//fetch userData from users table

export const getUserDetails = async()=>{
    const res = await fetch('http://localhost:5001/api/v1/user', {
        method:'GET',
        credentials:'include',
    });
    // console.log("value of res from getUserDetails:", res)
    // console.log("value of res from data.ts:", await res.json());
    if(!res.ok) throw new Error ('Failed to fetch user Details');
    return res.json();
};

export const checkPassword = async(email:string, password:string)=>{
    const res = await fetch('http://localhost:5000/api/v1/getPassword',{
        method:'GET',
        credentials:'include',
        body:JSON.stringify({email, password})
    });
    if(!res.ok) throw new Error('Failed to check password');
    return res.json();
}


export const refreshToken = async(apiBody:string|null)=>{
    const res = await fetch('http://localhost:5000/api/v1/auth/refresh',{
        method:'POST',
        credentials:'include',
        body:JSON.stringify(apiBody)
    });
    // console.log("Value of res from data.ts for refreshToken:\n", await res.json());
    if(!res.ok) throw new Error('Failed to fetch accessToken using refreshToken');
    return await res.json();
}

export const sendOTP = async(name:string, email:string, type:string)=>{
    try{
        
        const res = await fetch('http://localhost:5000/api/v1/auth/otp/generate',{
            method:'POST',
            credentials:'include',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({name, email, ...(type==='emailChange' && {type})}),
        });
        const result= await res.json();
        console.log("Value of result from sendOTP:\n", result);
        return result.message;
    }catch(err){
        console.error('Value of error from sendOTP function:\n', err);
        return 
    }
}

export const verifyOTPStatus = async(otp:string, email:string)=>{
    const useForLogin=false;
    const res = await fetch('http://localhost:5000/api/v1/auth/otp/verify',{
        method:'POST',
        credentials:'include',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify({otp,email, useForLogin}),
    });
    console.log(JSON.stringify({email, otp, useForLogin}))
    console.log('Value of res from verifyOTP:', res);
    return await res.json();
}