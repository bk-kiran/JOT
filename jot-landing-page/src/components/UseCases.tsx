'use client';

import { motion } from 'framer-motion';
import {
  AlarmClock,
  FileX2,
  Bell,
  ShoppingCart,
  RotateCcw,
  Calendar,
  Clock,
} from 'lucide-react';

const USE_CASES = [
  {
    input: 'call mom tmr at 7pm',
    steps: [
      { icon: AlarmClock, text: 'Reminder parsed · Tomorrow 7:00 PM' },
      { icon: FileX2, text: 'Note deleted automatically' },
      { icon: Bell, text: 'Push notification scheduled' },
    ],
    result: '🔔 You\'ll get an alert tomorrow at 7:00 PM',
  },
  {
    input: 'add oat milk to the grocery list',
    steps: [
      { icon: ShoppingCart, text: 'Matched to existing Grocery List' },
      { icon: FileX2, text: 'Note deleted automatically' },
      { icon: RotateCcw, text: 'Undo available for 4 seconds' },
    ],
    result: '✓ Oat milk added · Grocery List (12 items)',
  },
  {
    input: 'meeting with sarah friday 2pm',
    steps: [
      { icon: Calendar, text: 'Event created · Friday 2:00 PM' },
      { icon: FileX2, text: 'Note deleted automatically' },
      { icon: Clock, text: 'Added to Upcoming Events' },
    ],
    result: '📅 Showing in your upcoming events',
  },
];

export default function UseCases() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p
            className="mb-4 text-sm uppercase tracking-widest"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'hsl(var(--primary))',
            }}
          >
            See it in action
          </p>
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Type anything.{' '}
            <span className="text-gradient">JOT figures it out.</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-glow-hover flex flex-col overflow-hidden rounded-2xl"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
              }}
            >
              {/* Top: input */}
              <div className="p-6 pb-4">
                <p
                  className="mb-3 text-xs"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'hsl(var(--muted))',
                  }}
                >
                  you type
                </p>
                <div
                  className="rounded-xl p-4 text-sm text-white"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    background: 'hsl(220, 18%, 6%)',
                  }}
                >
                  {uc.input}
                </div>
              </div>

              {/* Middle: steps */}
              <div className="flex flex-grow flex-col gap-3 px-6 py-4">
                {uc.steps.map((step, j) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={j} className="flex items-center gap-3">
                      <StepIcon
                        size={16}
                        style={{ color: 'hsl(var(--primary))', flexShrink: 0 }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: 'hsl(var(--muted))' }}
                      >
                        {step.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom: result */}
              <div
                className="px-6 py-4"
                style={{
                  background: 'hsl(200 100% 55% / 0.06)',
                  borderTop: '1px solid hsl(var(--border))',
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: 'hsl(var(--primary))',
                  }}
                >
                  {uc.result}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
