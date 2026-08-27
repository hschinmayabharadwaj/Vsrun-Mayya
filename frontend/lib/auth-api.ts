import { API_URL } from '@/lib/api';

export async function authApiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  let token: string | null = null;

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('demo-user');
      if (stored) {
        const user = JSON.parse(stored);
        token = user.uid || null;
      }
    } catch {
      // ignore
    }
  }

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
    next: options?.method === 'GET' ? { revalidate: 60 } : undefined,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Request failed');
  }
  return json.data as T;
}
