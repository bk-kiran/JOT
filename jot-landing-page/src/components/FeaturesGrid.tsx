'use client';

import { motion } from 'framer-motion';
import { MessageSquare, LayoutGrid, RotateCcw, AlarmClock } from 'lucide-react';

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Natural Language Reminders',
    description:
      "Just write it like you'd say it. 'Call dentist Thursday morning' becomes a reminder — no date pickers, no time wheels.",
  },
  {
    icon: LayoutGrid,
    title: 'Smart Collections',
    description:
      'Your home screen shows AI-generated buckets: Today, Shopping Lists, Ideas, Upcoming. You never organize anything manually.',
  },
  {
    icon: RotateCcw,
    title: 'Undo Toast System',
    description:
      'Every AI action shows a 4-second undo banner. Automation that feels safe, not scary. One tap to reverse anything.',
  },
  {
    icon: AlarmClock,
    title: 'Snooze-Native Reminders',
    description:
      'Done and Snooze are equals, not afterthoughts. Built for how people actually behave when an alert fires at the wrong moment.',
  },
];

export default function FeaturesGrid() {
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
            Everything you need
          </p>
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Smart features,{' '}
            <span className="text-gradient">invisible effort.</span>
          </h2>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-glow-hover rounded-2xl p-8"
                style={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                <div
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: 'hsl(200 100% 55% / 0.1)',
                    border: '1px solid hsl(200 100% 55% / 0.15)',
                  }}
                >
                  <Icon size={22} style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <h3
                  className="mb-3 text-xl font-semibold text-white"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'hsl(var(--muted))' }}
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
