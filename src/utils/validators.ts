export const validateEmail =(email:string)=>{
   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const validatePassword = (password: string) =>
  {return /^(?=.*[0-9]).{8,}$/.test(password);}
