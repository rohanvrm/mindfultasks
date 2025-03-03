import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';
import { MoodEntry } from '../types';

interface MoodTrackerProps {
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
  date: string;
  onMoodSelect: (date: string, mood: 'happy' | 'neutral' | 'sad') => void;
  moodEntries: MoodEntry[];
  darkMode: boolean;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ 
  completedTasks, 
  totalTasks, 
  completionPercentage,
  date,
  onMoodSelect,
  moodEntries,
  darkMode
}) => {
  const currentMood = moodEntries.find(entry => entry.date === date)?.mood;
  
  return (
    <div className={`${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50' 
        : 'bg-gradient-to-br from-white/60 to-gray-50/60 border-gray-100/60'
    } backdrop-blur-sm rounded-xl shadow-md p-6 border transition-colors duration-200`}>
      <h3 className={`text-xl font-medium ${
        darkMode ? 'text-white' : 'text-gray-800'
      } mb-6 flex items-center transition-colors duration-200`}>
        <div className="w-1.5 h-6 bg-indigo-500 rounded-full mr-3"></div>
        Today's Progress
      </h3>
      
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          <span className={`text-sm font-medium ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          } transition-colors duration-200`}>
            Completed: {completedTasks}/{totalTasks} tasks
          </span>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              completionPercentage >= 75 ? 'bg-green-500' : 
              completionPercentage >= 50 ? 'bg-yellow-500' : 
              completionPercentage > 0 ? 'bg-orange-500' : 
              darkMode ? 'bg-gray-600' : 'bg-gray-300'
            }`}></div>
            <span className={`text-sm font-bold ${
              completionPercentage >= 75 ? darkMode ? 'text-green-300' : 'text-green-600' : 
              completionPercentage >= 50 ? darkMode ? 'text-yellow-300' : 'text-yellow-600' : 
              completionPercentage > 0 ? darkMode ? 'text-orange-300' : 'text-orange-600' : 
              darkMode ? 'text-gray-300' : 'text-gray-500'
            } transition-colors duration-200`}>
              {completionPercentage}%
            </span>
          </div>
        </div>
        <div className={`w-full ${
          darkMode ? 'bg-gray-700/70' : 'bg-gray-200/70'
        } rounded-full h-3 overflow-hidden shadow-inner transition-colors duration-200`}>
          <div 
            className={`h-3 rounded-full transition-all duration-700 ease-in-out ${
              completionPercentage >= 75 
                ? darkMode 
                  ? 'bg-gradient-to-r from-green-600 to-green-500' 
                  : 'bg-gradient-to-r from-green-400 to-green-500' 
                : completionPercentage >= 50 
                  ? darkMode 
                    ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' 
                    : 'bg-gradient-to-r from-yellow-300 to-yellow-400' 
                  : completionPercentage > 0 
                    ? darkMode 
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500' 
                      : 'bg-gradient-to-r from-orange-300 to-orange-400' 
                    : darkMode 
                      ? 'bg-gray-600' 
                      : 'bg-gray-300'
            }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className={`${
        darkMode ? 'bg-gray-800/60 border-gray-700/60' : 'bg-white/70 border-gray-100/70'
      } backdrop-blur-sm p-5 rounded-lg shadow-sm border transition-colors duration-200`}>
        <h4 className={`text-base font-medium ${
          darkMode ? 'text-gray-100' : 'text-gray-700'
        } mb-4 transition-colors duration-200`}>
          How do you feel about today's progress?
        </h4>
        <div className="flex justify-around">
          <button 
            onClick={() => onMoodSelect(date, 'happy')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all ${
              currentMood === 'happy' 
                ? darkMode 
                  ? 'bg-green-900/40 text-green-200 scale-110 shadow-md' 
                  : 'bg-green-50/80 text-green-600 scale-110 shadow-md' 
                : darkMode 
                  ? 'text-gray-300 hover:text-green-200 hover:bg-green-900/30 hover:scale-105' 
                  : 'text-gray-500 hover:text-green-500 hover:bg-green-50/70 hover:scale-105'
            }`}
          >
            <Smile size={32} className={currentMood === 'happy' ? 'animate-pulse' : ''} />
            <span className="text-xs mt-2 font-medium">Great</span>
          </button>
          
          <button 
            onClick={() => onMoodSelect(date, 'neutral')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all ${
              currentMood === 'neutral' 
                ? darkMode 
                  ? 'bg-yellow-900/40 text-yellow-200 scale-110 shadow-md' 
                  : 'bg-yellow-50/80 text-yellow-600 scale-110 shadow-md' 
                : darkMode 
                  ? 'text-gray-300 hover:text-yellow-200 hover:bg-yellow-900/30 hover:scale-105' 
                  : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50/70 hover:scale-105'
            }`}
          >
            <Meh size={32} className={currentMood === 'neutral' ? 'animate-pulse' : ''} />
            <span className="text-xs mt-2 font-medium">Okay</span>
          </button>
          
          <button 
            onClick={() => onMoodSelect(date, 'sad')}
            className={`flex flex-col items-center p-3 rounded-lg transition-all ${
              currentMood === 'sad' 
                ? darkMode 
                  ? 'bg-red-900/40 text-red-200 scale-110 shadow-md' 
                  : 'bg-red-50/80 text-red-600 scale-110 shadow-md' 
                : darkMode 
                  ? 'text-gray-300 hover:text-red-200 hover:bg-red-900/30 hover:scale-105' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50/70 hover:scale-105'
            }`}
          >
            <Frown size={32} className={currentMood === 'sad' ? 'animate-pulse' : ''} />
            <span className="text-xs mt-2 font-medium">Could be better</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;