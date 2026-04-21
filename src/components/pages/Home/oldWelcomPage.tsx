// // 'use client';
// // import Image from "next/image";
// // import {useEffect, useState} from 'react';
// // import { Button } from "../../ui/buttons/buttons";
// // import { useAuth } from "../../../context/authContext";
// // import { useRouter } from "next/navigation";


// // export default function WelcomePage(){
// //     const [loaded, setLoaded] = useState(false);
// //     const {isLoggedIn} = useAuth();
// //     const router = useRouter();
// //     console.log("Value of isLoggedIn", isLoggedIn);

// //     useEffect(()=>{
// //         const timer = setTimeout(()=>setLoaded(true), 300);
// //         return ()=> clearTimeout(timer)
// //     }, []);

// //     const handleSubmit=()=>{
// //         if (isLoggedIn){
// //             router.push('/dashboard');
// //         }else{
// //             router.push('/auth/login');
// //         }
// //     }

// //     return (
// //         <div className={`flex justify-center h-screen transition-opacity ease-in-out ${loaded ? 'opacity-90':'opacity-0'}`}>
// //             <div className="w-full absolute min-h-screen">
// //                 <Image className={`absolute w-full h-full  pointer-events-none`} alt='background image' width={500} height={500} src='/backgroundImage_new.png'/>
// //             </div>
// //             <div className="relative flex flex-col top-10 text-center gap-2 px-4">
// //                 <h1 className="text-white animate-pulsate transitions-all ease-in-out duration-400 sm:text-xl md:text-2xl text-lg lg:text-4xl ">
// //                     Welcome to the Expense Tracker App
// //                 </h1>

// //                 <h2 className="text-white lg:text-2xl transitions-all ease-in-out duration-400">
// //                     Take care of your expenses at one place.
// //                 </h2>
// //                 <Button onClick={handleSubmit} className="mt-10">
// //                     Get Started
// //                 </Button>


// //             </div>
            
// //         </div>
// //     )
// // }

// import React from 'react';
// import Link from 'next/link';

// export default function LandingPage() {
//   return (
//     <div className="relative overflow-hidden min-h-screen">
//       {/* 🔮 Background Glow Accents - Using your global classes */}
//       <div className="glow-indigo top-[-5%] left-[-5%] opacity-50 dark:opacity-30" />
//       <div className="glow-purple bottom-[10%] right-[-5%] opacity-50 dark:opacity-30" />

//       {/* Hero Section */}
//       <section className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center">
//         <div className="max-w-4xl z-10">
//           <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
//             Master your money with <br />
//             <span className="text-blue-600 dark:text-blue-400">Glass-Clear Clarity.</span>
//           </h1>
//           <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
//             A premium, privacy-first expense tracker designed to help you visualize spending 
//             patterns and reach your financial goals faster.
//           </p>
          
//           <div className="flex gap-4 justify-center">
//             <Link href="/auth/register" className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg">
//               Get Started Free
//             </Link>
//             <Link href="#features" className="px-8 py-4 glass glass-hover rounded-full font-semibold">
//               Live Demo
//             </Link>
//           </div>
//         </div>

//         {/* Dashboard Preview - The "Hero Glass Card" */}
//         <div className="mt-20 w-full max-w-5xl mx-auto relative group">
//           <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
//           <div className="glass-strong rounded-2xl p-4 md:p-8 relative min-h-[400px] border border-white/20 dark:border-white/10">
//             {/* Mock Dashboard UI */}
//             <div className="flex flex-col gap-6">
//               <div className="flex justify-between items-center">
//                 <div className="h-8 w-32 skeleton rounded-md" />
//                 <div className="h-10 w-10 skeleton rounded-full" />
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="h-32 glass-light rounded-xl p-4 flex flex-col justify-center">
//                    <span className="text-xs uppercase opacity-60">Total Balance</span>
//                    <span className="text-2xl font-bold">$12,450.00</span>
//                 </div>
//                 <div className="h-32 glass-light rounded-xl p-4 flex flex-col justify-center">
//                    <span className="text-xs uppercase opacity-60 text-green-500">Income</span>
//                    <span className="text-2xl font-bold">$8,200.00</span>
//                 </div>
//                 <div className="h-32 glass-light rounded-xl p-4 flex flex-col justify-center">
//                    <span className="text-xs uppercase opacity-60 text-red-500">Expenses</span>
//                    <span className="text-2xl font-bold">$3,150.00</span>
//                 </div>
//               </div>
//               {/* Shimmer chart effect */}
//               <div className="h-64 w-full skeleton rounded-xl mt-4" />
//             </div>
//           </div>
//         </div>
//       </section>

      

//       {/* Features Grid */}
//       <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-16">Smart Features, Zero Friction</h2>
//         <div className="grid grid-cols-1  md:grid-cols-3 gap-8">
//           <div className="glass glass-hover p-8 rounded-3xl border border-white/20">
//             <div className="w-12 glass h-12 bg-blue-500/20 rounded-xl mb-6 flex items-center justify-center text-blue-500 text-2xl">📊</div>
//             <h3 className="text-xl font-bold mb-3">Spending Insights</h3>
//             <p className="text-gray-500 dark:text-gray-600">Beautifully visualized charts that tell you exactly where your money goes every month.</p>
//           </div>
          
//           <div className="glass glass-hover p-8 rounded-3xl border border-white/20">
//             <div className="w-12 h-12 bg-purple-500/20 rounded-xl mb-6 flex items-center justify-center text-purple-500 text-2xl glass">📱</div>
//             <h3 className="text-xl font-bold mb-3 ">PWA Ready</h3>
//             <p className="text-gray-500 dark:text-gray-600">Install it on your home screen. Access your finances offline and on the go with zero lag.</p>
//           </div>

//           <div className="glass glass-hover p-8 rounded-3xl border border-white/20">
//             <div className="w-12 h-12 bg-indigo-500/20 rounded-xl mb-6 flex items-center justify-center text-indigo-500 text-2xl glass">🔐</div>
//             <h3 className="text-xl font-bold mb-3">Private & Secure</h3>
//             <p className="text-gray-700 dark:text-gray-600">We don't sell your data. Your financial records are encrypted and yours alone.</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
