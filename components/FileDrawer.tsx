
import React, { useState } from 'react';
import { X, FileJson, Star, Trash2, Search } from 'lucide-react';
import { ProjectFile } from '../types';

interface FileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  files: ProjectFile[];
  onSelectReference: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

const FileDrawer: React.FC<FileDrawerProps> = ({ isOpen, onClose, files, onSelectReference, onDeleteFile }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity" onClick={onClose} />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-80 bg-slate-950 border-r border-slate-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="h-full flex flex-col">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Archivos del Proyecto</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 border-b border-slate-800">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar componentes..." 
                        className="w-full bg-slate-900 border border-slate-800 rounded px-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-neon-cyan/50"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                {filteredFiles.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                        <FileJson className="w-10 h-10 mx-auto mb-3 text-slate-600" />
                        <p className="text-xs uppercase text-slate-500">
                            {files.length === 0 ? "Sin Archivos Guardados" : "No se encontraron resultados"}
                        </p>
                    </div>
                ) : (
                    filteredFiles.map(file => (
                        <div 
                            key={file.id}
                            className={`
                                group relative p-3 rounded-lg border transition-all cursor-pointer
                                ${file.isReference 
                                    ? 'bg-yellow-900/10 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.1)]' 
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'}
                            `}
                            onClick={() => onSelectReference(file.id)}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-mono font-bold truncate ${file.isReference ? 'text-yellow-200' : 'text-slate-300'}`}>
                                    {file.name}
                                </span>
                                {file.isReference && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] text-slate-600 font-mono">
                                    {new Date(file.timestamp).toLocaleDateString()}
                                </span>
                                <span className="text-[9px] text-slate-600 font-mono uppercase">
                                    {Math.round(file.content.length / 1024 * 10) / 10} KB
                                </span>
                            </div>

                             {/* Hover Actions */}
                            <div className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 bg-slate-900 pl-2">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                                    className="text-slate-500 hover:text-red-500 p-1 hover:bg-slate-800 rounded"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    Marca un archivo como <span className="text-yellow-500 font-bold">Referencia Dorada</span> para instruir a la IA sobre tu estilo de código.
                </p>
            </div>
        </div>
      </div>
    </>
  );
};

export default FileDrawer;
