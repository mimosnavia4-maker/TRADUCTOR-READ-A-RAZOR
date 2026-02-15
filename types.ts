
export enum AppState {
  IDLE = 'IDLE',
  AUDITING = 'AUDITING',
  REFACTORING = 'REFACTORING',
  ANALYZING_IMPROVEMENTS = 'ANALYZING_IMPROVEMENTS', // Nuevo: IA buscando mejoras
  REVIEW_SUGGESTIONS = 'REVIEW_SUGGESTIONS',         // Nuevo: Usuario eligiendo
  APPLYING_IMPROVEMENTS = 'APPLYING_IMPROVEMENTS',   // Nuevo: IA aplicando cambios
  COMPLETE = 'COMPLETE'
}

export interface ProtocolRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  isLocked: boolean;
}

export interface AuditStats {
  sourceType: 'Razor' | 'React' | 'Unknown';
  buttons: number;
  kpis: number;
  tables: number;
  icons: number;
  dynamicTypes: number;
}

export interface RefactorResult {
  inventory: string;
  mapping: string;
  architecture: string;
  fidelity: string;
  code: string;
  guide: string;
}

export interface Enhancement {
  id: string;
  title: string;
  description: string;
  impact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'UX' | 'SECURITY' | 'FUNCTIONALITY' | 'PERFORMANCE';
  isSelected: boolean;
  technicalNote?: string; // Nota interna para la IA sobre cómo implementar esto
}

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  timestamp: number;
  isReference: boolean; // "Golden Standard" flag
}
