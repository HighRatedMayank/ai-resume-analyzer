'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Dropzone({ onFileAccepted }: { onFileAccepted: (file: File) => void }) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50">
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p>Drop the resume PDF here...</p>
          : <p>Drag & drop a PDF here, or click to select a file</p>
      }
    </div>
  );
}