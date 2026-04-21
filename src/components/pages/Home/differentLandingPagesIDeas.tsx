// // // // // // // 'use client';
// // // // // // // import React, { useEffect, useRef } from 'react';
// // // // // // // import Link from 'next/link';
// // // // // // // import {gsap} from 'gsap';
// // // // // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // // // // // // export default function LandingPage() {
// // // // // // //     if(typeof window!=='undefined'){
// // // // // // //         gsap.registerPlugin(ScrollTrigger);
// // // // // // //     }

// // // // // // //     const heroRef = useRef(null);
// // // // // // //     const cardsRef = useRef<HTMLDivElement>(null);
// // // // // // //     const chartRef = useRef(null);

// // // // // // //     useEffect(()=>{
// // // // // // //         const ctx = gsap.context(()=>{
// // // // // // //             gsap.from(".hero-text", {
// // // // // // //                 y:60,
// // // // // // //                 opacity:0,
// // // // // // //                 duration:1,
// // // // // // //                 stagger:0.2,
// // // // // // //                 ease:"power4.out",
// // // // // // //             });

// // // // // // //             gsap.to(".glow-move",{
// // // // // // //                 y:"40px",
// // // // // // //                 x:"20px",
// // // // // // //                 duration:4,
// // // // // // //                 repeat:-1,
// // // // // // //                 yoyo:true,
// // // // // // //                 ease:"sine.inOut",
// // // // // // //                 stagger:1,
// // // // // // //             });
// // // // // // //             gsap.from(".feature-card",{
// // // // // // //                 scrollTrigger:{
// // // // // // //                     trigger:".feature-grid",
// // // // // // //                     start:"top 80%",
// // // // // // //                 },
// // // // // // //                 y:100,
// // // // // // //                 opacity:0,
// // // // // // //                 duration:0.8,
// // // // // // //                 stagger:0.2,
// // // // // // //                 ease:"power3.out",
// // // // // // //             });

// // // // // // //             gsap.to(".dashboard-preview", {
// // // // // // //                 scrollTrigger:{
// // // // // // //                     trigger:".dashboard-preview",
// // // // // // //                     start:"top bottom",
// // // // // // //                     end:"bottom top",
// // // // // // //                     scrub:1,
// // // // // // //                 },
// // // // // // //                 y:-50,
// // // // // // //                 scale:1.05,
// // // // // // //             });
// // // // // // //         });
// // // // // // //         return ()=>ctx.revert();
// // // // // // //     },[]);

// // // // // // //   return (
// // // // // // //     <div className="relative min-h-screen w-full overflow-x-hidden pt-safe pb-safe px-safe">
      
// // // // // // //       {/* 🔮 Background Glows - Using your global classes */}
// // // // // // //       <div className="glow-indigo top-[-5%] left-[-10%] opacity-40 dark:opacity-20 fixed" />
// // // // // // //       <div className="glow-purple bottom-[5%] right-[-10%] opacity-40 dark:opacity-20 fixed" />

// // // // // // //       {/* --- HERO SECTION --- */}
// // // // // // //       <section className="relative flex flex-col items-center pt-16 md:pt-28 pb-16 px-4">
// // // // // // //         <div className="max-w-4xl z-10 text-center">
// // // // // // //           {/* Mobile: 4xl font, Desktop: 7xl */}
// // // // // // //           <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-balance">
// // // // // // //             Track expenses with <br />
// // // // // // //             <span className="text-blue-600 dark:text-blue-400">Glass-Clear Clarity.</span>
// // // // // // //           </h1>
          
// // // // // // //           <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto px-4">
// // // // // // //             A premium financial companion that turns complex spending data into beautiful, actionable insights.
// // // // // // //           </p>
          
// // // // // // //           {/* Buttons: Stacked on mobile, row on desktop */}
// // // // // // //           <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-xs sm:max-w-none mx-auto">
// // // // // // //             <Link href="/auth/register" className="px-10 py-4 bg-blue-600 text-white rounded-2xl md:rounded-full font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg text-center">
// // // // // // //               Start Free Trial
// // // // // // //             </Link>
// // // // // // //             <Link href="#features" className="px-10 py-4 glass glass-hover rounded-2xl md:rounded-full font-semibold text-center">
// // // // // // //               See How It Works
// // // // // // //             </Link>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* --- DYNAMIC DASHBOARD PREVIEW --- */}
// // // // // // //         <div className="mt-16 w-full max-w-6xl mx-auto relative group px-2 md:px-6">
// // // // // // //           <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-2xl transition duration-1000 group-hover:opacity-100 opacity-50" />
          
// // // // // // //           <div className="glass-strong rounded-[2rem] p-4 md:p-10 relative border border-white/20 dark:border-white/10 shadow-2xl">
            
// // // // // // //             {/* Header of Preview */}
// // // // // // //             <div className="flex justify-between items-center mb-8">
// // // // // // //               <div className="flex items-center gap-3">
// // // // // // //                 <div className="w-8 h-8 rounded-lg bg-blue-600" />
// // // // // // //                 <div className="h-4 w-24 skeleton rounded" />
// // // // // // //               </div>
// // // // // // //               <div className="h-10 w-10 glass rounded-full flex items-center justify-center">👤</div>
// // // // // // //             </div>

// // // // // // //             {/* Grid: 1 col on mobile, 3 cols on desktop */}
// // // // // // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
// // // // // // //               <div className="glass-light p-6 rounded-2xl flex md:flex-col justify-between items-center md:items-start gap-4">
// // // // // // //                 <span className="text-xs uppercase font-bold tracking-wider opacity-60">Total Balance</span>
// // // // // // //                 <span className="text-2xl md:text-3xl font-bold">$12,450.00</span>
// // // // // // //               </div>
// // // // // // //               <div className="glass-light p-6 rounded-2xl flex md:flex-col justify-between items-center md:items-start gap-4 border-l-4 border-green-500/50">
// // // // // // //                 <span className="text-xs uppercase font-bold tracking-wider text-green-600 dark:text-green-400">Income</span>
// // // // // // //                 <span className="text-2xl md:text-3xl font-bold">$8,200.00</span>
// // // // // // //               </div>
// // // // // // //               <div className="glass-light p-6 rounded-2xl flex md:flex-col justify-between items-center md:items-start gap-4 border-l-4 border-red-500/50">
// // // // // // //                 <span className="text-xs uppercase font-bold tracking-wider text-red-600 dark:text-red-400">Expenses</span>
// // // // // // //                 <span className="text-2xl md:text-3xl font-bold">$3,150.00</span>
// // // // // // //               </div>
// // // // // // //             </div>

// // // // // // //             {/* Main Visual: Shimmer Chart */}
// // // // // // //             <div className="relative h-48 md:h-80 w-full glass-light rounded-2xl overflow-hidden p-6">
// // // // // // //               <div className="flex items-end justify-between h-full gap-2 md:gap-4">
// // // // // // //                  {[40, 70, 45, 90, 65, 80, 50, 95, 60, 75, 40, 85].map((h, i) => (
// // // // // // //                    <div key={i} className="flex-1 bg-blue-500/30 rounded-t-lg transition-all duration-1000 skeleton-no-shimmer" style={{ height: `${h}%` }} />
// // // // // // //                  ))}
// // // // // // //               </div>
// // // // // // //               {/* Floating Tooltip Mockup (Desktop only) */}
// // // // // // //               <div className="hidden md:block absolute top-10 left-1/2 glass-strong p-3 rounded-xl border border-white/40 shadow-xl animate-bounce">
// // // // // // //                 <p className="text-xs font-bold text-blue-600">Peak Spending</p>
// // // // // // //                 <p className="text-sm">$1,240.00</p>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </section>

// // // // // // //       {/* --- FEATURES GRID --- */}
// // // // // // //       <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
// // // // // // //         <div className="text-center mb-16">
// // // // // // //           <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for your pocket</h2>
// // // // // // //           <p className="opacity-60 max-w-lg mx-auto">Seamlessly transitions between your desktop browser and your phone as a PWA.</p>
// // // // // // //         </div>

// // // // // // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
// // // // // // //           <div className="glass glass-hover p-8 rounded-[2rem]">
// // // // // // //             <div className="w-14 h-14 bg-blue-500/10 rounded-2xl mb-6 flex items-center justify-center text-3xl">📊</div>
// // // // // // //             <h3 className="text-xl font-bold mb-3 text-foreground">Smart Analytics</h3>
// // // // // // //             <p className="text-sm leading-relaxed opacity-70">Deep dive into your spending habits with automatic categorization and trend forecasting.</p>
// // // // // // //           </div>
          
// // // // // // //           <div className="glass glass-hover p-8 rounded-[2rem] border-t border-white/30">
// // // // // // //             <div className="w-14 h-14 bg-purple-500/10 rounded-2xl mb-6 flex items-center justify-center text-3xl">📲</div>
// // // // // // //             <h3 className="text-xl font-bold mb-3 text-foreground">Native PWA Feel</h3>
// // // // // // //             <p className="text-sm leading-relaxed opacity-70">Add to home screen for an app-like experience with offline support and haptic feedback.</p>
// // // // // // //           </div>

// // // // // // //           <div className="glass glass-hover p-8 rounded-[2rem]">
// // // // // // //             <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl mb-6 flex items-center justify-center text-3xl">🔐</div>
// // // // // // //             <h3 className="text-xl font-bold mb-3 text-foreground">Bank-Grade Privacy</h3>
// // // // // // //             <p className="text-sm leading-relaxed opacity-70">Your data belongs to you. We use end-to-end encryption to keep your finances private.</p>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </section>

// // // // // // //       {/* --- MOBILE CTA FOOTER (Floating for Mobile) --- */}
// // // // // // //       <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
// // // // // // //         <Link href="/auth/register" className="glass-strong block w-full py-4 text-center rounded-2xl font-bold shadow-2xl border border-white/20 active:scale-95 transition-transform">
// // // // // // //           ⚡ Get Started Now
// // // // // // //         </Link>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // 'use client';
// // // // // // import { useEffect, useRef } from 'react';
// // // // // // import { gsap } from 'gsap';
// // // // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // // // // // if (typeof window !== 'undefined') {
// // // // // //   gsap.registerPlugin(ScrollTrigger);
// // // // // // }

// // // // // // export default function LandingPage() {
// // // // // //   const containerRef = useRef(null);

// // // // // //   useEffect(() => {
// // // // // //     const ctx = gsap.context(() => {
// // // // // //       // 1. Initial Load: Hero Reveal
// // // // // //       const tl = gsap.timeline();
// // // // // //       tl.from(".hero-text", {
// // // // // //         y: 40,
// // // // // //         opacity: 0,
// // // // // //         duration: 0.8,
// // // // // //         stagger: 0.15,
// // // // // //         ease: "power3.out",
// // // // // //       })
// // // // // //       .from(".dashboard-preview", {
// // // // // //         scale: 0.9,
// // // // // //         opacity: 0,
// // // // // //         duration: 1,
// // // // // //         ease: "power2.out"
// // // // // //       }, "-=0.4");

// // // // // //       // 2. Continuous Glow Pulse (Optimized for mobile battery)
// // // // // //       gsap.to(".glow-move", {
// // // // // //         x: "15%",
// // // // // //         y: "10%",
// // // // // //         duration: 8,
// // // // // //         repeat: -1,
// // // // // //         yoyo: true,
// // // // // //         ease: "sine.inOut",
// // // // // //         stagger: 2
// // // // // //       });

// // // // // //       // 3. Feature Cards: Slide up on scroll
// // // // // //       gsap.from(".feature-card", {
// // // // // //         scrollTrigger: {
// // // // // //           trigger: ".feature-grid",
// // // // // //           start: "top 85%", // Start earlier on mobile
// // // // // //         },
// // // // // //         y: 60,
// // // // // //         opacity: 0,
// // // // // //         duration: 0.6,
// // // // // //         stagger: 0.2,
// // // // // //         ease: "power2.out"
// // // // // //       });
// // // // // //     }, containerRef);

// // // // // //     return () => ctx.revert();
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <div ref={containerRef} className="relative min-h-screen w-full overflow-x-hidden pt-safe">
      
// // // // // //       {/* 🔮 Optimized Glows (Smaller for mobile view) */}
// // // // // //       <div className="glow-indigo glow-move fixed top-[-10%] left-[-20%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-30 pointer-events-none" />
// // // // // //       <div className="glow-purple glow-move fixed bottom-[10%] right-[-20%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-30 pointer-events-none" />

// // // // // //       {/* --- HERO SECTION --- */}
// // // // // //       <section className="relative pt-12 md:pt-32 pb-16 px-6 text-center">
// // // // // //         {/* text-balance prevents single-word widow lines on mobile */}
// // // // // //         <h1 className="hero-text text-[2.75rem] md:text-8xl font-bold tracking-tighter leading-[0.95] mb-6 text-balance">
// // // // // //           TRACKING <br /> 
// // // // // //           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
// // // // // //             REDEFINED.
// // // // // //           </span>
// // // // // //         </h1>
        
// // // // // //         <p className="hero-text text-gray-500 dark:text-gray-400 text-base md:text-xl max-w-xl mx-auto mb-10 px-2 leading-relaxed">
// // // // // //           The expense tracker that works as hard as you do. <br className="hidden md:block" />
// // // // // //           Minimalist design, maximalist insights.
// // // // // //         </p>
        
// // // // // //         <div className="hero-text flex flex-col sm:flex-row gap-4 justify-center items-center">
// // // // // //           <button className="w-full sm:w-auto px-10 py-4 bg-white text-black dark:bg-white dark:text-black rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl">
// // // // // //             Join the Waitlist
// // // // // //           </button>
// // // // // //         </div>

// // // // // //         {/* Dashboard Preview: Scaled for Mobile Viewports */}
// // // // // //         <div className="dashboard-preview mt-16 md:mt-24 max-w-5xl mx-auto">
// // // // // //            <div className="glass-strong rounded-[2rem] md:rounded-[2.5rem] border border-white/20 p-2 md:p-4 shadow-2xl overflow-hidden">
// // // // // //               <div className="bg-black/5 dark:bg-white/5 rounded-[1.6rem] md:rounded-[2rem] h-[260px] md:h-[500px] flex items-center justify-center relative">
// // // // // //                   {/* Internal animated bars: Thinner on mobile */}
// // // // // //                   <div className="flex items-end gap-2 md:gap-4 h-32 px-4">
// // // // // //                     {[60, 100, 80, 40, 90, 70, 50].map((h, i) => (
// // // // // //                       <div 
// // // // // //                         key={i} 
// // // // // //                         className="w-6 md:w-12 bg-blue-500/40 rounded-t-lg transition-all duration-1000"
// // // // // //                         style={{ height: `${h}%` }} 
// // // // // //                       />
// // // // // //                     ))}
// // // // // //                   </div>
// // // // // //               </div>
// // // // // //            </div>
// // // // // //         </div>
// // // // // //       </section>

// // // // // //       {/* --- FEATURES GRID --- */}
// // // // // //       <section className="feature-grid py-20 md:py-32 px-6 max-w-7xl mx-auto">
// // // // // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
// // // // // //           {/* Smaller padding on mobile (p-8 vs p-10) */}
// // // // // //           <div className="feature-card glass p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem]">
// // // // // //             <span className="text-3xl md:text-4xl mb-6 block">⚡</span>
// // // // // //             <h3 className="text-xl md:text-2xl font-bold mb-3">Instant Sync</h3>
// // // // // //             <p className="text-sm md:text-base opacity-60 leading-relaxed">Your data, everywhere. Instantly syncs between desktop and mobile PWA.</p>
// // // // // //           </div>
          
// // // // // //           <div className="feature-card glass p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem]">
// // // // // //             <span className="text-3xl md:text-4xl mb-6 block">💎</span>
// // // // // //             <h3 className="text-xl md:text-2xl font-bold mb-3">Pure Glass</h3>
// // // // // //             <p className="text-sm md:text-base opacity-60 leading-relaxed">A visual experience designed to reduce financial anxiety through clarity.</p>
// // // // // //           </div>

// // // // // //           <div className="feature-card glass p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem]">
// // // // // //             <span className="text-4xl mb-6 block">🔒</span>
// // // // // //             <h3 className="text-2xl font-bold mb-3">Secure Core</h3>
// // // // // //             <p className="text-sm md:text-base opacity-60 leading-relaxed">Private by default. We never see your data, and we never sell it.</p>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </section>

