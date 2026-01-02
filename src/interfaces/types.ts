export type SortGenerator = Generator<
  {
    array: number[];
    activeIndices: number[];
    sortedIndices: number[];
    pivotIndex?: number;
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
  isFinished: boolean;
}
