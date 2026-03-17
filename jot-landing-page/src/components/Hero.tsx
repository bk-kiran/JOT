'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';
import TypewriterDemo from './TypewriterDemo';

type Status = 'idle' | 'loading' | 'success';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Hero() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setError('');
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1000);
  };

  return (
    <section
      className="flex min-h-screen items-center"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(200 100% 55% / 0.08), transparent)',
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-center lg:justify-between">
          {/* Left column */}
          <div className="flex max-w-xl flex-col gap-8 lg:max-w-lg">
            {/* Pill badge */}
            <div
              className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
                border: '1px solid hsl(200 100% 55% / 0.25)',
                background: 'hsl(200 100% 55% / 0.06)',
                color: 'hsl(var(--primary))',
              }}
            >
              <div
                className="pulse-dot h-2 w-2 rounded-full"
                style={{ background: 'hsl(200, 100%, 55%)' }}
              />
              Coming Soon — iOS &amp; Android
            </div>

            {/* H1 */}
            <h1
              className="text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800 }}
            >
              Just type it.
              <br />
              <span className="text-gradient">We&apos;ll handle</span> the rest.
            </h1>

            {/* Subtext */}
            <p
              className="max-w-md text-lg leading-relaxed"
              style={{ color: 'hsl(var(--muted))' }}
            >
              Your note becomes a reminder, a list, an event — then it disappears.
              No folders. No filing. No thinking about where to put it. Just capture.
            </p>

            {/* Email capture */}
            <div className="flex flex-col gap-2">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 size={22} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                    <span
                      className="text-lg font-medium text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      You&apos;re on the list! We&apos;ll be in touch.
                    </span>
                  </motion.div>
                ) : (
                  <motion.div key="form" className="flex flex-col gap-2">
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3 sm:flex-row"
                    >
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="your@email.com"
                        disabled={status === 'loading'}
                        className="w-full rounded-xl px-4 py-3 text-white outline-none transition sm:w-72"
                        style={{
                          background: 'hsl(var(--card))',
                          border: `1px solid ${error ? '#f87171' : 'hsl(var(--border))'}`,
                        }}
                        onFocus={(e) => {
                          if (!error) e.target.style.borderColor = 'hsl(var(--primary))';
                        }}
                        onBlur={(e) => {
                          if (!error) e.target.style.borderColor = 'hsl(var(--border))';
                        }}
                      />
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3 font-semibold text-black transition hover:brightness-110 disabled:opacity-70"
                        style={{ background: 'hsl(var(--primary))' }}
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Joining...
                          </>
                        ) : (
                          'Get Early Access →'
                        )}
                      </button>
                    </form>
                    {error && (
                      <p className="text-sm text-red-400">{error}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {status !== 'success' && (
                <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
                  No spam. We&apos;ll only reach out when JOT launches.
                </p>
              )}
            </div>
          </div>

          {/* Right column — typewriter demo */}
          <div className="flex w-full justify-center lg:w-auto lg:justify-end">
            <TypewriterDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