// // // // // //       {/* --- BOTTOM CTA: Responsive Padding --- */}
// // // // // //       <section className="py-16 md:py-24 text-center px-6">
// // // // // //         <div className="glass-strong p-10 md:p-24 rounded-[2rem] md:rounded-[3rem] max-w-4xl mx-auto border border-white/10">
// // // // // //           <h2 className="text-2xl md:text-5xl font-bold mb-8 italic leading-tight">Ready to take control?</h2>
// // // // // //           <button className="w-full sm:w-auto px-12 py-4 glass-hover glass-strong border border-white/20 rounded-full font-bold active:scale-95 transition-transform">
// // // // // //             Get Started Now
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </section>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // //---------------------------Good heading-------------------------
// // // // // // 'use client';
// // // // // // import { useEffect, useRef } from 'react';
// // // // // // import { gsap } from 'gsap';
// // // // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // // // // // if (typeof window !== 'undefined') {
// // // // // //   gsap.registerPlugin(ScrollTrigger);
// // // // // // }

// // // // // // export default function LandingPage() {
// // // // // //   const containerRef = useRef(null);

// // // // // //   useEffect(() => {
// // // // // //     const ctx = gsap.context(() => {
// // // // // //       const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

// // // // // //       // 1. Pre-loader style entrance
// // // // // //       tl.from(".reveal-text", {
// // // // // //         y: 100,
// // // // // //         opacity: 0,
// // // // // //         duration: 1.2,
// // // // // //         stagger: 0.1,
// // // // // //       })
// // // // // //       .from(".dashboard-preview", {
// // // // // //         y: 40,
// // // // // //         opacity: 0,
// // // // // //         scale: 0.98,
// // // // // //         duration: 1.5,
// // // // // //       }, "-=0.8")
// // // // // //       .from(".cta-btn", {
// // // // // //         scale: 0.8,
// // // // // //         opacity: 0,
// // // // // //         duration: 1,
// // // // // //       }, "-=1.2");

// // // // // //       // 2. Parallax Scrolling for Glows
// // // // // //       gsap.to(".glow-1", {
// // // // // //         scrollTrigger: { scrub: 1 },
// // // // // //         y: -200,
// // // // // //         x: 100,
// // // // // //       });
// // // // // //       gsap.to(".glow-2", {
// // // // // //         scrollTrigger: { scrub: 1 },
// // // // // //         y: 200,
// // // // // //         x: -100,
// // // // // //       });

// // // // // //       // 3. Staggered Feature Reveal
// // // // // //       gsap.from(".feature-card", {
// // // // // //         scrollTrigger: {
// // // // // //           trigger: ".feature-grid",
// // // // // //           start: "top 80%",
// // // // // //         },
// // // // // //         y: 50,
// // // // // //         opacity: 0,
// // // // // //         duration: 1,
// // // // // //         stagger: 0.15,
// // // // // //         ease: "power4.out"
// // // // // //       });
// // // // // //     }, containerRef);

// // // // // //     return () => ctx.revert();
// // // // // //   }, []);

// // // // // //   return (
// // // // // //     <div ref={containerRef} className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      
// // // // // //       {/* 🔮 Deep Layer Glows */}
// // // // // //       <div className="glow-1 glow-indigo fixed -top-20 -left-20 w-[400px] h-[400px] md:w-[800px] md:h-[800px] opacity-20 blur-[120px] pointer-events-none z-0" />
// // // // // //       <div className="glow-2 glow-purple fixed -bottom-20 -right-20 w-[400px] h-[400px] md:w-[800px] md:h-[800px] opacity-20 blur-[120px] pointer-events-none z-0" />

// // // // // //       {/* --- HERO --- */}
// // // // // //       <section className="relative z-10 pt-20 md:pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
// // // // // //         <div className="overflow-hidden mb-2">
// // // // // //            <span className="reveal-text block text-xs md:text-sm font-black tracking-[0.3em] uppercase opacity-50">
// // // // // //              Next-Gen Finance
// // // // // //            </span>
// // // // // //         </div>
        
// // // // // //         <h1 className="text-center text-[3.2rem] md:text-[9rem] font-bold tracking-tighter leading-[0.85] mb-8">
// // // // // //           <div className="overflow-hidden">
// // // // // //             <span className="reveal-text block">TRACKING</span>
// // // // // //           </div>
// // // // // //           <div className="overflow-hidden">
// // // // // //             <span className="reveal-text block text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 dark:from-white dark:to-white/20">
// // // // // //               REDEFINED.
// // // // // //             </span>
// // // // // //           </div>
// // // // // //         </h1>

// // // // // //         <p className="reveal-text text-center text-gray-500 max-w-lg md:text-xl mb-12 leading-relaxed text-balance">
// // // // // //           The minimalist tracker for maximalist lives. Visualize your wealth through the lens of glassmorphism.
// // // // // //         </p>

// // // // // //         <button className="cta-btn group relative px-12 py-5 bg-foreground text-background rounded-full font-bold overflow-hidden transition-transform active:scale-95">
// // // // // //           <span className="relative z-10">Get Early Access</span>
// // // // // //           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
// // // // // //         </button>

// // // // // //         {/* --- DEVICE MOCKUP --- */}
// // // // // //         <div className="dashboard-preview mt-20 w-full max-w-5xl group">
// // // // // //            <div className="glass-strong rounded-[2.5rem] p-2 md:p-4 border border-white/20 shadow-[0_0_80px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)] transition-transform duration-700 group-hover:scale-[1.01]">
// // // // // //               <div className="bg-[#050505] rounded-[2rem] h-[300px] md:h-[600px] relative overflow-hidden flex items-center justify-center">
// // // // // //                   {/* Subtle Grid Background for the "App" */}
// // // // // //                   <div className="absolute inset-0 opacity-10 bg-[url('https://vercel.app')] brightness-200" />
                  
// // // // // //                   {/* Visualizing Data */}
// // // // // //                   <div className="flex items-end gap-3 h-40 relative z-10">
// // // // // //                     {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
// // // // // //                       <div 
// // // // // //                         key={i} 
// // // // // //                         className="w-4 md:w-10 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-full animate-pulse"
// // // // // //                         style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} 
// // // // // //                       />
// // // // // //                     ))}
// // // // // //                   </div>
// // // // // //               </div>
// // // // // //            </div>
// // // // // //         </div>
// // // // // //       </section>

// // // // // //       {/* --- FEATURES --- */}
// // // // // //       <section className="feature-grid relative z-10 py-32 px-6 max-w-7xl mx-auto">
// // // // // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // // // // //           {[
// // // // // //             { icon: "⚡", title: "Real-time", desc: "Transactions sync before you leave the store." },
// // // // // //             { icon: "🛡️", title: "Vault-Grade", desc: "AES-256 encryption. We don't see your data." },
// // // // // //             { icon: "📈", title: "Insights", desc: "AI that actually understands your coffee habit." }
// // // // // //           ].map((f, i) => (
// // // // // //             <div key={i} className="feature-card glass p-10 rounded-[2.5rem] border border-white/10 flex flex-col gap-4 hover:bg-white/5 transition-colors">
// // // // // //               <span className="text-4xl">{f.icon}</span>
// // // // // //               <h3 className="text-2xl font-bold">{f.title}</h3>
// // // // // //               <p className="opacity-50 text-sm leading-relaxed">{f.desc}</p>
// // // // // //             </div>
// // // // // //           ))}
// // // // // //         </div>
// // // // // //       </section>

// // // // // //       {/* --- ELITE FOOTER CTA --- */}
// // // // // //       <section className="relative z-10 pb-40 px-6">
// // // // // //         <div className="glass-strong p-12 md:p-32 rounded-[3rem] text-center border border-white/10 relative overflow-hidden">
// // // // // //           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
// // // // // //           <h2 className="text-4xl md:text-7xl font-bold mb-10 tracking-tighter italic">Ready to go clear?</h2>
// // // // // //           <button className="px-16 py-6 glass-strong rounded-full font-black text-sm uppercase tracking-widest hover:scale-110 active:scale-95 transition-all border border-white/20">
// // // // // //             Create Account
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </section>
// // // // // //     </div>
// // // // // //   );
// // // // // // }


