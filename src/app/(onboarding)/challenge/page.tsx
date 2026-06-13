import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your 21-day sprint — Deylon',
  description: 'Launch your 21-day sprint with Deylon.',
};

export default function ChallengePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Your 21-day sprint starts now
        </h1>
        <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
          21 days. One task a day. Deylon will guide you every step of the way.
        </p>
        {/* ChallengeGrid component will be mounted here */}
      </div>
    </main>
  );
}
