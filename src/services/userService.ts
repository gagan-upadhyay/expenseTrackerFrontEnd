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

export async function updateUserProfile(data: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}) {
  const USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE;

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