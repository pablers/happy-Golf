import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  TrendingUp, 
  Target, 
  Activity,
  History,
  Clock
} from 'lucide-react';
import { useRounds } from '../contexts/RoundsContext';
import { useNavigate } from 'react-router-dom';

const AnalysisView: React.FC = () => {
  const { rounds, isLoading } = useRounds();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <History className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay rondas registradas</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-8">
          Tus estadísticas aparecerán aquí una vez que completes tu primera ronda de golf.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-green-500 text-white font-bold rounded-full shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all"
        >
          Empezar primera ronda
        </button>
      </div>
    );
  }

  // Calculate some aggregate stats
  const totalRounds = rounds.length;
  const avgStrokes = Math.round(rounds.reduce((acc, r) => acc + (r.totalStrokes || 0), 0) / totalRounds);
  const bestRound = [...rounds].sort((a, b) => (a.totalStrokes || 999) - (b.totalStrokes || 999))[0];

  return (
    <div className="flex-grow bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-8">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <header>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Anǭlisis de Juego</h2>
          <p className="text-gray-500 dark:text-gray-400">Progreso y estadísticas detalladas</p>
        </header>

        {/* Highlight Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{avgStrokes}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Media Golpes</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
              <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">{bestRound.totalStrokes}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mejor Ronda</div>
          </motion.div>
        </div>

        {/* Latest Rounds List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              ǧltimas Rondas
            </h3>
            <button className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest hover:opacity-70">
              Ver Todas
            </button>
          </div>

          <div className="space-y-3">
            {rounds.map((round, index) => (
              <motion.div
                key={round.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/analysis/${round.id}`)}
                className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">{new Date(round.date).toLocaleString('es-ES', { month: 'short' })}</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white leading-none mt-1">{new Date(round.date).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{round.courseName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {round.roundType === 'full' ? '18 hoyos' : '9 hoyos'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <div className="text-xl font-black text-gray-900 dark:text-white">{round.totalStrokes}</div>
                    <div className={clsx(
                      "text-[10px] font-bold uppercase",
                      (round.toPar || 0) <= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {(round.toPar || 0) > 0 ? `+${round.toPar}` : round.toPar}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Global Stats/Chart Section Mock */}
        <section className="bg-green-600 rounded-3xl p-6 text-white shadow-xl shadow-green-600/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-bold">Evolucin HCP</h3>
            </div>
            <div className="px-2 py-1 bg-white/20 rounded-md text-[10px] font-bold uppercase tracking-wider">
              ǧltimos 30 das
            </div>
          </div>
          
          {/* Mock Chart Visualization */}
          <div className="h-32 flex items-end justify-between gap-1 mb-6">
            {[40, 65, 45, 80, 55, 90, 75, 85].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-white/30 rounded-t-sm relative group cursor-help"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-green-600 px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  24.5
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-white/20">
            <div>
              <span className="text-white/60 text-xs font-bold uppercase block mb-1">Handicap Actual</span>
              <span className="text-2xl font-black">23.2</span>
            </div>
            <div className="text-right">
              <span className="text-white/60 text-xs font-bold uppercase block mb-1">Mejora</span>
              <span className="text-xl font-bold text-green-200">-1.3</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalysisView;
