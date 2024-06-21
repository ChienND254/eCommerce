import { ShopModel } from "../models/shop.model";
import { IShop } from "../interface/shop";

interface FindByEmailParams {
    email: string;
    select?: Record<string, any>;
}

const findByEmail = async ({ email, select = { email: 1, password: 1, name: 1, roles: 1 } }: FindByEmailParams): Promise<IShop | null> => {
    return await ShopModel.findOne({ email }).select(select).lean();
};

export { findByEmail };
