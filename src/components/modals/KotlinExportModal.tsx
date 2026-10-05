import React, { useState } from 'react';
import { X, Check, Copy, Download, Code, FileText } from 'lucide-react';
import { KOTLIN_PROJECT_FILES, KotlinFile } from '../../data/kotlinSourceCode';

interface KotlinExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KotlinExportModal: React.FC<KotlinExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<KotlinFile>(KOTLIN_PROJECT_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-slate-900 text-slate-100 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3A65F0]/20 text-[#3A65F0] flex items-center justify-center border border-blue-500/30">
              <Code className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Código Fonte Nativo Android (Kotlin + Jetpack Compose)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Arquivos prontos para compilar no Android Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {KOTLIN_PROJECT_FILES.map((file) => {
            const isSelected = selectedFile.name === file.name;
            return (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#3A65F0] text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs text-slate-300">
          <div className="text-[11px] text-slate-500 mb-2 font-mono">
            // {selectedFile.path}
          </div>
          <pre className="leading-relaxed whitespace-pre font-mono selection:bg-blue-600/50">
            {selectedFile.code}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Total: {KOTLIN_PROJECT_FILES.length} arquivos estruturados
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3A65F0] hover:bg-blue-600 text-white font-medium transition-colors shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar {selectedFile.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
