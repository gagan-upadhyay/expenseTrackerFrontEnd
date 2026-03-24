export default function ForgotPasswordSkeleton(){
    return(
        <div className="w-full px-6 pb-4 pt-8 bg-gray-50/70 md:bg-gray-50 rounded-lg mb-30 max-w-xs md:max-w-sm animate-pulse">
            {/* Login Form title */}
            <div className="h-6 w-1/2 bg-gray-300 rounded mb-6"></div>
            {Array(1).fill(0).map((_,i)=>(
                <div key={i} className="mb-4">
                    <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-10 w-full bg-gray-300 rounded"></div>
                </div>
            ))}

        {/* Button */}
        <div className="h-10 w-23 ml-56 bg-gray-300 rounded mb-4"></div>

        {/* Footer text */}
        <div className="h-10 w-full bg-gray-300 rounded"></div>
        </div>
    )
}