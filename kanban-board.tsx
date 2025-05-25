"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { Plus } from 'lucide-react' // Removed duplicated import

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "inprogress" | "done"
  tag: string
  tagColor: string
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design System Setup",
    description: "Create a comprehensive design system with components and guidelines",
    status: "todo",
    tag: "Design",
    tagColor: "bg-purple-500",
  },
  {
    id: "2",
    title: "API Integration",
    description: "Integrate REST API endpoints for user authentication and data management",
    status: "todo",
    tag: "Backend",
    tagColor: "bg-green-500",
  },
  {
    id: "3",
    title: "User Dashboard",
    description: "Build responsive dashboard with analytics and user preferences",
    status: "inprogress",
    tag: "Frontend",
    tagColor: "bg-blue-500",
  },
  {
    id: "4",
    title: "Database Migration",
    description: "Migrate legacy data to new database schema",
    status: "inprogress",
    tag: "Backend",
    tagColor: "bg-green-500",
  },
  {
    id: "5",
    title: "Landing Page",
    description: "Create marketing landing page with hero section and features",
    status: "done",
    tag: "Frontend",
    tagColor: "bg-blue-500",
  },
  {
    id: "6",
    title: "Testing Suite",
    description: "Implement comprehensive testing with unit and integration tests",
    status: "done",
    tag: "QA",
    tagColor: "bg-orange-500",
  },
]

const tagColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
]

export default function Component() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({ title: "", description: "", tag: "" })
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTask, setEditTask] = useState({ title: "", description: "", tag: "" })

  // Carregar dados do localStorage quando o componente montar
  useEffect(() => {
    const savedTasks = localStorage.getItem("kanban-tasks")
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        setTasks(parsedTasks)
      } catch (error) {
        console.error("Erro ao carregar tarefas salvas:", error)
      }
    }
  }, [])

  // Salvar no localStorage sempre que as tarefas mudarem
  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks))
  }, [tasks])

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: "todo" | "inprogress" | "done") => {
    e.preventDefault()
    if (draggedTask) {
      setTasks(tasks.map((task) => (task.id === draggedTask ? { ...task, status: newStatus } : task)))
      setDraggedTask(null)
    }
  }

  const getTasksByStatus = (status: "todo" | "inprogress" | "done") => {
    return tasks.filter((task) => task.status === status)
  }

  const addTask = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: "todo",
        tag: newTask.tag || "General",
        tagColor: tagColors[Math.floor(Math.random() * tagColors.length)],
      }
      setTasks([...tasks, task])
      setNewTask({ title: "", description: "", tag: "" })
    }
  }

  const startEdit = (task: Task) => {
    setEditingTask(task.id)
    setEditTask({ title: task.title, description: task.description, tag: task.tag })
  }

  const saveEdit = () => {
    if (editingTask && editTask.title.trim() && editTask.description.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask
            ? { ...task, title: editTask.title, description: editTask.description, tag: editTask.tag || "General" }
            : task,
        ),
      )
      setEditingTask(null)
      setEditTask({ title: "", description: "", tag: "" })
    }
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditTask({ title: "", description: "", tag: "" })
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const columns = [
    { id: "todo", title: "Não Iniciado", status: "todo" as const },
    { id: "inprogress", title: "Em Andamento", status: "inprogress" as const },
    { id: "done", title: "Concluído", status: "done" as const },
  ]

  return (
    <div className="min-h-screen bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Lista de Atividades</h1>
        </div>

        {/* Add Task Form */}
        <Card className="bg-[#1a1a1a] border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Adicionar Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Título da tarefa"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="bg-[#111] border-gray-700 text-white placeholder-gray-400"
              />
              <Textarea
                placeholder="Descrição da tarefa"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="bg-[#111] border-gray-700 text-white placeholder-gray-400 resize-none"
                rows={3}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Tag (opcional)"
                  value={newTask.tag}
                  onChange={(e) => setNewTask({ ...newTask, tag: e.target.value })}
                  className="bg-[#111] border-gray-700 text-white placeholder-gray-400 flex-1"
                />
                <Button onClick={addTask} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Tarefa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kanban Board - Vertical on mobile, horizontal on desktop */}
        <div className="flex flex-col lg:flex-row gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-1 bg-[#1a1a1a] rounded-lg p-4 border border-gray-800"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-200">{column.title}</h2>
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                  {getTasksByStatus(column.status).length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {getTasksByStatus(column.status).map((task) => (
                  <Card
                    key={task.id}
                    draggable={editingTask !== task.id}
                    onDragStart={(e) => editingTask !== task.id && handleDragStart(e, task.id)}
                    className="bg-[#111] border-gray-700 cursor-move hover:bg-[#0f0f0f] transition-colors group"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        {editingTask === task.id ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              value={editTask.title}
                              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                              className="bg-[#1a1a1a] border-gray-600 text-white text-sm"
                              placeholder="Título da tarefa"
                            />
                            <Textarea
                              value={editTask.description}
                              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                              className="bg-[#1a1a1a] border-gray-600 text-white text-xs resize-none"
                              placeholder="Descrição da tarefa"
                              rows={2}
                            />
                            <Input
                              value={editTask.tag}
                              onChange={(e) => setEditTask({ ...editTask, tag: e.target.value })}
                              className="bg-[#1a1a1a] border-gray-600 text-white text-xs"
                              placeholder="Tag (opcional)"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={saveEdit}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white text-xs"
                              >
                                Salvar
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700 text-xs"
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <CardTitle className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                              {task.title}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startEdit(task)}
                                className="p-1 text-gray-500 hover:text-blue-400 transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              <GripVertical className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    {editingTask !== task.id && (
                      <CardContent className="pt-0">
                        <CardDescription className="text-gray-400 text-xs mb-3">{task.description}</CardDescription>
                        <Badge className={`${task.tagColor} text-white text-xs`}>{task.tag}</Badge>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
