'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/Icon';
import { askAssistant, type ChatLink } from '@/lib/chat-api';

interface WidgetMessage {
  role: 'user' | 'assistant';
  text: string;
  links?: ChatLink[];
}

const SUGGESTIONS = [
  'How do I get an income certificate?',
  'Emergency helplines',
  'How to track my application?',
];

const STORAGE_KEY = 'chat-log';

export function ChatWidget() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<WidgetMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [offsetUp, setOffsetUp] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const transition = reduceMotion ? { duration: 0 } : undefined;

  useEffect(() => {
    setOffsetUp(!localStorage.getItem('cookie-consent'));
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      // stale or invalid log — start fresh
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-15)));
    } catch {
      // storage unavailable — ignore
    }
  }, [messages]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send(text?: string) {
    const body = (text ?? input).trim();
    if (!body || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: body }]);
    setLoading(true);
    try {
      const reply = await askAssistant(body);
      setMessages((m) => [...m, { role: 'assistant', text: reply.answer, links: reply.links }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: 'Sorry, I could not reach the assistant. Please try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`fixed right-4 z-[120] md:right-6 ${offsetUp ? 'bottom-24' : 'bottom-6'}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat assistant"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={transition ?? { duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="mb-3 flex h-[min(560px,65vh)] w-[min(calc(100vw-2rem),380px)] flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center gap-3 gradient-primary px-4 py-3 text-white shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Icon name="robot" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-label-sm font-semibold">Citizen Services Assistant</p>
                <p className="text-label-sm text-white/80">Ask about services, tracking &amp; helplines</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} data-lenis-prevent-wheel className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-background/40 px-4 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="max-w-[85%] rounded-xl border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface">
                    Hello! I&apos;m the Citizen Services assistant. How can I help you today?
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-body-sm ${
                      msg.role === 'user'
                        ? 'bg-primary/10 text-on-surface'
                        : 'border border-outline-variant bg-surface text-on-surface'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-outline-variant/60 pt-2">
                        {msg.links.map((link) => (
                          <button
                            key={link.href}
                            type="button"
                            onClick={() => router.push(link.href)}
                            className="text-body-sm font-medium text-secondary hover:underline"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-xl border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface">
                    <span className="animate-pulse">Typing…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested topics — always visible */}
            <div className="shrink-0 border-t border-outline-variant/60 bg-surface px-3 py-2">
              <p className="mb-1.5 text-label-sm text-on-surface-variant">Suggested topics</p>
              <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-outline-variant">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    disabled={loading}
                    className="btn-outline shrink-0 px-3 py-1.5 text-label-sm min-h-[34px] disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex shrink-0 items-center gap-2 border-t border-outline-variant bg-surface p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question…"
                aria-label="Your question"
                maxLength={500}
                className="h-11 flex-1 rounded-xl border border-outline-variant bg-background px-3 text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="btn-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl p-0 text-white disabled:opacity-40"
              >
                <Icon name="send" size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle — hidden while chat is open */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
          aria-expanded={false}
          className="gradient-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white shadow-elevated"
        >
          <Icon name="robot" size={26} />
        </button>
      )}
    </div>
  );
}