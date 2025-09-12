export const getCookie = ((name:string):string|null =>{
    if(typeof document === 'undefined') return null;
    try{
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    }catch(err){
        console.error(`Error reading the cookie "${name}"`, err);
    }
    return null;
});