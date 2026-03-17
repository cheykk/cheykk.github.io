import React from 'react';
import { BookOpen, Pencil, FlaskConical, Check } from 'lucide-react';
import { SchoolTask } from '../types';

interface AcademicProps {
  tasks: SchoolTask[];
  onToggle: (id: string) => void;
  onAdd: () => void;
}

export default function Academic({ tasks, onToggle, onAdd }: AcademicProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <BookOpen className="text-school-blue w-6 h-6" />
          SCHOOL TASKS
        </h3>
        <button 
          onClick={onAdd}
          className="bg-duo-pink text-white px-4 py-1.5 rounded-xl font-bold text-sm border-b-4 border-duo-pink-dark active:border-b-0 active:translate-y-1 transition-all"
        >
          ADD NEW
        </button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-400 font-bold">No tasks yet. Add one to start!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggle(task.id)}
              className={`bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-start gap-4 hover:border-school-blue transition-colors group cursor-pointer
                ${task.status === 'completed' ? 'opacity-75' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center
                ${task.status === 'completed' ? 'bg-gray-100' : 'bg-blue-50'}`}>
                {task.status === 'completed' ? (
                  <Check className="text-duo-pink w-6 h-6" />
                ) : (
                  <>
                    {task.icon === 'pen' && <Pencil className="text-school-blue w-6 h-6" />}
                    {task.icon === 'flask' && <FlaskConical className="text-school-blue w-6 h-6" />}
                  </>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {task.title}
                  </h4>
                  {task.status === 'high-priority' && (
                    <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">High Priority</span>
                  )}
                  {task.status === 'exam' && (
                    <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Exam</span>
                  )}
                  {task.status === 'completed' && (
                    <span className="bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Completed</span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {task.dueDate}
                </p>
                {task.progress !== undefined && task.status !== 'completed' && (
                  <div className="mt-3 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-school-blue h-full transition-all duration-500" style={{ width: `${task.progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
