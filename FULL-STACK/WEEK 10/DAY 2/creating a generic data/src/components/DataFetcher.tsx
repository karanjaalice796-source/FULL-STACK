import { useEffect, type ReactNode } from 'react';
import { fetchData } from '../features/dataSlice';
import { useAppDispatch, useAppSelector } from '../store';
import type { QueryParams } from '../types/types';

interface DataFetcherProps<T> {
  cacheKey: string;
  endpoint: string;
  params?: QueryParams;
  isData: (value: unknown) => value is T;
  renderData: (data: T) => ReactNode;
}

const EMPTY_PARAMS: QueryParams = {};

export function DataFetcher<T>({
  cacheKey,
  endpoint,
  params = EMPTY_PARAMS,
  isData,
  renderData,
}: DataFetcherProps<T>) {
  const dispatch = useAppDispatch();
  const entry = useAppSelector((state) => state.data.entries[cacheKey]);
  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    const request = dispatch(
      fetchData({
        key: cacheKey,
        endpoint,
        params: JSON.parse(serializedParams) as QueryParams,
      })
    );

    return () => request.abort();
  }, [cacheKey, dispatch, endpoint, serializedParams]);

  if (!entry || entry.status === 'loading' || entry.status === 'idle') {
    return <p className="message loading" role="status">Loading recipes...</p>;
  }

  if (entry.status === 'failed') {
    return <p className="message error" role="alert">{entry.error}</p>;
  }

  if (!isData(entry.data)) {
    return <p className="message error" role="alert">The API returned data in an unexpected format.</p>;
  }

  return <>{renderData(entry.data)}</>;
}
