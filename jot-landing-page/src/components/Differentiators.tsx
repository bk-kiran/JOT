'use client';

import { motion } from 'framer-motion';
import { Flame, BrainCircuit, Zap } from 'lucide-react';

const CARDS = [
  {
    icon: Flame,
    tagline: 'ephemeral by design',
    title: 'Ephemeral Action Notes',
    description:
      "Every note has one job — trigger an action. Once it does, it's gone. No cluttered inbox, no archive to manage. The note was never meant to last; the action was.",
  },
  {
    icon: BrainCircuit,
    tagline: 'context-aware ai',
    title: 'Contextual List Merging',
    description:
      "Say 'add oat milk to the grocery list' and JOT finds your existing list and appends it — no opening the note, no scrolling, no tapping. It just happens.",
  },
  {
    icon: Zap,
    tagline: 'zero friction capture',
    title: 'Zero-Friction Capture',
    description:
      'Open the app and the keyboard is already up. No tap to focus, no loading state, no folder to choose. The fastest notes app ever built — because thinking about where to put a note is wasted thought.',
  },
];

export default function Differentiators() {
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
            Why JOT is different
          </p>
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Built around{' '}
            <span className="text-gradient">capture, not storage.</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-glow-hover flex flex-row items-start gap-6 rounded-2xl p-8 md:gap-8 md:p-10"
                style={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                {/* Icon */}
                <div
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: 'hsl(200 100% 55% / 0.1)',
                    border: '1px solid hsl(200 100% 55% / 0.2)',
                  }}
                >
                  <Icon size={28} style={{ color: 'hsl(var(--primary))' }} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-2">
                  <span
                    className="text-xs uppercase tracking-widest"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: 'hsl(var(--primary))',
                    }}
                  >
                    {card.tagline}
                  </span>
                  <h3
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: 'hsl(var(--muted))' }}
                  >
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
