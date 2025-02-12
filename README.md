# Todo App - MERN Stack

A simple and interactive **Todo App** built using the **MERN (MongoDB, Express.js, React, Node.js) stack**. This app allows users to **add, edit, delete, and mark tasks as completed**.

## Features

- **Create, Read, Update, Delete (CRUD) Operations**  
- **User Authentication (Signup/Login)**  
- **Mark Tasks as Completed**  
- **Modern UI with React**  
- **MongoDB for Data Storage**  

## Tech Stack

- **Frontend**: React, Axios, Bootstrap  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: JWT (JSON Web Token)  

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/prashanth370/todoapp.git
   cd todoapp
   ```

2. **Install dependencies for the backend**:

   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**:  
   Create a `.env` file inside the `backend` folder and add the following:

   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Start the backend server**:

   ```bash
   npm start
   ```

5. **Install dependencies for the frontend**:

   ```bash
   cd ../frontend
   npm install
   ```

6. **Start the React app**:

   ```bash
   npm start
   ```

7. Open your browser and visit:

   ```
   http://localhost:3000/
   ```

## Folder Structure

```
📂 todoapp
├── 📂 backend         # Node.js & Express API
│   ├── 📂 models      # Mongoose models
│   ├── 📂 routes      # API routes
│   ├── server.js      # Express server setup
│   ├── .env           # Environment variables
│   ├── package.json   # Backend dependencies
│
├── 📂 frontend        # React frontend
│   ├── 📂 src
│   │   ├── 📂 components   # UI components
│   │   ├── 📂 pages        # Pages (Home, Login, Signup)
│   │   ├── App.js         # Main App component
│   ├── package.json       # Frontend dependencies
│
├── README.md          # Project documentation
```

## API Endpoints

| Method | Endpoint        | Description                |
|--------|----------------|----------------------------|
| POST   | `/api/users/signup`  | Register a new user   |
| POST   | `/api/users/login`   | User login            |
| GET    | `/api/todos`         | Get all todos         |
| POST   | `/api/todos`         | Create a new todo     |
| PUT    | `/api/todos/:id`     | Update a todo         |
| DELETE | `/api/todos/:id`     | Delete a todo         |

## Dependencies

### Backend:
```bash
npm install express mongoose dotenv cors jsonwebtoken bcryptjs
```

### Frontend:
```bash
npm install axios react-router-dom bootstrap
```

## License

This project is open-source and available under the MIT License.

---
