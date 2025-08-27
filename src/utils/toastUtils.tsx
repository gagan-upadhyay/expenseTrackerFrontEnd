import {toast} from 'react-toastify';

export const toastShowSuccess = (msg: string) =>
  toast.success(msg, { position: "top-right", autoClose: 300, theme: "colored" });

export const toastShowError = (msg: string) =>
  toast.error(msg, { position: "top-right", autoClose: 300, theme: "colored" });

export const toastShowLoading = (msg: string) => {
  toast.loading(msg, {position:"top-right", autoClose:300, theme:"colored"});
}

export const toastShowWarning=(msg:string)=>{
  toast.warn(msg, {position:"top-right", autoClose:300, theme:"colored"});
}