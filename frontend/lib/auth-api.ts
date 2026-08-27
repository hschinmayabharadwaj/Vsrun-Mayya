import { API_URL } from './api';

export async function authApiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser
    ? localStorage.getItem('demo-token') || localStorage.getItem('citizen-auth-token')
    : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || (json && json.success === false)) {
    throw new Error(json.error || json.detail || json.message || 'Request failed');
  }
  return (json.data !== undefined ? json.data : json) as T;
}
