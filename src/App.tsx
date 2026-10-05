import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AppSettings, Project, TabType, Task, User } from './types';
import { StorageService } from './services/storage';
import { SoundService } from './services/audio';

import { AndroidFrame } from './components/layout/AndroidFrame';
import { TopAppBar } from './components/layout/TopAppBar';
import { BottomNav } from './components/layout/BottomNav';

import { SplashScreen } from './components/screens/SplashScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { TasksScreen } from './components/screens/TasksScreen';
import { ProjectsScreen } from './components/screens/ProjectsScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';

import { TaskModal } from './components/modals/TaskModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { KotlinExportModal } from './components/modals/KotlinExportModal';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => StorageService.isLoggedIn());
  const [user, setUser] = useState<User>(() => StorageService.getUser() || {
    id: 'usr_demo_1',
    name: 'Luccas Silva',
    email: 'demo@flowtask.com',
  });

  const [tasks, setTasks] = useState<Task[]>(() => StorageService.getTasks());
  const [projects, setProjects] = useState<Project[]>(() => StorageService.getProjects());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());

  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskModalDefaultProjectId, setTaskModalDefaultProjectId] = useState<string | undefined>();
  const [taskModalDefaultDate, setTaskModalDefaultDate] = useState<string | undefined>();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [isKotlinModalOpen, setIsKotlinModalOpen] = useState<boolean>(false);

  // Sync state changes with storage
  useEffect(() => {
    StorageService.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    StorageService.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (user) {
      StorageService.setUser(user);
    }
  }, [user]);

  // Auth Handlers
  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setIsLoggedIn(true);
    StorageService.setLoggedIn(true);
    setCurrentTab('home');
    if (settings.soundEffects) {
      SoundService.playSuccess();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    StorageService.setLoggedIn(false);
    if (settings.soundEffects) {
      SoundService.playClick();
    }
  };

  // Task Actions
  const handleToggleTask = useCallback((taskId: string) => {
    const { tasks: updated, toggledTask } = StorageService.toggleTaskStatus(taskId);
    setTasks(updated);

    if (toggledTask && toggledTask.status === 'completed') {
      if (settings.soundEffects) {
        SoundService.playSuccess();
      }
      if (settings.hapticFeedback) {
        SoundService.triggerHaptic();
      }

      // Celebratory Confetti Burst
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#3A65F0', '#10B981', '#F59E0B', '#60A5FA'],
        });
      } catch {
        // Ignore in restricted environments
      }
    } else {
      if (settings.soundEffects) {
        SoundService.playClick();
      }
    }
  }, [settings]);

  const handleOpenCreateTask = (defaultProjectId?: string, defaultDate?: string) => {
    setEditingTask(null);
    setTaskModalDefaultProjectId(defaultProjectId);
    setTaskModalDefaultDate(defaultDate);
    setIsTaskModalOpen(true);
    if (settings.soundEffects) {
      SoundService.playClick();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
    if (settings.soundEffects) {
      SoundService.playClick();
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (settings.confirmBeforeDelete) {
      if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
      }
    }
    const updated = StorageService.deleteTask(taskId);
    setTasks(updated);
    if (settings.soundEffects) {
      SoundService.playClick();
    }
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      const existing = tasks.find((t) => t.id === existingId);
      if (existing) {
        const updatedTask: Task = {
          ...existing,
          ...taskData,
          completedAt:
            taskData.status === 'completed'
              ? existing.completedAt || new Date().toISOString().split('T')[0]
              : undefined,
        };
        const updated = StorageService.updateTask(updatedTask);
        setTasks(updated);
      }
    } else {
      const newTask = StorageService.addTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
    }
    if (settings.soundEffects) {
      SoundService.playSuccess();
    }
  };

  // Project Actions
  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
    if (settings.soundEffects) {
      SoundService.playClick();
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
    if (settings.soundEffects) {
      SoundService.playClick();
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const { projects: updatedProjects, tasks: updatedTasks } =
      StorageService.deleteProject(projectId);
    setProjects(updatedProjects);
    setTasks(updatedTasks);
    if (settings.soundEffects) {
      SoundService.playClick();
    }
  };

  const handleSaveProject = (
    projectData: Omit<Project, 'id' | 'createdAt'>,
    existingId?: string
  ) => {
    if (existingId) {
      const existing = projects.find((p) => p.id === existingId);
      if (existing) {
        const updatedProj: Project = {
          ...existing,
          ...projectData,
        };
        const updated = StorageService.updateProject(updatedProj);
        setProjects(updated);
      }
    } else {
      const newProj = StorageService.addProject(projectData);
      setProjects((prev) => [newProj, ...prev]);
    }
    if (settings.soundEffects) {
      SoundService.playSuccess();
    }
  };

  // Data Reset & Backup
  const handleResetDemoData = () => {
    const fresh = StorageService.resetToDemo();
    setUser(fresh.user);
    setTasks(fresh.tasks);
    setProjects(fresh.projects);
    setSettings(fresh.settings);
  };

  const handleExportBackup = () => {
    const jsonStr = StorageService.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowtask-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonStr: string): boolean => {
    const success = StorageService.importBackup(jsonStr);
    if (success) {
      setTasks(StorageService.getTasks());
      setProjects(StorageService.getProjects());
      setUser(StorageService.getUser() || user);
      setSettings(StorageService.getSettings());
    }
    return success;
  };

  const pendingTasksCount = tasks.filter((t) => t.status === 'pending').length;

  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'home':
        return 'FlowTask';
      case 'tasks':
        return 'Todas as Tarefas';
      case 'projects':
        return 'Projetos';
      case 'calendar':
        return 'Calendário';
      case 'reports':
        return 'Relatórios';
      case 'profile':
        return 'Meu Perfil';
    }
  };

  const getTabSubtitle = (tab: TabType) => {
    switch (tab) {
      case 'home':
        return 'Organize hoje. Conquiste amanhã.';
      case 'tasks':
        return `${pendingTasksCount} tarefas a realizar`;
      case 'projects':
        return `${projects.length} categorias ativas`;
      case 'calendar':
        return 'Planejamento mensal';
      case 'reports':
        return 'Estatísticas de produtividade';
      case 'profile':
        return user.email;
    }
  };

  return (
    <AndroidFrame>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : !isLoggedIn ? (
        <AuthScreen onSuccess={handleAuthSuccess} />
      ) : (
        <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
          {/* Top App Bar */}
          <TopAppBar
            currentTab={currentTab}
            title={getTabTitle(currentTab)}
            subtitle={getTabSubtitle(currentTab)}
            onNavigateTab={(tab) => {
              setCurrentTab(tab);
              if (settings.soundEffects) SoundService.playClick();
            }}
            onOpenKotlinModal={() => setIsKotlinModalOpen(true)}
          />

          {/* Current Tab Screen */}
          <main className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            {currentTab === 'home' && (
              <DashboardScreen
                user={user}
                tasks={tasks}
                projects={projects}
                onToggleTask={handleToggleTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onOpenCreateTask={handleOpenCreateTask}
                onNavigateTab={(tab) => {
                  setCurrentTab(tab);
                  if (settings.soundEffects) SoundService.playClick();
                }}
              />
            )}

            {currentTab === 'tasks' && (
              <TasksScreen
                tasks={tasks}
                projects={projects}
                onToggleTask={handleToggleTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onOpenCreateTask={handleOpenCreateTask}
              />
            )}

            {currentTab === 'projects' && (
              <ProjectsScreen
                projects={projects}
                tasks={tasks}
                onOpenCreateProject={handleOpenCreateProject}
                onEditProject={handleEditProject}
                onDeleteProject={handleDeleteProject}
                onToggleTask={handleToggleTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onOpenCreateTask={handleOpenCreateTask}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarScreen
                tasks={tasks}
                projects={projects}
                onToggleTask={handleToggleTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onOpenCreateTask={handleOpenCreateTask}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsScreen tasks={tasks} projects={projects} />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                user={user}
                settings={settings}
                onUpdateUser={(updated) => setUser(updated)}
                onUpdateSettings={(newSet) => setSettings(newSet)}
                onResetDemoData={handleResetDemoData}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onOpenKotlinModal={() => setIsKotlinModalOpen(true)}
                onLogout={handleLogout}
              />
            )}
          </main>

          {/* 5-Item Bottom Navigation Bar */}
          <BottomNav
            currentTab={currentTab}
            onTabChange={(tab) => {
              setCurrentTab(tab);
              if (settings.soundEffects) SoundService.playClick();
            }}
            pendingTasksCount={pendingTasksCount}
          />
        </div>
      )}

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        projects={projects}
        taskToEdit={editingTask}
        defaultDate={taskModalDefaultDate}
        defaultProjectId={taskModalDefaultProjectId}
      />

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        projectToEdit={editingProject}
      />

      {/* Kotlin Native Source Code & Android Studio Export Modal */}
      <KotlinExportModal
        isOpen={isKotlinModalOpen}
        onClose={() => setIsKotlinModalOpen(false)}
      />
    </AndroidFrame>
  );
}
