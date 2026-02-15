
import React from 'react';
import { Cpu, FolderOpen, Shield, CheckCircle2, Layout, Sparkles } from 'lucide-react';
import { AppState } from '../types';
import { STEPS } from '../constants';

interface TopNavProps {
  appState: AppState;
  fileCount: number;
  onToggleFileDrawer: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ appState, fileCount, onToggleFileDrawer }) => {
  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0 z-20 relative">
      
      {/* 1. BRAND & FILES */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
                <Cpu className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
                <h1 className="text-sm font-bold tracking-wider text-slate-100 font-sans">RAZOR ARCHITECT</h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-tight">MIRROR SHIELD PROTOCOL v3.6</p>
            </div>
        </div>

        <div className="h-8 w-[1px] bg-slate-800 mx-2" />

        <button 
            onClick={onToggleFileDrawer}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors border border-transparent hover:border-slate-800 group"
        >
            <FolderOpen className="w-4 h-4 group-hover:text-neon-cyan transition-colors" />
            <span className="text-xs font-bold uppercase tracking-wide">Archivos</span>
            <span className="bg-slate-800 text-slate-400 text-[9px] px-1.5 rounded-full font-mono group-hover:bg-slate-700">{fileCount}</span>
        </button>
      </div>

      {/* 2. TABBED NAVIGATION (VISUAL STEPS) */}
      <div className="flex items-center bg-slate-900/50 p-1 rounded-lg border border-slate-800/50">
        {STEPS.map((step, idx) => {
             // Logic to determine active state based on AppState
             let isActive = false;
             let isCompleted = false;

             if (appState === AppState.IDLE && idx === 0) isActive = true;
             if ((appState === AppState.AUDITING || appState === AppState.REFACTORING) && idx === 1) isActive = true;
             if (appState === AppState.REVIEW_SUGGESTIONS && idx === 2) isActive = true; // Review phase
             if (appState === AppState.COMPLETE && idx === 3) isActive = true;

             if (appState !== AppState.IDLE && idx === 0) isCompleted = true;
             if (appState === AppState.COMPLETE && idx <= 2) isCompleted = true;
             if (appState === AppState.REVIEW_SUGGESTIONS && idx <= 1) isCompleted = true;

             return (
                 <div key={step.id} className="relative px-4 py-1.5">
                    <div className={`
                        flex items-center space-x-2 text-xs font-bold uppercase tracking-wide transition-all duration-300
                        ${isActive ? 'text-white' : isCompleted ? 'text-neon-cyan' : 'text-slate-600'}
                    `}>
                        {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : step.icon}
                        <span>{step.label}</span>
                    </div>
                    {isActive && (
                        <div className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-neon-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)] rounded-full mx-2" />
                    )}
                 </div>
             )
        })}
      </div>

      {/* 3. CONTEXT STATUS */}
      <div className="flex items-center space-x-3">
        <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 flex items-center space-x-2 text-[10px] font-mono text-slate-400">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>ZERO TRUST: ACTIVO</span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
