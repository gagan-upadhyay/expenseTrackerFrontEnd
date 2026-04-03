// export async function updateUserProfile(data:{
//     firstName:string|null,
//     lastName:string|null,
//     email:string|null,
//     password?:string|null,
//     profilePicture?:File|null;
// }){
//     const USER_SERVICE= process.env.NEXT_PUBLIC_USER_SERVICE;
//     console.log(`VALUE OF USER_SERVICE: ${USER_SERVICE} from userService.ts`);
//     try{    
//         const formData = new FormData();
//         Object.entries(data).forEach(([key, value])=>{
//             if(value) formData.append(key, value);
//         });
//         const res = await fetch(`${USER_SERVICE}/api/v1/user/update-user/`, {
//             method:'PUT',
//             body:formData,
//             credentials:'include'
//         });
//         const json = await res.json();
//         console.log('UserService, response from submit:', json);
//         return {success:true};
//     }catch(err){
//         if(err instanceof(Error))
//         {console.error("Error while fetching userDetails", err);
//         return {success:false, error:err};}
//     }
// }


import apiFetch from "../utils/apiClient";
import imageCompression from 'browser-image-compression';

const USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE;

export async function updateUserProfile(data: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  profile_picture?: string|null
}) {
  try {
        const res:{success:boolean, message:string, user:object|null, error:string} = await apiFetch(`${USER_SERVICE}/api/v1/user/update-user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        }) as {success:boolean, message:string, user:object|null, error:string};
        return res;
    
    // fetch(`${USER_SERVICE}/api/v1/user/update-user`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    //   credentials: "include",
    // }) as ;

    // const json = await res.json();
    // const data = await res.json()

    // return json;
  } catch (err) {
    console.error(err);
    return { success: false, error:err };
  }
}

export async function uploadProfilePicture(file:File){
  try{ 
    // ✅ 1. Validate file
    if(!file.type.startsWith("image/")){
      throw new Error("Only image files are allowed");
    }
    if(file.size>2*1024*1024){
      throw new Error("File size should be less than 2MB");
    }

    // ✅ 2. Compress Image
    const compressedFile = await imageCompression(file, {
      maxSizeMB:1,
      maxWidthOrHeight:512,
      useWebWorker:true
    });
    
    // ✅ 3. Get SAS URL
    const res = await apiFetch(`${USER_SERVICE}/api/v1/user/generate-upload-url`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({fileType:compressedFile.type})
    }) as {success:boolean, uploadUrl:string, blobName:string, error:string|null};

    if(!res.success){
      throw new Error(res.error || "Failed to get upload URL");
    }
    

  // ✅ 4. Upload to Azure Blob
    await fetch(res.uploadUrl, {
      method:"PUT",
      headers:{
        "x-ms-blob-type":"BlockBlob",
        "Content-Type":compressedFile.type
      },
      body:compressedFile
    });

    // ✅ 5. Save URL in DB
    
    // await updateUserProfile({profile_picture:res.blobUrl});
    // return {
    //   success:true, url:res.blobUrl
    // };
    // return await updateUserProfile({profile_picture:res.blobName}) 
    // return updateRes;
    return {success:true, blobName:res.blobName}
    }catch(err){
    return {success:false, error:err}
  }
}