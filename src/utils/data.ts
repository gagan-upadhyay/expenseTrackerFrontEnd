//fetch userData from users table

export const getUserDetails = async()=>{
    const res = await fetch('http://localhost:5001/api/v1/user', {
        method:'GET',
        credentials:'include',
    });
    console.log("value of res from data.ts:", res);
    if(!res.ok) throw new Error ('Failed to fetch user Details');
    return res.json();
};


export const refreshToken = async(apiBody:string|null)=>{
    const res = await fetch('http://localhost:5000/api/v1/refresh',{
        method:'POST',
        credentials:'include',
        body:JSON.stringify(apiBody)
    });
    console.log("Value of res from data.ts for refreshToken:\n", res);
    if(!res.ok) throw new Error('Failed to fetch accessToken using refreshToken');
    return await res.json();
}