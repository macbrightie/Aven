'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  'Building your plan...',
  'Mapping your path to financial freedom...',
  'Breaking 1-year into quarters...',
  'Writing your first 100-day challenge...',
  'Almost ready.',
];

export default function BuildingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) {
      // Last step — hold briefly then navigate to dashboard
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1400);
      return () => clearTimeout(timer);
    }

    // Fade out → swap text → fade back in
    const fadeOut = setTimeout(() => setVisible(false), 1600);
    const swap = setTimeout(() => {
      setStepIndex((i) => i + 1);
      setVisible(true);
    }, 1900);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(swap);
    };
  }, [stepIndex, router]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#F7F5EE' }}
    >
      {/* Spinner */}
      <svg
        className="w-7 h-7 mb-5 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        style={{ opacity: 0.45 }}
      >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.15" />
        <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
      </svg>

      {/* Animated copy */}
      <p
        key={stepIndex}
        className="font-sans font-medium text-[#1a1a1a] text-[22px] md:text-[28px] tracking-tight text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {STEPS[stepIndex]}
      </p>
    </main>
  );
}
