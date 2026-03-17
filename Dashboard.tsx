import React from 'react';
import { Flame, ChevronLeft, ChevronRight, Zap, Star } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { SchoolTask, LifeEvent } from '../types';
import { calculateStreak } from '../utils/streak';

interface DashboardProps {
  tasks: SchoolTask[];
  events: LifeEvent[];
}

export default function Dashboard({ tasks, events }: DashboardProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const streak = calculateStreak(tasks, events);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const selectedDayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate));
  const selectedDayEvents = events.filter(e => isSameDay(new Date(e.date), selectedDate));

  return (
    <div className="space-y-8 mb-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 flex items-center gap-4 hover:border-duo-pink transition-colors">
          <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center">
            <Flame className="text-duo-pink w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Current Streak</p>
            <p className="text-2xl font-black text-gray-800">{streak} DAYS</p>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 flex items-center gap-4 hover:border-school-blue transition-colors">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Zap className="text-school-blue w-8 h-8" />
          </div>
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Tasks Done</p>
            <p className="text-2xl font-black text-gray-800">{completedTasks}/{totalTasks}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-extrabold uppercase tracking-tight">Calendar</h2>
            </div>

            <div className="flex items-center gap-3 bg-gray-100 p-1 rounded-2xl">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="p-2 hover:bg-white rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="px-4 font-extrabold uppercase tracking-wider">
                {format(currentDate, 'MMMM yyyy')}
              </span>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="p-2 hover:bg-white rounded-xl transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-xs font-black text-gray-400 uppercase">
                {day}
              </div>
            ))}

            {days.map((day, i) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = isSameDay(day, new Date());
              const isSelected = isSameDay(day, selectedDate);
              const hasEvent = events.some(e => isSameDay(new Date(e.date), day));
              const hasTask = tasks.some(t => isSameDay(new Date(t.dueDate), day));

              return (
                <div
                  key={i}
                  onClick={() => isCurrentMonth && setSelectedDate(day)}
                  className={`aspect-square rounded-full flex flex-col items-center justify-center font-bold text-lg transition-all relative
                    ${isToday 
                      ? "bg-duo-pink text-white border-b-4 border-duo-pink-dark" 
                      : isSelected
                        ? "bg-gray-800 text-white"
                        : isCurrentMonth
                          ? "bg-white text-gray-700 border-2 border-gray-100 hover:border-gray-300 cursor-pointer"
                          : "text-transparent pointer-events-none"
                    }`}
                >
                  {isCurrentMonth ? format(day, 'd') : ''}
                  {isCurrentMonth && (
                    <div className="flex gap-1 mt-1">
                      {hasEvent && <div className={`w-1.5 h-1.5 rounded-full ${isToday || isSelected ? 'bg-white' : 'bg-event-orange'}`} />}
                      {hasTask && <div className={`w-1.5 h-1.5 rounded-full ${isToday || isSelected ? 'bg-white' : 'bg-school-blue'}`} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-lg font-black uppercase mb-4 text-gray-400">
            {isSameDay(selectedDate, new Date()) ? 'Today' : format(selectedDate, 'MMM d')}
          </h3>
          
          <div className="space-y-4">
            {selectedDayTasks.length === 0 && selectedDayEvents.length === 0 ? (
              <p className="text-sm font-bold text-gray-300 italic">No plans for this day!</p>
            ) : (
              <>
                {selectedDayTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border-2 border-blue-100">
                    <div className="w-2 h-2 rounded-full bg-school-blue" />
                    <span className="text-sm font-bold text-school-blue truncate">{task.title}</span>
                  </div>
                ))}
                {selectedDayEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border-2 border-orange-100">
                    <div className="w-2 h-2 rounded-full bg-event-orange" />
                    <span className="text-sm font-bold text-event-orange truncate">{event.title}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
