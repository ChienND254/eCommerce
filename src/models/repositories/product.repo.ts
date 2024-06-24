import { IProduct } from "../../interface/product";
import { productModel } from "../product.model";
import Query from "../../interface/query";
import { Model, ObjectId, SortOrder } from "mongoose";

interface QueryParams {
    query: Query;
    limit: number;
    skip: number;
}

interface UpdateProductParams<T> {
    productId: ObjectId;
    bodyUpdate: Partial<T>;
    model: Model<any>;
    isNew?: boolean;
}

const findAllDraftsForShop = async ({ query, limit, skip }: QueryParams): Promise<IProduct[]> => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }: QueryParams): Promise<IProduct[]> => {
    return await queryProduct({ query, limit, skip })
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

const publishProductByShop = async ({ product_shop, product_id }: { product_shop: ObjectId, product_id: ObjectId }) => {
    const result = await productModel.updateOne(
        { _id: product_id, product_shop: product_shop },
        { $set: { isDraft: false, isPublished: true } }
    );

    return result.modifiedCount;
}

const unPublishProductByShop = async ({ product_shop, product_id }: { product_shop: ObjectId, product_id: ObjectId }) => {
    const result = await productModel.updateOne(
        { _id: product_id, product_shop: product_shop },
        { $set: { isDraft: true, isPublished: false } }
    );

    return result.modifiedCount;
}

const searchProductByUser = async (keySearch: string): Promise<IProduct[]> => {
    const regexSearch: RegExp = new RegExp(keySearch);
    const results = await productModel.find({
        isPublished: true,
        $text: { $search: regexSearch as unknown as string }
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results;
}

const findAllProducts = async ({ limit, sort, page, filter, select }: { limit: number, sort: string, page: number, filter: any, select: string[] }): Promise<IProduct[]> => {
    const skip: number = (page - 1) * limit
    const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await productModel.find(filter)
        .sort(sortBy)
        .skip(skip)
        .select(select)
        .lean()
    return products
}

const findProduct = async ({ product_id, unSelect }: { product_id: ObjectId, unSelect: string[] }): Promise<IProduct | null> => {
    return await productModel.findById(product_id).select(unSelect)
}

const updateProductById = async <T>({ productId, bodyUpdate, model, isNew = true }
    : UpdateProductParams<T>): Promise<T | null> => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}

const getProductById = async (productId: ObjectId): Promise<IProduct | null> => {
    return await productModel.findOne({ _id: productId }).lean()
}

export {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById
}