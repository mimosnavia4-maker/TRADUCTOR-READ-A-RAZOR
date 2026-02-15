
import React, { useState } from 'react';
import { Enhancement } from '../types';
import { Sparkles, Zap, ShieldAlert, MousePointerClick, ToggleLeft, ToggleRight, ArrowRight, PlusCircle, PenTool, X } from 'lucide-react';

interface EnhancementGridProps {
  enhancements: Enhancement[];
  onToggle: (id: string) => void;
  onAdd: (enhancement: Enhancement) => void;
  onApply: () => void;
  onCancel: () => void;
}

const EnhancementGrid: React.FC<EnhancementGridProps> = ({ enhancements, onToggle, onAdd, onApply, onCancel }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const getImpactColor = (impact: string) => {
    switch(impact) {
      case 'CRITICAL': return 'text-red-400 border-red-500/50 bg-red-500/10';
      case 'HIGH': return 'text-orange-400 border-orange-500/50 bg-orange-500/10';
      case 'MEDIUM': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      default: return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'SECURITY': return <ShieldAlert className="w-3 h-3" />;
      case 'UX': return <MousePointerClick className="w-3 h-3" />;
      case 'PERFORMANCE': return <Zap className="w-3 h-3" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  const handleSaveManual = () => {
    if (!newTitle.trim()) return;

    const newEnhancement: Enhancement = {
        id: `manual-${Date.now()}`,
        title: newTitle.toUpperCase(),
        description: newDesc || "Mejora manual definida por el usuario.",
        impact: 'CRITICAL', // Manual overrides are usually critical
        category: 'FUNCTIONALITY',
        isSelected: true,
        technicalNote: newDesc // Pass description as technical note to AI
    };

    onAdd(newEnhancement);
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-2 text-neon-purple mb-1">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Protocolo de Mejora Estratégica</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">La IA ha detectado {enhancements.length} mejoras. Añade las tuyas si falta algo.</p>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
        
        {/* ADD MANUAL BUTTON AREA */}
        <div className="mb-6">
            {!isAdding ? (
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center space-x-2 text-slate-500 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-slate-900/50 transition-all group"
                >
                    <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Inyección de Mejora Manual</span>
                </button>
            ) : (
                <div className="bg-slate-900/80 border border-neon-cyan/50 rounded-xl p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-3">
                         <div className="flex items-center space-x-2 text-neon-cyan">
                            <PenTool className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Definición de Cambio</span>
                         </div>
                         <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
                    </div>
                    
                    <input 
                        type="text" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="TÍTULO BREVE (EJ: AÑADIR BOTÓN EDITAR)"
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-bold text-white mb-2 focus:border-neon-cyan focus:outline-none uppercase"
                        autoFocus
                    />
                    
                    <textarea 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Descripción técnica para la IA: 'Crear modal de edición reutilizando el formulario existente...'"
                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-slate-300 mb-3 focus:border-neon-cyan focus:outline-none h-20 resize-none"
                    />
                    
                    <button 
                        onClick={handleSaveManual}
                        disabled={!newTitle.trim()}
                        className={`w-full py-2 rounded text-xs font-bold uppercase tracking-wider transition-all ${newTitle.trim() ? 'bg-neon-cyan text-slate-950 hover:bg-cyan-400' : 'bg-slate-800 text-slate-500'}`}
                    >
                        Confirmar Inyección
                    </button>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {enhancements.map((item) => (
            <div 
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`
                group relative p-4 rounded-xl border-2 transition-all cursor-pointer select-none
                ${item.isSelected 
                  ? 'bg-slate-900/80 border-neon-purple/50 shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'}
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold uppercase flex items-center gap-1 ${getImpactColor(item.impact)}`}>
                      {getCategoryIcon(item.category)}
                      {item.impact}
                    </span>
                    <h3 className={`text-xs font-bold uppercase tracking-wide ${item.isSelected ? 'text-white' : 'text-slate-500'}`}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    {item.description}
                  </p>
                </div>

                <div className={`transition-colors ${item.isSelected ? 'text-neon-purple' : 'text-slate-600'}`}>
                  {item.isSelected ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end space-x-3">
        <button 
          onClick={onCancel}
          className="px-4 py-2 rounded text-xs font-bold uppercase text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
        >
          Omitir y Mantener Original
        </button>
        <button 
          onClick={onApply}
          className="flex items-center space-x-2 px-6 py-2 rounded bg-neon-purple text-white text-xs font-bold uppercase tracking-wider hover:bg-purple-500 shadow-lg shadow-purple-900/20 transition-all active:scale-95"
        >
          <span>Aplicar Actualizaciones</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
    </div>
  );
};

export default EnhancementGrid;
