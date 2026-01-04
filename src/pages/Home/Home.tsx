import { useState, useEffect } from 'react';
import { Play, RotateCcw, Pause, Volume2, VolumeX } from 'lucide-react';
import { AlgorithmInfo } from 'interfaces/types';
import { ALGORITHMS } from 'constants/constants';
import { SortingCard, SortingModal } from './components';

export default function Home() {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmInfo | null>(null);
  const [resetKey, setResetKey] = useState(0);
  // Shared array data for all cards
  const [sharedArray, setSharedArray] = useState<number[]>([]);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Generate initial random data once
  useEffect(() => {
    setSharedArray(
      Array.from({ length: 30 }, () => Math.floor(Math.random() * 90) + 10)
    );
  }, []);

  const togglePlayAll = () => {
    setIsPlayingAll((prev) => !prev);
  };

  const handleResetAll = () => {
    setIsPlayingAll(false);
    // Regenerate shared data so all cards get the NEW same random data
    setSharedArray(
      Array.from({ length: 30 }, () => Math.floor(Math.random() * 90) + 10)
    );
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className='min-h-screen bg-black text-neutral-200 font-sans p-2 sm:p-4 lg:px-4 selection:bg-blue-500/30 flex flex-col relative overflow-hidden'>
      {/* Grid Background */}
      <div className='fixed inset-0 z-0 pointer-events-none'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-size-[24px_24px] opacity-40'></div>
      </div>

      {/* Floating Header */}
      <header className='sticky top-2 sm:top-4 z-50 max-w-[1800px] w-full mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 py-2 px-3 sm:px-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md shadow-sm select-none'>
        <div className='text-center sm:text-left flex items-baseline gap-3'>
          <h1 className='text-2xl sm:text-2xl font-bold tracking-tight text-white'>
            AlgoSort
          </h1>
          <p className='text-neutral-500 text-xs font-medium tracking-wide hidden sm:block'>
            Visualizing Sorting Algorithms
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto'>
          <div className='flex items-center gap-2'>
            {/* Speed Controls */}
            <div className='flex items-center p-1 rounded-lg border border-white/5 bg-black/40 backdrop-blur-sm'>
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`relative px-3 py-1 rounded-md text-[10px] sm:text-xs font-bold transition-all duration-300 select-none ${
                    speed === s
                      ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)] ring-1 ring-white/20'
                      : 'text-neutral-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-lg border transition-all duration-300 select-none ${
                !isMuted
                  ? 'bg-white/10 border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                  : 'bg-black/40 border-white/5 text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          <div className='flex items-center gap-2 w-full sm:w-auto justify-center'>
            <button
              onClick={togglePlayAll}
              className={`group flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg font-bold transition-all duration-300 shadow-md text-xs whitespace-nowrap select-none ${
                isPlayingAll
                  ? 'bg-neutral-800 text-white border border-white/10 hover:bg-neutral-700'
                  : 'bg-white text-black hover:bg-neutral-200 hover:scale-[1.02]'
              }`}
            >
              {isPlayingAll ? (
                <Pause size={14} className='fill-current' />
              ) : (
                <Play size={14} className='fill-current' />
              )}
              {isPlayingAll ? 'Pause' : 'Play All'}
            </button>

            <button
              onClick={handleResetAll}
              className='group flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg font-bold bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-sm text-xs select-none'
            >
              <RotateCcw
                size={14}
                className='group-hover:-rotate-180 transition-transform duration-500'
              />
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className='max-w-[1800px] w-full mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4 grow content-start relative z-10 pb-8'>
        {ALGORITHMS.map((algo) => (
          <SortingCard
            key={`${algo.id}-${resetKey}`}
            algorithm={algo}
            isPlayingAll={isPlayingAll}
            initialData={sharedArray}
            delay={80 / speed}
            onClick={() => setSelectedAlgorithm(algo)}
            isMuted={isMuted || !!selectedAlgorithm}
          />
        ))}
      </div>

      {/* Modal Overlay */}
      {selectedAlgorithm && (
        <SortingModal
          algorithm={selectedAlgorithm}
          onClose={() => setSelectedAlgorithm(null)}
        />
      )}
    </div>
  );
}
