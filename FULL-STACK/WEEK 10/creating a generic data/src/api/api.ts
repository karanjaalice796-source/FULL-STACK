import type { QueryParams } from '../types/types';

const HOST = 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com';
const BASE_URL = `https://${HOST}`;

export async function fetchFromApi<T>(
  endpoint: string,
  params: QueryParams = {},
  signal?: AbortSignal
): Promise<T> {
  const apiKey = import.meta.env.VITE_RAPIDAPI_KEY;
  if (!apiKey) {
    throw new Error('Add your RapidAPI key to the VITE_RAPIDAPI_KEY value in .env.');
  }

  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();
  const response = await fetch(`${BASE_URL}${endpoint}${query ? `?${query}` : ''}`, {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': HOST,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}
