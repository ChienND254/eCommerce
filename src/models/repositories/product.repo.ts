import { IProduct } from "../../interface/product";
import { productModel, electronicsModel, clothingModel, furnitureModel } from "../product.model";
import Query from "../../interface/query";
import { ObjectId } from "mongoose";

interface QueryParams {
    query: Query;
    limit: number;
    skip: number;
}

interface PublishProductByShopParams {
    product_shop: ObjectId;
    product_id: ObjectId;
}
const findAllDraftsForShop = async ({ query, limit, skip }: QueryParams): Promise<IProduct[]> => {
    return await queryProduct({ query, limit, skip })

}

const findAllPublishForShop = async ({ query, limit, skip }: QueryParams): Promise<IProduct[]> => {
    return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id }: PublishProductByShopParams) => {
    const result = await productModel.updateOne(
        { _id: product_id, product_shop: product_shop },
        { $set: { isDraft: false, isPublished: true } }
    );

    return result.modifiedCount;
}

const unPublishProductByShop = async ({ product_shop, product_id }: PublishProductByShopParams) => {
    const result = await productModel.updateOne(
        { _id: product_id, product_shop: product_shop },
        { $set: { isDraft: true, isPublished: false } }
    );

    return result.modifiedCount;
}

const queryProduct = async ({ query, limit, skip }: QueryParams): Promise<IProduct[]> => {
    return await productModel.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const searchProductByUser = async (keySearch: string ): Promise<IProduct[]> => {
    const regexSearch: RegExp = new RegExp(keySearch);
    const results = await productModel.find({
        isPublished: true,
        $text: { $search: regexSearch  as unknown as string}
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results;
}
export {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
}