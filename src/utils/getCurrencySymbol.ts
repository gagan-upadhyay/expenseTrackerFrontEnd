export function getCurrencySymbol(currency:string|undefined):string|undefined{
        if(currency===undefined) return 'Money';
        switch(currency.toLocaleLowerCase()){
            case 'dollar':
                case 'usd':
                    return'$';
            
            case 'rupee':
                case 'inr':
                    return '₹';
            case 'pound':
                case 'gbp':
                    return '£';
            case 'yen':
                case 'jpy':
                    return '¥';
            case 'euro':
                case 'eur':
                    return '€';
            default:
                return ''
        }
    }