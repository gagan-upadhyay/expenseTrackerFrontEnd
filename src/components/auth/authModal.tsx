// 'use client';

// import { useAuthModal } from "@/src/context/authModalContext";
// import LoginForm from "./loginForm";
// import RegisterForm from "./signUpForm";
// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import clsx from "clsx";

// export default function AuthModal() {
//   const { isOpen, mode, closeModal } = useAuthModal();
//   const modalRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!modalRef.current) return;

//     if (isOpen) {
//       gsap.fromTo(
//         modalRef.current,
//         { opacity: 0, scale: 0.9, y: 50 },
//         {
//           opacity: 1,
//           scale: 1,
//           y: 0,
//           duration: 0.4,
//           ease: "power3.out",
//         }
//       );
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">

//       {/* CLOSE AREA */}
//       <div
//         className="absolute inset-0"
//         onClick={closeModal}
//       />

//       {/* MODAL */}
//       <div
//         ref={modalRef}
//         className="relative w-full max-w-sm px-4"
//       >
//         <div className="glass rounded-2xl p-6 relative">

//           {/* CLOSE BTN */}
//           <button
//             onClick={closeModal}
//             className="absolute top-3 right-3 text-sm opacity-60"
//           >
//             ✕
//           </button>

//           {/* SWITCH */}
//           <div className="flex justify-center gap-4 mb-4 text-sm">
//             <button
//               className={clsx(
//                 mode === "login" && "text-indigo-500 font-semibold"
//               )}
//             >
//               Login
//             </button>
//             <button
//               className={clsx(
//                 mode === "register" && "text-indigo-500 font-semibold"
//               )}
//             >
//               Register
//             </button>
//           </div>

//           {/* FORM */}
//           {mode === "login" ? <LoginForm /> : <RegisterForm />}
//         </div>
//       </div>
//     </div>
//   );
// }