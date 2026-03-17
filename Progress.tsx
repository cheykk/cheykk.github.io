import React from 'react';
import { ChevronLeft, Zap, Clock, Trophy, Star, Crown, Flame } from 'lucide-react';
import { SchoolTask, LifeEvent } from '../types';
import { isSameDay, subDays, format } from 'date-fns';
import { calculateStreak } from '../utils/streak';

interface ProgressProps {
  tasks: SchoolTask[];
  events: LifeEvent[];
  onAddEvent: (event: Omit<LifeEvent, 'id'>) => void;
}

export default function Progress({ tasks, events, onAddEvent }: ProgressProps) {
  const [workoutTitle, setWorkoutTitle] = React.useState('');
  const [workoutDuration, setWorkoutDuration] = React.useState(30);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalXP = completedTasks * 100 + events.filter(e => e.completed).length * 50;
  const streak = calculateStreak(tasks, events);
  
  const totalMinutes = events
    .filter(e => e.category === 'fitness' && e.completed && e.duration)
    .reduce((acc, curr) => acc + (curr.duration || 0), 0);
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeSpent = `${hours}h ${minutes}m`;

  const handleLogWorkout = () => {
    if (!workoutTitle) return;
    onAddEvent({
      title: workoutTitle,
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      category: 'fitness',
      duration: workoutDuration,
      completed: true,
      note: 'Quick log from Statistics'
    });
    setWorkoutTitle('');
    setWorkoutDuration(30);
  };

  // Generate heatmap data based on real events and tasks
  const heatmapCells = Array.from({ length: 7 * 26 }, (_, i) => {
    const date = subDays(new Date(), (7 * 26) - 1 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    const activityCount = 
      tasks.filter(t => t.status === 'completed' && t.dueDate === dateStr).length +
      events.filter(e => e.completed && e.date === dateStr).length;
    return Math.min(activityCount, 4);
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="bg-white p-3 rounded-2xl neo-shadow border-2 border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Your Progress</h1>
        </div>
      </header>

      <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-gray-200 neo-shadow">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-pink-100 p-2 rounded-lg">
              <Flame className="w-6 h-6 text-duo-pink" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Log Today's Exercise</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
              <input 
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-duo-pink focus:border-duo-pink outline-none placeholder:text-gray-400 font-medium" 
                placeholder="Describe your workout (e.g., Yoga, Running)"
                type="text" 
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
              />
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black text-gray-400 uppercase">
                  <span>Duration</span>
                  <span className="text-duo-pink">{workoutDuration === 60 ? '60+ mins' : `${workoutDuration} mins`}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  step="5" 
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                  className="w-full accent-duo-pink"
                />
              </div>
            </div>
            
            <div className="md:col-span-4 flex items-end">
              <button 
                onClick={handleLogWorkout}
                className="w-full bg-duo-pink hover:bg-duo-pink-dark text-white font-black py-4 px-8 rounded-2xl neo-shadow transition-all active:neo-shadow-active whitespace-nowrap"
              >
                LOG WORKOUT
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="md:col-span-2 bg-white rounded-3xl p-8 border-2 border-gray-200 neo-shadow flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <h2 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Current Streak</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black text-duo-pink-dark">{streak}</span>
              <span className="text-2xl font-bold text-gray-400">DAYS</span>
            </div>
            <p className="text-gray-600 mt-4 font-medium italic">"You're on fire! Keep it up!"</p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-duo-pink opacity-5 rounded-full" />
        </section>

        <section className="bg-white rounded-3xl p-6 border-2 border-gray-200 neo-shadow flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 rounded-2xl">
              <Zap className="h-6 w-6 text-duo-pink" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold">Total XP</p>
              <p className="text-2xl font-black text-gray-800">{totalXP.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 rounded-2xl">
              <Clock className="h-6 w-6 text-duo-pink" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-bold">Exercise Time</p>
              <p className="text-2xl font-black text-gray-800">{timeSpent}</p>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-white rounded-3xl p-8 border-2 border-gray-200 neo-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Consistency Map</h3>
          <select className="border-2 border-gray-200 rounded-xl px-4 py-1 font-bold text-gray-600 focus:ring-duo-pink focus:border-duo-pink outline-none">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5">
            {heatmapCells.map((level, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-sm
                  ${level === 0 ? 'bg-gray-100' : 
                    level === 1 ? 'bg-pink-100' : 
                    level === 2 ? 'bg-pink-300' : 
                    level === 3 ? 'bg-duo-pink' : 'bg-duo-pink-dark'}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-xs font-bold text-gray-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-pink-100" />
          <div className="w-3 h-3 rounded-sm bg-pink-300" />
          <div className="w-3 h-3 rounded-sm bg-duo-pink" />
          <div className="w-3 h-3 rounded-sm bg-duo-pink-dark" />
          <span>More</span>
        </div>
      </section>
    </div>
  );
}
