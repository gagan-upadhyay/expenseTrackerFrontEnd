export async function updateUserProfile(data:{
    firstName:string,
    lastName:string,
    email:string,
    password?:string,
    profilePicture?:File|null;
}){
    try{
        const formData = new FormData();
        Object.entries(data).forEach(([key, value])=>{
            if(value) formData.append(key, value);
        });

        const res = await fetch('http://localhost:5001/api/v1/user/update-user', {
            method:'PUT',
            body:formData,
        });
        if(!res.ok) throw new Error('Failed to update');
        return {success:true};
    }catch(err){
        if(err instanceof(Error))
        {console.error("Error while fetching userDetails", err);
        return {success:false, error:err};}
    }
}
