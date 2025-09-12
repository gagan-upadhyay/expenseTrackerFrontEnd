export async function updateUserProfile(data:{
    firstName:string,
    lastName:string,
    email:string,
    profilePicture?:File|null;
}){
    try{
        const formData = new FormData();
        //creating a new formData for the values that are changed
        Object.entries(data).forEach(([key, value])=>{
            if(value) formData.append(key, value);
        });
        // const result = Object.keys(formData).includes('profilePicture');

        const res = await fetch('http://localhost:5001/api/v1/user/update-user', {
            method:'PUT',
            body:JSON.stringify({
                firstName:data?.firstName,
                lastName:data?.lastName,
            }),
            headers:{'Content-Type':'application/json'},
            credentials:'include'
        });
        if(!res.ok) throw new Error('Failed to update');

        // console.log("value of res from updateUserProfile from userService:\n", res);
        return {success:true};
    }catch(err){
        if(err instanceof(Error))
        {console.error("Error while fetching userDetails", err);
        return {success:false, error:err};}
    }
}
