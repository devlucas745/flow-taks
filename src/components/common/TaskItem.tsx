import React from 'react';
import { Check, Calendar, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Project, Task } from '../../types';

interface TaskItemProps {
  task: Task;
  project?: Project;
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  project,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'completed';
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = !isCompleted && task.dueDate < today;
  const isDueToday = !isCompleted && task.dueDate === today;

  // Format date readable
  const formatDueDate = (dateStr: string) => {
    if (dateStr === today) return 'Hoje';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Amanhã';

    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
  };

  const getPriorityBadge = (p: Task['priority']) => {
    switch (p) {
      case 'high':
        return (
          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
            Alta
          </span>
        );
      case 'medium':
        return (
          <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            Média
          </span>
        );
      case 'low':
      default:
        return (
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            Baixa
          </span>
        );
    }
  };

  return (
    <div
      className={`group relative bg-white border rounded-2xl p-3.5 transition-all duration-200 hover:shadow-sm ${
        isCompleted
          ? 'border-slate-100 bg-slate-50/70 opacity-75'
          : isOverdue
          ? 'border-rose-200 shadow-xs'
          : 'border-slate-200/80'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Android Checkbox Hitbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`shrink-0 w-6 h-6 rounded-lg mt-0.5 border flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-[#3A65F0] border-[#3A65F0] text-white shadow-xs'
              : 'border-slate-300 hover:border-[#3A65F0] bg-white'
          }`}
          aria-label={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
        >
          {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-semibold tracking-tight transition-colors line-clamp-2 ${
                isCompleted
                  ? 'line-through text-slate-400'
                  : 'text-slate-800 group-hover:text-slate-900'
              }`}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p
              className={`text-xs mt-1 line-clamp-2 ${
                isCompleted ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Meta Tags Row */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            {getPriorityBadge(task.priority)}

            {project && (
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate max-w-[120px] font-medium">{project.name}</span>
              </div>
            )}

            <div
              className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                isOverdue
                  ? 'text-rose-600 bg-rose-50 font-semibold'
                  : isDueToday
                  ? 'text-[#3A65F0] bg-blue-50 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="w-3 h-3 text-rose-500" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              <span>{formatDueDate(task.dueDate)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons (Edit & Delete) */}
        <div className="flex items-center gap-1 shrink-0 -mr-1">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Editar Tarefa"
            aria-label="Editar"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Excluir Tarefa"
            aria-label="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
