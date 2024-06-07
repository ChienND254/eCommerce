import {ApiKeyModel, IApiKey} from "../models/apikey.model"
const findByID = async (key:string): Promise<IApiKey | null> => {
    const objKey:IApiKey | null = await ApiKeyModel.findOne({key ,status: true}).lean()
    return objKey
}

export default findByID