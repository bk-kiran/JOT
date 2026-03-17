'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistCTA() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [count, setCount] = useState(200);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    setError('');
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setCount((prev) => prev + 1);
    }, 1000);
  };

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="card-glow mx-auto max-w-2xl rounded-3xl p-12 text-center md:p-16"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 100% 80% at 50% 100%, hsl(200 100% 55% / 0.06), transparent)',
            backgroundColor: 'hsl(var(--card))',
          }}
        >
          <p
            className="mb-4 text-xs uppercase tracking-widest"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'hsl(var(--primary))',
            }}
          >
            Early Access
          </p>

          <h2
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Be the first to try{' '}
            <span className="text-gradient">JOT</span>
          </h2>

          <p
            className="mb-10 text-lg"
            style={{ color: 'hsl(var(--muted))' }}
          >
            Join the waitlist and get access before the public launch. We&apos;re
            starting with a small group of beta testers.
          </p>

          {/* Email capture */}
          <div className="flex flex-col items-center gap-2">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-center gap-3"
                >
                  <CheckCircle2
                    size={22}
                    style={{ color: 'hsl(var(--primary))', flexShrink: 0 }}
                  />
                  <span
                    className="text-lg font-medium text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    You&apos;re on the list! We&apos;ll be in touch.
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="flex w-full flex-col items-center gap-2"
                >
                  <form
                    onSubmit={handleSubmit}
                    className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center"
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
                        background: 'hsl(220, 20%, 4%)',
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
                        'Join the Waitlist →'
                      )}
                    </button>
                  </form>
                  {error && (
                    <p className="text-sm text-red-400">{error}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <p
              className="mt-2 text-sm"
              style={{ color: 'hsl(var(--muted))' }}
            >
              Already {count}+ people on the waitlist.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
