import React, { useState } from 'react';
import { db } from '../services/db';
import { User, UserRole } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await db.login(email, password);
        if (user) {
          onAuthSuccess(user);
        } else {
          setError('Email ou senha inválidos.');
        }
      } else {
        if (!name || !email || !password || !confirmPassword) {
          setError('Por favor, preencha todos os campos.');
        } else if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
        } else if (password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres.');
        } else {
          const newUser = await db.register(name, email, password);
          onAuthSuccess(newUser);
        }
      }
    } catch (err) {
      setError('Ocorreu um erro ao processar sua solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-green-100 overflow-hidden border border-gray-100 p-8 md:p-12 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-6 overflow-hidden">
            <img 
              src="/biblioteca-jimui/logo.jpeg" 
              alt="Logo JIMUA" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Biblioteca JIMUI</h1>
          <p className="text-gray-400 font-medium mt-2">
            {mode === 'login' ? 'Bem-vindo de volta, leitor!' : 'Crie sua conta na comunidade.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 text-center animate-in shake duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none transition-all font-medium"
                placeholder="Ex: João Silva"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none transition-all font-medium"
              placeholder="leitor@jimui.org"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none transition-all font-medium"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Confirmar senha — apenas no registo */}
          {mode === 'register' && (
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Confirmar Senha</label>
              <input 
                type="password" 
                required
                className={`w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 outline-none transition-all font-medium ${
                  confirmPassword && password !== confirmPassword
                    ? 'ring-2 ring-red-400 focus:ring-red-400'
                    : 'focus:ring-[#0F9D58]'
                }`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-[10px] font-bold mt-1 ml-2">As senhas não coincidem</p>
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0F9D58] text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all mt-4 disabled:opacity-50"
          >
            {isLoading ? 'PROCESSANDO...' : mode === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? 'Ainda não tem conta?' : 'Já possui cadastro?'}
          </p>
          <button 
            onClick={handleModeSwitch}
            className="text-[#0F9D58] font-black mt-1 hover:underline underline-offset-4"
          >
            {mode === 'login' ? 'REGISTRE-SE AGORA' : 'FAÇA LOGIN'}
          </button>
        </div>

          <div className="mt-6 text-[10px] text-gray-300 text-center italic">
            Dica: use admin@jimui.org / admin para entrar como Administrador.
          </div>
    
      </div>
    </div>
  );
};

export default AuthView;