// // // // // 'use client';
// // // // // import { useEffect, useRef } from 'react';
// // // // // import { gsap } from 'gsap';
// // // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // // // // if (typeof window !== 'undefined') {
// // // // //   gsap.registerPlugin(ScrollTrigger);
// // // // // }

// // // // // export default function LandingPage() {
// // // // //   const containerRef = useRef(null);

// // // // //   useEffect(() => {
// // // // //     const ctx = gsap.context(() => {
// // // // //       const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

// // // // //       tl.from(".reveal-text", {
// // // // //         y: 80,
// // // // //         opacity: 0,
// // // // //         duration: 1.2,
// // // // //         stagger: 0.1,
// // // // //       })
// // // // //       .from(".dashboard-preview", {
// // // // //         y: 40,
// // // // //         opacity: 0,
// // // // //         scale: 0.98,
// // // // //         duration: 1.5,
// // // // //       }, "-=0.8");

// // // // //       // Ticker Animation
// // // // //       gsap.to(".ticker-content", {
// // // // //         xPercent: -50,
// // // // //         repeat: -1,
// // // // //         duration: 20,
// // // // //         ease: "none",
// // // // //       });
// // // // //     }, containerRef);

// // // // //     return () => ctx.revert();
// // // // //   }, []);

// // // // //   return (
// // // // //     // FIX: Added min-w-full and touch-action to prevent the 70% width glitch
// // // // //     <div ref={containerRef} className="relative min-h-screen w-full min-w-full overflow-x-hidden bg-[var(--background)] touch-manipulation">
      
// // // // //       {/* 🔮 Background Glows */}
// // // // //       <div className="glow-1 glow-indigo fixed -top-20 -left-20 w-[300px] h-[300px] md:w-[800px] md:h-[800px] opacity-20 blur-[120px] pointer-events-none z-0" />
// // // // //       <div className="glow-2 glow-purple fixed -bottom-20 -right-20 w-[300px] h-[300px] md:w-[800px] md:h-[800px] opacity-20 blur-[120px] pointer-events-none z-0" />

// // // // //       {/* 💹 FINANCE ELEMENT: Ticker Tape */}
// // // // //       <div className="relative z-20 w-full border-y border-white/5 bg-white/5 backdrop-blur-md py-2 overflow-hidden">
// // // // //         <div className="ticker-content flex whitespace-nowrap gap-10 text-[10px] font-mono uppercase tracking-widest opacity-50">
// // // // //           {[1, 2].map((i) => (
// // // // //             <div key={i} className="flex gap-10 items-center">
// // // // //               <span>Savings +12.4%</span>
// // // // //               <span className="text-green-500">▲ $4,240.00</span>
// // // // //               <span>Expenses -5.2%</span>
// // // // //               <span className="text-red-500">▼ $1,120.00</span>
// // // // //               <span>Net Worth Growth</span>
// // // // //               <span className="text-blue-500">↗ Stable</span>
// // // // //             </div>
// // // // //           ))}
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* --- HERO --- */}
// // // // //       <section className="relative z-10 pt-16 md:pt-32 pb-20 px-6 w-full flex flex-col items-center">
// // // // //         <div className="flex items-center gap-2 mb-4 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
// // // // //             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
// // // // //             <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Live Market Analysis Active</span>
// // // // //         </div>
        
// // // // //         <h1 className="text-center text-[3rem] md:text-[9rem] font-bold tracking-tighter leading-[0.85] mb-8">
// // // // //           <div className="overflow-hidden">
// // // // //             <span className="reveal-text block">TRACKING</span>
// // // // //           </div>
// // // // //           <div className="overflow-hidden">
// // // // //             <span className="reveal-text block text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 dark:from-white dark:to-white/20">
// // // // //               REDEFINED.
// // // // //             </span>
// // // // //           </div>
// // // // //         </h1>

// // // // //         <p className="reveal-text text-center text-gray-500 max-w-lg md:text-xl mb-12 leading-relaxed font-medium">
// // // // //           The ultimate financial terminal for your personal wealth. <br />
// // // // //           Precision tracking meets glassmorphism.
// // // // //         </p>

// // // // //         {/* --- DEVICE MOCKUP (FINANCE STYLE) --- */}
// // // // //         <div className="dashboard-preview w-full max-w-5xl px-2 md:px-0">
// // // // //            <div className="glass-strong rounded-[2.5rem] p-3 md:p-6 border border-white/20 shadow-2xl">
// // // // //               <div className="bg-[#050505] rounded-[2rem] h-[350px] md:h-[600px] relative overflow-hidden p-6 md:p-10">
                  
// // // // //                   {/* Internal App UI Header */}
// // // // //                   <div className="flex justify-between items-start mb-10">
// // // // //                     <div>
// // // // //                       <p className="text-[10px] uppercase opacity-40 font-bold mb-1">Portfolio Value</p>
// // // // //                       <h2 className="text-3xl md:text-5xl font-mono">$142,500.42</h2>
// // // // //                     </div>
// // // // //                     <div className="glass px-4 py-2 rounded-xl text-[10px] font-bold border-white/5">24H HIGH</div>
// // // // //                   </div>

// // // // //                   {/* The Graph Effect */}
// // // // //                   <div className="flex items-end gap-2 md:gap-4 h-48 md:h-64 relative z-10 border-b border-white/5">
// // // // //                     {[40, 70, 55, 90, 65, 80, 100].map((h, i) => (
// // // // //                       <div key={i} className="flex-1 flex flex-col items-center group">
// // // // //                         <div 
// // // // //                           className="w-full bg-gradient-to-t from-blue-600/20 to-blue-400 rounded-t-lg transition-all duration-1000 relative"
// // // // //                           style={{ height: `${h}%` }} 
// // // // //                         >
// // // // //                            {/* Hover price tooltip */}
// // // // //                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono">
// // // // //                              ${(h * 120).toLocaleString()}
// // // // //                            </div>
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     ))}
// // // // //                   </div>

// // // // //                   {/* Bottom Labels */}
// // // // //                   <div className="flex justify-between mt-4 text-[9px] font-mono opacity-30 uppercase tracking-widest">
// // // // //                     <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span>
// // // // //                   </div>
// // // // //               </div>
// // // // //            </div>
// // // // //         </div>
// // // // //       </section>

// // // // //       {/* --- QUICK STATS GRID --- */}
// // // // //       <section className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 max-w-7xl mx-auto py-10">
// // // // //          {[
// // // // //            { label: "Assets", val: "+$12k" },
// // // // //            { label: "Liabilities", val: "-$2.4k" },
// // // // //            { label: "Equity", val: "84%" },
// // // // //            { label: "Score", val: "820" }
// // // // //          ].map((stat, i) => (
// // // // //            <div key={i} className="glass p-6 rounded-3xl border border-white/5">
// // // // //              <p className="text-[10px] uppercase opacity-40 mb-1">{stat.label}</p>
// // // // //              <p className="text-xl font-bold font-mono">{stat.val}</p>
// // // // //            </div>
// // // // //          ))}
// // // // //       </section>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // 'use client';
// // // // import { useEffect, useRef } from 'react';
// // // // import { gsap } from 'gsap';
// // // // import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // // // if (typeof window !== 'undefined') {
// // // //   gsap.registerPlugin(ScrollTrigger);
// // // // }

// // // // export default function LandingPage() {
// // // //   const containerRef = useRef(null);

// // // //   useEffect(() => {
// // // //     const ctx = gsap.context(() => {
// // // //       const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

// // // //       // 1. Smooth Reveal
// // // //       tl.from(".reveal-text", {
// // // //         y: 80,
// // // //         opacity: 0,
// // // //         duration: 1.2,
// // // //         stagger: 0.1,
// // // //       })
// // // //       .from(".main-terminal", {
// // // //         y: 60,
// // // //         opacity: 0,
// // // //         duration: 1.5,
// // // //       }, "-=0.8");

// // // //       // 2. Animated Ticker
// // // //       gsap.to(".ticker-content", {
// // // //         xPercent: -50,
// // // //         repeat: -1,
// // // //         duration: 25,
// // // //         ease: "none",
// // // //       });

