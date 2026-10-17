import SystemMonitor from '../components/monitor/SystemMonitor.jsx';
import ApiTester from '../components/api-tester/ApiTester.jsx';
import ModelManager from '../components/models/ModelManager.jsx';
import CostDashboard from '../components/costs/CostDashboard.jsx';
import HuggingFaceBrowser from '../components/huggingface/HuggingFaceBrowser.jsx';
import DockerCommandBuilder from '../components/docker/DockerCommandBuilder.jsx';
import { Activity, Zap, Boxes, DollarSign, Search, Container } from 'lucide-react';

export default function Herramientas() {
  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Herramientas Avanzadas</h1>
          <p className="text-sm text-slate-400 mt-1">Monitor, APIs, Modelos, Docker, HuggingFace y más</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SystemMonitor />
        <ApiTester />
        <ModelManager />
        <DockerCommandBuilder />
        <HuggingFaceBrowser />
        <CostDashboard />
      </div>
    </div>
  );
}
