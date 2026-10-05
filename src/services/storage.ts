import { AppSettings, Project, Task, User } from '../types';
import { DEMO_USER, INITIAL_PROJECTS, INITIAL_SETTINGS, INITIAL_TASKS } from '../data/initialData';

const KEYS = {
  USER: 'flowtask_user',
  TASKS: 'flowtask_tasks',
  PROJECTS: 'flowtask_projects',
  SETTINGS: 'flowtask_settings',
  IS_LOGGED_IN: 'flowtask_is_logged_in',
};

export const StorageService = {
  // User Management
  getUser(): User | null {
    try {
      const data = localStorage.getItem(KEYS.USER);
      if (!data) return DEMO_USER;
      return JSON.parse(data);
    } catch {
      return DEMO_USER;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  isLoggedIn(): boolean {
    const status = localStorage.getItem(KEYS.IS_LOGGED_IN);
    return status === 'true';
  },

  setLoggedIn(status: boolean): void {
    localStorage.setItem(KEYS.IS_LOGGED_IN, status ? 'true' : 'false');
  },

  // Tasks Management
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      if (!data) {
        localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: task.status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
    };
    const updated = [newTask, ...tasks];
    this.saveTasks(updated);
    return newTask;
  },

  updateTask(updatedTask: Task): Task[] {
    const tasks = this.getTasks();
    const updated = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
    this.saveTasks(updated);
    return updated;
  },

  deleteTask(taskId: string): Task[] {
    const tasks = this.getTasks();
    const updated = tasks.filter(t => t.id !== taskId);
    this.saveTasks(updated);
    return updated;
  },

  toggleTaskStatus(taskId: string): { tasks: Task[]; toggledTask: Task | null } {
    const tasks = this.getTasks();
    let toggled: Task | null = null;
    const today = new Date().toISOString().split('T')[0];

    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        toggled = {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? today : undefined,
        };
        return toggled;
      }
      return t;
    });

    this.saveTasks(updated);
    return { tasks: updated, toggledTask: toggled };
  },

  // Projects Management
  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(KEYS.PROJECTS);
      if (!data) {
        localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
        return INITIAL_PROJECTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROJECTS;
    }
  },

  saveProjects(projects: Project[]): void {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
  },

  addProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newProject, ...projects];
    this.saveProjects(updated);
    return newProject;
  },

  updateProject(updatedProject: Project): Project[] {
    const projects = this.getProjects();
    const updated = projects.map(p => (p.id === updatedProject.id ? updatedProject : p));
    this.saveProjects(updated);
    return updated;
  },

  deleteProject(projectId: string): { projects: Project[]; tasks: Task[] } {
    const projects = this.getProjects().filter(p => p.id !== projectId);
    this.saveProjects(projects);

    // Also remove or unlink tasks belonging to this project
    const tasks = this.getTasks().filter(t => t.projectId !== projectId);
    this.saveTasks(tasks);

    return { projects, tasks };
  },

  // App Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) return INITIAL_SETTINGS;
      return JSON.parse(data);
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Reset to default sample dataset
  resetToDemo(): { user: User; tasks: Task[]; projects: Project[]; settings: AppSettings } {
    localStorage.setItem(KEYS.USER, JSON.stringify(DEMO_USER));
    localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    return {
      user: DEMO_USER,
      tasks: INITIAL_TASKS,
      projects: INITIAL_PROJECTS,
      settings: INITIAL_SETTINGS,
    };
  },

  // Export full backup
  exportBackup(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      tasks: this.getTasks(),
      projects: this.getProjects(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Import backup
  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.tasks && Array.isArray(data.tasks)) {
        this.saveTasks(data.tasks);
      }
      if (data.projects && Array.isArray(data.projects)) {
        this.saveProjects(data.projects);
      }
      if (data.user) {
        this.setUser(data.user);
      }
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      return true;
    } catch {
      return false;
    }
  },
};
