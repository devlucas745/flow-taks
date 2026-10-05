import { Project, Task, User, AppSettings } from '../types';

export const DEMO_USER: User = {
  id: 'usr_demo_1',
  name: 'Luccas Silva',
  email: 'demo@flowtask.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  role: 'Product Manager & Designer',
};

export const INITIAL_SETTINGS: AppSettings = {
  soundEffects: true,
  hapticFeedback: true,
  notificationsEnabled: true,
  theme: 'light',
  confirmBeforeDelete: true,
};

// Helper for relative dates
const getFormattedDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_mobile',
    name: 'Redesenho do App Mobile',
    description: 'Interface Jetpack Compose, Material 3 e fluxos de navegação.',
    color: '#3A65F0',
    icon: 'Smartphone',
    createdAt: getFormattedDate(-15),
  },
  {
    id: 'proj_marketing',
    name: 'Lançamento de Marketing Q4',
    description: 'Campanha de aquisição, ativos visuais e métricas de conversão.',
    color: '#10B981',
    icon: 'Megaphone',
    createdAt: getFormattedDate(-10),
  },
  {
    id: 'proj_study',
    name: 'Estudos & Certificação Android',
    description: 'Kotlin Coroutines, Flow, Jetpack Architecture e Clean Code.',
    color: '#8B5CF6',
    icon: 'GraduationCap',
    createdAt: getFormattedDate(-5),
  },
  {
    id: 'proj_personal',
    name: 'Vida Pessoal & Finanças',
    description: 'Organização do orçamento mensal e rotina de treinos.',
    color: '#F59E0B',
    icon: 'Compass',
    createdAt: getFormattedDate(-2),
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_1',
    title: 'Ajustar paleta de cores e tipografia no Jetpack Compose',
    description: 'Definir tema com cor primária #3A65F0 e fontes Plus Jakarta Sans.',
    priority: 'high',
    dueDate: getFormattedDate(0), // Hoje
    projectId: 'proj_mobile',
    status: 'pending',
    createdAt: getFormattedDate(-2),
  },
  {
    id: 'task_2',
    title: 'Finalizar protótipo do Dashboard e Gráficos',
    description: 'Conectar cards de tarefas pendentes, concluídas e progresso dos projetos.',
    priority: 'high',
    dueDate: getFormattedDate(0), // Hoje
    projectId: 'proj_mobile',
    status: 'completed',
    createdAt: getFormattedDate(-3),
    completedAt: getFormattedDate(0),
  },
  {
    id: 'task_3',
    title: 'Criar criativos para campanha nas redes sociais',
    description: 'Banners 1080x1080 com o slogan: Organize hoje. Conquiste amanhã.',
    priority: 'medium',
    dueDate: getFormattedDate(-1), // Atrasada de ontem
    projectId: 'proj_marketing',
    status: 'pending',
    createdAt: getFormattedDate(-4),
  },
  {
    id: 'task_4',
    title: 'Módulo de Kotlin Coroutines e StateFlow',
    description: 'Completar os exercícios práticos do capítulo de concorrência.',
    priority: 'low',
    dueDate: getFormattedDate(2), // Daqui a 2 dias
    projectId: 'proj_study',
    status: 'pending',
    createdAt: getFormattedDate(-1),
  },
  {
    id: 'task_5',
    title: 'Revisar planilha orçamentária do mês',
    description: 'Registrar despesas fixas e aportes em investimentos.',
    priority: 'medium',
    dueDate: getFormattedDate(4),
    projectId: 'proj_personal',
    status: 'pending',
    createdAt: getFormattedDate(0),
  },
  {
    id: 'task_6',
    title: 'Configurar Room Database para persistência local',
    description: 'Implementar DAOs, Entities e migrations locais para o FlowTask.',
    priority: 'high',
    dueDate: getFormattedDate(1),
    projectId: 'proj_mobile',
    status: 'pending',
    createdAt: getFormattedDate(0),
  },
  {
    id: 'task_7',
    title: 'Aprovar copy do e-mail de boas-vindas',
    description: 'Revisar modelo de onboarding para novos usuários cadastrados.',
    priority: 'low',
    dueDate: getFormattedDate(-2), // Atrasada
    projectId: 'proj_marketing',
    status: 'completed',
    createdAt: getFormattedDate(-5),
    completedAt: getFormattedDate(-1),
  },
];