// // // //       // 3. Card Entrance on Scroll
// // // //       gsap.from(".feature-card", {
// // // //         scrollTrigger: {
// // // //           trigger: ".feature-grid",
// // // //           start: "top 85%",
// // // //         },
// // // //         y: 40,
// // // //         opacity: 0,
// // // //         scale: 0.95,
// // // //         duration: 1,
// // // //         stagger: 0.1,
// // // //       });
// // // //     }, containerRef);

// // // //     return () => ctx.revert();
// // // //   }, []);

// // // //   return (
// // // //     <div ref={containerRef} className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden selection:bg-blue-500/30">
      
// // // //       {/* 🔮 Fixed Ambient Glows (Z-Index adjusted to not block scroll) */}
// // // //       <div className="glow-indigo fixed -top-20 -left-20 w-[300px] h-[300px] md:w-[800px] md:h-[800px] opacity-20 blur-[120px] pointer-events-none z-0" />
// // // //       <div className="glow-purple fixed -bottom-20 -right-20 w-[300px] h-[300px] md:w-[800px] md:h-[800px] opacity-20 blur-[120px] pointer-events-none z-0" />

// // // //       {/* 💹 Multi-Currency Ticker */}
// // // //       <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl py-3 overflow-hidden">
// // // //         <div className="ticker-content flex whitespace-nowrap gap-12 text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">
// // // //           {[1, 2].map((i) => (
// // // //             <div key={i} className="flex gap-12 items-center">
// // // //               <span className="flex gap-2">USD/INR <span className="text-green-500">83.42</span></span>
// // // //               <span className="flex gap-2">EUR/USD <span className="text-red-500">1.08</span></span>
// // // //               <span className="flex gap-2">GBP/INR <span className="text-blue-500">105.12</span></span>
// // // //               <span className="text-blue-400">● TOTAL NET WORTH CALCULATED IN PREFERRED CURRENCY</span>
// // // //               <span className="text-indigo-400">● AI REVENUE ANALYTICS ACTIVE</span>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </div>

// // // //       {/* --- HERO --- */}
// // // //       <section className="relative z-10 pt-16 md:pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
// // // //         <div className="inline-flex items-center gap-2 mb-6 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
// // // //           <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
// // // //           <span className="text-[11px] font-black uppercase tracking-widest text-blue-500">Intelligence v2.4</span>
// // // //         </div>

// // // //         <h1 className="text-center text-[3rem] md:text-[8.5rem] font-bold tracking-tighter leading-[0.85] mb-8">
// // // //           <div className="overflow-hidden">
// // // //             <span className="reveal-text block">FINANCE</span>
// // // //           </div>
// // // //           <div className="overflow-hidden">
// // // //             <span className="reveal-text block text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 dark:from-white dark:to-white/20">
// // // //               TERMINAL.
// // // //             </span>
// // // //           </div>
// // // //         </h1>

// // // //         <p className="reveal-text text-center text-gray-500 max-w-2xl md:text-xl mb-12 leading-relaxed font-medium">
// // // //           The all-in-one ecosystem for your wealth. Track net worth across currencies, manage loans, 
// // // //           automate receipts, and predict trends with industry-level precision.
// // // //         </p>

// // // //         {/* --- MAIN TERMINAL MOCKUP --- */}
// // // //         <div className="main-terminal w-full max-w-6xl relative group">
// // // //           <div className="glass-strong rounded-[2.5rem] p-3 md:p-6 border border-white/20 shadow-2xl relative z-10">
// // // //             <div className="bg-[#080808] rounded-[2rem] min-h-[400px] md:h-[650px] relative overflow-hidden p-6 md:p-12 text-white">
              
// // // //               {/* Terminal Top Bar */}
// // // //               <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
// // // //                 <div>
// // // //                   <p className="text-[10px] uppercase text-blue-400 font-black tracking-widest mb-2">Consolidated Net Worth</p>
// // // //                   <h2 className="text-4xl md:text-6xl font-mono tracking-tight">$420,690.00 <span className="text-xl opacity-40">USD</span></h2>
// // // //                 </div>
// // // //                 <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
// // // //                   <div className="glass p-4 rounded-2xl border-white/5">
// // // //                     <p className="text-[9px] opacity-40 uppercase">Loan Balance</p>
// // // //                     <p className="text-sm font-bold text-red-400">-$12,400</p>
// // // //                   </div>
// // // //                   <div className="glass p-4 rounded-2xl border-white/5">
// // // //                     <p className="text-[9px] opacity-40 uppercase">Credit Used</p>
// // // //                     <p className="text-sm font-bold text-yellow-400">22% Left</p>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>

// // // //               {/* Main Revenue Chart Area */}
// // // //               <div className="relative h-64 border-b border-white/5 flex items-end gap-1 md:gap-3">
// // // //                  {[40, 70, 45, 90, 65, 80, 100, 75, 50, 85, 95, 110].map((h, i) => (
// // // //                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400 rounded-t-sm transition-all duration-1000 animate-pulse" 
// // // //                         style={{ height: `${(h/110) * 100}%`, animationDelay: `${i * 0.1}s` }} />
// // // //                  ))}
// // // //                  <div className="absolute top-4 right-4 glass px-3 py-1 rounded-lg text-[10px] font-mono text-green-400">REVENUE ANALYTICS: POSITIVE</div>
// // // //               </div>

// // // //               {/* Terminal Bottom Grid */}
// // // //               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
// // // //                  <div className="space-y-1">
// // // //                     <p className="text-[9px] uppercase opacity-40">Savings Target</p>
// // // //                     <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
// // // //                       <div className="w-[75%] h-full bg-blue-500" />
// // // //                     </div>
// // // //                     <p className="text-[10px] font-bold">75.4%</p>
// // // //                  </div>
// // // //                  <div className="space-y-1">
// // // //                     <p className="text-[9px] uppercase opacity-40">Next Payable</p>
// // // //                     <p className="text-[10px] font-bold text-orange-400">Due in 2 days</p>
// // // //                  </div>
// // // //                  <div className="hidden md:block space-y-1">
// // // //                     <p className="text-[9px] uppercase opacity-40">Receipts Scanned</p>
// // // //                     <p className="text-[10px] font-bold uppercase">1,242 Items</p>
// // // //                  </div>
// // // //                  <div className="space-y-1">
// // // //                     <p className="text-[9px] uppercase opacity-40">Currency</p>
// // // //                     <p className="text-[10px] font-bold uppercase">Auto-Converted</p>
// // // //                  </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // // //       {/* --- FEATURE GRID (Detailed Abilities) --- */}
// // // //       <section className="feature-grid py-20 px-6 max-w-7xl mx-auto">
// // // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // // //           <div className="feature-card glass p-10 rounded-[2.5rem] border border-white/10 group hover:border-blue-500/50 transition-all">
// // // //             <div className="text-3xl mb-6 group-hover:scale-110 transition-transform">🌍</div>
// // // //             <h3 className="text-2xl font-bold mb-4">Multi-Currency</h3>
// // // //             <p className="opacity-50 text-sm leading-relaxed">Automatic real-time exchange rates. See your global net worth in any preferred currency instantly.</p>
// // // //           </div>
          
// // // //           <div className="feature-card glass p-10 rounded-[2.5rem] border border-white/10 group hover:border-red-500/50 transition-all">
// // // //             <div className="text-3xl mb-6 group-hover:scale-110 transition-transform">📉</div>
// // // //             <h3 className="text-2xl font-bold mb-4">Debt Management</h3>
// // // //             <p className="opacity-50 text-sm leading-relaxed">Track loan balances, credit limits, and set alerts for when your liquid amount drops too low.</p>
// // // //           </div>

