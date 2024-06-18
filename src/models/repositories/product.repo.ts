import { IProduct } from "../../interface/product";
import { productModel, electronicsModel, clothingModel, furnitureModel } from "../product.model";
import Query from "../../interface/query";

interface FindAllDraftForShopParams {
    query: Query;
    limit: number;
    skip: number;
}

const findAllDraftsForShop = async ({ query, limit, skip }: FindAllDraftForShopParams): Promise<IProduct[]> => {
    return await productModel.find(query).populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

export { findAllDraftsForShop }