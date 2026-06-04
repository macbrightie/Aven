'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const STEPS = [
  'Building your plan...',
  'Mapping your path to financial freedom...',
  'Breaking 1-year into quarters...',
  'Writing your first 100-day challenge...',
  'Almost ready.',
];

function BuildingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [apiDone, setApiDone] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (!conversationId) {
      setApiDone(true); // No conversation ID to generate, skip API
      return;
    }

    async function triggerPlanGeneration() {
      try {
        const res = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversationId }),
        });

        if (!res.ok) {
          throw new Error('Failed to generate plan');
        }

        setApiDone(true);
      } catch (err) {
        console.error('[BuildingPage] Plan generation error:', err);
        setApiError(true);
      }
    }

    triggerPlanGeneration();
  }, [searchParams]);

  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) {
      // Last step — hold until API is done or errored
      if (apiDone) {
        const timer = setTimeout(() => {
          router.push('/dashboard');
        }, 1400);
        return () => clearTimeout(timer);
      }
      if (apiError) {
        const timer = setTimeout(() => {
          alert("We encountered an issue building your plan. Redirecting to start page to try again.");
          router.push('/start');
        }, 1400);
        return () => clearTimeout(timer);
      }
      return;
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
  }, [stepIndex, router, apiDone, apiError]);

  return (
    <>
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
        {apiError ? 'Plan generation failed.' : STEPS[stepIndex]}
      </p>
    </>
  );
}

export default function BuildingPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#F7F5EE' }}
    >
      <Suspense fallback={
        <div className="text-center py-6 space-y-4">
          <svg className="animate-spin w-10 h-10 text-[#104d3b]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      }>
        <BuildingClient />
      </Suspense>
    </main>
  );
}
