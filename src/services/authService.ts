import { CredentialResponse } from "@react-oauth/google";



export const loginWithGoogle=async(credentialResponse:CredentialResponse)=>{
    if(!credentialResponse.credential) throw new Error("No credential received");

    const response = await fetch("http://localhost:5000/api/v1/auth/login/OAuth", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentialResponse.credential}`,
    },
    credentials: "include",
  });

  const data = await response.json();
  console.log("Value of data from service", data);
  
  if(!response.ok) throw new Error(data.message||"OAuth login failed");
  return data;
}


export const loginWithEmail = async( email:string, password:string)=>{
  const response = await fetch('http://localhost:5000/api/v1/auth/login',
    {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email, password}),
      credentials:'include'
    }
  );
  const data = await response.json();
  console.log("Value of data", await data.message);
  console.log("Value of response:", response);
  if(!response.ok) throw new Error(data.message||"Login failed");
  return data;
}

export const logoutUser = async()=>{
    const response = await fetch('http://localhost:5000/api/v1/auth/logout',{
        method:'POST',
        credentials:'include',
    })
    return response;
}