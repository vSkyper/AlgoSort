import { VisualizationState } from 'interfaces/types';

interface BarVisualizerProps {
  state: VisualizationState;
  height?: string; // CSS height class
}

export default function BarVisualizer({
  state,
  height = 'h-32',
}: BarVisualizerProps) {
  const { array, activeIndices, sortedIndices, pivotIndex } = state;
  const maxVal = Math.max(...array, 100);

  return (
    <div className={`flex items-end justify-center gap-[2px] w-full ${height}`}>
      {array.map((value, idx) => {
        let colorClass = 'bg-neutral-500'; // Default

        // Priority: Pivot > Active > Sorted > Default
        if (idx === pivotIndex) {
          colorClass = 'bg-yellow-400'; // Pivot
        } else if (activeIndices.includes(idx)) {
          colorClass = 'bg-blue-500';
          if (activeIndices.length > 1 && idx === activeIndices[1]) {
            colorClass = 'bg-red-500'; // Second active element
          }
        } else if (sortedIndices.includes(idx)) {
          colorClass = 'bg-green-500'; // Sorted
        }

        const barHeight = `${(value / maxVal) * 100}%`;

        return (
          <div
            key={idx}
            className={`w-full rounded-t-sm duration-0 ${colorClass} opacity-90 hover:opacity-100`}
            style={{ height: barHeight }}
          />
        );
      })}
    </div>
  );
}
