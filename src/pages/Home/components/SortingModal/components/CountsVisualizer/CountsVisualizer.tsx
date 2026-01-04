interface CountsVisualizerProps {
  counts: number[];
  min: number;
}

export default function CountsVisualizer({
  counts,
  min,
}: CountsVisualizerProps) {
  if (!counts || counts.length === 0) return null;

  return (
    <div className='flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-white/10 mt-4'>
      <div className='text-center space-y-2'>
        <h3 className='text-lg font-bold text-white'>Counts</h3>
        <p className='text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto'>
          This array stores the frequency of each number. The index is the
          number (relative to min), and the value is its count.
        </p>
      </div>
      <div className='w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-white/30'>
        <div className='w-min min-w-full flex justify-center'>
          <div className='flex border border-white/20 rounded-lg overflow-hidden shrink-0'>
            {counts.map((count, idx) => (
              <div
                key={idx}
                className='flex flex-col border-r border-white/20 last:border-r-0 w-8 sm:w-10'
              >
                <div
                  className={`transition-colors duration-300 font-mono font-bold py-1.5 sm:py-2 text-center border-b border-white/20 text-sm sm:text-base ${
                    count > 0
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-white/5 text-white/40'
                  }`}
                >
                  {count}
                </div>
                <div className='bg-black/20 text-neutral-500 font-mono text-[10px] sm:text-xs py-1 text-center'>
                  {idx + (min || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
