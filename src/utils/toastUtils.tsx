import {toast} from 'react-toastify';

export const toastShowSuccess = (msg: string, time:number) =>
  toast.success(msg, { position: "top-right", autoClose: time, theme: "colored" });

export const toastShowError = (msg: string, time:number) =>
  toast.error(msg, { position: "top-right", autoClose: time, theme: "colored" });

export const toastShowLoading = (msg: string, time:number) => {
  toast.loading(msg, {position:"top-right", autoClose:time, theme:"colored"});
}

export const toastShowWarning=(msg:string, time:number)=>{
  toast.warn(msg, {position:"top-right", autoClose:time, theme:"colored"});
}