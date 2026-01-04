import { BarVisualizer } from 'components';
import { useSorter, useLockBodyScroll } from 'hooks';
import { AlgorithmInfo } from 'interfaces/types';
import {
  X,
  Play,
  RotateCcw,
  Pause,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { CodeBlock, CountsVisualizer, InfoVisualizer } from './components';
import { createPortal } from 'react-dom';

interface SortingModalProps {
  algorithm: AlgorithmInfo;
  onClose: () => void;
}

export default function SortingModal({
  algorithm,
  onClose,
}: SortingModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useLockBodyScroll();

  const baseDelay = 200;
  const currentDelay = baseDelay / speed;

  const { state, reset } = useSorter({
    algorithm,
    arraySize: 20,
    delay: currentDelay,
    isPlaying: isPlaying,
    isMuted,
  });

  useEffect(() => {
    reset();
    setIsPlaying(true);
  }, []);

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePlay = () => {
    if (state.isFinished) {
      reset();
      // Small timeout to ensure state reset propagates before starting
      setTimeout(() => setIsPlaying(true), 0);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300'>
      <div className='bg-black/80 border border-white/10 backdrop-blur-2xl w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/5'>
        <div className='px-4 py-3 sm:px-6 sm:py-4 border-b border-white/5 flex justify-between items-center shrink-0'>
          <div>
            <h2 className='text-lg sm:text-2xl font-bold text-white tracking-tight'>
              {algorithm.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white shrink-0'
          >
            <X size={20} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8'>
          <div className='space-y-4 sm:space-y-6 flex flex-col'>
            {/* Description */}
            <p className='text-neutral-300 text-xs sm:text-sm leading-relaxed'>
              {algorithm.description}
            </p>
            {/* Complexity Cards */}
            <div className='grid grid-cols-2 gap-2 sm:gap-4'>
              <div className='bg-green-500/5 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)] p-2 sm:p-4 rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1'>
                <span className='text-[8px] sm:text-[10px] uppercase tracking-widest text-green-300/60 font-bold'>
                  Time Complexity
                </span>
                <span className='text-green-400 font-mono text-base sm:text-xl font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]'>
                  {algorithm.timeComplexity}
                </span>
              </div>
              <div className='bg-blue-500/5 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] p-2 sm:p-4 rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1'>
                <span className='text-[8px] sm:text-[10px] uppercase tracking-widest text-blue-300/60 font-bold'>
                  Space Complexity
                </span>
                <span className='text-blue-400 font-mono text-base sm:text-xl font-bold drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]'>
                  {algorithm.spaceComplexity}
                </span>
              </div>
            </div>

            <div className='bg-black/40 rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-6 flex-1 min-h-[200px] sm:min-h-[250px] flex flex-col justify-end relative overflow-hidden shadow-inner'>
              <BarVisualizer state={state} height='h-full' />
            </div>
            <InfoVisualizer
              description={state.metadata?.description}
              type={state.metadata?.type}
            />
            {state.auxiliaryArray && (
              <CountsVisualizer
                counts={state.auxiliaryArray}
                min={state.metadata?.min || 0}
              />
            )}
            {/* Controls */}
            <div className='flex flex-col gap-3 sm:gap-4 shrink-0 bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5'>
              <div className='flex justify-center gap-2 sm:gap-3 items-center'>
                <button
                  onClick={handlePlay}
                  className={`group flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-300 shadow-lg flex-1 justify-center whitespace-nowrap border text-xs sm:text-sm select-none ${
                    state.isFinished
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20 border-transparent hover:scale-[1.02]'
                      : isPlaying
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-white/10 hover:border-white/20'
                      : 'bg-white text-black hover:bg-neutral-200 shadow-white/10 border-transparent hover:scale-[1.02]'
                  }`}
                >
                  {state.isFinished ? (
                    <RotateCcw
                      size={14}
                      className='sm:w-[16px] sm:h-[16px] group-hover:rotate-180 transition-transform duration-500'
                    />
                  ) : isPlaying ? (
                    <Pause
                      size={14}
                      className='fill-current sm:w-[16px] sm:h-[16px]'
                    />
                  ) : (
                    <Play
                      size={14}
                      className='fill-current sm:w-[16px] sm:h-[16px]'
                    />
                  )}
                  {state.isFinished
                    ? 'Restart'
                    : isPlaying
                    ? 'Pause'
                    : 'Start Sorting'}
                </button>

                {!state.isFinished && (
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      reset();
                    }}
                    className='group p-2.5 sm:p-3 bg-neutral-900 border border-white/10 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all duration-300 hover:border-white/20 select-none'
                    title='Reset'
                  >
                    <RotateCcw
                      size={16}
                      className='sm:w-[18px] sm:h-[18px] group-hover:-rotate-180 transition-transform duration-500'
                    />
                  </button>
                )}
              </div>

              <div className='flex justify-between items-center px-1 sm:px-2'>
                <span className='text-[9px] sm:text-[10px] text-neutral-500 font-bold uppercase tracking-widest'>
                  Speed
                </span>
                <div className='flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5'>
                  {[0.25, 0.5, 1, 2, 4, 8].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`relative px-2.5 py-1 sm:px-4 sm:py-1.5 rounded sm:rounded-md text-[9px] sm:text-[10px] font-bold transition-all duration-300 select-none ${
                        speed === s
                          ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                          : 'text-neutral-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <div className='h-4 w-px bg-white/10 mx-1 sm:mx-2'></div>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 sm:p-2 rounded-lg border transition-all duration-300 ${
                    !isMuted
                      ? 'bg-white/10 border-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                      : 'bg-black/40 border-white/5 text-neutral-500 hover:text-white hover:bg-white/5'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX size={14} className='sm:w-4 sm:h-4' />
                  ) : (
                    <Volume2 size={14} className='sm:w-4 sm:h-4' />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className='flex flex-col h-full overflow-hidden min-h-[250px] sm:min-h-[300px] bg-[#0f0f0f] rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl ring-1 ring-black/50'>
            <div className='px-3 py-2 sm:px-4 sm:py-3 border-b border-white/5 bg-[#1a1a1a] flex justify-between items-center relative'>
              {/* macOS Window Controls */}
              <div className='flex gap-1.5 sm:gap-2 group'>
                <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] group-hover:bg-[#ff5f56] transition-colors'></div>
                <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] group-hover:bg-[#ffbd2e] transition-colors'></div>
                <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] border border-[#1aab29] group-hover:bg-[#27c93f] transition-colors'></div>
              </div>

              {/* Centered Title */}
              <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 opacity-60'>
                <span className='hidden sm:block text-[10px] sm:text-xs font-mono font-medium text-neutral-400'>
                  algorithm.ts
                </span>
              </div>

              <a
                href={algorithm.reference}
                target='_blank'
                rel='noopener noreferrer'
                className='text-[10px] sm:text-xs text-neutral-500 hover:text-white flex items-center gap-1 font-medium transition-colors'
              >
                Docs <ExternalLink size={10} />
              </a>
            </div>
            <div className='flex-1 overflow-hidden relative'>
              <CodeBlock code={algorithm.code} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
