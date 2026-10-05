import React from 'react';
import { BarChart3, CheckCircle2, Clock, AlertTriangle, ListChecks, Award } from 'lucide-react';
import { Project, Task } from '../../types';

interface ReportsScreenProps {
  tasks: Task[];
  projects: Project[];
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ tasks, projects }) => {
  const today = new Date().toISOString().split('T')[0];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const overdueTasks = tasks.filter((t) => t.status === 'pending' && t.dueDate < today);

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Priority counts
  const highPriority = tasks.filter((t) => t.priority === 'high');
  const mediumPriority = tasks.filter((t) => t.priority === 'medium');
  const lowPriority = tasks.filter((t) => t.priority === 'low');

  const highPct = totalTasks > 0 ? Math.round((highPriority.length / totalTasks) * 100) : 0;
  const medPct = totalTasks > 0 ? Math.round((mediumPriority.length / totalTasks) * 100) : 0;
  const lowPct = totalTasks > 0 ? Math.round((lowPriority.length / totalTasks) * 100) : 0;

  // Simulated 7-day productivity distribution
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('pt-BR', { weekday: 'narrow' });
    const count = tasks.filter(
      (t) => t.dueDate === dStr || t.completedAt === dStr
    ).length;
    return { date: dStr, label: dayLabel, count };
  });

  const maxDayCount = Math.max(...last7Days.map((d) => d.count), 1);

  return (
    <div className="flex-1 p-4 pb-24 space-y-4 overflow-y-auto no-scrollbar">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#3A65F0] flex items-center justify-center">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Relatório de Produtividade</h2>
          <p className="text-xs text-slate-500">Métricas e desempenho das suas tarefas</p>
        </div>
      </div>

      {/* Primary Efficiency Card */}
      <div className="bg-gradient-to-br from-[#3A65F0] to-blue-700 text-white rounded-2xl p-5 shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
              Taxa de Conclusão
            </span>
            <div className="text-3xl font-extrabold tracking-tight mt-1 tabular-nums">
              {completionRate}%
            </div>
            <p className="text-xs text-blue-100 mt-1 font-medium">
              {completedTasks.length} de {totalTasks} tarefas concluídas
            </p>
          </div>

          <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center relative">
            <Award className="w-8 h-8 text-white stroke-[1.8]" />
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl" />
      </div>

      {/* 4 Key Statistics Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <ListChecks className="w-3.5 h-3.5 text-slate-600" />
            <span>Total Tarefas</span>
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {totalTasks}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Concluídas</span>
          </div>
          <div className="text-xl font-bold text-emerald-600 tabular-nums">
            {completedTasks.length}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pendentes</span>
          </div>
          <div className="text-xl font-bold text-slate-800 tabular-nums">
            {pendingTasks.length}
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Atrasadas</span>
          </div>
          <div
            className={`text-xl font-bold tabular-nums ${
              overdueTasks.length > 0 ? 'text-rose-600' : 'text-slate-700'
            }`}
          >
            {overdueTasks.length}
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Atividade Semanal (Últimos 7 dias)
        </h3>
        <div className="flex items-end justify-between gap-2 h-32 pt-4 px-2">
          {last7Days.map((day) => {
            const heightPct = Math.max((day.count / maxDayCount) * 100, 12);
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-500 tabular-nums">
                  {day.count}
                </span>
                <div className="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-full flex items-end">
                  <div
                    className="w-full bg-[#3A65F0] hover:bg-blue-600 rounded-t-lg transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-600 uppercase">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Distribuição por Prioridade
        </h3>

        {/* Stacked multi-segment bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full flex overflow-hidden">
          <div
            className="bg-rose-500 h-full transition-all"
            style={{ width: `${highPct}%` }}
            title={`Alta: ${highPriority.length}`}
          />
          <div
            className="bg-amber-500 h-full transition-all"
            style={{ width: `${medPct}%` }}
            title={`Média: ${mediumPriority.length}`}
          />
          <div
            className="bg-emerald-500 h-full transition-all"
            style={{ width: `${lowPct}%` }}
            title={`Baixa: ${lowPriority.length}`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
            <span className="text-slate-600 font-medium">Alta ({highPriority.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-600 font-medium">Média ({mediumPriority.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-600 font-medium">Baixa ({lowPriority.length})</span>
          </div>
        </div>
      </div>

      {/* Projects Completion Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Desempenho por Projeto
        </h3>

        <div className="space-y-3">
          {projects.map((proj) => {
            const pTasks = tasks.filter((t) => t.projectId === proj.id);
            const pComp = pTasks.filter((t) => t.status === 'completed').length;
            const pct = pTasks.length > 0 ? Math.round((pComp / pTasks.length) * 100) : 0;

            return (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: proj.color }}
                    />
                    <span className="font-semibold text-slate-800 truncate">
                      {proj.name}
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px] tabular-nums shrink-0">
                    {pComp}/{pTasks.length} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: proj.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
