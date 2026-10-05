import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Priority, Project, Task } from '../../types';
import { TaskItem } from '../common/TaskItem';

interface TasksScreenProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenCreateTask: (defaultProjectId?: string) => void;
}

type StatusFilter = 'all' | 'pending' | 'completed' | 'overdue';

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  projects,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onOpenCreateTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');
  const [showFilters, setShowFilters] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        // Status filter
        if (statusFilter === 'pending' && task.status !== 'pending') return false;
        if (statusFilter === 'completed' && task.status !== 'completed') return false;
        if (statusFilter === 'overdue') {
          if (task.status === 'completed' || task.dueDate >= today) return false;
        }

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Project filter
        if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'priority') {
          const score = { high: 3, medium: 2, low: 1 };
          return score[b.priority] - score[a.priority];
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, selectedProjectId, sortBy, today]);

  const activeFiltersCount =
    (statusFilter !== 'all' ? 1 : 0) +
    (priorityFilter !== 'all' ? 1 : 0) +
    (selectedProjectId !== 'all' ? 1 : 0);

  return (
    <div className="flex-1 p-4 pb-24 space-y-3.5 overflow-y-auto no-scrollbar relative">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar tarefas por título ou descrição..."
          className="w-full pl-9 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3A65F0]/20 focus:border-[#3A65F0] transition-all shadow-2xs placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Primary Status Segmented Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setStatusFilter('all')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            statusFilter === 'all'
              ? 'bg-white text-slate-900 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todas ({tasks.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            statusFilter === 'pending'
              ? 'bg-white text-[#3A65F0] shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            statusFilter === 'completed'
              ? 'bg-white text-emerald-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Concluídas
        </button>
        <button
          onClick={() => setStatusFilter('overdue')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
            statusFilter === 'overdue'
              ? 'bg-white text-rose-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Atrasadas
        </button>
      </div>

      {/* Filter and Sort Bar Trigger */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
            showFilters || activeFiltersCount > 0
              ? 'bg-blue-50 border-[#3A65F0] text-[#3A65F0]'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filtros avançados</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-[#3A65F0] text-white text-[10px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort Selector */}
        <div className="flex items-center gap-1 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-2 py-1">
          <ArrowUpDown className="w-3 h-3 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'title')}
            className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="date">Data</option>
            <option value="priority">Prioridade</option>
            <option value="title">Título</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-3 shadow-2xs animate-in fade-in duration-150">
          {/* Priority filter */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">
              Prioridade
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'high', 'medium', 'low'] as const).map((p) => {
                const label =
                  p === 'all'
                    ? 'Todas'
                    : p === 'high'
                    ? 'Alta'
                    : p === 'medium'
                    ? 'Média'
                    : 'Baixa';
                const isSelected = priorityFilter === p;
                return (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project filter */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">
              Projeto
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedProjectId('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedProjectId === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos
              </button>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedProjectId === proj.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: proj.color }}
                  />
                  <span>{proj.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-2.5 pt-1">
        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">Nenhuma tarefa encontrada</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {searchQuery || activeFiltersCount > 0
                ? 'Tente ajustar seus termos de pesquisa ou remover os filtros.'
                : 'Comece adicionando uma nova tarefa para organizar o seu dia.'}
            </p>
            <button
              onClick={() => onOpenCreateTask(selectedProjectId !== 'all' ? selectedProjectId : undefined)}
              className="mt-4 px-4 py-2 bg-[#3A65F0] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Nova Tarefa</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              project={projects.find((p) => p.id === task.projectId)}
              onToggle={onToggleTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => onOpenCreateTask(selectedProjectId !== 'all' ? selectedProjectId : undefined)}
        className="fixed bottom-20 right-5 z-20 w-14 h-14 rounded-full bg-[#3A65F0] hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all active:scale-95 group"
        title="Criar Nova Tarefa"
        aria-label="Adicionar Tarefa"
      >
        <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
      </button>
    </div>
  );
};
