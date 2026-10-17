import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const TIPOS_INTERFAZ = [
  { value: 'automatic1111', label: 'AUTOMATIC1111 WebUI' },
  { value: 'comfyui', label: 'ComfyUI' },
  { value: 'forge', label: 'Forge' },
  { value: 'fooocus', label: 'Fooocus' },
  { value: 'sdnext', label: 'SD.Next' },
  { value: 'otra', label: 'Otra' },
];

const ESTADOS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
];

export default function InterfaceForm({ interfaceData, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'automatic1111',
    url_local: '',
    puerto: '',
    comando_lanzamiento: '',
    descripcion: '',
    estado: 'activo',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (interfaceData) {
      setFormData({
        nombre: interfaceData.nombre || '',
        tipo: interfaceData.tipo || 'automatic1111',
        url_local: interfaceData.url_local || '',
        puerto: interfaceData.puerto || '',
        comando_lanzamiento: interfaceData.comando_lanzamiento || '',
        descripcion: interfaceData.descripcion || '',
        estado: interfaceData.estado || 'activo',
      });
    }
  }, [interfaceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    if (!formData.url_local.trim()) { setError('La URL local es obligatoria'); return; }
    if (!formData.puerto) { setError('El puerto es obligatorio'); return; }
    const dataToSave = { ...formData, puerto: parseInt(formData.puerto, 10) };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-slate-900 border border-cyan-700/50 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Save size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">{interfaceData ? 'Editar Interfaz' : 'Nueva Interfaz'}</h2>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-3 bg-red-950/50 border border-red-700/30 rounded-lg p-4">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: AUTOMATIC1111" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tipo de Interfaz *</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition" required>
              {TIPOS_INTERFAZ.map(tipo => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">URL Local *</label>
            <input type="url" name="url_local" value={formData.url_local} onChange={handleChange} placeholder="Ej: http://127.0.0.1:7860" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Puerto *</label>
            <input type="number" name="puerto" value={formData.puerto} onChange={handleChange} placeholder="Ej: 7860" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Comando de Lanzamiento</label>
            <input type="text" name="comando_lanzamiento" value={formData.comando_lanzamiento} onChange={handleChange} placeholder="Ej: webui-user.bat --xformers --api" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition font-mono text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition">
              {ESTADOS.map(estado => <option key={estado.value} value={estado.value}>{estado.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción opcional de la interfaz..." rows={3} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition border border-slate-700/50" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save size={16} />{loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
