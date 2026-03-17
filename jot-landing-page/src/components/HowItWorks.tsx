'use client';

import { motion } from 'framer-motion';
import { Keyboard, Brain, Trash2 } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Keyboard,
    title: 'Capture',
    description:
      "Open the app and type whatever's on your mind. No categories, no decisions, no friction.",
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Acts',
    description:
      'JOT reads your note and instantly creates a reminder, updates a list, or logs an event.',
  },
  {
    number: '03',
    icon: Trash2,
    title: 'Note Disappears',
    description:
      'The note deletes itself. The action persists. Your mind stays clear.',
  },
];

export default function HowItWorks() {
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
            Simple by design
          </p>
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Three steps.{' '}
            <span className="text-gradient">Zero thinking.</span>
          </h2>
        </div>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 gap-0 md:grid-cols-3">
          {/* Connector line 1 */}
          <div
            className="absolute hidden md:block"
            style={{
              top: '22%',
              left: '33.33%',
              right: '33.33%',
              borderTop: '1px dashed hsl(var(--border))',
              zIndex: 0,
            }}
          />

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative z-10 px-8 py-8 text-center"
              >
                <span
                  className="mb-6 block text-xs tracking-widest"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'hsl(var(--primary))',
                  }}
                >
                  {step.number}
                </span>
                <div
                  className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                  }}
                >
                  <Icon size={24} style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <h3
                  className="mb-3 text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {step.title}
                </h3>
                <p
                  className="mx-auto max-w-[220px] text-sm leading-relaxed"
                  style={{ color: 'hsl(var(--muted))' }}
                >
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