// // // //           <div className="feature-card glass p-10 rounded-[2.5rem] border border-white/10 group hover:border-purple-500/50 transition-all">
// // // //             <div className="text-3xl mb-6 group-hover:scale-110 transition-transform">📄</div>
// // // //             <h3 className="text-2xl font-bold mb-4">Receipt Vault</h3>
// // // //             <p className="opacity-50 text-sm leading-relaxed">Upload and link receipts to every transaction. Digital bookkeeping that’s ready for tax season.</p>
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // // //       {/* --- NOTIFICATION PREVIEW --- */}
// // // //       <section className="py-20 px-6 flex justify-center">
// // // //         <div className="glass-strong p-8 md:p-12 rounded-[3rem] border border-white/10 max-w-3xl w-full relative overflow-hidden">
// // // //           <div className="flex gap-4 items-center">
// // // //              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-500">🔔</div>
// // // //              <div>
// // // //                <h4 className="font-bold">Payable Alert</h4>
// // // //                <p className="text-sm opacity-60">Rent due in 48 hours. Current balance is below safe threshold.</p>
// // // //              </div>
// // // //           </div>
// // // //         </div>
// // // //       </section>

// // // //       {/* --- ELITE FOOTER --- */}
// // // //       <section className="py-24 text-center">
// // // //         <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tighter italic">Ready for total control?</h2>
// // // //         <button className="px-16 py-6 glass-strong rounded-full font-black uppercase tracking-widest text-xs hover:scale-110 active:scale-95 transition-all">
// // // //           Initialize Terminal
// // // //         </button>
// // // //       </section>
// // // //     </div>
// // // //   );
// // // // }

// // // 'use client';
// // // import { useEffect, useRef, useState } from 'react';
// // // import { gsap } from 'gsap';
// // // import { ScrollTrigger } from 'gsap/ScrollTrigger';
// // // import Link from 'next/link';

// // // if (typeof window !== 'undefined') {
// // //   gsap.registerPlugin(ScrollTrigger);
// // // }

// // // export default function LandingPage() {
// // //   const containerRef = useRef(null);
// // //   const [isLoggingIn, setIsLoggingIn] = useState(false);
// // //   const [isSigningUp, setIsSigningUp] = useState(false);

// // //   useEffect(() => {
// // //     const ctx = gsap.context(() => {
// // //       const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
// // //       tl.from(".reveal-text", { y: 80, opacity: 0, duration: 1.2, stagger: 0.1 })
// // //         .from(".main-terminal", { y: 40, opacity: 0, duration: 1.5 }, "-=0.8");

// // //       gsap.to(".ticker-content", { xPercent: -50, repeat: -1, duration: 25, ease: "none" });
// // //     }, containerRef);
// // //     return () => ctx.revert();
// // //   }, []);

// // //   const handleAuth = (type: 'login' | 'signup') => {
// // //     if (type === 'login') setIsLoggingIn(true);
// // //     else setIsSigningUp(true);
// // //     // Simulate navigation/auth delay
// // //     setTimeout(() => {
// // //       window.location.href = type === 'login' ? '/auth/login' : '/auth/register';
// // //     }, 800);
// // //   };

// // //   return (
// // //     <div ref={containerRef} className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden selection:bg-blue-500/30">
      
// // //       {/* 🔮 Background Glows - Adjusted for Mobile Scale */}
// // //       <div className="glow-indigo fixed -top-10 -left-10 w-[250px] h-[250px] md:w-[800px] md:h-[800px] opacity-20 blur-[80px] md:blur-[120px] pointer-events-none z-0" />
// // //       <div className="glow-purple fixed -bottom-10 -right-10 w-[250px] h-[250px] md:w-[800px] md:h-[800px] opacity-20 blur-[80px] md:blur-[120px] pointer-events-none z-0" />

// // //       {/* 💹 Sticky Ticker */}
// // //       <div className="sticky top-0 z-50 w-full border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl py-3 overflow-hidden">
// // //         <div className="ticker-content flex whitespace-nowrap gap-8 md:gap-12 text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">
// // //           {[1, 2].map((i) => (
// // //             <div key={i} className="flex gap-8 md:gap-12 items-center">
// // //               <span>USD/INR <span className="text-green-500">83.42</span></span>
// // //               <span>EUR/USD <span className="text-red-500">1.08</span></span>
// // //               <span className="text-blue-400">● MULTI-CURRENCY CONSOLIDATION</span>
// // //               <span className="text-indigo-400">● AI REVENUE ANALYTICS</span>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* --- HERO --- */}
// // //       <section className="relative z-10 pt-12 md:pt-24 pb-16 px-5 max-w-7xl mx-auto flex flex-col items-center">
// // //         <div className="inline-flex items-center gap-2 mb-6 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
// // //           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
// // //           <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Intelligence v2.4</span>
// // //         </div>

// // //         <h1 className="text-center text-[2.8rem] md:text-[8.5rem] font-bold tracking-tighter leading-[0.9] mb-8 w-full max-w-full overflow-hidden">
// // //           <div className="overflow-hidden">
// // //             <span className="reveal-text block">FINANCE</span>
// // //           </div>
// // //           <div className="overflow-hidden">
// // //             <span className="reveal-text block text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 dark:from-white dark:to-white/20">
// // //               TERMINAL.
// // //             </span>
// // //           </div>
// // //         </h1>

// // //         <p className="reveal-text text-center text-gray-500 max-w-2xl text-sm md:text-xl mb-10 leading-relaxed font-medium px-2">
// // //           Consolidate net worth, manage loans, and automate receipts in a unified glassmorphism ecosystem.
// // //         </p>

// // //         {/* --- AUTH BUTTONS WITH LOADING --- */}
// // //         <div className="reveal-text flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none justify-center mb-16 px-4">
// // //           <button 
// // //             onClick={() => handleAuth('signup')}
// // //             disabled={isSigningUp || isLoggingIn}
// // //             className="group relative px-8 py-4 bg-foreground text-background rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
// // //           >
// // //             {isSigningUp && <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />}
// // //             {isSigningUp ? "Initializing..." : "Get Early Access"}
// // //           </button>
          
// // //           <button 
// // //             onClick={() => handleAuth('login')}
// // //             disabled={isSigningUp || isLoggingIn}
// // //             className="px-8 py-4 glass-strong rounded-2xl font-bold border border-white/20 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
// // //           >
// // //             {isLoggingIn && <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />}
// // //             {isLoggingIn ? "Verifying..." : "Login"}
// // //           </button>
// // //         </div>

// // //         {/* --- MAIN TERMINAL MOCKUP (Mobile Responsive) --- */}
// // //         <div className="main-terminal w-full max-w-6xl relative px-1">
// // //           <div className="glass-strong rounded-[2rem] md:rounded-[2.5rem] p-2 md:p-6 border border-white/20 shadow-2xl">
// // //             <div className="bg-[#080808] rounded-[1.8rem] min-h-[350px] md:min-h-[600px] relative overflow-hidden p-6 md:p-12 text-white">
              
// // //               {/* Terminal Stats */}
// // //               <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
// // //                 <div className="w-full">
// // //                   <p className="text-[9px] uppercase text-blue-400 font-black tracking-widest mb-1">Portfolio Balance</p>
// // //                   <h2 className="text-3xl md:text-6xl font-mono">$420,690<span className="text-sm opacity-40 ml-2">USD</span></h2>
// // //                 </div>
// // //                 <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 scrollbar-hide">
// // //                   <div className="glass p-3 rounded-xl border-white/5 min-w-[120px]">
// // //                     <p className="text-[8px] opacity-40 uppercase">Debt</p>
// // //                     <p className="text-xs font-bold text-red-400">-$12.4k</p>
// // //                   </div>
// // //                   <div className="glass p-3 rounded-xl border-white/5 min-w-[120px]">
// // //                     <p className="text-[8px] opacity-40 uppercase">Credit</p>
// // //                     <p className="text-xs font-bold text-yellow-400">22% Used</p>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* Chart (Responsive heights) */}
// // //               <div className="relative h-40 md:h-72 border-b border-white/5 flex items-end gap-1 md:gap-3 px-1">
// // //                  {[40, 70, 50, 90, 60, 100, 80].map((h, i) => (
// // //                    <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/40 to-blue-400 rounded-t-sm transition-all duration-1000 animate-pulse" 
// // //                         style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
// // //                  ))}
// // //               </div>

// // //               {/* Terminal Grid (Stacked on Mobile) */}
// // //               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
// // //                  <div className="space-y-1">
// // //                     <p className="text-[8px] uppercase opacity-40">Target</p>
// // //                     <div className="w-full h-1 bg-white/10 rounded-full"><div className="w-[75%] h-full bg-blue-500" /></div>
// // //                     <p className="text-[9px] font-bold">75.4%</p>
// // //                  </div>
// // //                  <div className="space-y-1">
// // //                     <p className="text-[8px] uppercase opacity-40">Payable</p>
// // //                     <p className="text-[9px] font-bold text-orange-400">Due 48h</p>
// // //                  </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </section>

