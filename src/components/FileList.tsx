import React, { useEffect, useState } from 'react';
import { Download, Trash2, File } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserFile } from '../types';
import toast from 'react-hot-toast';

interface FileListProps {
  refreshTrigger: number;
}

export function FileList({ refreshTrigger }: FileListProps) {
  const [files, setFiles] = useState<UserFile[]>([]);

  useEffect(() => {
    loadFiles();
  }, [refreshTrigger]);

  const loadFiles = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', user.data.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error accessing data vault');
      return;
    }

    setFiles(data || []);
  };

  const handleDownload = async (file: UserFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('files')
        .download(file.url);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Data retrieval failed');
    }
  };

  const handleDelete = async (file: UserFile) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([file.url]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      toast.success('Data purged successfully');
      loadFiles();
    } catch (error) {
      toast.error('Error purging data');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
        Secured Data Vault
      </h2>
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="glass-effect p-4 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <File className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 truncate">
                    {file.name}
                  </h3>
                  <p className="text-sm text-cyan-400/70">
                    {formatFileSize(file.size)} • {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-full transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <div className="text-center py-8 text-cyan-400/50">
            Data vault is empty
          </div>
        )}
      </div>
    </div>
  );
}