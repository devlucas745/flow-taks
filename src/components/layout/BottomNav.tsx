import React from 'react';
import { LayoutDashboard, CheckSquare, FolderKanban, Calendar, User } from 'lucide-react';
import { TabType } from '../../types';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingTasksCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  pendingTasksCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Início', icon: LayoutDashboard },
    { id: 'tasks' as TabType, label: 'Tarefas', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'projects' as TabType, label: 'Projetos', icon: FolderKanban },
    { id: 'calendar' as TabType, label: 'Calendário', icon: Calendar },
    { id: 'profile' as TabType, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg shadow-slate-200/50">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 select-none group min-h-[48px]"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? 'text-[#3A65F0] scale-110 stroke-[2.4]'
                      : 'text-slate-400 group-hover:text-slate-600 stroke-[1.8]'
                  }`}
                />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-[#3A65F0] text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-xs">
                    {tab.badge! > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-[#3A65F0] font-bold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-[#3A65F0] rounded-full mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
