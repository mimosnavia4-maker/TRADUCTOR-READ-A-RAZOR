
import { AuditStats, RefactorResult, Enhancement } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// --- ANALYZER ---
export const analyzeRazor = (code: string): AuditStats => {
  const isReact = code.includes('import React') || code.includes('useState') || code.includes('className=');
  const sourceType = isReact ? 'React' : 'Razor';

  const buttons = (code.match(/<button|btn-/g) || []).length;
  const kpis = (code.match(/Card|Value|Metric|<div.*card/gi) || []).length;
  const tables = (code.match(/<table|datagrid|<tbody/gi) || []).length;
  const icons = (code.match(/<i |<svg|Icon|Fa\w+/g) || []).length;
  const dynamicTypes = (code.match(/dynamic|object|var |any/g) || []).length;

  return { sourceType, buttons, kpis, tables, icons, dynamicTypes };
};

// --- CONSTANTS & SCHEMAS ---
const ENHANCEMENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    enhancements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          impact: { type: Type.STRING, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
          category: { type: Type.STRING, enum: ['UX', 'SECURITY', 'FUNCTIONALITY', 'PERFORMANCE'] },
          technicalNote: { type: Type.STRING, description: "Instrucción técnica breve." }
        },
        required: ["id", "title", "description", "impact", "category"]
      }
    }
  }
};

const DEFAULT_ENHANCEMENTS: Enhancement[] = [
    {
        id: 'auto-mock-data',
        title: 'INYECCIÓN DE DATOS SIMULADOS (MOCK DATA)',
        description: 'Se requiere poblar la UI con datos de prueba para validar visualmente el comportamiento de tablas y gráficas.',
        impact: 'HIGH',
        category: 'FUNCTIONALITY',
        isSelected: true,
        technicalNote: 'En OnInitializedAsync, rellenar las listas con 10-15 registros estáticos de ejemplo variados.'
    },
    {
        id: 'fallback-1',
        title: 'EXPORTACIÓN DE DATOS (CSV)',
        description: 'Falta funcionalidad para exportar los datos de la tabla.',
        impact: 'HIGH',
        category: 'FUNCTIONALITY',
        isSelected: false,
        technicalNote: 'Implementar JSInterop para descarga de archivos.'
    },
    {
        id: 'fallback-2',
        title: 'VALIDACIÓN DE FORMULARIO',
        description: 'Se recomienda usar DataAnnotations y EditForm.',
        impact: 'MEDIUM',
        category: 'UX',
        isSelected: false,
        technicalNote: 'Añadir DataAnnotationsValidator.'
    },
    {
        id: 'fallback-3',
        title: 'FEEDBACK VISUAL (TOASTS)',
        description: 'El usuario no recibe confirmación visual tras las acciones.',
        impact: 'LOW',
        category: 'UX',
        isSelected: false,
        technicalNote: 'Implementar sistema de notificaciones temporales.'
    }
];

// --- HELPER: ROBUST TAG PARSING ---
// Extrae contenido entre etiquetas <TAG>contenido</TAG> ignorando mayúsculas/minúsculas
const extractTagContent = (text: string, tagName: string): string => {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : "";
};

// --- MAIN REFACTOR FUNCTION ---
export const generateRefactor = async (code: string, audit: AuditStats, modelId: string, referenceCode?: string): Promise<RefactorResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // NOTA: Usamos un formato basado en ETIQUETAS XML personalizadas en lugar de JSON.
    // Esto evita que la IA rompa el formato al generar cadenas de código muy largas con comillas.
    let systemPrompt = `
      ROL: Arquitecto Senior de Razor & Ingeniero Frontend.
      PROTOCOLO: "Mirror & Shield" v3.6 (Modo Estricto).

      MISIÓN:
      Refactorizar el código de entrada (React/JSX/TSX) a un componente ASP.NET Core Blazor (.razor) listo para producción.

      FORMATO DE SALIDA (OBLIGATORIO):
      No uses JSON. Envuelve tu respuesta en las siguientes etiquetas:

      <INVENTORY>
      (Lista de componentes detectados. Texto plano.)
      </INVENTORY>

      <MAPPING>
      (Explicación del mapeo de estado React a C#.)
      </MAPPING>

      <ARCHITECTURE>
      (Descripción de RenderFragments y estructura.)
      </ARCHITECTURE>

      <FIDELITY>
      (Confirmación de fidelidad visual.)
      </FIDELITY>

      <GUIDE>
      (Guía rápida de implementación.)
      </GUIDE>

      <CODE>
      (AQUÍ INSERTA EL CÓDIGO RAZOR FINAL. SOLO TEXTO. SIN MARKDOWN.)
      </CODE>

      REGLAS DE CÓDIGO:
      1. Genera el código COMPLETO. No omitas nada.
      2. Mantén todas las clases Tailwind exactas.
      3. Convierte lógica React (useState, useEffect) a Blazor (@code block).
      4. IMPORTANTE: Para atributos HTML con lógica C# que contienen strings, usa COMILLAS SIMPLES en el HTML.
         Ejemplo CORRECTO: <button @onclick='() => Metodo("param")'>
         Ejemplo INCORRECTO: <button @onclick="() => Metodo("param")">
    `;

    if (referenceCode) {
        systemPrompt += `
        
        ### ESTÁNDAR DE CÓDIGO (GOLDEN STANDARD) ###
        Imita el estilo de este archivo de referencia proporcionado por el usuario:
        ${referenceCode}
        `;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1, // Baja temperatura para mayor precisión
        // NO ponemos responseMimeType: application/json para evitar el error de parsing
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `Refactoriza este código:\n\n${code}` }]
        }
      ]
    });

    const text = response.text || "";
    
    // Extraemos los datos usando las etiquetas
    const inventory = extractTagContent(text, "INVENTORY") || "Sin inventario.";
    const mapping = extractTagContent(text, "MAPPING") || "Sin mapeo.";
    const architecture = extractTagContent(text, "ARCHITECTURE") || "Sin arquitectura.";
    const fidelity = extractTagContent(text, "FIDELITY") || "Sin datos de fidelidad.";
    const guide = extractTagContent(text, "GUIDE") || "Sin guía.";
    
    let generatedCode = extractTagContent(text, "CODE");
    
    // Limpieza de seguridad por si la IA pone markdown dentro de las etiquetas
    generatedCode = generatedCode.replace(/^```razor/gi, '').replace(/^```csharp/gi, '').replace(/^```html/gi, '').replace(/```$/gi, '').trim();

    if (!generatedCode) {
        throw new Error("La IA no generó el bloque <CODE> correctamente. El archivo puede ser demasiado grande.");
    }

    return {
      inventory,
      mapping,
      architecture,
      fidelity,
      code: generatedCode,
      guide
    };

  } catch (error) {
    console.error("AI Refactor Failed:", error);
    return {
      inventory: "Error",
      mapping: "Error",
      architecture: "Error",
      fidelity: "Error",
      code: `// ERROR AL GENERAR CÓDIGO.\n// Detalle: ${error instanceof Error ? error.message : String(error)}`,
      guide: "Intente reducir el tamaño del archivo o dividirlo en componentes más pequeños."
    };
  }
};

