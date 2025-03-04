import React from 'react';
import { CheckCircle, Circle, X } from 'lucide-react';
import { Task } from '../types';

interface EisenhowerMatrixProps {
  tasks: Task[];
  currentDate: string;
  updateTaskMatrix: (id: string, important: boolean, urgent: boolean) => void;
  toggleCompletion: (id: string) => void;
  deleteTask: (id: string) => void;
  darkMode: boolean;
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ 
  tasks, 
  currentDate,
  updateTaskMatrix,
  toggleCompletion,
  deleteTask,
  darkMode
}) => {
  const todaysTasks = tasks.filter(task => task.date === currentDate);
  
  const quadrants = {
    q1: todaysTasks.filter(task => task.important && task.urgent),
    q2: todaysTasks.filter(task => task.important && !task.urgent),
    q3: todaysTasks.filter(task => !task.important && task.urgent),
    q4: todaysTasks.filter(task => !task.important && !task.urgent),
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDrop = (e: React.DragEvent, important: boolean, urgent: boolean) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    updateTaskMatrix(taskId, important, urgent);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const renderTask = (task: Task) => (
    <div 
      key={task.id}
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      className={`flex items-center justify-between p-3 mb-2 rounded-lg border ${
        task.completed 
          ? darkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-gray-50 border-gray-100' 
          : darkMode 
            ? 'bg-gray-700 border-gray-600' 
            : 'bg-white border-gray-200'
      } cursor-move transition-colors duration-200`}
    >
      <div className="flex items-center">
        <button
          onClick={() => toggleCompletion(task.id)}
          className={`mr-2 ${
            task.completed 
              ? darkMode 
                ? 'text-indigo-400' 
                : 'text-indigo-500' 
              : darkMode 
                ? 'text-gray-400 hover:text-indigo-300' 
                : 'text-gray-400 hover:text-indigo-500'
          } transition-colors`}
        >
          {task.completed ? (
            <CheckCircle size={18} className={darkMode ? 'text-indigo-400' : 'text-indigo-500'} />
          ) : (
            <Circle size={18} />
          )}
        </button>
        <span className={`text-sm ${
          task.completed 
            ? 'line-through text-gray-400' 
            : darkMode 
              ? 'text-gray-200' 
              : 'text-gray-700'
        } transition-colors duration-200`}>
          {task.text}
        </span>
      </div>
      <button
        onClick={() => deleteTask(task.id)}
        className={`${
          darkMode ? 'text-gray-400 hover:text-red-300' : 'text-gray-400 hover:text-red-500'
        } transition-colors`}
      >
        <X size={16} />
      </button>
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className={`text-xl font-bold ${
        darkMode ? 'text-white' : 'text-emerald-950'
      } mb-2 transition-colors duration-200`}>
        Eisenhower Matrix
      </h2>
      <p className={`text-m font-light ${
        darkMode ? 'text-white' : 'text-gray-800'
      } mb-8 transition-colors duration-800`}>
        Drag and drop tasks between quadrants to prioritize your work effectively.
      </p>
      
      <div className="grid grid-cols-2 gap-6">
        <div 
          className={`${
            darkMode ? 'bg-red-900/30 border-red-800/30' : 'bg-red-50/70 border-red-100/70'
          } backdrop-blur-sm rounded-xl p-5 border transition-colors duration-200`}
          onDrop={(e) => handleDrop(e, true, true)}
          onDragOver={handleDragOver}
        >
          <h3 className={`font-medium ${
            darkMode ? 'text-red-200' : 'text-red-700'
          } mb-4 transition-colors duration-200`}>
            Urgent & Important
          </h3>
          <p className={`text-xs ${
            darkMode ? 'text-red-300' : 'text-red-600'
          } mb-4 transition-colors duration-200`}>
            Do these tasks immediately
          </p>
          {quadrants.q1.map(renderTask)}
          {quadrants.q1.length === 0 && (
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            } italic transition-colors duration-200`}>
              No tasks in this quadrant
            </p>
          )}
        </div>
        
        <div 
          className={`${
            darkMode ? 'bg-blue-900/30 border-blue-800/30' : 'bg-blue-50/70 border-blue-100/70'
          } backdrop-blur-sm rounded-xl p-5 border transition-colors duration-200`}
          onDrop={(e) => handleDrop(e, true, false)}
          onDragOver={handleDragOver}
        >
          <h3 className={`font-medium ${
            darkMode ? 'text-blue-200' : 'text-blue-700'
          } mb-4 transition-colors duration-200`}>
            Important, Not Urgent
          </h3>
          <p className={`text-xs ${
            darkMode ? 'text-blue-300' : 'text-blue-600'
          } mb-4 transition-colors duration-200`}>
            Schedule these tasks
          </p>
          {quadrants.q2.map(renderTask)}
          {quadrants.q2.length === 0 && (
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            } italic transition-colors duration-200`}>
              No tasks in this quadrant
            </p>
          )}
        </div>
        
        <div 
          className={`${
            darkMode ? 'bg-yellow-900/30 border-yellow-800/30' : 'bg-yellow-50/70 border-yellow-100/70'
          } backdrop-blur-sm rounded-xl p-5 border transition-colors duration-200`}
          onDrop={(e) => handleDrop(e, false, true)}
          onDragOver={handleDragOver}
        >
          <h3 className={`font-medium ${
            darkMode ? 'text-yellow-200' : 'text-yellow-700'
          } mb-4 transition-colors duration-200`}>
            Urgent, Not Important
          </h3>
          <p className={`text-xs ${
            darkMode ? 'text-yellow-300' : 'text-yellow-600'
          } mb-4 transition-colors duration-200`}>
            Delegate these tasks if possible
          </p>
          {quadrants.q3.map(renderTask)}
          {quadrants.q3.length === 0 && (
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            } italic transition-colors duration-200`}>
              No tasks in this quadrant
            </p>
          )}
        </div>
        
        <div 
          className={`${
            darkMode ? 'bg-gray-800/40 border-gray-700/40' : 'bg-gray-50/70 border-gray-200/70'
          } backdrop-blur-sm rounded-xl p-5 border transition-colors duration-200`}
          onDrop={(e) => handleDrop(e, false, false)}
          onDragOver={handleDragOver}
        >
          <h3 className={`font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          } mb-4 transition-colors duration-200`}>
            Not Urgent & Not Important
          </h3>
          <p className={`text-xs ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } mb-4 transition-colors duration-200`}>
            Eliminate these tasks if possible
          </p>
          {quadrants.q4.map(renderTask)}
          {quadrants.q4.length === 0 && (
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            } italic transition-colors duration-200`}>
              No tasks in this quadrant
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EisenhowerMatrix;