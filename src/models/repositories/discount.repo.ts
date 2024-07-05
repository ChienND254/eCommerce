import { Model, ObjectId, SortOrder } from "mongoose";
import { IDiscount } from "../../interfaces";

interface Params {
    limit?: number;
    page?: number;
    sort?: string;
    filter: any;
    unSelect: string[];
    model: Model<any>
}

interface UpdateDiscountParams {
    discountId: ObjectId;
    bodyUpdate: Partial<IDiscount>;
    model: Model<any>;
    isNew?: boolean;
}
const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect, model
}: Params) => {
    const skip: number = (page - 1) * limit
    const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .select(unSelect)
        .lean()
    return products
}

const checkDiscountExists = async ({model, filter}: {model: Model<any>, filter: any}): Promise<IDiscount | null> => {
    return await model.findOne(filter).lean()
}

const updateDiscountById = async ({ discountId, bodyUpdate, model, isNew = true }
    : UpdateDiscountParams): Promise<IDiscount | null> => {
    return await model.findByIdAndUpdate(discountId, bodyUpdate, {
        new: isNew
    })
}

export { 
    findAllDiscountCodesUnSelect, 
    checkDiscountExists,
    updateDiscountById
}