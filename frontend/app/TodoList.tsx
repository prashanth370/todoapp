// todo.tsx
"use client"

import { useState, useEffect } from 'react'
import { useAuth } from './auth/AuthContext'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Trash, Calendar, Tag, Flag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Task {
  _id: string
  text: string
  completed: boolean
  dueDate?: string
  category?: string
  priority?: 'low' | 'medium' | 'high'
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [newTaskDueDate, setNewTaskDueDate] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("")
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const { token, logout } = useAuth()

  useEffect(() => {
    if (token) {
      fetchTasks()
    }
  }, [token])

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: { 'x-auth-token': token }
      })
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, 
          { 
            text: newTask,
            dueDate: newTaskDueDate,
            category: newTaskCategory,
            priority: newTaskPriority
          },
          { headers: { 'x-auth-token': token } }
        )
        setTasks([...tasks, response.data])
        setNewTask("")
        setNewTaskDueDate("")
        setNewTaskCategory("")
        setNewTaskPriority('medium')
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  const toggleTaskCompletion = async (id: string) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === id)
      if (taskToUpdate) {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`,
          { completed: !taskToUpdate.completed },
          { headers: { 'x-auth-token': token } }
        )
        setTasks(tasks.map(task => task._id === id ? response.data : task))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const removeTask = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, 
        { headers: { 'x-auth-token': token } }
      )
      setTasks(tasks.filter(task => task._id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleLogout = () => {
    logout()
    setTasks([])
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Input
            type="date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Category"
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <Button 
            onClick={addTask}
            className="w-full"
          >
            Add Task
          </Button>
        </div>
        <AnimatePresence>
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-muted-foreground mt-4"
            >
              <p>No tasks yet. Add one to get started!</p>
            </motion.div>
          ) : (
            <div className="space-y-2 mt-4">
              {tasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-center justify-between p-3 bg-card rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                    task.completed ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`task-${task._id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task._id)}
                    />
                    <label
                      htmlFor={`task-${task._id}`}
                      className={`font-medium ${task.completed ? "line-through" : ""}`}
                    >
                      {task.text}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.dueDate && <Calendar size={16} />}
                    {task.category && <Tag size={16} />}
                    {task.priority && <Flag size={16} />}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeTask(task._id)} 
                      aria-label="Remove task"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
