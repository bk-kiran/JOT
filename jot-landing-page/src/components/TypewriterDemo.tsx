'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlarmClock, ShoppingCart, Calendar, Loader2 } from 'lucide-react';

type DemoPhase = 'typing' | 'processing' | 'result' | 'fadeout';

const TYPING_SPEED      = 55;   // ms per character
const PROCESSING_DELAY  = 400;  // ms after typing ends before "Analyzing..."
const PROCESSING_MS     = 1400; // ms duration of processing phase
const RESULT_MS         = 2000; // ms duration of result phase
const FADEOUT_MS        = 400;  // ms for opacity fade
const PAUSE_MS          = 300;  // ms gap before next demo starts

const DEMOS = [
  {
    input: 'call mom tmr at 7pm',
    icon: AlarmClock,
    result: 'Reminder set · Tomorrow 7:00 PM',
  },
  {
    input: 'add oat milk to the grocery list',
    icon: ShoppingCart,
    result: 'Added to Grocery List',
  },
  {
    input: 'meeting with sarah friday 2pm',
    icon: Calendar,
    result: 'Event created · Friday 2:00 PM',
  },
  {
    input: 'eggs bread milk butter olive oil',
    icon: ShoppingCart,
    result: 'Grocery list created · 5 items',
  },
];

function getCycleDuration(inputLength: number) {
  return (
    inputLength * TYPING_SPEED +
    PROCESSING_DELAY +
    PROCESSING_MS +
    RESULT_MS +
    FADEOUT_MS +
    PAUSE_MS
  );
}

export default function TypewriterDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<DemoPhase>('typing');
  const [displayedText, setDisplayedText] = useState('');
  const [contentOpacity, setContentOpacity] = useState(1);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    const demo = DEMOS[currentIndex];
    let charIndex = 0;

    setPhase('typing');
    setDisplayedText('');
    setContentOpacity(1);

    // Phase 1 — Typing
    intervalRef.current = setInterval(() => {
      charIndex++;
      setDisplayedText(demo.input.slice(0, charIndex));
      if (charIndex >= demo.input.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;

        // Phase 2 — Processing
        const t1 = setTimeout(() => {
          setPhase('processing');

          // Phase 3 — Result
          const t2 = setTimeout(() => {
            setPhase('result');

            // Phase 4 — Fade out
            const t3 = setTimeout(() => {
              setPhase('fadeout');
              setContentOpacity(0);

              // Advance to next demo
              const t4 = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % DEMOS.length);
              }, FADEOUT_MS + PAUSE_MS);
              timeoutsRef.current.push(t4);
            }, RESULT_MS);
            timeoutsRef.current.push(t3);
          }, PROCESSING_MS);
          timeoutsRef.current.push(t2);
        }, PROCESSING_DELAY);
        timeoutsRef.current.push(t1);
      }
    }, TYPING_SPEED);

    return () => clearAll();
  }, [currentIndex]);

  const demo = DEMOS[currentIndex];
  const DemoIcon = demo.icon;
  const cycleDuration = getCycleDuration(demo.input.length);
  const isStruck = phase === 'result' || phase === 'fadeout';

  return (
    <div
      className="card-glow overflow-hidden rounded-2xl"
      style={{ width: 420, maxWidth: '100%', background: 'hsl(var(--card))' }}
    >
      {/* ── Window chrome ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: '12px 16px',
          background: 'hsl(220,18%,6%)',
          borderBottom: '1px solid hsl(220,18%,14%)',
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        </div>
        {/* "jot" label — absolutely centered in the bar */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            color: 'hsl(220,15%,55%)',
          }}
        >
          jot
        </div>
      </div>

      {/* ── Content area — fixed height so it never jumps ── */}
      <div
        style={{
          height: 220,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: 24,
          opacity: contentOpacity,
          transition: `opacity ${FADEOUT_MS}ms ease`,
          overflow: 'hidden',
        }}
      >
        {/* "you type" label */}
        <span
          style={{
            display: 'block',
            marginBottom: 8,
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'hsl(var(--muted))',
            flexShrink: 0,
          }}
        >
          you type
        </span>

        {/* Input box — always in DOM, opacity transitions only, fixed min-height */}
        <div
          style={{
            marginBottom: 14,
            borderRadius: 8,
            padding: '14px 16px',
            background: 'hsl(220, 18%, 6%)',
            minHeight: 52,
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              color: 'white',
              textDecoration: isStruck ? 'line-through' : 'none',
              opacity: isStruck ? 0.4 : 1,
              transition: 'opacity 300ms ease',
            }}
          >
            {displayedText}
          </span>
          {phase === 'typing' && <span className="cursor-blink" />}
        </div>

        {/* Lower slot — processing row OR result card, same space */}
        <div style={{ flex: 1, minHeight: 64 }}>
          {phase === 'processing' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: 'hsl(var(--primary))', flexShrink: 0 }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: 'hsl(var(--muted))',
                }}
              >
                Analyzing...
              </span>
            </div>
          )}

          <AnimatePresence>
            {(phase === 'result' || phase === 'fadeout') && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  borderRadius: 12,
                  padding: 14,
                  background: 'hsl(200 100% 55% / 0.08)',
                  border: '1px solid hsl(200 100% 55% / 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <DemoIcon size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
                  <span
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      color: 'white',
                    }}
                  >
                    {demo.result}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    color: 'hsl(var(--primary))',
                  }}
                >
                  Note deleted ✓
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Progress bar — resets on each new demo via key ── */}
      <div style={{ height: 2, background: 'hsl(var(--border))' }}>
        <div
          key={currentIndex}
          style={{
            height: '100%',
            background: 'hsl(200, 100%, 55%)',
            animation: `progress-fill ${cycleDuration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
