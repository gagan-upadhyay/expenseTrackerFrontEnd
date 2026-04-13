import {z, ZodError} from 'zod'
import getLogger from '../services/logger-service';

//Given three functions use any one to parseJSON and get the output as per their returns

export const safeParseJson = async <T>
    (
        res:Response,
        schema:z.Schema<T>
    ):Promise<T|null>=>
{
    try{
        const json = await res.json();
        const result = schema.safeParse(json);
        return result.success?result.data:null; //will deliver data or null
    }catch{
        return null;
    }
};

export type OK<T>={ok:true; data:T};
export type Err = {ok:false; error:string; status?:number; zodError?:ZodError};

export type Result<T> = OK<T>| Err;

export const safeParseJsonResult=async<T>(
    res:Response,
    schema:z.Schema<T>
):Promise<Result<T>>=>{
    try{
        const json = await res.json();
        console.log('value of json:', json);
        const result = schema.safeParse(json);

        if(result.success){
            return {ok:true, data:result.data};
        }
        // if(!result.success){
            console.error("Zod Validation Path:", result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`));
            getLogger('safeParseJSON').debug('Full Zod Error Object', result.error.format());
            return {
                ok: false,
                error: 'Schema validation failed',
                status: res.status,
                zodError: result.error
            }
        // }
        // getLogger('safeParseJSON').debug('parsed result', result);
        // getLogger('safeParseJSON').debug('json input', json);
        // // this is returning an pbject with ok error status and zodError 
        // return {
        //     ok:false,
        //     error:'Schema validation failed',
        //     status:res.status,
        //     zodError:result.error
        // }
    }catch(e){
        return{
            ok:false, 
            error: e instanceof Error?e.message: 'Unknown Error while parsing JSON',
            status:res.status
        };
    };
};

export const ensureOkThenParse = async <T>(
    res:Response, 
    parser:(res:Response)=>Promise<Result<T>>
):Promise<Result<T>>=>{
    // first checking the response, if it is not ok returning erro with status and statusText
    if(!res.ok){
        let serverMsg:string|undefined;
        try{
            const data = await res.json();
            serverMsg = typeof data?.message ==='string'? data.message:undefined;
        }catch{
        }
        return {
            ok:false,
            status:res.status,
            error:serverMsg??`Request failed with status ${res.status} ${res.statusText}.trim()`
        };
    }
    return parser(res)
};

