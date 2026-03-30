// export default function LoginSkeleton(){
//     return(
//         <div className="w-full px-6 pb-4 pt-8 bg-gray-50/70 md:bg-gray-50 rounded-lg mb-30 max-w-xs md:max-w-sm animate-pulse">
//             {/* Login Form title */}
//             <div className="h-6 w-1/2 bg-gray-300 rounded mb-6"></div>
//             {Array(2).fill(0).map((_,i)=>(
//                 <div key={i} className="mb-4">
//                     <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
//                     <div className="h-10 w-full bg-gray-300 rounded"></div>
//                 </div>
//             ))}

//         {/* Button */}
//         <div className="h-10 w-23 ml-56 bg-gray-300 rounded mb-4"></div>

//         {/* Footer text */}
//         <div className="h-10 w-full bg-gray-300 rounded"></div>
//         </div>
//     )
// }

export default function LoginSkeleton() {
  return (
    <div className="glass relative w-full px-6 py-8 rounded-2xl">
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      <div className="text-xl md:text-2xl font-bold text-center opacity-80 mb-6">Login</div>

      <div className="flex flex-col gap-4">
        <div className="skeleton h-10 w-full rounded-xl"></div>
        <div className="skeleton h-10 w-full rounded-xl"></div>
        <div className="skeleton h-10 w-full rounded-xl mt-2"></div>
      </div>
    </div>
  );
}