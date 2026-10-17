import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';

const TOUR_STEPS = [
  {
    title: '¡Bienvenido a AI Local Manager!',
    content: 'Esta aplicación te ayuda a gestionar todas tus herramientas de IA local desde un solo lugar. Vamos a hacer un recorrido rápido.',
    icon: '👋',
  },
  {
    title: 'Interfaces UI',
    content: 'Aquí gestionas tus interfaces de generación de imágenes como AUTOMATIC1111, ComfyUI, Forge, Fooocus y más. Cada interfaz tiene health check, QR code y favoritos.',
    icon: '🎨',
    path: '/interfaces',
  },
  {
    title: 'Servidores de Red',
    content: 'Accede a tus servidores de IA desde cualquier dispositivo: Ollama, SillyTavern, KoboldCpp. Incluye integración con API de Ollama para ver modelos en vivo.',
    icon: '🌐',
    path: '/servidores',
  },
  {
    title: 'Lanzadores',
    content: 'Gestiona Docker, PocketBase, aplicaciones NPM y Python. Guarda comandos, directorios y variables de entorno para lanzar servicios con un clic.',
    icon: '🚀',
    path: '/lanzadores',
  },
  {
    title: 'Sesiones',
    content: 'Crea presets de servicios que usas juntos. Por ejemplo, una "Sesión SDXL" puede incluir AUTOMATIC1111 + Fooocus + Ollama. ¡Actívala con un clic!',
    icon: '📦',
    path: '/sesiones',
  },
  {
    title: 'Herramientas Avanzadas',
    content: 'Monitor del Sistema, Probador de APIs, Gestor de Modelos, Generador Docker y más. Accede con Ctrl+Shift+M/T/D o desde el menú.',
    icon: '🛠️',
  },
  {
    title: 'Atajos de Teclado',
    content: 'Presiona Ctrl+K para ver todos los atajos. Usa Ctrl+1-5 para navegar entre módulos rápidamente. ¡Hazte un power user!',
    icon: '⌨️',
  },
  {
    title: '¡Listo!',
    content: 'Ya conoces lo básico. Recuerda: PocketBase debe estar corriendo en http://127.0.0.1:8090 para guardar tus configuraciones. ¡Disfruta!',
    icon: '✅',
  },
];

export default function GuidedTour() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Mostrar tour si es la primera vez
    const hasSeenTour = localStorage.getItem('has_seen_tour');
    if (!hasSeenTour) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      const nextStep = TOUR_STEPS[currentStep + 1];
      if (nextStep.path) {
        window.location.hash = nextStep.path;
      }
    } else {
      finishTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const prevStep = TOUR_STEPS[currentStep - 1];
      if (prevStep.path) {
        window.location.hash = prevStep.path;
      }
    }
  };

  const finishTour = () => {
    localStorage.setItem('has_seen_tour', 'true');
    setShowTour(false);
    window.location.hash = '/';
  };

  if (!showTour) return null;

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Tour Guiado</h3>
              <p className="text-xs text-slate-500">Paso {currentStep + 1} de {TOUR_STEPS.length}</p>
            </div>
          </div>
          <button onClick={finishTour} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="text-6xl mb-4">{step.icon}</div>
          <h2 className="text-xl font-bold text-slate-100 mb-3">{step.title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed">{step.content}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-slate-800/50">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition border border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            <span>Anterior</span>
          </button>

          <div className="flex gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-cyan-500 w-6' : idx < currentStep ? 'bg-cyan-700' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-sm font-medium transition shadow-lg shadow-cyan-500/20"
          >
            <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
            {currentStep === TOUR_STEPS.length - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
