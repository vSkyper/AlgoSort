import { BarVisualizer } from 'components';
import { useSorter } from 'hooks';
import { AlgorithmInfo } from 'interfaces/types';

interface SortingCardsProps {
  algorithm: AlgorithmInfo;
  isPlayingAll: boolean;
  initialData: number[];
  delay: number;
  onClick: () => void;
}

export default function SortingCards({
  algorithm,
  isPlayingAll,
  initialData,
  delay,
  onClick,
}: SortingCardsProps) {
  const { state } = useSorter({
    algorithm,
    arraySize: 20,
    initialData,
    delay,
    isPlaying: isPlayingAll,
  });

  return (
    <div
      onClick={onClick}
      className='group flex flex-col h-[300px] bg-neutral-900/30 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-neutral-900/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer relative'
    >
      <div className='p-3 sm:p-4 pb-0 text-center z-10'>
        <h3 className='text-sm sm:text-base font-bold text-neutral-200 group-hover:text-white transition-colors truncate'>
          {algorithm.name}
        </h3>
      </div>

      <div className='flex-1 px-3 sm:px-5 py-2 sm:py-3 flex items-end w-full min-h-0'>
        <BarVisualizer state={state} height='h-[85%] sm:h-full' />
      </div>

      <div className='p-3 sm:p-4 pt-0 z-10 flex flex-col justify-end'>
        <p className='text-[10px] sm:text-xs text-neutral-400 leading-tight line-clamp-3 mb-2 sm:mb-3 h-[3.75em]'>
          {algorithm.description}
        </p>

        {/* Complexity Footer */}
        <div className='pt-2 sm:pt-3 border-t border-white/10 mt-auto flex flex-col gap-1'>
          <div className='flex justify-between items-center text-[10px] sm:text-xs font-mono text-neutral-500'>
            <span className='font-bold text-neutral-400'>Time:</span>
            <span className='text-green-400 font-semibold'>
              {algorithm.timeComplexity}
            </span>
          </div>
          <div className='flex justify-between items-center text-[10px] sm:text-xs font-mono text-neutral-500'>
            <span className='font-bold text-neutral-400'>Space:</span>
            <span className='text-blue-400 font-semibold'>
              {algorithm.spaceComplexity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
