import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const TIPOS_LANZADOR = [
  { value: 'docker', label: 'Docker Container' },
  { value: 'npm', label: 'Aplicación NPM' },
  { value: 'pocketbase', label: 'PocketBase' },
  { value: 'python', label: 'Python (FastAPI/Flask)' },
  { value: 'custom', label: 'Comando Personalizado' },
];

const ESTADOS = [
  { value: 'detenido', label: 'Detenido' },
  { value: 'corriendo', label: 'Corriendo' },
  { value: 'error', label: 'Error' },
];

export default function LanzadorForm({ lanzadorData, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'docker',
    comando: '',
    directorio: '',
    puerto: '',
    url_acceso: '',
    variables_entorno: '',
    descripcion: '',
    estado: 'detenido',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (lanzadorData) {
      setFormData({
        nombre: lanzadorData.nombre || '',
        tipo: lanzadorData.tipo || 'docker',
        comando: lanzadorData.comando || '',
        directorio: lanzadorData.directorio || '',
        puerto: lanzadorData.puerto || '',
        url_acceso: lanzadorData.url_acceso || '',
        variables_entorno: lanzadorData.variables_entorno || '',
        descripcion: lanzadorData.descripcion || '',
        estado: lanzadorData.estado || 'detenido',
      });
    }
  }, [lanzadorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    if (!formData.comando.trim()) { setError('El comando es obligatorio'); return; }
    const dataToSave = { ...formData, puerto: formData.puerto ? parseInt(formData.puerto, 10) : null };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-slate-900 border border-green-700/50 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg"><Save size={20} className="text-white" /></div>
            <h2 className="text-xl font-bold text-slate-100">{lanzadorData ? 'Editar Lanzador' : 'Nuevo Lanzador'}</h2>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-3 bg-red-950/50 border border-red-700/30 rounded-lg p-4"><AlertCircle size={18} className="text-red-400 shrink-0" /><span className="text-sm text-red-300">{error}</span></div>
          )}
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre *</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: PocketBase Local" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition" required /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Tipo de Servicio *</label><select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition" required>{TIPOS_LANZADOR.map(tipo => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Comando de Ejecución *</label><textarea name="comando" value={formData.comando} onChange={handleChange} placeholder={"Ej:\ndocker run -d -p 8090:8090 pocketbase/pocketbase\nnpm run dev\npython -m uvicorn main:app --reload"} rows={3} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition resize-none font-mono text-sm" required /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Directorio de Trabajo</label><input type="text" name="directorio" value={formData.directorio} onChange={handleChange} placeholder="Ej: /home/user/proyectos/mi-app" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition font-mono text-sm" /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Puerto</label><input type="number" name="puerto" value={formData.puerto} onChange={handleChange} placeholder="Ej: 8090" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition" /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">URL de Acceso</label><input type="url" name="url_acceso" value={formData.url_acceso} onChange={handleChange} placeholder="Ej: http://localhost:8090" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition" /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Variables de Entorno</label><textarea name="variables_entorno" value={formData.variables_entorno} onChange={handleChange} placeholder={"Ej:\nDATABASE_URL=postgres://localhost/db\nAPI_KEY=abc123"} rows={3} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition resize-none font-mono text-sm" /><p className="text-xs text-slate-500 mt-1.5">Una variable por línea (KEY=VALUE)</p></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Estado</label><select name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition">{ESTADOS.map(estado => <option key={estado.value} value={estado.value}>{estado.label}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label><textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción opcional del servicio..." rows={2} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition resize-none" /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition border border-slate-700/50" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white text-sm font-medium transition shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"><Save size={16} />{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
