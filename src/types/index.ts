export type Priority = 'low' | 'medium' | 'high';

export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  projectId: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string; // Hex color code
  icon: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export interface AppSettings {
  soundEffects: boolean;
  hapticFeedback: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  confirmBeforeDelete: boolean;
}

export type TabType = 'home' | 'tasks' | 'projects' | 'calendar' | 'reports' | 'profile';
