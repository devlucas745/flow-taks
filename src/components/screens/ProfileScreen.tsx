import React, { useState } from 'react';
import {
  User as UserIcon,
  LogOut,
  Volume2,
  VolumeX,
  Bell,
  Trash2,
  RotateCcw,
  Download,
  Upload,
  Code,
  Check,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { AppSettings, User } from '../../types';

interface ProfileScreenProps {
  user: User;
  settings: AppSettings;
  onUpdateUser: (updatedUser: User) => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onResetDemoData: () => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => boolean;
  onOpenKotlinModal: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  settings,
  onUpdateUser,
  onUpdateSettings,
  onResetDemoData,
  onExportBackup,
  onImportBackup,
  onOpenKotlinModal,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role || 'Desenvolvedor & Designer');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateUser({
      ...user,
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
    });
    setIsEditing(false);
    showToast('Perfil atualizado com sucesso!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportBackup(content);
        if (success) {
          showToast('Dados restaurados com sucesso!');
        } else {
          showToast('Erro ao importar arquivo JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 p-4 pb-24 space-y-4 overflow-y-auto no-scrollbar">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* User Info Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3A65F0] to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-8 h-8 text-[#3A65F0]" />
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-slate-900 truncate">{user.name}</h2>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-[#3A65F0] bg-blue-50 px-2 py-0.5 rounded-md">
              {user.role || 'Usuário FlowTask'}
            </span>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Editar Perfil"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Edit profile form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-3 border-t border-slate-100 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3A65F0]/20 focus:border-[#3A65F0]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3A65F0]/20 focus:border-[#3A65F0]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo / Função</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3A65F0]/20 focus:border-[#3A65F0]"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold text-white bg-[#3A65F0] rounded-xl hover:bg-blue-600 shadow-sm"
              >
                Salvar Perfil
              </button>
            </div>
          </form>
        )}
      </div>

      {/* App Preferences */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Preferências do Aplicativo
        </h3>

        <div className="space-y-2.5">
          {/* Sound effects */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              {settings.soundEffects ? (
                <Volume2 className="w-4 h-4 text-[#3A65F0]" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Efeitos Sonoros
                </span>
                <span className="text-[11px] text-slate-400">
                  Som tátil ao concluir e interagir
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({ ...settings, soundEffects: !settings.soundEffects })
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.soundEffects ? 'bg-[#3A65F0]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.soundEffects ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Confirm before delete */}
          <div className="flex items-center justify-between py-1 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Confirmar Exclusão
                </span>
                <span className="text-[11px] text-slate-400">
                  Solicitar confirmação ao deletar
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  confirmBeforeDelete: !settings.confirmBeforeDelete,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.confirmBeforeDelete ? 'bg-[#3A65F0]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.confirmBeforeDelete ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Daily reminders */}
          <div className="flex items-center justify-between py-1 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Lembretes Diários
                </span>
                <span className="text-[11px] text-slate-400">
                  Notificações de tarefas pendentes
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  notificationsEnabled: !settings.notificationsEnabled,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.notificationsEnabled ? 'bg-[#3A65F0]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform absolute top-1 ${
                  settings.notificationsEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Kotlin Native Android Code Export */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md space-y-2.5">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">
            Desenvolvimento Android Nativo
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Inspecione e baixe a base de código Kotlin completa com Jetpack Compose, ViewModels e tema oficial.
        </p>
        <button
          onClick={onOpenKotlinModal}
          className="w-full py-2.5 bg-[#3A65F0] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
        >
          <Code className="w-3.5 h-3.5" />
          <span>Ver Código Kotlin & Gradle</span>
        </button>
      </div>

      {/* Data Management & Backup */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Gerenciamento de Dados
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExportBackup}
            className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center gap-1"
          >
            <Download className="w-4 h-4 text-[#3A65F0]" />
            <span className="text-xs font-semibold text-slate-700">Exportar Backup</span>
            <span className="text-[10px] text-slate-400">Download em JSON</span>
          </button>

          <label className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center gap-1 cursor-pointer">
            <Upload className="w-4 h-4 text-[#3A65F0]" />
            <span className="text-xs font-semibold text-slate-700">Importar Backup</span>
            <span className="text-[10px] text-slate-400">Arquivo JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={() => {
            if (
              window.confirm(
                'Deseja restaurar as tarefas e projetos de demonstração originais?'
              )
            ) {
              onResetDemoData();
              showToast('Dados de demonstração restaurados!');
            }
          }}
          className="w-full py-2 border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Dados de Demonstração</span>
        </button>
      </div>

      {/* Security & Logout */}
      <div className="space-y-2">
        <button
          onClick={onLogout}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-rose-100"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta</span>
        </button>

        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>FlowTask v1.0.0 &bull; Armazenamento local seguro</span>
        </div>
      </div>
    </div>
  );
};
