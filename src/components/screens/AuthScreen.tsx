import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { User } from '../../types';

interface AuthScreenProps {
  onSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);

  // Form fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('demo@flowtask.com');
  const [password, setPassword] = useState<string>('123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, informe um e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (isRegistering && !name.trim()) {
      setError('Por favor, informe seu nome.');
      return;
    }

    // Local authentication check
    const loggedUser: User = {
      id: isRegistering ? 'usr_' + Date.now() : 'usr_demo_1',
      name: isRegistering ? name.trim() : (email === 'demo@flowtask.com' ? 'Luccas Silva' : email.split('@')[0]),
      email: email.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      role: 'Usuário FlowTask',
    };

    onSuccess(loggedUser);
  };

  const handleGoogleLogin = () => {
    const googleUser: User = {
      id: 'usr_google_' + Date.now(),
      name: 'Conta Google',
      email: 'usuario.google@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      role: 'Google Sync',
    };
    onSuccess(googleUser);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Informe seu e-mail para recuperar a senha.');
      return;
    }
    setError('');
    setSuccessMsg(`Enviamos instruções de recuperação para ${email}.`);
    setTimeout(() => {
      setIsForgotPassword(false);
      setSuccessMsg('');
    }, 2800);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white overflow-y-auto no-scrollbar">
      {/* Top Brand Banner */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <div className="w-16 h-16 rounded-2xl bg-[#3A65F0] flex items-center justify-center shadow-lg shadow-blue-500/25 mb-3">
          <div className="relative">
            <Check className="w-8 h-8 text-white stroke-[3] -translate-x-0.5 -translate-y-0.5" />
            <ArrowRight className="w-5 h-5 text-blue-200 stroke-[3] absolute bottom-0 right-0 translate-x-1 translate-y-0.5" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Flow<span className="text-[#3A65F0]">Task</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium text-center">
          Organize hoje. Conquiste amanhã.
        </p>
      </div>

      {/* Forgot Password Flow */}
      {isForgotPassword ? (
        <form onSubmit={handleForgotPassword} className="space-y-4 my-auto">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">Recuperar Senha</h3>
            <p className="text-xs text-slate-500 mt-1">
              Digite seu e-mail cadastrado para receber o link de redefinição.
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3A65F0]/20 focus:border-[#3A65F0] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#3A65F0] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all"
          >
            Enviar Link de Recuperação
          </button>

          <button
            type="button"
            onClick={() => {
              setIsForgotPassword(false);
              setError('');
            }}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Voltar ao Login
          </button>
        </form>
      ) : (
        /* Login or Register Form */
        <form onSubmit={handleSubmit} className="space-y-3.5 my-auto">
          <div className="text-center mb-2">
            <h3 className="text-lg font-bold text-slate-900">
              {isRegistering ? 'Criar Nova Conta' : 'Acessar FlowTask'}
            </h3>
            <p className="text-xs text-slate-500">
              {isRegistering
                ? 'Cadastre-se para sincronizar seus projetos e tarefas.'
                : 'Entre para continuar seu planejamento diário.'}
            </p>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria Santos"
                required={isRegistering}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3A65F0]/20 focus:border-[#3A65F0] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@flowtask.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3A65F0]/20 focus:border-[#3A65F0] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Senha
              </label>
              {!isRegistering && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-[11px] font-medium text-[#3A65F0] hover:underline"
                >
                  Esqueci minha senha
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3A65F0]/20 focus:border-[#3A65F0] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#3A65F0] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isRegistering ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Criar Conta</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">
                ou
              </span>
            </div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar com Google</span>
          </button>
        </form>
      )}

      {/* Switch between Login and Register */}
      <div className="pt-3 pb-1 text-center border-t border-slate-100">
        <button
          type="button"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
          }}
          className="text-xs text-slate-600 hover:text-[#3A65F0] font-medium transition-colors"
        >
          {isRegistering ? (
            <span>
              Já tem uma conta? <strong className="text-[#3A65F0]">Entrar</strong>
            </span>
          ) : (
            <span>
              Não tem conta? <strong className="text-[#3A65F0]">Criar conta</strong>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
