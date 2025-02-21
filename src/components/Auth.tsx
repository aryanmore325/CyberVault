import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Access granted!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Identity created successfully!');
      }
      onAuthSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 cyber-grid py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-effect p-8 rounded-xl border border-cyan-500/30">
        <div className="text-center">
          <HardDrive className="mx-auto h-12 w-12 text-cyan-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 neon-text">
            {isLogin ? 'Access CyberVault' : 'Create Identity'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 bg-black/30 border border-cyan-500/30
                         placeholder-gray-400 text-cyan-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500
                         focus:z-10 sm:text-sm disabled:bg-gray-800 disabled:cursor-not-allowed"
                placeholder="Neural interface (email)"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 bg-black/30 border border-cyan-500/30
                         placeholder-gray-400 text-cyan-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500
                         focus:z-10 sm:text-sm disabled:bg-gray-800 disabled:cursor-not-allowed"
                placeholder="Access code"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !email || !password}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium
                         rounded-md text-black transition-all duration-300 ease-in-out
                         ${loading || !email || !password
                           ? 'bg-cyan-400/50 cursor-not-allowed'
                           : 'bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-500 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500'
                         }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Initialize Connection
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Access
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-cyan-400 hover:text-cyan-300 disabled:text-cyan-600 disabled:cursor-not-allowed"
            >
              {isLogin
                ? "Don't have an identity? Create one"
                : 'Already have access? Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}