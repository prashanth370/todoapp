require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://todoapp-k89q.vercel.app/'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB!'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

// Task model
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  category: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

taskSchema.index({ user: 1 });

const Task = mongoose.model('Task', taskSchema);

// Middleware for authentication
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Routes
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ username, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error during login' });
  }
});

app.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.post('/tasks', auth, async (req, res) => {
  try {
    const { text, dueDate, category, priority } = req.body;
    const newTask = new Task({
      text,
      dueDate,
      category,
      priority,
      user: req.user.id
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.put('/tasks/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.delete('/tasks/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
