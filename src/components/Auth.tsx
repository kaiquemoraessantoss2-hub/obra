'use client';

import { useState } from 'react';
import { Building2, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { validateUser, getUserByEmail, saveUser, loadUsers } from '@/lib/auth';
import LoginPage from '@/components/team/LoginPage';

interface AuthProps {
  onLogin: (user: User, isNewUser?: boolean) => void;
  onMemberLogin?: () => void;
}

export default function Auth({ onLogin, onMemberLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMemberLogin, setShowMemberLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (isLogin) {
      const user = validateUser(email, password);
      if (user) {
        if (user.isActive === false) {
          setError('Usuário desativado. Contate o administrador.');
          setIsLoading(false);
          return;
        }
        onLogin({ id: user.id, companyId: user.companyId, name: user.name, email: user.email, role: user.role }, false);
      } else {
        const exists = getUserByEmail(email);
        if (exists) {
          if (exists.isActive === false) {
            setError('Usuário desativado. Contate o administrador.');
          } else {
            setError('Senha incorreta');
          }
        } else {
          setError('Usuário não encontrado');
        }
      }
    } else {
      const exists = getUserByEmail(email);
      if (exists) {
        setError('E-mail já cadastrado');
      } else {
        const newUserId = `u_${Date.now()}`;
        const newCompanyId = `comp_${Date.now()}`;
        const newUser = {
          id: newUserId,
          email,
          password,
          name,
          role: 'ADMIN' as const,
          companyId: newCompanyId,
          isActive: true
        };
        const saved = saveUser(newUser);
        if (!saved) {
          setError('Erro ao criar conta. Tente novamente.');
          setIsLoading(false);
          return;
        }
        onLogin({ id: newUserId, companyId: newCompanyId, name, email, role: 'ADMIN' }, true);
      }
    }
    setIsLoading(false);
  };

  if (showMemberLogin) {
    return <LoginPage onLogin={(member: any) => { 
      window.location.href = '?member=' + encodeURIComponent(JSON.stringify(member));
    }} />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-[480px] space-y-12 animate-fade-in relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex w-20 h-20 bg-blue-600 rounded-[24px] items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 animate-bounce-subtle">
            <Building2 className="text-white" size={40} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">ObraFlow</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Gestão de Obras Premium</p>
        </div>

        <div className="glass-card p-12 rounded-[40px] border-white/5 relative overflow-hidden backdrop-blur-xl">
          <div className="flex bg-white/[0.03] p-1.5 rounded-2xl mb-10 border border-white/5">
            <button onClick={() => { setIsLogin(true); setError(''); }} className={cn("flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", isLogin ? "bg-white text-black shadow-xl" : "text-slate-500 hover:text-slate-300")}>Entrar</button>
            <button onClick={() => { setIsLogin(false); setError(''); }} className={cn("flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all", !isLogin ? "bg-white text-black shadow-xl" : "text-slate-500 hover:text-slate-300")}>Registrar</button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
              <AlertCircle className="text-rose-500" size={18} />
              <p className="text-rose-500 text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">Nome Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder-slate-700" placeholder="Seu nome" />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder-slate-700" placeholder="voce@empresa.com" />
              </div>
              {isLogin && email === 'admin@obraflow.com' && (
                <p className="text-[10px] text-blue-500 mt-2 flex items-center gap-1.5 font-black uppercase"><ShieldCheck size={12}/> Administrador SaaS Detectado</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-widest">Senha de Acesso</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-blue-500 transition-all font-bold placeholder-slate-700" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-base transition-all shadow-2xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 group mt-4">
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Entrar no ObraFlow' : 'Criar Conta Premium'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            {isLogin && (
              <button type="button" onClick={() => setShowMemberLogin(true)} className="w-full py-3 text-slate-500 text-sm hover:text-white mt-2">
                Entrar como membro da obra
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
