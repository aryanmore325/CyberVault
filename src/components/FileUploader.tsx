import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface FileUploaderProps {
  onUploadComplete: () => void;
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast.error('Authentication required for data upload');
      return;
    }

    for (const file of acceptedFiles) {
      try {
        const { data, error } = await supabase.storage
          .from('files')
          .upload(`${user.data.user.id}/${file.name}`, file);

        if (error) throw error;
        
        await supabase.from('files').insert({
          name: file.name,
          size: file.size,
          type: file.type,
          url: data.path,
          user_id: user.data.user.id
        });

        toast.success(`Data transfer complete: ${file.name}`);
        onUploadComplete();
      } catch (error) {
        toast.error(`Upload failed: ${file.name}`);
        console.error(error);
      }
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        glass-effect border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
        transition-all duration-300 transform hover:scale-[1.02]
        ${isDragActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-cyan-500/30 hover:border-cyan-400'}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
      <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
        {isDragActive ? 'Release to upload' : 'Upload data to CyberVault'}
      </p>
      <p className="mt-2 text-cyan-400/70">or click to select files</p>
      <p className="mt-2 text-sm text-cyan-400/50">Maximum data size: 100MB</p>
    </div>
  );
}