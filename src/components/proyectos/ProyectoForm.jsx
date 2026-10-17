import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const TIPOS_PROYECTO = [
  { value: 'nodejs', label: 'Node.js (Express/Next/Nuxt)' },
  { value: 'python', label: 'Python (FastAPI/Flask/Django)' },
  { value: 'php', label: 'PHP (Laravel/Symfony)' },
  { value: 'static', label: 'Sitio Estático (HTML/React/Vue)' },
  { value: 'docker', label: 'Docker Container' },
  { value: 'other', label: 'Otro' },
];

const ESTADOS = [
  { value: 'detenido', label: 'Detenido' },
  { value: 'corriendo', label: 'Corriendo' },
  { value: 'error', label: 'Error' },
];

export default function ProyectoForm({ proyectoData, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'nodejs',
    ruta: '',
    comando_inicio: '',
    puerto: '',
    url_acceso: '',
    dominio_local: '',
    lanzador_id: '',
    descripcion: '',
    estado: 'detenido',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (proyectoData) {
      setFormData({
        nombre: proyectoData.nombre || '',
        tipo: proyectoData.tipo || 'nodejs',
        ruta: proyectoData.ruta || '',
        comando_inicio: proyectoData.comando_inicio || '',
        puerto: proyectoData.puerto || '',
        url_acceso: proyectoData.url_acceso || '',
        dominio_local: proyectoData.dominio_local || '',
        lanzador_id: proyectoData.lanzador_id || '',
        descripcion: proyectoData.descripcion || '',
        estado: proyectoData.estado || 'detenido',
      });
    }
  }, [proyectoData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    if (!formData.ruta.trim()) { setError('La ruta es obligatoria'); return; }
    const dataToSave = { ...formData, puerto: formData.puerto ? parseInt(formData.puerto, 10) : null };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-slate-900 border border-pink-700/50 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Save size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">{proyectoData ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h2>
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
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre del Proyecto *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Mi App Web" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tipo de Proyecto *</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition" required>
              {TIPOS_PROYECTO.map(tipo => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Ruta del Proyecto *</label>
            <input type="text" name="ruta" value={formData.ruta} onChange={handleChange} placeholder="Ej: /home/user/proyectos/mi-app" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition font-mono text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Comando de Inicio</label>
            <input type="text" name="comando_inicio" value={formData.comando_inicio} onChange={handleChange} placeholder="Ej: npm run dev, python app.py" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition font-mono text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Puerto</label>
            <input type="number" name="puerto" value={formData.puerto} onChange={handleChange} placeholder="Ej: 3000" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">URL de Acceso</label>
            <input type="url" name="url_acceso" value={formData.url_acceso} onChange={handleChange} placeholder="Ej: http://localhost:3000" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Dominio Local</label>
            <input type="text" name="dominio_local" value={formData.dominio_local} onChange={handleChange} placeholder="Ej: miapp.dev, proyecto.local" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition font-mono text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Lanzador Asociado</label>
            <input type="text" name="lanzador_id" value={formData.lanzador_id} onChange={handleChange} placeholder="ID del lanzador (opcional)" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition font-mono text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition">
              {ESTADOS.map(estado => <option key={estado.value} value={estado.value}>{estado.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción opcional del proyecto..." rows={2} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition border border-slate-700/50" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-sm font-medium transition shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save size={16} />{loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
