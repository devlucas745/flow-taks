import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Project, Task } from '../../types';
import { TaskItem } from '../common/TaskItem';

interface CalendarScreenProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenCreateTask: (defaultProjectId?: string, defaultDate?: string) => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  tasks,
  projects,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onOpenCreateTask,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const weekDayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Days in month calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateStr(dStr);
  };

  // Filter tasks for selected date
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="flex-1 p-4 pb-24 space-y-4 overflow-y-auto no-scrollbar">
      {/* Calendar Header with Month Selector */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#3A65F0]" />
            <h2 className="text-base font-bold text-slate-900">
              {monthNames[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                setSelectedDateStr(now.toISOString().split('T')[0]);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {weekDayLabels.map((lbl, idx) => (
            <span
              key={lbl}
              className={`text-[11px] font-bold py-1 ${
                idx === 0 || idx === 6 ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {lbl}
            </span>
          ))}
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {/* Month days */}
          {Array.from({ length: totalDaysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const currentCellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
              dayNum
            ).padStart(2, '0')}`;
            const isSelected = selectedDateStr === currentCellDateStr;
            const isToday = todayStr === currentCellDateStr;

            // Tasks scheduled for this day
            const dayTasks = tasks.filter((t) => t.dueDate === currentCellDateStr);
            const hasOverdue = dayTasks.some((t) => t.status === 'pending' && currentCellDateStr < todayStr);
            const hasPending = dayTasks.some((t) => t.status === 'pending');
            const hasCompleted = dayTasks.some((t) => t.status === 'completed');

            return (
              <button
                key={dayNum}
                onClick={() => handleSelectDay(dayNum)}
                className={`h-11 rounded-xl flex flex-col items-center justify-center text-xs font-semibold relative transition-all ${
                  isSelected
                    ? 'bg-[#3A65F0] text-white shadow-xs scale-105'
                    : isToday
                    ? 'bg-blue-50 text-[#3A65F0] border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{dayNum}</span>

                {/* Task Indicators */}
                {dayTasks.length > 0 && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {hasOverdue && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-rose-500'
                        }`}
                      />
                    )}
                    {hasPending && !hasOverdue && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-amber-500'
                        }`}
                      />
                    )}
                    {hasCompleted && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-blue-200' : 'bg-emerald-500'
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Header & Tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Tarefas para {selectedDateStr === todayStr ? 'Hoje' : selectedDateStr.split('-').reverse().join('/')}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'tarefa agendada' : 'tarefas agendadas'}
            </p>
          </div>

          <button
            onClick={() => onOpenCreateTask(undefined, selectedDateStr)}
            className="h-8 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#3A65F0] font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Adicionar</span>
          </button>
        </div>

        {selectedDayTasks.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center">
            <p className="text-xs text-slate-500">
              Nenhuma tarefa agendada para esta data.
            </p>
            <button
              onClick={() => onOpenCreateTask(undefined, selectedDateStr)}
              className="mt-2.5 px-3 py-1.5 bg-[#3A65F0] text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              + Agendar tarefa neste dia
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                project={projects.find((p) => p.id === task.projectId)}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
