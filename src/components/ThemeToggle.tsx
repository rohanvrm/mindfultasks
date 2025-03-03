import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
      <button
        type="button"
        onClick={toggleDarkMode}
        className={`flex items-center justify-center w-12 h-6 p-1 rounded-full transition-colors duration-300 focus:outline-none ${
          darkMode ? 'bg-indigo-600' : 'bg-gray-300'
        }`}
        aria-pressed={darkMode}
      >
        <span
          className={`absolute left-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            darkMode ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {darkMode ? (
            <Moon size={12} className="text-indigo-700" />
          ) : (
            <Sun size={12} className="text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;