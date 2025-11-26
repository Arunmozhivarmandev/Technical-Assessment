// lib/apiClient.ts

import { get } from "http";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiRequestOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number>;
  cache?: RequestCache;
  token?: string; // pass server-side token here
}


import { getTokenFromCookies } from '@/app/actions/getToken';

export async function apiRequest(
  endpoint: string,
  options: ApiRequestOptions = {}
) {
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    cache = 'no-store',
 } = options;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

    const token = await getTokenFromCookies();

  // Build query string
  const queryString = params
    ? '?' +
      new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : '';

  // Detect FormData
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  // Build headers
  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(`${baseUrl}${endpoint}${queryString}`, {
    method,
    headers: finalHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    cache,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw error;
  }

  return res.json();
}
