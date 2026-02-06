"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Circle, Loader2 } from "lucide-react";
import api from "../lib/api";

interface Task {
    _id: string;
    title: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
}

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks");
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setAdding(true);
        try {
            const res = await api.post("/tasks", {
                title: newTaskTitle,
                priority: "medium", // Default for now
            });
            setTasks([res.data, ...tasks]);
            setNewTaskTitle("");
        } catch (error) {
            console.error("Error adding task", error);
        } finally {
            setAdding(false);
        }
    };

    const toggleTask = async (id: string, completed: boolean) => {
        // Optimistic update
        setTasks(tasks.map(t => t._id === id ? { ...t, completed: !completed } : t));

        try {
            await api.patch(`/tasks/${id}`, { completed: !completed });
        } catch (error) {
            console.error("Error updating task", error);
            // Revert on error
            fetchTasks();
        }
    };

    const deleteTask = async (id: string) => {
        // Optimistic delete
        setTasks(tasks.filter(t => t._id !== id));
        try {
            await api.delete(`/tasks/${id}`);
        } catch (error) {
            console.error("Error deleting task", error);
            fetchTasks();
        }
    }

    if (loading) {
        return <div className="flex h-32 items-center justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="space-y-4">
            {/* Add Task Input */}
            <form onSubmit={addTask} className="relative">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    disabled={adding}
                />
                <button
                    type="submit"
                    disabled={adding || !newTaskTitle.trim()}
                    className="absolute right-2 top-2 rounded-md bg-indigo-50 p-1 text-indigo-600 hover:bg-indigo-100 disabled:opacity-50"
                >
                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </button>
            </form>

            {/* Task List */}
            <ul className="space-y-2">
                {tasks.length === 0 ? (
                    <li className="py-4 text-center text-sm text-gray-400">No tasks yet. Add one above!</li>
                ) : (
                    tasks.map((task) => (
                        <li key={task._id} className="group flex items-center justify-between rounded-lg border border-gray-100 bg-white p-3 shadow-sm hover:border-gray-200 transition-all">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleTask(task._id, task.completed)}
                                    className={`flex-shrink-0 ${task.completed ? "text-green-500" : "text-gray-300 hover:text-indigo-500"}`}
                                >
                                    {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                </button>
                                <span className={`text-sm ${task.completed ? "text-gray-400 line-through" : "text-gray-700 font-medium"}`}>
                                    {task.title}
                                </span>
                            </div>
                            <button
                                onClick={() => deleteTask(task._id)}
                                className="hidden text-gray-400 hover:text-red-500 group-hover:block"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}
