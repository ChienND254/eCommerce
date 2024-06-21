import { apiKeyModel } from "../models/apikey.model"
import { IApiKey } from "../interface/apikey"

const findByID = async (key: string): Promise<IApiKey | null> => {
    const objKey: IApiKey | null = await apiKeyModel.findOne({ key, status: true }).lean()
    console.log(objKey);
    
    return objKey
}

export { findByID }