import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const TIPOS_SERVIDOR = [
  { value: 'chatbox_ui', label: 'Chatbox UI (SillyTavern, etc.)' },
  { value: 'api_backend', label: 'API Backend (Ollama, KoboldCpp, etc.)' },
  { value: 'sd_server', label: 'SD Server (A1111 --listen)' },
];

const ESTADOS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

export default function ServerForm({ serverData, onSave, onCancel, loading }) {
  const [formData, setFormData] = useState({
    nombre: '', tipo_servidor: 'api_backend', ip_red: '', puerto: '', url_acceso: '', descripcion: '', modelos_disponibles: '', estado: 'activo',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (serverData) {
      setFormData({
        nombre: serverData.nombre || '', tipo_servidor: serverData.tipo_servidor || 'api_backend',
        ip_red: serverData.ip_red || '', puerto: serverData.puerto || '', url_acceso: serverData.url_acceso || '',
        descripcion: serverData.descripcion || '', modelos_disponibles: serverData.modelos_disponibles || '', estado: serverData.estado || 'activo',
      });
    }
  }, [serverData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    if (name === 'ip_red' || name === 'puerto') {
      const ip = name === 'ip_red' ? value : formData.ip_red;
      const puerto = name === 'puerto' ? value : formData.puerto;
      if (ip && puerto) setFormData(prev => ({ ...prev, [name]: value, url_acceso: `http://${ip}:${puerto}` }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) { setError('El nombre es obligatorio'); return; }
    if (!formData.ip_red.trim()) { setError('La IP de red es obligatoria'); return; }
    if (!formData.puerto) { setError('El puerto es obligatorio'); return; }
    if (!formData.url_acceso.trim()) { setError('La URL de acceso es obligatoria'); return; }
    onSave({ ...formData, puerto: parseInt(formData.puerto, 10) });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto bg-slate-900 border border-purple-700/50 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"><Save size={20} className="text-white" /></div>
            <h2 className="text-xl font-bold text-slate-100">{serverData ? 'Editar Servidor' : 'Registrar Servidor'}</h2>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-3 bg-red-950/50 border border-red-700/30 rounded-lg p-4"><AlertCircle size={18} className="text-red-400 shrink-0" /><span className="text-sm text-red-300">{error}</span></div>
          )}
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Nombre *</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Ollama Local" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition" required /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Tipo de Servicio *</label><select name="tipo_servidor" value={formData.tipo_servidor} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition" required>{TIPOS_SERVIDOR.map(tipo => <option key={tipo.value} value={tipo.value}>{tipo.label}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">IP de Red Local *</label><input type="text" name="ip_red" value={formData.ip_red} onChange={handleChange} placeholder="Ej: 192.168.1.100" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition font-mono" required /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Puerto *</label><input type="number" name="puerto" value={formData.puerto} onChange={handleChange} placeholder="Ej: 11434" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition" required /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">URL de Acceso *</label><input type="url" name="url_acceso" value={formData.url_acceso} onChange={handleChange} placeholder="Ej: http://192.168.1.100:11434" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition" required /><p className="text-xs text-slate-500 mt-1.5">Se genera automáticamente al cambiar IP y puerto</p></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Estado</label><select name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition">{ESTADOS.map(estado => <option key={estado.value} value={estado.value}>{estado.label}</option>)}</select></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Descripción</label><textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Descripción opcional del servidor..." rows={2} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition resize-none" /></div>
          <div><label className="block text-xs font-medium text-slate-400 mb-1.5">Modelos Disponibles</label><textarea name="modelos_disponibles" value={formData.modelos_disponibles} onChange={handleChange} placeholder={"Ej:\nllama3.1:latest\nmistral:latest\ncodellama:7b"} rows={4} className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition resize-none font-mono text-sm" /><p className="text-xs text-slate-500 mt-1.5">Un modelo por línea</p></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition border border-slate-700/50" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium transition shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"><Save size={16} />{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
