
import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import FileDrawer from './components/FileDrawer';
import Editor from './components/Editor';
import EnhancementGrid from './components/EnhancementGrid';
import ReportPanel from './components/ReportPanel'; // IMPORTED
import { AppState, AuditStats, RefactorResult, ProjectFile, Enhancement } from './types';
import { analyzeRazor, generateRefactor, detectEnhancements, applyEnhancements } from './services/razorService';
import { Play, RotateCcw, AlertTriangle, Loader2, Save, Sparkles, Wand2, ArrowRightLeft, FileCode, SplitSquareHorizontal, Bot, CheckCircle2, ArrowRight, Timer } from 'lucide-react';

const App: React.FC = () => {
  // --- CORE STATE ---
  const [inputCode, setInputCode] = useState<string>('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  
  // View Stage: 1=Drafting, 2=Strategy, 3=Final Report
  const [viewStage, setViewStage] = useState<'DRAFTING' | 'STRATEGY' | 'FINAL'>('DRAFTING');

  const [auditStats, setAuditStats] = useState<AuditStats | null>(null);
  const [result, setResult] = useState<RefactorResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  
  // Model Selection State
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-pro-preview');

  // UI State
  const [isFileDrawerOpen, setIsFileDrawerOpen] = useState(false);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);

  // Loading State Enhancements
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Project Files State
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(() => {
    const saved = localStorage.getItem('razor-shield-files');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('razor-shield-files', JSON.stringify(projectFiles));
  }, [projectFiles]);

  // --- PROGRESS LOGIC (SMART LOADER) ---
  const startSmartProgress = (isFlash: boolean) => {
    setProgress(0);
    setElapsedSeconds(0);
    
    const startTime = Date.now();
    // Flash models are faster, Pro models need more "patience time"
    const expectedDuration = isFlash ? 15 : 45; 

    return setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(seconds);

      // Dynamic Messages based on phase
      if (seconds < 3) setLoadingMessage("Iniciando conexión segura...");
      else if (seconds < 8) setLoadingMessage("Analizando estructura y dependencias...");
      else if (seconds < 15) setLoadingMessage("Diseñando arquitectura de componentes...");
      else if (seconds < 25) setLoadingMessage("Escribiendo código Razor optimizado...");
      else if (seconds < 40) setLoadingMessage("Aplicando reglas de validación y seguridad...");
      else setLoadingMessage("Finalizando detalles y formateo...");

      // Smooth Progress Curve (Logarithmic)
      // It moves fast at first, then slows down, but keeps moving until 99%
      setProgress(prev => {
        if (prev >= 99) return 99;
        
        // Calculate increment based on remaining distance and expected duration
        const remaining = 100 - prev;
        const factor = isFlash ? 0.8 : 0.4;
        const increment = (remaining / expectedDuration) * factor;
        
        // Ensure minimum movement so it doesn't look frozen
        return prev + Math.max(0.05, increment);
      });
    }, 100);
  };

  // --- HANDLERS FOR WINDOW 1 (DRAFTING) ---

  const handleRefactor = async () => {
    if (!inputCode.trim()) return;
    setAppState(AppState.AUDITING);
    setProgress(0);

    const referenceFile = projectFiles.find(f => f.isReference);
    const referenceCode = referenceFile ? referenceFile.content : undefined;

    setTimeout(async () => {
      const stats = analyzeRazor(inputCode);
      setAuditStats(stats);
      setAppState(AppState.REFACTORING);
      
      const isFlash = selectedModel.includes('flash');
      const interval = startSmartProgress(isFlash);

      try {
        const refactorResult = await generateRefactor(inputCode, stats, selectedModel, referenceCode);
        clearInterval(interval);
        setProgress(100);
        setLoadingMessage("¡Proceso Completado!");
        setTimeout(() => {
             setResult(refactorResult);
             setAppState(AppState.COMPLETE);
             // Stay in DRAFTING stage, user manually proceeds to next stage
        }, 400);
      } catch (error) {
        clearInterval(interval);
        setProgress(0);
        setAppState(AppState.IDLE);
        alert("Fallo en refactorización. Por favor intente de nuevo.");
      }
    }, 800);
  };

  // Transition Window 1 -> Window 2
  const goToStrategyWindow = async () => {
      if (!result) return;
      setViewStage('STRATEGY');
      setAppState(AppState.ANALYZING_IMPROVEMENTS);
      
      const isFlash = selectedModel.includes('flash');
      const interval = startSmartProgress(isFlash);

      try {
          const suggestions = await detectEnhancements(result.code, selectedModel);
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => {
              setEnhancements(suggestions);
              setAppState(AppState.REVIEW_SUGGESTIONS);
          }, 300);
      } catch (e) {
          clearInterval(interval);
          setAppState(AppState.COMPLETE);
      }
  };

  // --- HANDLERS FOR WINDOW 2 (STRATEGY) ---

  const handleToggleEnhancement = (id: string) => {
    setEnhancements(prev => prev.map(e => e.id === id ? { ...e, isSelected: !e.isSelected } : e));
  };

  const handleAddManualEnhancement = (newEnhancement: Enhancement) => {
    setEnhancements(prev => [newEnhancement, ...prev]);
  };

  // Transition Window 2 -> Window 3 (Applying Updates)
  const handleApplyEnhancements = async () => {
    if (!result) return;
    setAppState(AppState.APPLYING_IMPROVEMENTS);
    
    // Check model at the moment of application (in case user switched)
    const isFlash = selectedModel.includes('flash');
    const interval = startSmartProgress(isFlash);
    
    try {
        const newCode = await applyEnhancements(result.code, enhancements, selectedModel);
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
            setResult({ ...result, code: newCode });
            setAppState(AppState.COMPLETE);
            setEnhancements([]);
            setViewStage('FINAL'); // Move to Window 3
        }, 300);
    } catch (e) {
        clearInterval(interval);
        setAppState(AppState.COMPLETE);
    }
  };

  // Transition Window 2 -> Window 3 (Skipping Updates)
  const handleSkipEnhancements = () => {
      setViewStage('FINAL');
      setEnhancements([]);
  };

  // --- HANDLERS FOR WINDOW 3 (FINAL) ---

  const handleSaveFile = () => {
    if (!result) return;
    const name = prompt("Introduce nombre de archivo:", "Componente.razor");
    if (!name) return;
    const newFile: ProjectFile = { id: Date.now().toString(), name, content: result.code, timestamp: Date.now(), isReference: projectFiles.length === 0 };
    setProjectFiles([...projectFiles, newFile]);
    handleReset();
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setAuditStats(null);
    setResult(null);
    setProgress(0);
    setEnhancements([]);
    setViewStage('DRAFTING');
    setInputCode('');
    setIsEditorMaximized(false);
  };

  // --- LAYOUT LOGIC ---

  let leftTitle = "Fuente de Entrada";
  let leftValue = "";
  let leftReadOnly = false;
  let RightComponent = null;

  switch (viewStage) {
      case 'DRAFTING':
          leftTitle = "Fuente de Entrada (React/JSX)";
          leftValue = inputCode;
          leftReadOnly = appState !== AppState.IDLE;
          RightComponent = (
              <Editor 
                 title="Salida Razor (Borrador)" 
                 value={result ? result.code : ''} 
                 readOnly={true} 
              />
          );
          break;

      case 'STRATEGY':
          leftTitle = "Borrador Actual (Razor)";
          leftValue = result?.code || '';
          leftReadOnly = true;
          RightComponent = (
              <EnhancementGrid 
                  enhancements={enhancements}
                  onToggle={handleToggleEnhancement}
                  onAdd={handleAddManualEnhancement}
                  onApply={handleApplyEnhancements}
                  onCancel={handleSkipEnhancements}
              />
          );
          break;

      case 'FINAL':
          leftTitle = "Código de Producción Final (Razor)";
          leftValue = result?.code || '';
          leftReadOnly = true;
          RightComponent = (
              result ? <ReportPanel result={result} onSave={handleSaveFile} onReset={handleReset} /> : null
          );
          break;
  }

  // Derived state to know if we are currently processing (spinner active)
  const isProcessing = appState === AppState.AUDITING || 
                       appState === AppState.REFACTORING || 
                       appState === AppState.ANALYZING_IMPROVEMENTS || 
                       appState === AppState.APPLYING_IMPROVEMENTS;

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      <TopNav 
        appState={appState} 
        fileCount={projectFiles.length} 
        onToggleFileDrawer={() => setIsFileDrawerOpen(true)} 
      />

      <FileDrawer 
        isOpen={isFileDrawerOpen} 
        onClose={() => setIsFileDrawerOpen(false)} 
        files={projectFiles}
        onSelectReference={(id) => setProjectFiles(files => files.map(f => ({ ...f, isReference: f.id === id ? !f.isReference : false })))}
        onDeleteFile={(id) => { if(confirm("¿Eliminar archivo?")) setProjectFiles(files => files.filter(f => f.id !== id)); }}
      />

      <main className="flex-1 flex flex-col p-6 min-h-0 relative">
        
        {/* TOP BAR: Controls & Wizard Status */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0 bg-slate-900/50 p-3 rounded-lg border border-slate-800/50 backdrop-blur-sm">
           
           {/* Left: Wizard Stage Indicator (INTERACTIVE TABS) */}
           <div className="flex items-center space-x-2 pl-2">
                <button
                   onClick={() => setViewStage('DRAFTING')}
                   className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all
                       ${viewStage === 'DRAFTING' 
                           ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_10px_-5px_rgba(6,182,212,0.5)]' 
                           : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 cursor-pointer'}
                   `}
                >
                   1. Borrador
                </button>

                <div className="w-4 h-[1px] bg-slate-800"></div>
                
                <button
                   onClick={() => result && setViewStage('STRATEGY')}
                   disabled={!result}
                   className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all
                       ${viewStage === 'STRATEGY' 
                           ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50 shadow-[0_0_10px_-5px_rgba(139,92,246,0.5)]' 
                           : result 
                               ? 'text-slate-500 hover:text-neon-purple hover:bg-slate-800 cursor-pointer' 
                               : 'text-slate-800 cursor-not-allowed opacity-50'}
                   `}
                >
                   2. Mejoras
                </button>

                <div className="w-4 h-[1px] bg-slate-800"></div>

                <button
                   onClick={() => result && setViewStage('FINAL')}
                   disabled={!result}
                   className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all
                       ${viewStage === 'FINAL' 
                           ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 shadow-[0_0_10px_-5px_rgba(16,185,129,0.5)]' 
                           : result 
                               ? 'text-slate-500 hover:text-emerald-500 hover:bg-slate-800 cursor-pointer' 
                               : 'text-slate-800 cursor-not-allowed opacity-50'}
                   `}
                >
                   3. Informe
                </button>
           </div>

           {/* Right: Global Actions */}
           <div className="flex items-center space-x-3">
               
               {/* MODEL SELECTOR - UNLOCKED FOR STRATEGY */}
               <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md">
                   <Bot className={`w-4 h-4 ${selectedModel.includes('pro') ? 'text-neon-purple' : 'text-neon-cyan'}`} />
                   <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={isProcessing} // ONLY disable when busy processing
                      className="bg-transparent text-xs font-bold uppercase text-slate-300 focus:outline-none cursor-pointer hover:text-white"
                   >
                       <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                       <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                   </select>
               </div>

               <div className="h-4 w-[1px] bg-slate-800 mx-1" />

               {/* WINDOW 1 ACTION: START */}
               {viewStage === 'DRAFTING' && appState === AppState.IDLE && (
                <button onClick={handleRefactor} disabled={!inputCode.trim()} className={`flex items-center space-x-2 px-8 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${inputCode.trim() ? 'bg-neon-cyan text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Iniciar</span>
                </button>
               )}

               {/* WINDOW 1 ACTION: NEXT */}
               {viewStage === 'DRAFTING' && appState === AppState.COMPLETE && (
                   <div className="flex space-x-2">
                        <button onClick={handleReset} className="px-3 py-2 rounded bg-slate-800 text-slate-400 hover:text-white"><RotateCcw className="w-4 h-4"/></button>
                        <button onClick={goToStrategyWindow} className="flex items-center space-x-2 px-6 py-2 rounded-md bg-neon-purple text-white text-xs font-bold uppercase hover:bg-purple-500 shadow-lg shadow-purple-900/20 transition-all">
                            <Wand2 className="w-4 h-4" />
                            <span>Detectar Mejoras</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                   </div>
               )}

               {/* WINDOW 2 ACTION: Managed inside EnhancementGrid */}
               
               {/* RESET BUTTON */}
               {viewStage !== 'DRAFTING' && (
                 <button onClick={handleReset} disabled={isProcessing} className="flex items-center space-x-2 px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase transition-colors disabled:opacity-50">
                   <RotateCcw className="w-4 h-4" />
                   <span>Reiniciar Proyecto</span>
                 </button>
               )}

           </div>
        </div>

        {/* MAIN GRID CONTENT */}
        <div className={`flex-1 grid gap-6 min-h-0 ${isEditorMaximized ? 'grid-cols-1' : 'grid-cols-2'}`}>
            
            {/* COLUMN 1: Dynamic Source */}
            <div className="flex flex-col min-h-0 transition-all duration-500">
                <Editor 
                    title={leftTitle}
                    value={leftValue} 
                    onChange={viewStage === 'DRAFTING' && appState === AppState.IDLE ? setInputCode : undefined}
                    readOnly={leftReadOnly}
                    isMaximized={isEditorMaximized}
                    onToggleMaximize={() => setIsEditorMaximized(!isEditorMaximized)}
                />
            </div>

            {/* COLUMN 2: Dynamic Output/Tools */}
            <div className={`flex flex-col min-h-0 transition-all duration-500 relative ${isEditorMaximized ? 'hidden' : ''}`}>
                
                {RightComponent}

                {/* Loading / Progress Overlay */}
                {isProcessing && (
                     <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-20 flex flex-col items-center justify-center border border-slate-800 rounded-lg">
                        <div className="flex flex-col items-center gap-4 w-3/4 max-w-md">
                          
                          {/* Spinner & Timer */}
                          <div className="relative">
                            <Loader2 className="w-12 h-12 text-neon-cyan animate-spin opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-mono text-white font-bold">{elapsedSeconds}s</span>
                            </div>
                          </div>

                          {/* Progress Bar Container */}
                          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative mt-2">
                              <div 
                                className="h-full bg-gradient-to-r from-neon-cyan to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300 ease-out relative" 
                                style={{ width: `${progress}%` }}
                              >
                                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                              </div>
                          </div>
                          
                          {/* Text Status */}
                          <div className="flex flex-col items-center space-y-1">
                             <div className="flex items-center space-x-2">
                                <span className="text-2xl font-mono font-bold text-white tracking-tighter">{Math.round(progress)}%</span>
                             </div>
                             <p className="text-xs font-mono text-neon-cyan animate-pulse uppercase tracking-widest text-center">
                                {loadingMessage}
                             </p>
                          </div>

                        </div>
                     </div>
                )}

                {/* Visual Connector Arrow */}
                <div className="absolute top-1/2 -left-3 transform -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block">
                     <div className="bg-slate-900 border border-slate-700 p-2 rounded-full shadow-xl">
                        {viewStage === 'STRATEGY' ? <Sparkles className="w-4 h-4 text-neon-purple" /> : <ArrowRightLeft className="w-4 h-4 text-slate-500" />}
                     </div>
                </div>

            </div>
        </div>

      </main>
    </div>
  );
};

export default App;
