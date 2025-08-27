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