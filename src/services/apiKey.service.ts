import {ApiKeyModel} from "../models/apikey.model"
import { IApiKey } from "../interface/apikey"
const findByID = async (key:string): Promise<IApiKey | null> => {
    const objKey:IApiKey | null = await ApiKeyModel.findOne({key ,status: true}).lean()
    return objKey
}

export default findByID