import React from 'react';
import { CheckCircle, Circle, X, ArrowUp, ArrowRight, ArrowDown } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  updatePriority: (id: string, priority: 'low' | 'medium' | 'high') => void;
  darkMode: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleCompletion, deleteTask, updatePriority, darkMode }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
          No tasks for today. Add one to get started!
        </p>
      </div>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUp size={16} className="text-red-500" />;
      case 'medium':
        return <ArrowRight size={16} className="text-yellow-500" />;
      default:
        return <ArrowDown size={16} className="text-green-500" />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return darkMode 
          ? 'bg-red-900/30 text-red-300 border-red-800/50' 
          : 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return darkMode 
          ? 'bg-yellow-900/30 text-yellow-300 border-yellow-800/50' 
          : 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return darkMode 
          ? 'bg-green-900/30 text-green-300 border-green-800/50' 
          : 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li 
          key={task.id} 
          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
            task.completed 
              ? darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-gray-50 border-gray-100'
              : darkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center flex-grow">
            <button
              onClick={() => toggleCompletion(task.id)}
              className={`mr-3 ${
                task.completed 
                  ? 'text-indigo-500' 
                  : darkMode 
                    ? 'text-gray-400 hover:text-indigo-300' 
                    : 'text-gray-400 hover:text-indigo-500'
              } transition-colors`}
            >
              {task.completed ? (
                <CheckCircle size={20} className={darkMode ? 'text-indigo-400' : 'text-indigo-500'} />
              ) : (
                <Circle size={20} />
              )}
            </button>
            <span className={`${
              task.completed 
                ? 'line-through text-gray-400' 
                : darkMode 
                  ? 'text-gray-200' 
                  : 'text-gray-700'
            } break-words transition-colors duration-200`}>
              {task.text}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
            <div className="relative group">
              <button 
                className={`px-2 py-1 rounded text-xs border flex items-center space-x-1 ${getPriorityClass(task.priority)}`}
              >
                {getPriorityIcon(task.priority)}
                <span>{task.priority}</span>
              </button>
              
              <div className={`absolute right-0 mt-1 ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
              } border rounded-md shadow-lg z-10 hidden group-hover:block transition-colors duration-200`}>
                <button 
                  onClick={() => updatePriority(task.id, 'low')}
                  className={`flex items-center w-full px-3 py-2 text-xs text-left ${
                    darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                  } transition-colors duration-200`}
                >
                  <ArrowDown size={14} className="mr-2 text-green-500" />
                  Low
                </button>
                <button 
                  onClick={() => updatePriority(task.id, 'medium')}
                  className={`flex items-center w-full px-3 py-2 text-xs text-left ${
                    darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                  } transition-colors duration-200`}
                >
                  <ArrowRight size={14} className="mr-2 text-yellow-500" />
                  Medium
                </button>
                <button 
                  onClick={() => updatePriority(task.id, 'high')}
                  className={`flex items-center w-full px-3 py-2 text-xs text-left ${
                    darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                  } transition-colors duration-200`}
                >
                  <ArrowUp size={14} className="mr-2 text-red-500" />
                  High
                </button>
              </div>
            </div>
            
            <button
              onClick={() => deleteTask(task.id)}
              className={`${
                darkMode ? 'text-gray-400 hover:text-red-300' : 'text-gray-400 hover:text-red-500'
              } transition-colors`}
            >
              <X size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;