
import { ProtocolRule, AuditStats } from './types';
import React from 'react';
import { Shield, Eye, Lock, FileCode, Zap, Layers } from 'lucide-react';

export const INITIAL_RULES: ProtocolRule[] = [
  { id: 'no-summary', name: 'Cero Omisión', description: 'Nunca usar elipsis (...)', isActive: true, isLocked: true },
  { id: 'logic-shield', name: 'Escudo Lógico', description: 'Mantener lógica/nombres intactos', isActive: true, isLocked: true },
  { id: 'visual-mirror', name: 'Espejo Visual', description: 'Coincidencia exacta Hex y espaciado', isActive: true, isLocked: true },
  { id: 'type-safety', name: 'Tipado Fuerte', description: 'Convertir dynamic a class/record', isActive: true, isLocked: false },
  { id: 'render-fragments', name: 'Arquitectura Fragment', description: 'Extraer UI repetitiva a fragmentos', isActive: true, isLocked: false },
];

export const MOCK_AUDIT_STATS: AuditStats = {
  sourceType: 'Razor',
  buttons: 4,
  kpis: 3,
  tables: 1,
  icons: 12,
  dynamicTypes: 5,
};

export const STEPS = [
  { id: 1, label: 'Entrada', icon: <FileCode className="w-4 h-4" /> },
  { id: 2, label: 'Auditoría', icon: <Eye className="w-4 h-4" /> },
  { id: 3, label: 'Refactor', icon: <Zap className="w-4 h-4" /> },
  { id: 4, label: 'Verificación', icon: <Shield className="w-4 h-4" /> },
];
