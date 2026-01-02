import { BarVisualizer } from 'components';
import { useSorter } from 'hooks';
import { AlgorithmInfo } from 'interfaces/types';
import { X, Play, RotateCw, Pause, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CodeBlock } from './components';

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

  const baseDelay = 50;
  const currentDelay = baseDelay / speed;

  const { state, reset } = useSorter({
    algorithm,
    arraySize: 50,
    delay: currentDelay,
    isPlaying: isPlaying,
  });

  useEffect(() => {
    reset();
    setIsPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200'>
      <div className='bg-[#0a0a0a]/95 border border-white/10 backdrop-blur-xl w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden'>
        <div className='p-4 md:p-6 border-b border-white/10 flex justify-between items-start md:items-center shrink-0'>
          <div>
            <h2 className='text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight'>
              {algorithm.name}
            </h2>
            <p className='text-neutral-400 text-xs md:text-sm max-w-2xl line-clamp-2 md:line-clamp-none'>
              {algorithm.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white shrink-0 -mr-2'
          >
            <X size={24} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8'>
          <div className='space-y-4 md:space-y-6 flex flex-col'>
            <div className='flex items-center gap-4 bg-white/5 border border-white/10 p-3 md:p-4 rounded-lg shrink-0'>
              <div className='flex-1 text-center'>
                <span className='block text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1'>
                  Time Complexity
                </span>
                <span className='text-blue-400 font-mono text-base md:text-lg font-bold'>
                  {algorithm.timeComplexity}
                </span>
              </div>
              <div className='w-px h-8 bg-white/10'></div>
              <div className='flex-1 text-center'>
                <span className='block text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-1'>
                  Space Complexity
                </span>
                <span className='text-purple-400 font-mono text-base md:text-lg font-bold'>
                  {algorithm.spaceComplexity}
                </span>
              </div>
            </div>

            <div className='bg-black/50 rounded-xl border border-white/10 p-4 md:p-6 flex-1 min-h-[250px] md:min-h-[300px] flex flex-col justify-end relative overflow-hidden'>
              <BarVisualizer state={state} height='h-full' />
            </div>

            <div className='flex flex-col gap-4 shrink-0'>
              <div className='flex justify-center gap-3 md:gap-4 items-center'>
                <button
                  onClick={handlePlay}
                  className={`flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-bold transition-all shadow-lg flex-1 md:flex-none justify-center ${
                    state.isFinished
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                      : isPlaying
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10'
                      : 'bg-white text-black hover:bg-neutral-200 shadow-white/10'
                  }`}
                >
                  {state.isFinished ? (
                    <RotateCw size={18} />
                  ) : isPlaying ? (
                    <Pause size={18} className='fill-white' />
                  ) : (
                    <Play size={18} className='fill-black' />
                  )}
                  {state.isFinished
                    ? 'Restart'
                    : isPlaying
                    ? 'Pause'
                    : 'Start Sorting'}
                </button>

                {!state.isFinished && (
                  <button
                    onClick={reset}
                    className='p-2.5 md:p-3 bg-neutral-900 border border-white/10 rounded-lg hover:bg-neutral-800 text-white transition-colors'
                    title='Reset'
                  >
                    <RotateCw size={18} />
                  </button>
                )}
              </div>

              <div className='flex justify-center items-center gap-2'>
                <span className='text-xs text-neutral-500 font-medium uppercase tracking-wider mr-2'>
                  Speed
                </span>
                <div className='flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10 w-full md:w-auto justify-center'>
                  {[0.5, 1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                        speed === s
                          ? 'bg-white text-black shadow-sm'
                          : 'text-neutral-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col h-full overflow-hidden min-h-[300px]'>
            <h3 className='text-sm font-semibold text-neutral-400 mb-3 uppercase tracking-wider flex items-center justify-between shrink-0'>
              <span>Code Implementation</span>
              <a
                href={algorithm.reference}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 normal-case tracking-normal font-normal'
              >
                <ExternalLink size={12} /> Reference
              </a>
            </h3>
            <div className='flex-1 overflow-hidden rounded-lg border border-neutral-800'>
              <CodeBlock code={algorithm.code} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