// // //       {/* --- FEATURES (Improved Spacing) --- */}
// // //       <section className="py-20 px-5 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
// // //           {[
// // //             { t: "Currency Native", d: "Real-time consolidated views in USD, EUR, or INR.", i: "🌍" },
// // //             { t: "Loan Tracker", d: "Visualize debt reduction and credit limits.", i: "📉" },
// // //             { t: "Receipt Scan", d: "Link digital receipts to every transaction.", i: "📄" }
// // //           ].map((f, i) => (
// // //             <div key={i} className="feature-card glass p-8 rounded-[2rem] border border-white/10">
// // //               <span className="text-2xl mb-4 block">{f.i}</span>
// // //               <h3 className="text-lg font-bold mb-2">{f.t}</h3>
// // //               <p className="opacity-50 text-xs leading-relaxed">{f.d}</p>
// // //             </div>
// // //           ))}
// // //       </section>
// // //     </div>
// // //   );
// // // }

// // 'use client';
// // import { useEffect, useRef, useState } from 'react';
// // import { gsap } from 'gsap';
// // import { ScrollTrigger } from 'gsap/ScrollTrigger';

// // if (typeof window !== 'undefined') {
// //   gsap.registerPlugin(ScrollTrigger);
// // }

// // export default function LandingPage() {
// //   const containerRef = useRef(null);
// //   const [loadingType, setLoadingType] = useState<'login' | 'signup' | null>(null);

// //   useEffect(() => {
// //     const ctx = gsap.context(() => {
// //       const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
// //       tl.from(".reveal-text", { y: 60, opacity: 0, duration: 1, stagger: 0.1 })
// //         .from(".main-terminal", { y: 40, opacity: 0, scale: 0.98, duration: 1.2 }, "-=0.6");
      
// //       gsap.to(".ticker-content", { xPercent: -50, repeat: -1, duration: 30, ease: "none" });
// //     }, containerRef);
// //     return () => ctx.revert();
// //   }, []);

// //   const handleNav = (type: 'login' | 'signup') => {
// //     setLoadingType(type);
// //     setTimeout(() => {
// //       window.location.href = type === 'login' ? '/auth/login' : '/auth/register';
// //     }, 800);
// //   };

// //   const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
// //     <div className="feature-card glass p-8 rounded-[2.5rem] border border-white/10 flex flex-col gap-3 group hover:bg-white/5 transition-all">
// //       <div className="text-3xl group-hover:scale-110 transition-transform w-fit">{icon}</div>
// //       <h3 className="text-lg font-bold tracking-tight">{title}</h3>
// //       <p className="text-xs opacity-50 leading-relaxed">{desc}</p>
// //     </div>
// //   );

// //   return (
// //     <div ref={containerRef} className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden flex flex-col items-center">
      
// //       {/* 🔮 Fixed Ambient Glows */}
// //       <div className="glow-indigo fixed top-[-10%] left-[-10%] w-[300px] md:w-[800px] h-[300px] md:h-[800px] opacity-20 blur-[100px] pointer-events-none" />
// //       <div className="glow-purple fixed bottom-[-10%] right-[-10%] w-[300px] md:w-[800px] h-[300px] md:h-[800px] opacity-20 blur-[100px] pointer-events-none" />

// //       {/* 💹 Ticker Tape */}
// //       <div className="sticky top-0 z-[60] w-full border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl py-3 overflow-hidden">
// //         <div className="ticker-content flex whitespace-nowrap gap-10 text-[10px] font-mono font-bold tracking-widest opacity-40">
// //           {[1, 2].map((i) => (
// //             <div key={i} className="flex gap-10 items-center">
// //               <span>NET WORTH GROWTH: +14.2%</span>
// //               <span className="text-indigo-400">● MULTI-CURRENCY ENGINE ACTIVE</span>
// //               <span>USD/INR: 83.42</span>
// //               <span className="text-green-500">● AI PREDICTIONS SYNCED</span>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* --- HERO --- */}
// //       <section className="relative z-10 w-full max-w-7xl pt-16 md:pt-32 pb-20 px-6 flex flex-col items-center text-center">
// //         <div className="reveal-text inline-flex items-center gap-2 mb-8 bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">
// //           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
// //           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">System Live</span>
// //         </div>

// //         <h1 className="reveal-text text-[13vw] md:text-[8.5rem] font-bold tracking-tighter leading-[0.85] mb-8 select-none">
// //           FINANCE<br />
// //           <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 dark:from-white dark:to-white/10">TERMINAL.</span>
// //         </h1>

// //         <p className="reveal-text text-gray-500 max-w-xl text-base md:text-xl mb-12 font-medium leading-relaxed">
// //           The all-in-one ecosystem to track net worth, manage loans, and automate your financial life with glass clarity.
// //         </p>

// //         {/* --- DUAL ACTION BUTTONS --- */}
// //         <div className="reveal-text flex flex-col md:flex-row gap-4 w-full max-w-sm md:max-w-none justify-center">
// //           <button 
// //             onClick={() => handleNav('signup')}
// //             disabled={!!loadingType}
// //             className="w-full md:w-auto px-10 py-5 bg-foreground text-background rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl"
// //           >
// //             {loadingType === 'signup' ? <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" /> : "Access Terminal"}
// //           </button>
          
// //           <button 
// //             onClick={() => handleNav('login')}
// //             disabled={!!loadingType}
// //             className="w-full md:w-auto px-10 py-5 glass-strong border border-white/20 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-3"
// //           >
// //             {loadingType === 'login' ? <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" /> : "Member Login"}
// //           </button>
// //         </div>

// //         {/* --- TERMINAL MOCKUP --- */}
// //         <div className="main-terminal mt-20 w-full max-w-6xl">
// //           <div className="glass-strong rounded-[2.5rem] p-2 md:p-4 border border-white/20 shadow-2xl">
// //             <div className="bg-[#050505] rounded-[2rem] min-h-[380px] md:h-[650px] relative overflow-hidden p-8 md:p-14 text-white flex flex-col">
              
// //               <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
// //                 <div className="text-left">
// //                   <p className="text-[10px] uppercase text-indigo-400 font-black tracking-widest mb-2">Net Worth Consolidated</p>
// //                   <h2 className="text-4xl md:text-7xl font-mono">$420,690.42</h2>
// //                 </div>
// //                 <div className="flex gap-4 w-full md:w-auto">
// //                    <div className="glass px-5 py-3 rounded-2xl border-white/5 flex-1 md:flex-none">
// //                       <p className="text-[8px] opacity-40 uppercase">Debt Ratio</p>
// //                       <p className="text-sm font-bold text-red-500">12.4%</p>
// //                    </div>
// //                    <div className="glass px-5 py-3 rounded-2xl border-white/5 flex-1 md:flex-none">
// //                       <p className="text-[8px] opacity-40 uppercase">Liquidity</p>
// //                       <p className="text-sm font-bold text-green-500">Stable</p>
// //                    </div>
// //                 </div>
// //               </div>

// //               {/* Data Visualizer */}
// //               <div className="flex-grow flex items-end gap-1.5 md:gap-4 border-b border-white/5 pb-1 relative">
// //                 {[60, 40, 90, 70, 100, 80, 50, 110, 95].map((h, i) => (
// //                   <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600/20 to-indigo-500 rounded-t-sm animate-pulse" 
// //                        style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* --- FEATURE CARDS (Detailed Ability Showcase) --- */}
// //       <section className="relative z-10 w-full max-w-7xl py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
// //         <FeatureCard 
// //           icon="🌍" 
// //           title="Global Currencies" 
// //           desc="Automatic FX conversion. Track accounts in USD, EUR, INR and see your net worth in your local currency." 
// //         />
// //         <FeatureCard 
// //           icon="📊" 
// //           title="Revenue Analytics" 
// //           desc="Deep dive into your income streams. AI-powered trends help you spot growth opportunities instantly." 
// //         />
// //         <FeatureCard 
// //           icon="📄" 
// //           title="Receipt Vault" 
// //           desc="Snap and link receipts to transactions. Automatic categorization ensures your records are tax-ready." 
// //         />
// //         <FeatureCard 
// //           icon="🔔" 
// //           title="Smart Payables" 
// //           desc="Never miss a payment. Get intelligent notifications for upcoming dues and low-balance thresholds." 
// //         />
// //         <FeatureCard 
// //           icon="🏦" 
// //           title="Loan Architect" 
// //           desc="Visualize your debt-free journey. Track loan balances, interest impacts, and payoff timelines." 
// //         />
// //         <FeatureCard 
// //           icon="🎯" 
// //           title="Savings Targets" 
// //           desc="Set and track multiple savings goals with real-time progression charts and trend forecasting." 
// //         />
// //       </section>

