'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef(null);
  const [loadingType, setLoadingType] = useState<'login' | 'signup' | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });

      // Stacking Cards
      const cards = gsap.utils.toArray('.stack-card');
      cards.forEach((card: any) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=50",
            end: "top center",
            scrub: 1,
          },
          y: 80,
          scale: 0.92,
          opacity: 0,
        });
      });

      gsap.to(".ticker-content", { xPercent: -50, repeat: -1, duration: 30, ease: "none" });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleNav = (type: 'login' | 'signup') => {
    setLoadingType(type);
    setTimeout(() => {
      window.location.href = type === 'login' ? '/auth/login' : '/auth/register';
    }, 800);
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden flex flex-col items-center">
      
      {/* 🔮 Fixed Ambient Glows */}
      <div className="glow-indigo fixed top-0 left-0 w-full h-[40vh] opacity-20 blur-[120px] pointer-events-none" />
      <div className="glow-purple fixed bottom-0 right-0 w-full h-[40vh] opacity-20 blur-[120px] pointer-events-none" />

      {/* 💹 Ticker Tape + System Live Indicator */}
      <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl py-3 flex items-center">
        <div className="ticker-content flex whitespace-nowrap gap-10 text-[9px] font-mono font-bold tracking-widest opacity-40">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-10 items-center">
              <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                SYSTEM LIVE: NODE_04
              </span>
              <span>NET WORTH: +14.2%</span>
              <span className="text-indigo-400">● MULTI-CURRENCY CONSOLIDATION</span>
              <span>USD/INR: 92.42</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="hero-content relative z-10 w-full px-5 pt-16 md:pt-32 pb-12 flex flex-col items-center text-center">
        
        <h1 className="text-[13vw] md:text-[11rem] font-bold tracking-tighter leading-[0.8] mb-10 w-full max-w-full break-words select-none">
          FINANCE<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 dark:from-white dark:to-white/10">TRACKER.</span>
        </h1>

        <p className="text-gray-500 max-w-lg text-sm md:text-xl mb-12 font-medium leading-relaxed px-2 opacity-70">
          Professional wealth visualizer. Manage multi-currency assets, loans, and automated receipts.
        </p>

        {/* --- DUAL ACTION BUTTONS --- */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-[320px] md:max-w-none justify-center px-4 mb-5">
          <button 
            onClick={() => handleNav('signup')} 
            disabled={!!loadingType} 
            className="w-full md:w-auto px-12 py-5 bg-foreground text-background rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,255,255,0.1)]"
          >
            {loadingType === 'signup' ? <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" /> : "Access Terminal"}
          </button>
          
          <button 
            onClick={() => handleNav('login')} 
            disabled={!!loadingType} 
            className="w-full md:w-auto px-12 py-5 glass-strong border border-white/20 hover:border-indigo-500/50 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            {loadingType === 'login' ? <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" /> : "Member Login"}
          </button>
        </div>

        {/* --- DYNAMIC TERMINAL PREVIEW --- */}
        <div className="w-full max-w-6xl px-1 md:px-6 mt-16 md:mt-24">
          <div className="glass-strong rounded-[2.5rem] p-2 md:p-4 border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="bg-[#050505] rounded-[2rem] h-[320px] md:h-[600px] relative overflow-hidden p-8 md:p-14 text-white flex flex-col justify-between">
              
              {/* Background Animated Graph (The "Industry Level" Chart) */}
              <div className="absolute inset-0 opacity-20 flex items-end justify-between px-2 pointer-events-none">
                {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-500 mx-1 rounded-t-md animate-pulse" 
                       style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>

              <div className="relative z-10 text-left">
                <p className="text-[10px] text-indigo-400 font-black tracking-[0.2em] uppercase mb-1">Portfolio Velocity</p>
                <h3 className="text-4xl md:text-6xl font-mono tracking-tight">$142,500.42</h3>
              </div>

              <div className="relative z-10 flex justify-between items-center text-[9px] font-mono opacity-50 uppercase tracking-[0.3em]">
                <span>T-Minus 24H</span>
                <span>Active Conversion: USD/INR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STACKING FEATURE CARDS --- */}
      <section className="w-full max-w-4xl px-6 flex flex-col gap-8 md:gap-12 pb-32 mt-20">
        {[
          { icon: "🌍", t: "Global Net Worth", d: "Automatic FX conversion for international accounts and assets." },
          { icon: "📉", t: "Debt Architect", d: "Track loan balances and remaining credit limits with precision." },
          { icon: "📄", t: "Receipt Vault", d: "Digital bookkeeping. Securely link receipts to every transaction." },
          { icon: "🔔", t: "Liquidity Alerts", d: "AI-driven notifications for upcoming dues and low balances." },
          { icon: "📈", t: "Revenue Flow", d: "Industry-grade analytics for your income and expense trends." }
        ].map((f, i) => (
          <div key={i} className="stack-card glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 flex flex-col gap-4 shadow-xl">
            <span className="text-4xl mb-2">{f.icon}</span>
            <h3 className="text-xl md:text-3xl font-bold tracking-tight">{f.t}</h3>
            <p className="opacity-50 text-sm md:text-lg leading-relaxed">{f.d}</p>
          </div>
        ))}
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="w-full px-6 pb-40">
         <div className="glass-strong p-12 md:p-24 rounded-[3rem] text-center border border-white/10 max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl md:text-6xl font-bold tracking-tighter mb-10 italic">Go clear with Finance TRACKER.</h2>
            <button onClick={() => handleNav('signup')} className="px-16 py-6 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
              Initialize TRACKER
            </button>
         </div>
      </section>
    </div>
  );
}
