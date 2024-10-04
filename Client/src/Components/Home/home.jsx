import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash, FiCalendar } from "react-icons/fi";

const ItemTypes = {
  TASK: "task",
};

const priorityColors = {
  Low: "bg-blue-900 text-blue-200",
  Medium: "bg-yellow-900 text-yellow-200",
  High: "bg-red-900 text-red-200",
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [filter, setFilter] = useState({ priority: "All" });
  const [sortBy, setSortBy] = useState("dueDate");
  const [editingTask, setEditingTask] = useState(null);

  const columns = ["To Do", "In Progress", "Completed"];

  const filteredAndSortedTasks = tasks
    .filter(
      (task) => filter.priority === "All" || task.priority === filter.priority
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

  const moveTask = useCallback((id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-900 text-gray-100 p-6 font-sans">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-400">
          Kanban Board
        </h1>

        <div className="mb-8 flex flex-wrap justify-between items-center">
          <button
            onClick={() => setEditingTask({ status: "To Do", priority: "Low" })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-4 sm:mb-0 font-semibold"
          >
            <FiPlus className="inline mr-2" /> Add Task
          </button>
          <div className="flex flex-wrap gap-4">
            <select
              value={filter.priority}
              onChange={(e) =>
                setFilter({ ...filter, priority: e.target.value })
              }
              className="bg-gray-800 text-gray-100 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-gray-100 rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {columns.map((column) => (
            <Column
              key={column}
              columnName={column}
              tasks={filteredAndSortedTasks.filter(
                (task) => task.status === column
              )}
              moveTask={moveTask}
              setEditingTask={setEditingTask}
              deleteTask={deleteTask}
            />
          ))}
        </div>

        {editingTask && (
          <TaskModal
            task={editingTask}
            onSave={editingTask.id ? updateTask : addTask}
            onClose={() => setEditingTask(null)}
          />
        )}
      </div>
    </DndProvider>
  );
};

const Column = ({
  columnName,
  tasks,
  moveTask,
  setEditingTask,
  deleteTask,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item) => moveTask(item.id, columnName),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[300px] ${
        isOver ? "bg-gray-700" : "bg-gray-800"
      } p-4 rounded-lg transition-colors duration-300`}
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-300">{columnName}</h2>
      <div className="min-h-[400px]">
        <AnimatePresence>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              setEditingTask={setEditingTask}
              deleteTask={deleteTask}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Task = ({ task, setEditingTask, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`bg-gray-700 p-4 mb-4 rounded-lg ${
        isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab"
      }`}
      style={{ userSelect: "none" }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingTask(task);
            }}
            className="text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            <FiEdit className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            className="text-red-400 hover:text-red-300 cursor-pointer"
          >
            <FiTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-gray-400 mb-3">{task.description}</p>
      )}
      <div className="flex justify-between items-center text-sm">
        <span
          className={`px-2 py-1 rounded-full font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="flex items-center text-gray-400">
            <FiCalendar className="mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </motion.div>
  );
};
const TaskModal = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-6 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          {task.id ? "Edit Task" : "Add Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            className="bg-gray-700 text-gray-100 p-2 rounded-lg w-full mb-4"
            required
          />
          <textarea
            placeholder="Description"
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            className="bg-gray-700 text-gray-100 p-2 rounded-lg w-full mb-4"
            required
          />
          <select
            value={editedTask.priority}
            onChange={(e) =>
              setEditedTask({ ...editedTask, priority: e.target.value })
            }
            className="bg-gray-700 text-gray-100 p-2 rounded-lg w-full mb-4"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="date"
            value={editedTask.dueDate}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
            className="bg-gray-700 text-gray-100 p-2 rounded-lg w-full mb-4"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-gray-100 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const DEFAULT_TASKS = [
  {
    id: "1",
    title: "Task 1",
    description: "This is the first task.",
    priority: "High",
    dueDate: "2024-09-25",
    status: "To Do",
  },
  {
    id: "2",
    title: "Task 2",
    description: "This is the second task.",
    priority: "Medium",
    dueDate: "2024-09-26",
    status: "In Progress",
  },
  {
    id: "3",
    title: "Task 3",
    description: "This is the third task.",
    priority: "Low",
    dueDate: "2024-09-27",
    status: "Completed",
  },
];

export default KanbanBoard;