// //       {/* --- MOBILE OPTIMIZED FOOTER CTA --- */}
// //       <section className="relative z-10 py-32 px-6 w-full max-w-4xl text-center">
// //          <div className="glass-strong p-12 md:p-24 rounded-[3rem] border border-white/10">
// //             <h2 className="text-3xl md:text-6xl font-bold tracking-tighter mb-10 italic">Secure your future.</h2>
// //             <button className="px-12 py-5 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
// //               Initialize Terminal
// //             </button>
// //          </div>
// //       </section>
// //     </div>
// //   );
// // }

// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(ScrollTrigger);
// }

// export default function LandingPage() {
//   const containerRef = useRef(null);
//   const [loadingType, setLoadingType] = useState<'login' | 'signup' | null>(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // 1. Hero Entrance
//       gsap.from(".hero-content > *", {
//         y: 40,
//         opacity: 0,
//         duration: 1,
//         stagger: 0.1,
//         ease: "expo.out"
//       });

//       // 2. Stacking Cards Animation
//       // This creates the "slide out one by one" effect
//       const cards = gsap.utils.toArray('.stack-card');
//       cards.forEach((card: any, i) => {
//         gsap.from(card, {
//           scrollTrigger: {
//             trigger: card,
//             start: "top bottom-=100",
//             end: "top center",
//             scrub: true,
//           },
//           y: 100,
//           scale: 0.9,
//           opacity: 0,
//           rotateX: -10,
//         });
//       });

//       // 3. Ticker
//       gsap.to(".ticker-content", { xPercent: -50, repeat: -1, duration: 30, ease: "none" });
//     }, containerRef);
//     return () => ctx.revert();
//   }, []);

//   const handleNav = (type: 'login' | 'signup') => {
//     setLoadingType(type);
//     setTimeout(() => {
//       window.location.href = type === 'login' ? '/auth/login' : '/auth/register';
//     }, 800);
//   };

//   return (
//     <div ref={containerRef} className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden flex flex-col items-center selection:bg-indigo-500/30">
      
//       {/* 🔮 Fixed Ambient Glows */}
//       <div className="glow-indigo fixed top-0 left-0 w-full h-[50vh] opacity-20 blur-[100px] pointer-events-none" />
//       <div className="glow-purple fixed bottom-0 right-0 w-full h-[50vh] opacity-20 blur-[100px] pointer-events-none" />

//       {/* 💹 Ticker Tape */}
//       <div className="sticky top-0 z-[100] w-full border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl py-3">
//         <div className="ticker-content flex whitespace-nowrap gap-10 text-[9px] font-mono font-bold tracking-widest opacity-40">
//           {[1, 2].map((i) => (
//             <div key={i} className="flex gap-10 items-center">
//               <span>NET WORTH GROWTH: +14.2%</span>
//               <span className="text-indigo-400">● MULTI-CURRENCY ENGINE ACTIVE</span>
//               <span>USD/INR: 83.42</span>
//               <span className="text-green-500">● AI PREDICTIONS SYNCED</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* --- HERO SECTION --- */}
//       <section className="hero-content relative z-10 w-full px-6 pt-12 md:pt-32 pb-16 flex flex-col items-center text-center max-w-full">
//         <div className="inline-flex items-center gap-2 mb-6 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
//           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
//           <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">System Live</span>
//         </div>

//         <h1 className="text-[12vw] md:text-[9rem] font-bold tracking-tighter leading-[0.85] mb-8 w-full max-w-full overflow-hidden break-words">
//           FINANCE<br />
//           <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 dark:from-white dark:to-white/10">TERMINAL.</span>
//         </h1>

//         <p className="text-gray-500 max-w-xl text-sm md:text-xl mb-12 font-medium leading-relaxed px-4">
//           Visualise wealth across currencies. Manage loans, receipts, and net worth targets with glass clarity.
//         </p>

//         {/* --- DUAL ACTION BUTTONS --- */}
//         <div className="flex flex-col md:flex-row gap-4 w-full max-w-[320px] md:max-w-none justify-center px-4 mb-20">
//           <button onClick={() => handleNav('signup')} disabled={!!loadingType} className="w-full md:w-auto px-10 py-5 bg-foreground text-background rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-3">
//             {loadingType === 'signup' ? <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" /> : "Access Terminal"}
//           </button>
//           <button onClick={() => handleNav('login')} disabled={!!loadingType} className="w-full md:w-auto px-10 py-5 glass-strong border border-white/20 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center gap-3">
//             {loadingType === 'login' ? <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" /> : "Member Login"}
//           </button>
//         </div>

//         {/* --- DYNAMIC CHART PREVIEW --- */}
//         <div className="w-full max-w-6xl px-2 md:px-6 mb-32">
//           <div className="glass-strong rounded-[2.5rem] p-2 md:p-4 border border-white/20 shadow-2xl">
//             <div className="bg-[#050505] rounded-[2rem] h-[300px] md:h-[600px] relative overflow-hidden p-6 md:p-14 text-white flex flex-col justify-end">
//               <div className="absolute top-8 left-8 text-left">
//                 <p className="text-[10px] text-indigo-400 font-black tracking-widest uppercase mb-1">Live Revenue Stream</p>
//                 <h3 className="text-3xl font-mono">$142,500.00</h3>
//               </div>
//               {/* Responsive Chart Bars */}
//               <div className="flex items-end gap-1.5 md:gap-4 h-40 md:h-64 border-b border-white/5 pb-1">
//                 {[60, 40, 80, 50, 90, 70, 100, 60, 80, 40, 70, 90, 100].map((h, i) => (
//                   <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600/30 to-indigo-500 rounded-t-sm animate-pulse" 
//                        style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* --- STACKING FEATURE CARDS --- */}
//       <section className="w-full max-w-5xl px-6 flex flex-col gap-10 pb-32">
//         {[
//           { icon: "🌍", t: "Multi-Currency", d: "Track assets in USD, EUR, INR. Consolidated net worth in your local currency." },
//           { icon: "📉", t: "Debt Architect", d: "Manage loan balances and credit limits. Know exactly when you'll be debt-free." },
//           { icon: "📄", t: "Receipt Vault", d: "Digital records for every spend. Snap, scan, and link receipts to transactions." },
//           { icon: "🔔", t: "Predictive Alerts", d: "Get notified when balances drop or payables are due. AI-driven cashflow safety." },
//           { icon: "📈", t: "Revenue Trends", d: "Visualize income streams with professional-grade analytics and forecasting." }
//         ].map((f, i) => (
//           <div key={i} className="stack-card glass p-10 rounded-[2.5rem] border border-white/10 flex flex-col gap-4 shadow-xl">
//             <span className="text-4xl">{f.icon}</span>
//             <h3 className="text-2xl font-bold tracking-tight">{f.t}</h3>
//             <p className="opacity-50 text-sm md:text-base leading-relaxed">{f.d}</p>
//           </div>
//         ))}
//       </section>

//       {/* --- BOTTOM CTA --- */}
//       <section className="w-full px-6 pb-40">
//          <div className="glass-strong p-12 md:p-24 rounded-[3rem] text-center border border-white/10 max-w-4xl mx-auto">
//             <h2 className="text-3xl md:text-6xl font-bold tracking-tighter mb-10 italic">Go clear with Finance Terminal.</h2>
//             <button onClick={() => handleNav('signup')} className="px-16 py-6 bg-foreground text-background rounded-full font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
//               Initialize Account
//             </button>
//          </div>
//       </section>
//     </div>
//   );
// }