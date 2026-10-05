import React from 'react';
import {
  Clock,
  CheckCircle2,
  FolderKanban,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  ListTodo
} from 'lucide-react';
import { Project, TabType, Task, User } from '../../types';
import { TaskItem } from '../common/TaskItem';

interface DashboardScreenProps {
  user: User;
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenCreateTask: (defaultProjectId?: string) => void;
  onNavigateTab: (tab: TabType) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  tasks,
  projects,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onOpenCreateTask,
  onNavigateTab,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = tasks.filter((t) => t.status === 'pending' && t.dueDate < today);
  const activeProjectsCount = projects.length;

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Recent tasks (pending first, or newly added)
  const recentTasks = [...tasks]
    .sort((a, b) => {
      // Pending first
      if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 5);

  return (
    <div className="flex-1 p-4 pb-20 space-y-5 overflow-y-auto no-scrollbar">
      {/* User Greeting & Header Banner */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
            Olá, {user.name.split(' ')[0]} <span>👋</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => onOpenCreateTask()}
          className="h-9 px-3.5 bg-[#3A65F0] hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
          title="Nova Tarefa"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pending Tasks */}
        <div
          onClick={() => onNavigateTab('tasks')}
          className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Pendentes</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#3A65F0]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {pendingTasks.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium group-hover:text-[#3A65F0] transition-colors flex items-center gap-1">
            <span>Ver tarefas</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>

        {/* Completed Tasks */}
        <div
          onClick={() => onNavigateTab('tasks')}
          className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Concluídas</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {completedTasks.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium group-hover:text-emerald-600 transition-colors flex items-center gap-1">
            <span>{completionRate}% taxa</span>
            <TrendingUp className="w-3 h-3" />
          </p>
        </div>

        {/* Active Projects */}
        <div
          onClick={() => onNavigateTab('projects')}
          className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Projetos Ativos</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
            {activeProjectsCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium group-hover:text-indigo-600 transition-colors flex items-center gap-1">
            <span>Gerenciar</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </p>
        </div>

        {/* Overdue Tasks */}
        <div
          onClick={() => onNavigateTab('tasks')}
          className={`border rounded-2xl p-3.5 shadow-2xs transition-all cursor-pointer group ${
            overdueTasks.length > 0
              ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
              : 'bg-white border-slate-200/80 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Atrasadas</span>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                overdueTasks.length > 0
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-2xl font-extrabold tabular-nums ${
              overdueTasks.length > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {overdueTasks.length}
          </div>
          <p
            className={`text-[11px] mt-1 font-medium flex items-center gap-1 ${
              overdueTasks.length > 0 ? 'text-rose-500' : 'text-slate-400'
            }`}
          >
            <span>{overdueTasks.length > 0 ? 'Atenção necessária' : 'Tudo em dia'}</span>
          </p>
        </div>
      </div>

      {/* Projects Progress Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-[#3A65F0]" />
            <h3 className="text-sm font-bold text-slate-900">Progresso dos Projetos</h3>
          </div>
          <button
            onClick={() => onNavigateTab('projects')}
            className="text-xs font-semibold text-[#3A65F0] hover:underline"
          >
            Ver todos
          </button>
        </div>

        <div className="space-y-3">
          {projects.slice(0, 3).map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const pCompleted = projectTasks.filter((t) => t.status === 'completed').length;
            const pTotal = projectTasks.length;
            const progress = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;

            return (
              <div key={project.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-semibold text-slate-800 truncate">
                      {project.name}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px] tabular-nums shrink-0">
                    {pCompleted}/{pTotal} ({progress}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-[#3A65F0]" />
            <h3 className="text-sm font-bold text-slate-900">Tarefas Recentes</h3>
          </div>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-semibold text-[#3A65F0] hover:underline"
          >
            Ver todas ({tasks.length})
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center">
            <p className="text-xs text-slate-500">Nenhuma tarefa criada ainda.</p>
            <button
              onClick={() => onOpenCreateTask()}
              className="mt-3 px-3 py-1.5 bg-[#3A65F0] text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Criar primeira tarefa
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentTasks.map((task) => (
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
