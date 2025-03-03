import React, { useState, useEffect } from 'react';
import { Plus, X, CheckCircle, Circle, ArrowRight, Smile, Meh, Frown, ChevronLeft, ChevronRight, Calendar, Moon, Sun, ChevronUp, ChevronDown } from 'lucide-react';
import TaskList from './components/TaskList';
import MoodTracker from './components/MoodTracker';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import CalendarView from './components/CalendarView';
import ThemeToggle from './components/ThemeToggle';
import { Task, MoodEntry } from './types';

// Array of calm background images
const backgroundImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?q=80&w=2074&auto=format&fit=crop',
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const savedMoods = localStorage.getItem('moodEntries');
    return savedMoods ? JSON.parse(savedMoods) : [];
  });
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'eisenhower' | 'calendar'>('tasks');
  const [newTask, setNewTask] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  
  // Background image state
  const [currentBgIndex, setCurrentBgIndex] = useState<number>(() => {
    const savedBgIndex = localStorage.getItem('backgroundIndex');
    return savedBgIndex ? parseInt(JSON.parse(savedBgIndex)) : 0;
  });
  
  // Save to localStorage whenever tasks or moods change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Save background preference
  useEffect(() => {
    localStorage.setItem('backgroundIndex', JSON.stringify(currentBgIndex));
  }, [currentBgIndex]);
  
  // Format date to YYYY-MM-DD format for consistent storage
  const formatDate = (date: Date): string => {
    // Ensure we're working with a fresh date object to avoid timezone issues
    const d = new Date(date);
    const year = d.getFullYear();
    // Month is 0-indexed, so add 1 and pad with leading zero if needed
    const month = String(d.getMonth() + 1).padStart(2, '0');
    // Day of month, padded with leading zero if needed
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    
    // Get the formatted date string for the current date
    const dateStr = formatDate(currentDate);
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      date: dateStr,
      priority: 'low',
      urgent: false,
      important: false
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };
  
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task: Task) => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task: Task) => task.id !== id));
  };
  
  const updateTaskPriority = (id: string, priority: 'low' | 'medium' | 'high') => {
    setTasks(tasks.map((task: Task) => 
      task.id === id ? { ...task, priority } : task
    ));
  };
  
  const updateTaskMatrix = (id: string, important: boolean, urgent: boolean) => {
    setTasks(tasks.map((task: Task) => 
      task.id === id ? { ...task, important, urgent } : task
    ));
  };
  
  const addMoodEntry = (date: string, mood: 'happy' | 'neutral' | 'sad') => {
    // Check if we already have an entry for this date
    const existingEntryIndex = moodEntries.findIndex((entry: MoodEntry) => entry.date === date);
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...moodEntries];
      updatedEntries[existingEntryIndex] = { date, mood };
      setMoodEntries(updatedEntries);
    } else {
      // Add new entry
      setMoodEntries([...moodEntries, { date, mood }]);
    }
  };
  
  const changeDate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Change background image
  const changeBackground = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setCurrentBgIndex((prevIndex) => 
        prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1
      );
    }
  };
  
  // Get tasks for the current date
  const todaysTasks = tasks.filter((task: Task) => task.date === formatDate(currentDate));
  const completedTasksCount = todaysTasks.filter((task: Task) => task.completed).length;
  const totalTasksCount = todaysTasks.length;
  const completionPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;
  
  const currentDateFormatted = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Background style with current image
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
  };
  
  return (
    <div 
      className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}
      style={backgroundStyle}
    >
      <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
      
      <header className={`relative z-10 ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-sm shadow-sm py-4 transition-colors duration-200`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className={`text-2xl font-light ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4 sm:mb-0 transition-colors duration-200`}>
              mindful<span className="font-bold">tasks</span>
            </h1>
            <div className="flex items-center">
              <nav className="mr-6">
                <ul className="flex items-center space-x-1">
                  <li>
                    <button 
                      onClick={() => setActiveTab('tasks')}
                      className={`relative px-4 py-2 transition-all duration-300 ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      } hover:opacity-100 ${
                        activeTab === 'tasks' 
                          ? `font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'} opacity-100` 
                          : 'opacity-70'
                      }`}
                    >
                      Tasks
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('eisenhower')}
                      className={`relative px-4 py-2 transition-all duration-300 ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      } hover:opacity-100 ${
                        activeTab === 'eisenhower' 
                          ? `font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'} opacity-100` 
                          : 'opacity-70'
                      }`}
                    >
                      Matrix
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('calendar')}
                      className={`relative px-4 py-2 transition-all duration-300 ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      } hover:opacity-100 ${
                        activeTab === 'calendar' 
                          ? `font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'} opacity-100` 
                          : 'opacity-70'
                      }`}
                    >
                      Calendar
                    </button>
                  </li>
                </ul>
              </nav>
              <div className="flex items-center">
                {/* Background navigation arrows */}
                <div className="flex mr-3">
                  <button 
                    onClick={() => changeBackground('prev')}
                    className={`p-1 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors mr-1`}
                    aria-label="Previous background"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button 
                    onClick={() => changeBackground('next')}
                    className={`p-1 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors`}
                    aria-label="Next background"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
                <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8">
        {activeTab === 'tasks' && (
          <div className="max-w-3xl mx-auto">
            <div className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl shadow-md p-6 mb-6 transition-colors duration-200`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <button 
                    onClick={() => changeDate(-1)} 
                    className={`p-2 rounded-full ${
                      darkMode ? 'hover:bg-indigo-900/40 text-indigo-300' : 'hover:bg-indigo-50/70 text-indigo-600'
                    } transition-colors`}
                    aria-label="Previous day"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className={`text-xl font-medium ${darkMode ? 'text-gray-100' : 'text-gray-800'} mx-4 flex items-center transition-colors duration-200`}>
                    <Calendar size={18} className={`${darkMode ? 'text-indigo-300' : 'text-indigo-500'} mr-2 hidden sm:block transition-colors duration-200`} />
                    <span>{currentDateFormatted}</span>
                  </h2>
                  <button 
                    onClick={() => changeDate(1)} 
                    className={`p-2 rounded-full ${
                      darkMode ? 'hover:bg-indigo-900/40 text-indigo-300' : 'hover:bg-indigo-50/70 text-indigo-600'
                    } transition-colors`}
                    aria-label="Next day"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              
              <form onSubmit={addTask} className="flex mb-6">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className={`flex-grow px-4 py-3 rounded-l-lg focus:outline-none focus:ring-0 transition-colors ${
                    darkMode 
                      ? 'bg-gray-700/70 focus:bg-gray-600/70 text-white placeholder-gray-400 border-gray-600' 
                      : 'bg-gray-50/70 focus:bg-white/70 text-gray-800 border-gray-200'
                  }`}
                />
                <button 
                  type="submit" 
                  className="bg-indigo-500/70 hover:bg-indigo-600/70 text-white px-4 py-3 rounded-r-lg transition-colors flex items-center"
                >
                  <Plus size={20} />
                </button>
              </form>
              
              <TaskList 
                tasks={todaysTasks} 
                toggleCompletion={toggleTaskCompletion} 
                deleteTask={deleteTask}
                updatePriority={updateTaskPriority}
                darkMode={darkMode}
              />
            </div>
            
            <MoodTracker 
              completedTasks={completedTasksCount}
              totalTasks={totalTasksCount}
              completionPercentage={completionPercentage}
              date={formatDate(currentDate)}
              onMoodSelect={addMoodEntry}
              moodEntries={moodEntries}
              darkMode={darkMode}
            />
          </div>
        )}
        
        {activeTab === 'eisenhower' && (
          <EisenhowerMatrix 
            tasks={tasks} 
            currentDate={formatDate(currentDate)}
            updateTaskMatrix={updateTaskMatrix}
            toggleCompletion={toggleTaskCompletion}
            deleteTask={deleteTask}
            darkMode={darkMode}
          />
        )}
        
        {activeTab === 'calendar' && (
          <CalendarView 
            moodEntries={moodEntries} 
            tasks={tasks}
            currentMonth={currentDate}
            setCurrentMonth={setCurrentDate}
            darkMode={darkMode}
          />
        )}
      </main>
      
      <footer className={`relative z-10 ${darkMode ? 'bg-gray-800/60' : 'bg-white/60'} backdrop-blur-sm py-4 border-t border-gray-200/30 transition-colors duration-200`}>
        <div className="container mx-auto px-4 text-center text-sm">
          <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
            mindfulTasks © {new Date().getFullYear()} - Track your productivity and mood
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;