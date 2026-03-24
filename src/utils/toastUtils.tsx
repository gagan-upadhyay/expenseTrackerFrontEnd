import {toast} from 'react-toastify';

export const toastShowSuccess = (msg: string, time:number, toastId?:string) =>
  {
    if(toastId) return toast.update(toastId, {
      render:msg,
      type:'success',
      isLoading:false,
      autoClose:time,
      closeOnClick:true,
      position:'top-right'
    })
    toast.success(msg, { position: "top-right", autoClose: time, theme: "colored" });}

export const toastShowError = (msg: string, time:number) =>
  toast.error(msg, { position: "top-right", autoClose: time, theme: "colored" });

export const toastShowLoading = (msg: string) => {
  return toast.loading(msg, {position:"top-right", autoClose:false, theme:"colored"});
}

export const toastShowWarning=(msg:string, time:number)=>{
  toast.warn(msg, {position:"top-right", autoClose:time, theme:"colored"});
}