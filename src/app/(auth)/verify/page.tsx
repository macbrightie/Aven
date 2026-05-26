import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify your email — Aven',
  description: 'Confirm your magic link to access Aven.',
};

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 px-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Verifying your link…
        </h1>
        <p className="text-muted-foreground">
          Please wait while we log you in.
        </p>
      </div>
    </main>
  );
}
