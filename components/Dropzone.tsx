'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dropzone({ onFileAccepted }: { onFileAccepted: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onFileAccepted(file);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  if (selectedFile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center"
      >
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-green-900">{selectedFile.name}</p>
            <p className="text-sm text-green-600">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={removeFile}
          className="inline-flex items-center space-x-3 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
          <span>Remove</span>
        </button>
      </motion.div>
    );
  }

  const rootProps = getRootProps();
  
  return (
    <motion.div
      className={`
        relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 shadow-sm
        ${isDragActive || dragActive
          ? 'border-blue-400 bg-blue-50 scale-105 shadow-lg'
          : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50 hover:scale-[1.02] hover:shadow-md'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onDragEnter={rootProps.onDragEnter}
      onDragLeave={rootProps.onDragLeave}
      onDrop={rootProps.onDrop}
      onDragOver={rootProps.onDragOver}
      onClick={rootProps.onClick}
      onKeyDown={rootProps.onKeyDown}
      onFocus={rootProps.onFocus}
      onBlur={rootProps.onBlur}
      tabIndex={rootProps.tabIndex}
      role={rootProps.role}
      aria-label={rootProps['aria-label']}
    >
      <input {...getInputProps()} />
      
      <motion.div
        animate={isDragActive || dragActive ? { y: -5 } : { y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <motion.div
            animate={isDragActive || dragActive ? { rotate: 5, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={`w-10 h-10 ${isDragActive || dragActive ? 'text-blue-600' : 'text-blue-500'}`} />
          </motion.div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {isDragActive || dragActive ? 'Drop your resume here' : 'Upload your resume'}
          </h3>
          <p className="text-gray-600">
            {isDragActive || dragActive 
              ? 'Release to upload your PDF resume'
              : 'Drag & drop a PDF here, or click to browse files'
            }
          </p>
        </div>
        
        {!isDragActive && !dragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center space-x-3 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Choose File</span>
          </motion.div>
        )}
      </motion.div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 rounded-2xl opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-2xl" />
      </div>
    </motion.div>
  );
}