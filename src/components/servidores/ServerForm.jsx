// Formulario Modal para crear/editar servidores de red local
import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

// Opciones de tipo de servidor
const TIPOS_SERVIDOR = [
  { value: 'chatbox_ui', label: 'Chatbox UI (SillyTavern, etc.)' },
  { value: 'api_backend', label: 'API Backend (Ollama, KoboldCpp, etc.)' },
  { value: 'sd_server', label: 'SD Server (A1111 --listen)' },
];

// Opciones de estado
const ESTADOS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

export default function ServerForm({ serverData, onSave, onCancel, loading }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_servidor: 'api_backend',
    ip_red: '',
    puerto: '',
    url_acceso: '',
    descripcion: '',
    modelos_disponibles: '',
    estado: 'activo',
  });

  const [error, setError] = useState('');

  // Si se pasa un servidor existente, rellenar el formulario
  useEffect(() => {
    if (serverData) {
      setFormData({
        nombre: serverData.nombre || '',
        tipo_servidor: serverData.tipo_servidor || 'api_backend',
        ip_red: serverData.ip_red || '',
        puerto: serverData.puerto || '',
        url_acceso: serverData.url_acceso || '',
        descripcion: serverData.descripcion || '',
        modelos_disponibles: serverData.modelos_disponibles || '',
        estado: serverData.estado || 'activo',
      });
    }
  }, [serverData]);

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Limpiar error al editar

    // Auto-generar URL si se cambia IP o puerto
    if (name === 'ip_red' || name === 'puerto') {
      const ip = name === 'ip_red' ? value : formData.ip_red;
      const puerto = name === 'puerto' ? value : formData.puerto;
      if (ip && puerto) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          url_acceso: `http://${ip}:${puerto}`,
        }));
      }
    }
  };

  // Validar y enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (!formData.ip_red.trim()) {
      setError('La IP de red es obligatoria');
      return;
    }
    if (!formData.puerto) {
      setError('El puerto es obligatorio');
      return;
    }
    if (!formData.url_acceso.trim()) {
      setError('La URL de acceso es obligatoria');
      return;
    }

    // Preparar datos para enviar
    const dataToSave = {
      ...formData,
      puerto: parseInt(formData.puerto, 10),
    };

    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {serverData ? 'Editar Servidor' : 'Registrar Servidor'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo del formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Mensaje de error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700 rounded-lg p-3">
              <AlertCircle size={18} className="text-red-400 shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Ollama Local"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400"
              required
            />
          </div>

          {/* Tipo de Servicio */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Tipo de Servicio *
            </label>
            <select
              name="tipo_servidor"
              value={formData.tipo_servidor}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              required
            >
              {TIPOS_SERVIDOR.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* IP de Red Local */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              IP de Red Local *
            </label>
            <input
              type="text"
              name="ip_red"
              value={formData.ip_red}
              onChange={handleChange}
              placeholder="Ej: 192.168.1.100"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400"
              required
            />
          </div>

          {/* Puerto */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Puerto *
            </label>
            <input
              type="number"
              name="puerto"
              value={formData.puerto}
              onChange={handleChange}
              placeholder="Ej: 11434"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400"
              required
            />
          </div>

          {/* URL de Acceso */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              URL de Acceso *
            </label>
            <input
              type="url"
              name="url_acceso"
              value={formData.url_acceso}
              onChange={handleChange}
              placeholder="Ej: http://192.168.1.100:11434"
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Se genera automáticamente al cambiar IP y puerto
            </p>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            >
              {ESTADOS.map(estado => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción opcional del servidor..."
              rows={2}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400 resize-none"
            />
          </div>

          {/* Modelos Disponibles */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Modelos Disponibles
            </label>
            <textarea
              name="modelos_disponibles"
              value={formData.modelos_disponibles}
              onChange={handleChange}
              placeholder={"Ej:\nllama3.1:latest\nmistral:latest\ncodellama:7b"}
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none placeholder-slate-400 resize-none font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-1">
              Un modelo por línea
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
