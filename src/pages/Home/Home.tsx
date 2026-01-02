import { useState, useEffect } from 'react';
import { ALGORITHMS } from '../../constants/constants';
import SortingCard from './components/SortingCards/SortingCards';
import SortingModal from './components/SortingModal/SortingModal';
import { AlgorithmInfo } from '../../interfaces/types';
import { Play, RotateCcw, Pause } from 'lucide-react';

export default function Home() {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmInfo | null>(null);
  const [resetKey, setResetKey] = useState(0);
  // Shared array data for all cards
  const [sharedArray, setSharedArray] = useState<number[]>([]);
  const [speed, setSpeed] = useState(1);

  // Generate initial random data once
  useEffect(() => {
    // Increased data size to 30 (approx 2x previous size)
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
    <div className='min-h-screen bg-black text-neutral-200 font-sans p-2 sm:p-4 lg:px-6 selection:bg-blue-500/30 flex flex-col relative overflow-hidden'>
      {/* Grid Background */}
      <div className='fixed inset-0 z-0 pointer-events-none'>
        {/* Adjusted grid opacity to be slightly less visible (25) */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-size-[24px_24px] opacity-25'></div>

        {/* Expanded Gradients: reduced opacity for subtler effect */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none'></div>
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none'></div>
      </div>

      {/* Header */}
      <div className='max-w-[1800px] w-full mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 relative z-10'>
        <div className='text-center md:text-left'>
          <h1 className='text-3xl md:text-4xl font-bold text-white tracking-tighter mb-1'>
            AlgoSort
          </h1>
          <p className='text-neutral-500 text-xs md:text-sm font-medium'>
            Visualizing Sorting Algorithms.
          </p>
        </div>

        <div className='flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto'>
          {/* Speed Controls */}
          <div className='flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 w-full sm:w-auto justify-center backdrop-blur-sm'>
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`flex-1 sm:flex-none px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-bold transition-all ${
                  speed === s
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className='flex items-center gap-2 w-full sm:w-auto justify-center'>
            <button
              onClick={togglePlayAll}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 md:px-6 md:py-2.5 rounded-full font-bold transition-all shadow-lg text-xs md:text-sm whitespace-nowrap ${
                isPlayingAll
                  ? 'bg-neutral-800 text-white border border-white/10 hover:bg-neutral-700'
                  : 'bg-white text-black hover:bg-neutral-200 hover:scale-105 hover:shadow-white/10'
              }`}
            >
              {isPlayingAll ? (
                <Pause size={14} className='fill-white' />
              ) : (
                <Play size={14} className='fill-black' />
              )}
              {isPlayingAll ? 'Pause' : 'Play All'}
            </button>

            <button
              onClick={handleResetAll}
              className='flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 md:px-6 md:py-2.5 rounded-full font-bold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm text-xs md:text-sm'
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className='max-w-[1800px] w-full mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4 grow content-start relative z-10 pb-8'>
        {ALGORITHMS.map((algo) => (
          <SortingCard
            key={`${algo.id}-${resetKey}`}
            algorithm={algo}
            isPlayingAll={isPlayingAll}
            initialData={sharedArray}
            delay={80 / speed}
            onClick={() => setSelectedAlgorithm(algo)}
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
