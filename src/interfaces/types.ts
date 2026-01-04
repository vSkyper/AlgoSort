export type SortGenerator = Generator<
  {
    array: number[];
    activeIndices: number[];
    sortedIndices: number[];
    pivotIndex?: number;
    auxiliaryArray?: number[];
    metadata?: Record<string, any>;
  },
  void,
  unknown
>;

export type SortingAlgorithm = (array: number[]) => SortGenerator;

export interface AlgorithmInfo {
  id: string;
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  reference: string;
  algorithm: SortingAlgorithm;
}

export interface VisualizationState {
  array: number[];
  activeIndices: number[]; // Indices currently being compared/swapped
  sortedIndices: number[]; // Indices that are finalized
  pivotIndex?: number; // Specific for QuickSort visualization
  auxiliaryArray?: number[]; // For Counting Sort, Bucket Sort, etc.
  metadata?: Record<string, any>; // Generic metadata for specific visualizers
  isFinished: boolean;
}
