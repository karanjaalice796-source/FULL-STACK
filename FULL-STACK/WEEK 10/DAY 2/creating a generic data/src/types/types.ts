export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface DataEntry {
  data: unknown | null;
  status: Status;
  error: string | null;
}

export interface DataState {
  entries: Record<string, DataEntry>;
}

export type QueryParams = Record<string, string | number | boolean>;

export interface FetchArgs {
  key: string;
  endpoint: string;
  params?: QueryParams;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
}

export interface RecipeSearchResponse {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}
