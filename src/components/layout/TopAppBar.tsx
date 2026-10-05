import React from 'react';
import { ArrowLeft, Code, BarChart3, Bell } from 'lucide-react';
import { TabType } from '../../types';

interface TopAppBarProps {
  currentTab: TabType;
  title: string;
  subtitle?: string;
  onNavigateTab: (tab: TabType) => void;
  onOpenKotlinModal: () => void;
  onOpenNotifications?: () => void;
  unreadCount?: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  title,
  subtitle,
  onNavigateTab,
  onOpenKotlinModal,
}) => {
  const isHome = currentTab === 'home';

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        {!isHome && (
          <button
            onClick={() => onNavigateTab('home')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all -ml-1"
            title="Voltar ao Início"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-slate-900 tracking-tight truncate">
              {title}
            </h1>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onNavigateTab('reports')}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            currentTab === 'reports'
              ? 'bg-blue-50 text-[#3A65F0]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Relatórios & Métricas"
          aria-label="Relatórios"
        >
          <BarChart3 className="w-4.5 h-4.5" />
        </button>

        <button
          onClick={onOpenKotlinModal}
          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[#3A65F0] border border-blue-200/60 flex items-center gap-1.5 transition-all shadow-2xs"
          title="Ver Código Kotlin + Jetpack Compose"
        >
          <Code className="w-3.5 h-3.5 text-[#3A65F0]" />
          <span className="hidden sm:inline">Kotlin</span>
        </button>
      </div>
    </header>
  );
};
