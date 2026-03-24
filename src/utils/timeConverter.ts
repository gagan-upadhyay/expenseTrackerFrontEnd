

export const convertToMMYY=(dateStr:string)=>{
    const date = new Date(dateStr);
    const mmm = date.toLocaleString('default', {month:'short'});
    const yy = date.getFullYear().toString().slice(-2);
    const formattedDate = `${mmm}-${yy}`;
    return formattedDate;
}


// Get month (0-indexed, so add 1) and pad with leading zero
