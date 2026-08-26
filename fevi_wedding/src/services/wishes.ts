import {supabase} from "../lib/supabase";

export async function submitWish(
    token: string,
    message: string
){
    const {data, error} = await supabase.rpc(
        "submit_wish",
        {
            token_value: token,
            wish_message: message,
        }
    );

    if(error){
        throw error;
    }
    
    return data;
}