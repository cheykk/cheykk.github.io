import React from 'react';
import { Coffee, Clock, MapPin } from 'lucide-react';
import { LifeEvent } from '../types';

interface PersonalProps {
  events: LifeEvent[];
  onToggle: (id: string) => void;
  onAdd: () => void;
}

export default function Personal({ events, onToggle, onAdd }: PersonalProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black flex items-center gap-2">
          <Coffee className="text-event-orange w-6 h-6" />
          LIFE EVENTS
        </h3>
        <button 
          onClick={onAdd}
          className="bg-event-orange text-white px-4 py-1.5 rounded-xl font-bold text-sm border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all"
        >
          SCHEDULE
        </button>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {events.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
            <p className="text-gray-400 font-bold">No events yet. Schedule one!</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              onClick={() => onToggle(event.id)}
              className={`bg-white border-2 rounded-2xl p-4 flex gap-4 shadow-sm border-l-[6px] transition-all cursor-pointer
                ${event.completed ? 'opacity-60 grayscale-[0.5]' : ''}
                ${event.category === 'important' ? 'border-gray-100 border-l-gray-300' : 'border-orange-100 border-l-event-orange'}`}
            >
              <div className={`flex flex-col items-center justify-center min-w-[50px] rounded-xl p-2
                ${event.category === 'important' ? 'bg-gray-50 opacity-50' : 'bg-orange-50'}`}>
                <span className={`text-xs font-black uppercase ${event.category === 'important' ? 'text-gray-400' : 'text-event-orange'}`}>
                  {event.date.includes('-') ? format(new Date(event.date), 'MMM') : 'Event'}
                </span>
                <span className={`text-xl font-extrabold ${event.category === 'important' ? 'text-gray-400' : 'text-gray-700'}`}>
                  {event.date.includes('-') ? event.date.split('-')[2] : event.date}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-extrabold ${event.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {event.duration && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase">
                        {event.duration === 60 ? '60+ min' : `${event.duration} min`}
                      </span>
                    )}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase
                      ${event.category === 'social' ? 'bg-green-100 text-green-600' : 
                        event.category === 'medical' ? 'bg-red-100 text-red-600' : 
                        event.category === 'fitness' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {event.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 opacity-50" /> {event.time}
                </p>
                {event.location && (
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
                    <MapPin className="w-4 h-4 opacity-50" /> {event.location}
                  </p>
                )}
                {event.note && (
                  <div className={`mt-2 p-2 rounded-lg border ${event.category === 'important' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100'}`}>
                    <p className={`text-xs font-semibold italic ${event.category === 'important' ? 'text-yellow-700' : 'text-gray-500'}`}>
                      {event.note}
                    </p>
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

import { format } from 'date-fns';
