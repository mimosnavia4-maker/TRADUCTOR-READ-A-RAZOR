import React from 'react';
import { Shield, Lock, CheckCircle2, FileJson, FolderOpen, Star, Trash2 } from 'lucide-react';
import { ProtocolRule, ProjectFile } from '../types';

interface ProtocolStatusProps {
  rules: ProtocolRule[];
  files: ProjectFile[];
  onSelectReference: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

const ProtocolStatus: React.FC<ProtocolStatusProps> = ({ rules, files, onSelectReference, onDeleteFile }) => {
  return (
    <div className="bg-slate-950 border-r border-slate-800 w-80 flex-shrink-0 flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-neon-cyan mb-2">
          <FolderOpen className="w-6 h-6" />
          <h2 className="text-lg font-bold tracking-wider">PROJECT FILES</h2>
        </div>
        <p className="text-xs text-slate-400 font-mono">GOLDEN STANDARD REPO</p>
      </div>

      {/* FILE LIST SECTION */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        
        {files.length === 0 ? (
            <div className="text-center py-10 opacity-30 border border-dashed border-slate-700 rounded-lg">
                <FileJson className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                <p className="text-[10px] uppercase">No Saved Files</p>
            </div>
        ) : (
            <div className="space-y-3 mb-8">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 px-2 flex justify-between">
                  <span>Saved Components</span>
                  <span className="text-[10px]">{files.length}</span>
                </div>
                {files.map(file => (
                    <div 
                        key={file.id}
                        className={`
                            group relative p-3 rounded-lg border transition-all cursor-pointer
                            ${file.isReference 
                                ? 'bg-yellow-900/10 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
                                : 'bg-slate-900 border-slate-800 hover:border-slate-600'}
                        `}
                        onClick={() => onSelectReference(file.id)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 overflow-hidden">
                                <FileJson className={`w-4 h-4 flex-shrink-0 ${file.isReference ? 'text-yellow-500' : 'text-slate-500'}`} />
                                <span className={`text-xs font-mono truncate ${file.isReference ? 'text-yellow-200 font-bold' : 'text-slate-300'}`}>
                                    {file.name}
                                </span>
                            </div>
                            {file.isReference && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                        </div>
                        
                        {/* Hover Actions */}
                        <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 bg-slate-900 pl-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                                className="text-slate-500 hover:text-red-500"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>

                        {file.isReference && (
                            <div className="mt-2 text-[9px] text-yellow-500/70 font-mono uppercase tracking-widest flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>
                                Active Template
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}

        {/* PROTOCOL RULES SECTION */}
        <div className="border-t border-slate-800 pt-6">
            <div className="flex items-center space-x-2 text-slate-500 mb-4 px-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">Active Protocol</span>
            </div>
            
            <div className="space-y-3">
                {rules.map((rule) => (
                <div 
                    key={rule.id} 
                    className={`
                    p-3 rounded border 
                    ${rule.isActive 
                        ? 'bg-slate-900/50 border-slate-700/50' 
                        : 'bg-slate-900 border-slate-800 opacity-50'}
                    `}
                >
                    <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase ${rule.isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                            {rule.name}
                        </span>
                        {rule.isActive && <CheckCircle2 className="w-3 h-3 text-emerald-500/50" />}
                    </div>
                </div>
                ))}
            </div>
        </div>

      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950 text-center">
        <p className="text-[10px] text-slate-600 font-mono">
          SYSTEM ID: RZR-ARCH-99
        </p>
      </div>
    </div>
  );
};

export default ProtocolStatus;