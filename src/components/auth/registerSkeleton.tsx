// // components/RegisterFormSkeleton.jsx
// export default function RegisterFormSkeleton() {
//   return (
//     <div className="absolute w-screen top-25 px-6 pb-4 pt-8 bg-gray-50/70 md:bg-gray-50 rounded-lg max-w-xs md:max-w-sm animate-pulse">
//       {/* Title */}
//       <div className="h-6 w-1/2 bg-gray-300 rounded mb-6"></div>

//       {Array(4).fill(0).map((_,i)=>(
//         <div key={i} className="mb-4">
//           <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
//           <div className="h-10 w-full bg-gray-300 rounded"></div>
//         </div>
//       ))}

//       {/* Button */}
//       <div className="h-10 w-32 bg-gray-300 rounded mb-4"></div>

//       {/* Footer text */}
//       <div className="h-3 w-2/3 bg-gray-300 rounded"></div>

//     </div>
//   );
// }

export default function RegisterFormSkeleton() {
  return (
    <div className="glass relative w-full px-6 py-8 rounded-2xl">

      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      <div className="skeleton h-6 w-1/2 mx-auto rounded mb-6"></div>

      <div className="flex flex-col gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="skeleton h-10 w-full rounded-xl"></div>
        ))}
        <div className="skeleton h-10 w-full rounded-xl mt-2"></div>
      </div>
    </div>
  );
}