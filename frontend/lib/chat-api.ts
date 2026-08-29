import { API_URL } from '@/lib/api';

export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatReply {
  answer: string;
  intent: string;
  matches?: string[];
  links?: ChatLink[];
}

export async function askAssistant(message: string): Promise<ChatReply> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error ?? 'Request failed');
  return json.data as ChatReply;
}