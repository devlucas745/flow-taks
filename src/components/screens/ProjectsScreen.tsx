import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { Project, Task } from '../../types';
import { TaskItem } from '../common/TaskItem';

interface ProjectsScreenProps {
  projects: Project[];
  tasks: Task[];
  onOpenCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenCreateTask: (defaultProjectId?: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  projects,
  tasks,
  onOpenCreateProject,
  onEditProject,
  onDeleteProject,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onOpenCreateTask,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // If a project is selected, show its drill-down tasks view
  if (selectedProject) {
    const projectTasks = tasks.filter((t) => t.projectId === selectedProject.id);
    const completedTasks = projectTasks.filter((t) => t.status === 'completed');
    const progress =
      projectTasks.length > 0
        ? Math.round((completedTasks.length / projectTasks.length) * 100)
        : 0;

    return (
      <div className="flex-1 p-4 pb-24 space-y-4 overflow-y-auto no-scrollbar">
        {/* Back header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 -ml-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Todos os Projetos</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEditProject(selectedProject)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              title="Editar Projeto"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Excluir este projeto e todas as suas tarefas?')) {
                  onDeleteProject(selectedProject.id);
                  setSelectedProject(null);
                }
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50"
              title="Excluir Projeto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Header Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs"
              style={{ backgroundColor: selectedProject.color }}
            >
              <span className="font-bold text-base">
                {selectedProject.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-slate-900 truncate">
                {selectedProject.name}
              </h2>
              {selectedProject.description && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {selectedProject.description}
                </p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Progresso</span>
              <span className="font-bold text-slate-800 tabular-nums">
                {completedTasks.length} de {projectTasks.length} concluídas ({progress}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, backgroundColor: selectedProject.color }}
              />
            </div>
          </div>
        </div>

        {/* Project Tasks List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pt-1">
            <h3 className="text-xs font-bold text-slate-700 tracking-wide uppercase">
              Tarefas do Projeto ({projectTasks.length})
            </h3>
            <button
              onClick={() => onOpenCreateTask(selectedProject.id)}
              className="text-xs font-semibold text-[#3A65F0] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Tarefa</span>
            </button>
          </div>

          {projectTasks.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center">
              <p className="text-xs text-slate-500">Nenhuma tarefa vinculada a este projeto.</p>
              <button
                onClick={() => onOpenCreateTask(selectedProject.id)}
                className="mt-3 px-3.5 py-1.5 bg-[#3A65F0] text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                + Adicionar primeira tarefa
              </button>
            </div>
          ) : (
            projectTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                project={selectedProject}
                onToggle={onToggleTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  // Projects Overview List
  return (
    <div className="flex-1 p-4 pb-24 space-y-4 overflow-y-auto no-scrollbar relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Seus Projetos</h2>
          <p className="text-xs text-slate-500">
            {projects.length} {projects.length === 1 ? 'projeto ativo' : 'projetos ativos'}
          </p>
        </div>
        <button
          onClick={onOpenCreateProject}
          className="h-9 px-3 bg-[#3A65F0] hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo Projeto</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">Nenhum projeto cadastrado</p>
          <p className="text-xs text-slate-400 mt-1">
            Crie categorias para agrupar suas metas e tarefas.
          </p>
          <button
            onClick={onOpenCreateProject}
            className="mt-4 px-4 py-2 bg-[#3A65F0] text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            Criar Primeiro Projeto
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            const completedCount = projectTasks.filter((t) => t.status === 'completed').length;
            const totalCount = projectTasks.length;
            const progress =
              totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-xs"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#3A65F0] transition-colors truncate">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 shrink-0"
                  >
                    <button
                      onClick={() => onEditProject(project)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Excluir o projeto "${project.name}" e suas tarefas?`
                          )
                        ) {
                          onDeleteProject(project.id);
                        }
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{completedCount} de {totalCount} concluídas</span>
                    </span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {progress}%
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

                <div className="flex items-center justify-end text-xs font-semibold text-[#3A65F0] pt-1">
                  <span className="flex items-center gap-1">
                    Ver tarefas do projeto
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
