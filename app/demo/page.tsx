'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

export default function DemoPage() {
  const [outcomeMessage, setOutcomeMessage] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);

  const triggerCancellationFlow = () => {
    if (typeof window !== 'undefined' && (window as any).Revora) {
      setOutcomeMessage(null);
      setSessionActive(true);

      (window as any).Revora.open({
        public_key: 'rv_pub_test_123456789',
        external_customer_id: 'cus_stripe_test_999',
        subscription_id: 'sub_stripe_test_999',
        email: 'demo-founder@example.com',
        name: 'Interactive Demo SaaS Profile',
        onClose: (result: { outcome: string }) => {
          setSessionActive(false);
          if (result.outcome === 'offer_accepted') {
            setOutcomeMessage('Retention Secured! Revora applied a dynamic concession to this subscription contract.');
          } else {
            setOutcomeMessage('? Churn Finalized. The customer opted to leave, and feedback has been logged to your analyst grid.');
          }
        },
        onError: (err: any) => {
          console.error('Revora SDK Handshake Exception:', err);
          setSessionActive(false);
        }
      });
    } else {
      alert('Revora Widget Engine still stream-loading. Please wait a millisecond.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col items-center justify-center p-6">
      {/* Dynamic script loading hooks into your public compiled widget bundle asset safely */}
      <Script src="/revora-widget.js" data-revora-key="rv_pub_test_123456789" strategy="afterInteractive" />

      <div className="w-full max-w-md bg-white border border-slate-200/80 p-10 rounded-2xl shadow-sm text-center transition-all duration-300">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="font-black text-sm tracking-tight text-[#0F8F83]">REVORA STUDIO</span>
        </div>
        
        <h1 className="text-2xl font-black tracking-tight text-[#0F172A] mt-4">Interactive SDK Demo Runway</h1>
        <p className="text-xs text-slate-400 mt-1.5 mb-8 max-w-xs mx-auto leading-relaxed">
          Simulate exactly how global application subscribers interact with your fluid offboarding mitigation paths.
        </p>

        {!outcomeMessage ? (
          <button
            onClick={triggerCancellationFlow}
            disabled={sessionActive}
            className="w-full inline-flex items-center justify-center bg-[#0F172A] text-[#F8FAFC] text-xs font-bold h-11 px-6 rounded-xl transition hover:bg-slate-800 active:scale-95 disabled:opacity-40"
          >
            {sessionActive ? 'Interception Active...' : 'Simulate Churn Intent'}
          </button>
        ) : (
          <div className="animate-fade-in">
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-xs font-medium text-slate-600 mb-6 leading-relaxed">
              {outcomeMessage}
            </div>
            
            {/* THE RETRY OPTION MATRIX FOR ZERO-FRICTION SIMULATIONS */}
            <button
              onClick={triggerCancellationFlow}
              className="w-full inline-flex items-center justify-center bg-[#0F8F83] text-white text-xs font-bold h-11 px-6 rounded-xl transition hover:bg-[#0c776e] active:scale-95 shadow-sm shadow-[#0F8F83]/10"
            >
              Test Another Scenario?
            </button>
          </div>
        )}
      </div>

      <footer className="mt-8 text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
        Secured Asset Environment V1.1
      </footer>
    </div>
  );
}