// --- ENHANCEMENT DETECTION ---
export const detectEnhancements = async (razorCode: string, modelId: string): Promise<Enhancement[]> => {
  // 1. Definir la mejora obligatoria de Mock Data
  const mockDataEnhancement: Enhancement = {
    id: 'auto-mock-data',
    title: 'INYECCIÓN DE DATOS SIMULADOS (MOCK DATA)',
    description: 'Para validar la UI inmediatamente, se inyectarán datos de prueba estáticos en el método OnInitializedAsync.',
    impact: 'HIGH',
    category: 'FUNCTIONALITY',
    isSelected: true, // Pre-seleccionado por defecto
    technicalNote: 'Crear listas con 5-10 objetos dummy con datos realistas para poblar tablas y tarjetas. Asegurar que las fechas y montos sean variados.'
  };

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemPrompt = `
      Analiza el código Razor y sugiere 3-4 mejoras técnicas (UX, Seguridad, Performance).
      NO sugieras "Datos de prueba" o "Mock Data", ya que eso se añade automáticamente.
      Devuelve un JSON válido con el esquema Enhancement[].
    `;

    const response = await ai.models.generateContent({
      model: modelId || "gemini-3-flash-preview",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: ENHANCEMENT_SCHEMA,
        temperature: 0.3, 
      },
      contents: [
        { role: "user", parts: [{ text: razorCode }] }
      ]
    });

    const text = response.text;
    
    let detectedEnhancements: Enhancement[] = [];

    if (text) {
        try {
            const result = JSON.parse(text);
            if (result.enhancements && Array.isArray(result.enhancements)) {
                detectedEnhancements = result.enhancements.map((e: any) => ({ ...e, isSelected: false }));
            }
        } catch {
            console.warn("Error parsing enhancements JSON");
        }
    }

    // Fusionar: Mock Data PRIMERO + Lo que detectó la IA
    return [mockDataEnhancement, ...detectedEnhancements];

  } catch (error) {
    console.error("Detect Enhancements Failed:", error);
    // En caso de error, devolvemos el Mock Data + los Defaults
    return [mockDataEnhancement, ...DEFAULT_ENHANCEMENTS.filter(e => e.id !== 'auto-mock-data')];
  }
};

// --- APPLY ENHANCEMENTS ---
export const applyEnhancements = async (originalCode: string, enhancements: Enhancement[], modelId: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const tasks = enhancements
        .filter(e => e.isSelected)
        .map(e => `- [${e.title}]: ${e.technicalNote || e.description}`)
        .join('\n');

    if (!tasks) return originalCode;

    const systemPrompt = `
      Eres un experto en Blazor. Aplica estas mejoras al código existente SIN ROMPER lo que ya funciona.
      
      MEJORAS A APLICAR:
      ${tasks}
      
      Devuelve SOLO el código Razor final, sin markdown, sin explicaciones extra.
      Usa comillas simples para atributos con lógica C# compleja.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      config: { systemInstruction: systemPrompt },
      contents: [
        { role: "user", parts: [{ text: originalCode }] }
      ]
    });

    let code = response.text || "";
    // Limpieza de markdown
    if (code.includes("```")) {
        code = code.replace(/^```(razor|csharp|html)?/gm, "").replace(/```$/gm, "");
    }
    return code.trim();

  } catch (error) {
    console.error("Apply Enhancements Failed:", error);
    return originalCode + "\n\n// Error aplicando mejoras.";
  }
};
