export const formatCurrency=(amount:number, currencyCode:string='INR')=>{
    const code = currencyCode.toUpperCase();
    
    const localeMap: Record<string,string>={
        INR:"en-IN",
        USD:"en-US",
        GBP:"en-GB",
        JPY:"ja-JP",
        EUR:"de-DE",
    };

    const locale = localeMap[code]||"en-US";
    
    return new Intl.NumberFormat(locale, {
        style:'currency',
        currency:code==='YEN'?'JPY' : code,
        minimumFractionDigits: code === 'JPY' || code === 'YEN' ? 0 : 2,
        maximumFractionDigits: code === 'JPY' || code === 'YEN' ? 0 : 2,
    }).format(amount);
};