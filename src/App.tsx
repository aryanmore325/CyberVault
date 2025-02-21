import React, { useEffect, useState } from 'react';
import { Auth } from './components/Auth';
import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { supabase } from './lib/supabase';
import { LogOut, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';

function App() {
  const [session, setSession] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  if (!session) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 cyber-grid">
      <nav className="bg-black/50 glass-effect border-b border-cyan-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-8 h-8 text-cyan-400" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 neon-text">
                CyberVault
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-cyan-400">{session.user.email}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-cyan-500 text-sm font-medium rounded-md text-cyan-400 
                         bg-transparent hover:bg-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
                         transition-all duration-300 ease-in-out"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          <FileUploader onUploadComplete={() => setRefreshTrigger(prev => prev + 1)} />
          <FileList refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
}

export default App