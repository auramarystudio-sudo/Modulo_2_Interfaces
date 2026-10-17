import { useState, useRef } from 'react';
import { Download, Upload, Check, AlertCircle, X } from 'lucide-react';
import pb from '../../lib/pocketbase.js';

export default function ImportExport({ type, items, onImported }) {
  const [status, setStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const fileInputRef = useRef(null);

  const collectionName = 
    type === 'interfaces' ? 'interfaces_ui' : 
    type === 'servidores' ? 'servidores_red' : 
    type === 'lanzadores' ? 'lanzadores' : 
    type === 'proyectos' ? 'proyectos' : 
    type === 'bases_datos' ? 'bases_datos' : 'interfaces_ui';
  
  const typeName = 
    type === 'interfaces' ? 'Interfaces' : 
    type === 'servidores' ? 'Servidores' : 
    type === 'lanzadores' ? 'Lanzadores' : 
    type === 'proyectos' ? 'Proyectos' : 
    type === 'bases_datos' ? 'Bases de Datos' : 'Interfaces';

  const handleExport = () => {
    const data = { version: '1.0', type, exportedAt: new Date().toISOString(), items };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-manager-${type}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('success');
    setStatusMsg(`${items.length} ${typeName.toLowerCase()} exportados correctamente`);
    setTimeout(() => { setStatus(null); setStatusMsg(''); }, 3000);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.items || !Array.isArray(data.items)) throw new Error('Formato de archivo inválido');
      let imported = 0;
      let errors = 0;
      for (const item of data.items) {
        try {
          const cleanItem = { ...item };
          delete cleanItem.id;
          delete cleanItem.created;
          delete cleanItem.updated;
          delete cleanItem.collectionId;
          delete cleanItem.collectionName;
          await pb.collection(collectionName).create(cleanItem);
          imported++;
        } catch (err) {
          console.error('Error importando item:', err);
          errors++;
        }
      }
      if (imported > 0) {
        setStatus('success');
        setStatusMsg(`${imported} ${typeName.toLowerCase()} importados${errors > 0 ? `, ${errors} con errores` : ''}`);
        onImported?.();
      } else {
        setStatus('error');
        setStatusMsg('No se pudo importar ningún elemento');
      }
    } catch (err) {
      setStatus('error');
      setStatusMsg('Error al leer el archivo: ' + err.message);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => { setStatus(null); setStatusMsg(''); }, 4000);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={handleExport} disabled={items.length === 0} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition border border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed" title="Exportar configuración">
          <Download size={14} />
          <span className="hidden sm:inline">Exportar</span>
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition border border-slate-700/50" title="Importar configuración">
          <Upload size={14} />
          <span className="hidden sm:inline">Importar</span>
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>
      {status && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-2xl z-50 transition-all ${status === 'success' ? 'bg-green-950/80 border-green-700/30' : 'bg-red-950/80 border-red-700/30'}`}>
          {status === 'success' ? <Check size={18} className="text-green-400" /> : <AlertCircle size={18} className="text-red-400" />}
          <span className={`text-sm ${status === 'success' ? 'text-green-300' : 'text-red-300'}`}>{statusMsg}</span>
          <button onClick={() => setStatus(null)} className="text-slate-500 hover:text-white transition">
            <X size={14} />
          </button>
        </div>
      )}
    </>
  );
}
