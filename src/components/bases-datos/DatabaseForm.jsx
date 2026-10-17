import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const TIPOS_BD = [
  { value: 'sqlite', label: 'SQLite' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL / MariaDB' },
  { value: 'mongodb', label: 'MongoDB' },
  { value: 'redis', label: 'Redis' },
  { value: 'other', label: 'Otra' },
];

const ESTADOS = [
  { value: 'detenido', label: 'Detenido' },
  { value: 'corriendo', label: 'Corriendo' },
  { value: 'error', label: 'Error' },
];

export default function DatabaseForm({ databaseData, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'postgresql',
    host: 'localhost',
    puerto: '',
    nombre_bd: '',
    usuario: '',
    password: '',
    conexion_string: '',
    proyecto_id: '',
    descripcion: '',
    estado: 'detenido',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (databaseData) {
      setFormData({
        nombre: databaseData.nombre || '',
        tipo: databaseData.tipo || 'postgresql',
        host: databaseData.host || 'localhost',
        puerto: databaseData.puerto || '',
        nombre_bd: databaseData.nombre_bd || '',
        usuario: databaseData.usuario || '',
        password: databaseData.password || '',
        conexion_string: databaseData.conexion_string || '',
        proyecto_id: databaseData.proyecto_id || '',
        descripcion: databaseData.descripcion || '',
        estado: databaseData.estado || 'detenido',
      });
    }
  }, [databaseData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    if (!formData.tipo.trim()) { setError('El tipo es obligatorio'); return; }
    const dataToSave = { ...formData, puerto: formData.puerto ? parseInt(formData.puerto, 10) : null };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-slate-900 border border-teal-700/50 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Save size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">{databaseData ? 'Editar Base de Datos' : 'Nueva Base de Datos'}</h2>
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
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre de la BD *</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Mi Base de Datos" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Tipo de BD *</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition" required>
              {TIPOS_BD.map(tipo => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Host</label>
              <input type="text" name="host" value={formData.host} onChange={handleChange} placeholder="localhost" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Puerto</label>
              <input type="number" name="puerto" value={formData.puerto} onChange={handleChange} placeholder="5432" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre de Base de Datos</label>
            <input type="text" name="nombre_bd" value={formData.nombre_bd} onChange={handleChange} placeholder="Ej: mi_app_db" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition font-mono text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Usuario</label>
              <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} placeholder="postgres" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition font-mono text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition font-mono text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Connection String</label>
            <input type="text" name="conexion_string" value={formData.conexion_string} onChange={handleChange} placeholder="postgresql://user:pass@localhost:5432/db" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition font-mono text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Proyecto Asociado</label>
            <input type="text" name="proyecto_id" value={formData.proyecto_id} onChange={handleChange} placeholder="ID del proyecto (opcional)" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition font-mono text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition">
              {ESTADOS.map(estado => <option key={estado.value} value={estado.value}>{estado.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción opcional..." rows={2} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition border border-slate-700/50" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-sm font-medium transition shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save size={16} />{loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
