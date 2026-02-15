
import React from 'react';
import { Copy, FileCode, Check, Maximize2, Minimize2 } from 'lucide-react';

interface EditorProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  language?: string;
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

const Editor: React.FC<EditorProps> = ({ title, value, onChange, readOnly = false, isMaximized, onToggleMaximize }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-xl transition-all duration-300 ${isMaximized ? 'border-neon-cyan/30 shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-slate-300">
          <FileCode className="w-4 h-4 text-neon-purple" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          {readOnly && (
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              title="Copiar al portapapeles"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          )}

          {onToggleMaximize && (
            <button
              onClick={onToggleMaximize}
              className={`p-1.5 hover:bg-slate-800 rounded transition-colors ${isMaximized ? 'text-neon-cyan hover:text-cyan-400' : 'text-slate-400 hover:text-white'}`}
              title={isMaximized ? "Salir de Modo Zen" : "Modo Zen (Pantalla Completa)"}
            >
               {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          <div className="flex space-x-1 pl-2 border-l border-slate-800 ml-2">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
          </div>
        </div>
      </div>
      <div className="relative flex-1">
        <textarea
          className="absolute inset-0 w-full h-full bg-slate-950 text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-1 focus:ring-slate-700 leading-relaxed custom-scrollbar"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={readOnly}
          spellCheck={false}
          placeholder={readOnly ? "Esperando resultado..." : "// Pega tu código Razor (.cshtml) o React (.jsx) aquí..."}
        />
      </div>
      {readOnly && (
        <div className="px-4 py-1 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
           <span>Ln {value.split('\n').length}, Col 1</span>
           <span>UTF-8</span>
        </div>
      )}
    </div>
  );
};

export default Editor;
