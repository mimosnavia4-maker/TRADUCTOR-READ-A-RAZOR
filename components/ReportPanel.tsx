
import React from 'react';
import { RefactorResult } from '../types';
import { FileJson, Layers, Map, CheckCircle2, Save, BookOpen, AlertCircle } from 'lucide-react';

interface ReportPanelProps {
  result: RefactorResult;
  onSave: () => void;
  onReset: () => void;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ result, onSave, onReset }) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-2xl relative">
      
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <CheckCircle2 className="w-5 h-5" />
          <h2 className="text-sm font-bold uppercase tracking-wider">Informe de Arquitectura Final</h2>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">ID Sistema: RZR-FINAL-99 // Listo para Despliegue</p>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
        
        {/* Section 1: Inventory */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
           <div className="flex items-center space-x-2 text-slate-300 mb-2">
              <FileJson className="w-4 h-4 text-neon-cyan" />
              <h3 className="text-xs font-bold uppercase">Inventario UI</h3>
           </div>
           <p className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
              {result.inventory}
           </p>
        </div>

        {/* Section 2: Mapping */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
           <div className="flex items-center space-x-2 text-slate-300 mb-2">
              <Map className="w-4 h-4 text-neon-purple" />
              <h3 className="text-xs font-bold uppercase">Mapeo Lógico</h3>
           </div>
           <p className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
              {result.mapping}
           </p>
        </div>

        {/* Section 3: Architecture */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
           <div className="flex items-center space-x-2 text-slate-300 mb-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <h3 className="text-xs font-bold uppercase">Arquitectura Blazor</h3>
           </div>
           <p className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
              {result.architecture}
           </p>
        </div>

        {/* Section 4: Guide */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
           <div className="flex items-center space-x-2 text-slate-300 mb-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase">Guía de Implementación</h3>
           </div>
           <p className="text-xs text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
              {result.guide}
           </p>
        </div>
        
        {/* Fidelity Check */}
        <div className="flex items-start space-x-3 p-3 bg-emerald-900/10 border border-emerald-900/30 rounded text-emerald-400/80 text-[10px] font-mono">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{result.fidelity}</span>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col space-y-3">
        <button 
          onClick={onSave}
          className="flex items-center justify-center space-x-2 w-full py-3 rounded bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Componente en Proyecto</span>
        </button>

        <button 
          onClick={onReset}
          className="text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest text-center mt-2"
        >
          Iniciar Nuevo Refactor
        </button>
      </div>
    </div>
  );
};

export default ReportPanel;
