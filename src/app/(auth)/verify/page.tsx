import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyClient } from '@/components/auth/VerifyClient';

export const metadata: Metadata = {
  title: 'Verify your email — Deylon',
  description: 'Confirm your magic link to access Deylon.',
};

export default function VerifyPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F5EE]">
      <div className="bg-white rounded-[24px] border border-black/5 p-8 max-w-[400px] w-full shadow-lg">
        <Suspense fallback={
          <div className="text-center py-6 space-y-5 flex flex-col items-center">
            <div className="flex justify-center">
              <span className="loader"></span>
            </div>
            <p className="text-[14px] text-[#6f6f77] font-sans">Syncing authentication engine...</p>
          </div>
        }>
          <VerifyClient />
        </Suspense>
      </div>
    </main>
  );
}
