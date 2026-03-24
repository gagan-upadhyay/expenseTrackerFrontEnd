export async function updateUserProfile(data:{
    firstName:string,
    lastName:string,
    email:string,
    password?:string,
    profilePicture?:File|null;
}){
    const USER_SERVICE= process.env.NEXT_PUBLIC_USER_SERVICE;
    try{    
        const formData = new FormData();
        getLogger('userService').debug('received data', data);
        //creating a new formData for the values that are changed
        Object.entries(data).forEach(([key, value])=>{
            if(value) formData.append(key, value);
        });
        // const result = Object.keys(formData).includes('profilePicture');
        getLogger('userService').debug('formData to submit', formData);
        const res = await fetch(`${USER_SERVICE}/api/v1/user/update-user`, {
            method:'PUT',
            body:JSON.stringify({
                firstName:data?.firstName,
                lastName:data?.lastName,
            }),
            headers:{'Content-Type':'application/json'},
            credentials:'include'
        });
        const json = await res.json();
        getLogger('userService').debug('response from submit', json); // res.json().message = "update user hit"
        // if(!res.ok) throw new Error('Failed to update');

        // console.log("value of res from updateUserProfile from userService:\n", res);
        return {success:true};
    }catch(err){
        if(err instanceof(Error))
        {console.error("Error while fetching userDetails", err);
        return {success:false, error:err};}
    }
}
