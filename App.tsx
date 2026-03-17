import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Academic from './components/Academic';
import Personal from './components/Personal';
import Progress from './components/Progress';
import Modal from './components/Modal';
import { Plus, CheckCircle2, Calendar as CalendarIcon, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SchoolTask, LifeEvent } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<SchoolTask[]>([]);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('social');

  // Load from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedEvents = localStorage.getItem('events');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('events', JSON.stringify(events));
  }, [tasks, events]);

  const addTask = (task: Omit<SchoolTask, 'id'>) => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    setTasks([newTask, ...tasks]);
    setIsTaskModalOpen(false);
  };

  const addEvent = (event: Omit<LifeEvent, 'id'>) => {
    const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
    setEvents([newEvent, ...events]);
    setIsEventModalOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  const toggleEvent = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-20 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <>
                  <Dashboard tasks={tasks} events={events} />
                  <div className="grid md:grid-cols-2 gap-8">
                    <Academic tasks={tasks} onToggle={toggleTask} onAdd={() => setIsTaskModalOpen(true)} />
                    <Personal events={events} onToggle={toggleEvent} onAdd={() => setIsEventModalOpen(true)} />
                  </div>
                </>
              )}
              {activeTab === 'academic' && (
                <Academic tasks={tasks} onToggle={toggleTask} onAdd={() => setIsTaskModalOpen(true)} />
              )}
              {activeTab === 'personal' && (
                <Personal events={events} onToggle={toggleEvent} onAdd={() => setIsEventModalOpen(true)} />
              )}
              {activeTab === 'progress' && <Progress tasks={tasks} events={events} onAddEvent={addEvent} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <Modal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        title="Add School Task"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          addTask({
            title: formData.get('title') as string,
            dueDate: formData.get('dueDate') as string,
            status: formData.get('priority') as any,
            icon: 'pen',
            progress: 0
          });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Task Title</label>
            <input name="title" required className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-school-blue outline-none transition-all" placeholder="e.g. Math Homework" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Due Date</label>
            <input name="dueDate" type="date" required className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-school-blue outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Priority</label>
            <select name="priority" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-school-blue outline-none transition-all">
              <option value="pending">Normal</option>
              <option value="high-priority">High Priority</option>
              <option value="exam">Exam</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-school-blue text-white py-4 rounded-2xl font-black border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all">
            CREATE TASK
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        title="Add Life Event"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const category = formData.get('category') as any;
          addEvent({
            title: formData.get('title') as string,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            category,
            location: formData.get('location') as string,
            note: formData.get('note') as string,
            duration: category === 'fitness' ? Number(formData.get('duration')) : undefined,
            completed: false
          });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Event Title</label>
            <input name="title" required className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-event-orange outline-none transition-all" placeholder="e.g. Dinner with friends" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Date</label>
              <input name="date" type="date" required className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-event-orange outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Time</label>
              <input name="time" type="time" required className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-event-orange outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Category</label>
            <select 
              name="category" 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-event-orange outline-none transition-all"
            >
              <option value="social">Social</option>
              <option value="medical">Medical</option>
              <option value="important">Important</option>
              <option value="fitness">Fitness / Workout</option>
            </select>
          </div>
          
          {selectedCategory === 'fitness' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-bold mb-1">Duration (Minutes)</label>
              <div className="flex items-center gap-4">
                <input 
                  name="duration" 
                  type="range" 
                  min="10" 
                  max="60" 
                  step="5" 
                  defaultValue="30"
                  className="flex-1 accent-event-orange"
                  onChange={(e) => {
                    const val = e.target.value;
                    const label = document.getElementById('duration-label');
                    if (label) label.textContent = val === '60' ? '60+ mins' : `${val} mins`;
                  }}
                />
                <span id="duration-label" className="font-bold text-event-orange w-20 text-right">30 mins</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-1">Location (Optional)</label>
            <input name="location" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-event-orange outline-none transition-all" placeholder="e.g. Downtown" />
          </div>
          <button type="submit" className="w-full bg-event-orange text-white py-4 rounded-2xl font-black border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all">
            ADD EVENT
          </button>
        </form>
      </Modal>

      {/* Floating Action Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 flex flex-col gap-4">
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="w-14 h-14 bg-school-blue text-white rounded-full shadow-lg border-b-4 border-blue-600 flex items-center justify-center active:translate-y-1 active:border-b-0 transition-all"
        >
          <CheckCircle2 className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setIsEventModalOpen(true)}
          className="w-14 h-14 bg-event-orange text-white rounded-full shadow-lg border-b-4 border-orange-600 flex items-center justify-center active:translate-y-1 active:border-b-0 transition-all"
        >
          <CalendarIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
