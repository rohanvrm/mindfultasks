import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Smile, Meh, Frown, Calendar, ChevronDown } from 'lucide-react';
import { MoodEntry, Task } from '../types';

interface CalendarViewProps {
  moodEntries: MoodEntry[];
  tasks: Task[];
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  darkMode: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  moodEntries, 
  tasks,
  currentMonth,
  setCurrentMonth,
  darkMode
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Format date to YYYY-MM-DD format for consistent storage
  const formatDateString = (year: number, month: number, day: number) => {
    // Ensure month is 1-indexed for display but properly formatted with leading zero
    const monthStr = String(month + 1).padStart(2, '0');
    // Day of month, padded with leading zero if needed
    const dayStr = String(day).padStart(2, '0');
    
    return `${year}-${monthStr}-${dayStr}`;
  };
  
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentMonth(newDate);
  };
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  
  const getMoodIcon = (date: string) => {
    const entry = moodEntries.find(entry => entry.date === date);
    if (!entry) return null;
    
    switch (entry.mood) {
      case 'happy':
        return <Smile size={20} className="text-green-500" />;
      case 'neutral':
        return <Meh size={20} className="text-yellow-500" />;
      case 'sad':
        return <Frown size={20} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getTasksForDate = (date: string) => {
    return tasks.filter(task => task.date === date);
  };
  
  const getCompletionRate = (date: string) => {
    const dateTasks = getTasksForDate(date);
    if (dateTasks.length === 0) return 0;
    
    const completed = dateTasks.filter(task => task.completed).length;
    return Math.round((completed / dateTasks.length) * 100);
  };
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setShowMonthSelector(false);
  };
  
  const renderCalendarDays = () => {
    const days = [];
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    // Render weekday headers
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`header-${i}`} className={`text-center ${
          darkMode ? 'text-gray-300' : 'text-gray-500'
        } text-xs font-semibold py-3 transition-colors duration-200`}>
          {weekdays[i]}
        </div>
      );
    }
    
    // Create a container for the days grid
    const dayGrid = [];
    
    // Calculate total cells needed (previous month days + current month days)
    const totalCells = firstDayOfMonth + daysInMonth;
    const totalRows = Math.ceil(totalCells / 7);
    
    let dayCounter = 1;
    let dayIndex = 0;
    
    // Generate calendar grid
    for (let row = 0; row < totalRows; row++) {
      const weekRow = [];
      
      for (let col = 0; col < 7; col++) {
        dayIndex++;
        
        if (dayIndex <= firstDayOfMonth || dayCounter > daysInMonth) {
          // Empty cell
          weekRow.push(
            <div key={`empty-${dayIndex}`} className="aspect-square"></div>
          );
        } else {
          // Day cell
          const day = dayCounter;
          const date = formatDateString(year, month, day);
          const isToday = date === formatDateString(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate()
          );
          const isSelected = date === selectedDate;
          const moodIcon = getMoodIcon(date);
          const tasksForDay = getTasksForDate(date);
          const completionRate = getCompletionRate(date);
          
          weekRow.push(
            <div 
              key={`day-${day}`}
              className="aspect-square p-1"
            >
              <div
                onClick={() => setSelectedDate(date)}
                className={`
                  h-full w-full rounded-full flex flex-col items-center justify-center
                  relative group cursor-pointer transition-all duration-300
                  ${isToday 
                    ? darkMode 
                      ? 'bg-indigo-600/40 text-white' 
                      : 'bg-indigo-100/90 text-indigo-800' 
                    : darkMode 
                      ? 'hover:bg-gray-700/40' 
                      : 'hover:bg-white/60'
                  }
                  ${isSelected 
                    ? darkMode 
                      ? 'ring-2 ring-indigo-400 shadow-lg' 
                      : 'ring-2 ring-indigo-300 shadow-lg' 
                    : ''
                  }
                `}
              >
                <span className={`text-sm font-medium ${
                  isToday 
                    ? darkMode 
                      ? 'text-white' 
                      : 'text-indigo-800' 
                    : darkMode 
                      ? 'text-gray-200' 
                      : 'text-gray-700'
                }`}>
                  {day}
                </span>
                
                {/* Mood indicator */}
                {moodIcon && (
                  <div className="absolute top-1 right-1 transform scale-75">
                    {moodIcon}
                  </div>
                )}
                
                {/* Task indicator */}
                {tasksForDay.length > 0 && (
                  <div className="mt-1">
                    <div className={`h-1 w-4 rounded-full ${
                      completionRate >= 75 ? 'bg-green-500' : 
                      completionRate >= 50 ? 'bg-yellow-500' : 
                      completionRate > 0 ? 'bg-orange-500' : 
                      darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}></div>
                  </div>
                )}
              </div>
            </div>
          );
          
          dayCounter++;
        }
      }
      
      // Add the week row to the grid
      dayGrid.push(
        <div key={`week-${row}`} className="grid grid-cols-7 gap-1 mb-1">
          {weekRow}
        </div>
      );
    }
    
    return (
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days}
        </div>
        {dayGrid}
      </div>
    );
  };
  
  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;
    
    const date = new Date(selectedDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const tasksForDay = getTasksForDate(selectedDate);
    const moodEntry = moodEntries.find(entry => entry.date === selectedDate);
    
    return (
      <div className={`${
        darkMode ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white/40 border-gray-100/40'
      } backdrop-blur-sm rounded-2xl shadow-lg p-8 mt-8 border transition-colors duration-200`}>
        <h3 className={`text-lg font-medium ${
          darkMode ? 'text-white' : 'text-gray-800'
        } mb-6 flex items-center transition-colors duration-200`}>
          <Calendar size={18} className={`${
            darkMode ? 'text-indigo-200' : 'text-indigo-500'
          } mr-2 transition-colors duration-200`} />
          {formattedDate}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 ${
            darkMode ? 'bg-gray-700/40' : 'bg-gray-50/50'
          } rounded-xl transition-colors duration-200`}>
            <h4 className={`text-sm font-medium ${
              darkMode ? 'text-gray-100' : 'text-gray-700'
            } mb-4 transition-colors duration-200`}>
              Mood
            </h4>
            {moodEntry ? (
              <div className="flex items-center">
                {moodEntry.mood === 'happy' && <Smile size={24} className="text-green-500 mr-2" />}
                {moodEntry.mood === 'neutral' && <Meh size={24} className="text-yellow-500 mr-2" />}
                {moodEntry.mood === 'sad' && <Frown size={24} className="text-red-500 mr-2" />}
                <span className={`${
                  darkMode ? 'text-gray-100' : 'text-gray-700'
                } capitalize transition-colors duration-200`}>
                  {moodEntry.mood}
                </span>
              </div>
            ) : (
              <p className={`${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } italic transition-colors duration-200`}>
                No mood recorded for this day
              </p>
            )}
          </div>
          
          <div className={`p-6 ${
            darkMode ? 'bg-gray-700/40' : 'bg-gray-50/50'
          } rounded-xl transition-colors duration-200`}>
            <h4 className={`text-sm font-medium ${
              darkMode ? 'text-gray-100' : 'text-gray-700'
            } mb-4 transition-colors duration-200`}>
              Tasks ({tasksForDay.length})
            </h4>
            {tasksForDay.length > 0 ? (
              <ul className="space-y-2">
                {tasksForDay.map(task => (
                  <li 
                    key={task.id} 
                    className={`flex items-center p-2 ${
                      darkMode ? 'hover:bg-gray-600/40' : 'hover:bg-gray-100/50'
                    } rounded-md transition-colors duration-200`}
                  >
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      task.completed ? 'bg-green-500' : darkMode ? 'bg-gray-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-sm ${
                      task.completed 
                        ? 'line-through text-gray-400' 
                        : darkMode 
                          ? 'text-gray-100' 
                          : 'text-gray-700'
                    } transition-colors duration-200`}>
                      {task.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              } italic transition-colors duration-200`}>
                No tasks for this day
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col relative">
          <span className={`text-m font-medium ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {year}
          </span>
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-800'
          } transition-colors duration-200 flex items-center`}>
            {monthName} 
            <button 
              onClick={() => setShowMonthSelector(!showMonthSelector)}
              className="ml-2 flex items-center focus:outline-none"
              aria-label="Select month"
            >
              <Calendar size={22} className={`${
                darkMode ? 'text-white' : 'text-gray-800'
              }transition-colors duration-100 flex items-center`} />
              <ChevronDown size={14} className={`ml-1 ${
                darkMode ? 'text-white' : 'text-gray-800'
              } transition-transform duration-200 ${showMonthSelector ? 'rotate-180' : ''}`} />
            </button>
          </h2>
          
          {/* Month selector dropdown */}
          {showMonthSelector && (
            <div className={`absolute top-full left-0 mt-1 z-10 w-48 py-2 rounded-lg shadow-lg ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="max-h-64 overflow-y-auto">
                {months.map((monthName, index) => (
                  <button
                    key={monthName}
                    onClick={() => handleMonthSelect(index)}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      month === index
                        ? darkMode 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-100 text-indigo-800'
                        : darkMode
                          ? 'text-gray-200 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {monthName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => changeMonth(-1)}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700/40 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            } transition-colors`}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => changeMonth(1)}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700/40 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            } transition-colors`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div className={`${
        darkMode ? 'bg-gray-800/30' : 'bg-white/90'
      } backdrop-blur-sm rounded-3xl shadow-xl p-8 border-0 transition-colors duration-200`}>
        <div className="grid grid-cols-7 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div 
              key={`header-${i}`} 
              className={`text-center py-2 ${
                i === 0 || i === 6 
                  ? darkMode ? 'text-red-300' : 'text-red-500' 
                  : darkMode ? 'text-gray-400' : 'text-gray-500'
              } ${i === 0 ? 'font-medium' : ''} text-sm`}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-6">
          {/* Previous month days */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => {
            // Calculate the day from previous month
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevMonthYear = month === 0 ? year - 1 : year;
            const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            
            return (
              <div 
                key={`prev-${i}`} 
                className={`text-center ${
                  darkMode ? 'text-gray-600' : 'text-gray-300'
                } text-sm`}
              >
                {day}
              </div>
            );
          })}
          
          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = formatDateString(year, month, day);
            const isToday = date === formatDateString(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            );
            const isSelected = date === selectedDate;
            const moodEntry = moodEntries.find(entry => entry.date === date);
            const tasksForDay = getTasksForDate(date);
            const hasTask = tasksForDay.length > 0;
            const isWeekend = (firstDayOfMonth + i) % 7 === 0 || (firstDayOfMonth + i) % 7 === 6;
            
            // Determine background color based on mood
            let bgColorClass = '';
            let textColorClass = '';
            
            if (moodEntry) {
              if (moodEntry.mood === 'happy') {
                bgColorClass = darkMode ? 'bg-green-500' : 'bg-green-400';
                textColorClass = 'text-white';
              } else if (moodEntry.mood === 'neutral') {
                bgColorClass = darkMode ? 'bg-yellow-500' : 'bg-yellow-400';
                textColorClass = 'text-white';
              } else if (moodEntry.mood === 'sad') {
                bgColorClass = darkMode ? 'bg-red-500' : 'bg-red-400';
                textColorClass = 'text-white';
              }
            }
            
            // If today, override with today's style
            if (isToday) {
              bgColorClass = darkMode ? 'bg-orange-500' : 'bg-orange-400';
              textColorClass = 'text-white';
            }
            
            // If no mood and not today, use default style
            if (!moodEntry && !isToday) {
              bgColorClass = 'bg-transparent';
              textColorClass = isWeekend
                ? darkMode ? 'text-red-300' : 'text-red-500'
                : darkMode ? 'text-gray-300' : 'text-gray-700';
            }
            
            // If selected, add a ring
            const ringClass = isSelected 
              ? darkMode ? 'ring-2 ring-white' : 'ring-2 ring-gray-800' 
              : '';
            
            return (
              <div 
                key={`day-${day}`} 
                className="text-center relative"
              >
                <button
                  onClick={() => setSelectedDate(date)}
                  className={`
                    w-10 h-10 mx-auto flex items-center justify-center rounded-full
                    transition-all duration-200 relative
                    ${bgColorClass} ${textColorClass} ${ringClass}
                    ${!moodEntry && !isToday ? (darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-100') : ''}
                    font-medium shadow-sm
                  `}
                >
                  {day}
                </button>
              </div>
            );
          })}
          
          {/* Next month days */}
          {(() => {
            const totalCells = firstDayOfMonth + daysInMonth;
            const remainingCells = 7 - (totalCells % 7);
            if (remainingCells === 7) return null;
            
            return Array.from({ length: remainingCells }).map((_, i) => (
              <div 
                key={`next-${i}`} 
                className={`text-center ${
                  darkMode ? 'text-gray-600' : 'text-gray-300'
                } text-sm`}
              >
                {i + 1}
              </div>
            ));
          })()}
        </div>
      </div>
      
      {selectedDate && (
        <div className={`${
          darkMode ? 'bg-gray-800/30' : 'bg-white/90'
        } backdrop-blur-sm rounded-3xl shadow-lg p-8 mt-8 border-0 transition-colors duration-200`}>
          <h3 className={`text-lg font-medium ${
            darkMode ? 'text-white' : 'text-gray-800'
          } mb-6 flex items-center transition-colors duration-200`}>
            <Calendar size={18} className={`${
              darkMode ? 'text-indigo-300' : 'text-indigo-500'
            } mr-2 transition-colors duration-200`} />
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 ${
              darkMode ? 'bg-gray-700/40' : 'bg-gray-50/70'
            } rounded-xl transition-colors duration-200`}>
              <h4 className={`text-sm font-medium ${
                darkMode ? 'text-gray-100' : 'text-gray-700'
              } mb-4 transition-colors duration-200`}>
                Mood
              </h4>
              {(() => {
                const moodEntry = moodEntries.find(entry => entry.date === selectedDate);
                if (!moodEntry) {
                  return (
                    <p className={`${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } italic transition-colors duration-200`}>
                      No mood recorded for this day
                    </p>
                  );
                }
                
                return (
                  <div className="flex items-center">
                    {moodEntry.mood === 'happy' && <Smile size={24} className="text-green-500 mr-2" />}
                    {moodEntry.mood === 'neutral' && <Meh size={24} className="text-yellow-500 mr-2" />}
                    {moodEntry.mood === 'sad' && <Frown size={24} className="text-red-500 mr-2" />}
                    <span className={`${
                      darkMode ? 'text-gray-100' : 'text-gray-700'
                    } capitalize transition-colors duration-200`}>
                      {moodEntry.mood}
                    </span>
                  </div>
                );
              })()}
            </div>
            
            <div className={`p-6 ${
              darkMode ? 'bg-gray-700/40' : 'bg-gray-50/70'
            } rounded-xl transition-colors duration-200`}>
              <h4 className={`text-sm font-medium ${
                darkMode ? 'text-gray-100' : 'text-gray-700'
              } mb-4 transition-colors duration-200`}>
                Tasks ({getTasksForDate(selectedDate).length})
              </h4>
              {(() => {
                const tasksForDay = getTasksForDate(selectedDate);
                if (tasksForDay.length === 0) {
                  return (
                    <p className={`${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    } italic transition-colors duration-200`}>
                      No tasks for this day
                    </p>
                  );
                }
                
                return (
                  <ul className="space-y-2">
                    {tasksForDay.map(task => (
                      <li 
                        key={task.id} 
                        className={`flex items-center p-2 ${
                          darkMode ? 'hover:bg-gray-600/40' : 'hover:bg-gray-100/50'
                        } rounded-md transition-colors duration-200`}
                      >
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          task.completed ? 'bg-green-500' : darkMode ? 'bg-gray-500' : 'bg-gray-300'
                        }`}></div>
                        <span className={`text-sm ${
                          task.completed 
                            ? 'line-through text-gray-400' 
                            : darkMode 
                              ? 'text-gray-100' 
                              : 'text-gray-700'
                        } transition-colors duration-200`}>
                          {task.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      
      <div className={`mt-8 flex justify-center space-x-10 p-4 ${
        darkMode ? 'bg-gray-700/40' : 'bg-gray-50/70'
      } rounded-xl transition-colors duration-200`}>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className={`text-sm ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          } transition-colors duration-200`}>
            Great day
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
          <span className={`text-sm ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          } transition-colors duration-200`}>
            Okay day
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
          <span className={`text-sm ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          } transition-colors duration-200`}>
            Tough day
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;