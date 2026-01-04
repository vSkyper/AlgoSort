interface InfoVisualizerProps {
  description: string;
  type?:
    | 'compare'
    | 'swap'
    | 'move'
    | 'info'
    | 'success'
    | 'scatter'
    | 'gather';
}

export default function InfoVisualizer({
  description,
  type = 'info',
}: InfoVisualizerProps) {
  let colors =
    'bg-blue-500/10 border-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]';
  if (type === 'swap') {
    colors =
      'bg-amber-500/10 border-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
  } else if (type === 'compare') {
    colors =
      'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]';
  } else if (type === 'move') {
    colors =
      'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-300 shadow-[0_0_15px_rgba(217,70,239,0.1)]';
  } else if (type === 'info') {
    colors =
      'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]';
  } else if (type === 'success') {
    colors =
      'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
  } else if (type === 'scatter') {
    colors =
      'bg-rose-500/10 border-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
  } else if (type === 'gather') {
    colors =
      'bg-teal-500/10 border-teal-500/20 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.1)]';
  }

  if (!description) {
    colors = 'bg-neutral-500/10 border-neutral-500/20 text-neutral-300';
  }

  return (
    <div
      className={`mt-2 sm:mt-4 p-2 sm:p-4 rounded-xl text-center transition-all duration-300 border ${colors}`}
    >
      <span className='font-medium text-xs sm:text-base flex items-center justify-center min-h-[1.5em]'>
        {description || <span className='opacity-40 tracking-widest'>...</span>}
      </span>
    </div>
  );
}
