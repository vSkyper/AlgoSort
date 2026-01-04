import { AlgorithmInfo, VisualizationState } from 'interfaces/types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { soundGenerator } from 'utils/soundGenerator';

interface UseSorterProps {
  algorithm: AlgorithmInfo;
  arraySize?: number;
  initialData?: number[];
  delay?: number;
  isPlaying: boolean;
  onFinish?: () => void;
  isMuted?: boolean;
}

const generateRandomArray = (size: number) => {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10
  );
};

export const useSorter = ({
  algorithm,
  arraySize = 20,
  initialData,
  delay = 50,
  isPlaying,
  onFinish,
  isMuted = false,
}: UseSorterProps) => {
  const [state, setState] = useState<VisualizationState>({
    array: [],
    activeIndices: [],
    sortedIndices: [],
    isFinished: false,
  });

  const generatorRef = useRef<Generator<any, void, unknown> | null>(null);
  const timeoutRef = useRef<any>(null);

  const reset = useCallback(() => {
    // If initialData is provided, use it. Otherwise generate random.
    const newArr = initialData
      ? [...initialData]
      : generateRandomArray(arraySize);

    setState({
      array: newArr,
      activeIndices: [],
      sortedIndices: [],
      isFinished: false,
    });
    generatorRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [arraySize, initialData]);

  useEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    // If not playing or finished, or if array is not yet initialized, do nothing
    if (!isPlaying || state.isFinished || state.array.length === 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    if (!generatorRef.current) {
      // Start the generator
      generatorRef.current = algorithm.algorithm([...state.array]);
    }

    const runStep = () => {
      if (!generatorRef.current) return;

      const { value, done } = generatorRef.current.next();

      if (done) {
        setState((prev) => ({
          ...prev,
          isFinished: true,
          activeIndices: [],
          sortedIndices: prev.array.map((_, i) => i),
        }));
        if (onFinish) onFinish();
        return;
      }

      if (value) {
        setState({
          array: value.array,
          activeIndices: value.activeIndices,
          sortedIndices: value.sortedIndices,
          pivotIndex: value.pivotIndex,
          auxiliaryArray: value.auxiliaryArray,
          metadata: value.metadata,
          isFinished: false,
        });

        // Play sound if not muted and we have active indices to visualize
        if (!isMuted && value.activeIndices.length > 0) {
          const val = value.array[value.activeIndices[0]];
          // Estimate max value around 100 based on generation logic
          soundGenerator.playTone(val, 100);
        }

        timeoutRef.current = setTimeout(runStep, delay);
      }
    };

    // Run first step immediately to avoid initial delay if desired,
    // but usually setTimeout is better for consistent timing.
    // Ensure we don't stack timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(runStep, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    isPlaying,
    algorithm,
    delay,
    state.isFinished,
    state.array.length,
    onFinish,
    isMuted,
  ]);

  return { state, reset };
};
