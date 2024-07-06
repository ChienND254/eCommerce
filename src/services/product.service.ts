import { ObjectId } from "mongoose";
import { IProduct } from "../interfaces";
import { productModel, clothingModel, electronicsModel, furnitureModel } from "../models/product.model";
import { BadRequestError } from "../core/error.response";
import {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
} from "../models/repositories/product.repo";
import { removeUndefinedObject, updateNestedObjectParser } from "../utils";
import { insertInventory } from "../models/repositories/inventory.repo";
import notificationService from "./notification.service";
import { NotificationTypes } from "../utils/notificationTypes";

class ProductFactory {

    static productRegistry: { [key: string]: any } = {};

    static registerProductType(type: string, classRef: any) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type: string, data: IProduct): Promise<IProduct> {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        const productInstance = new productClass(data);
        return await productInstance.createProduct();
    }

    static async updateProduct(type: string, productId: ObjectId, data: Partial<IProduct>): Promise<IProduct> {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        const productInstance = new productClass(data);
        return await productInstance.updateProduct(productId);
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }: { product_shop: ObjectId, limit?: number, skip?: number }): Promise<IProduct[]> {
        if (!product_shop) throw new BadRequestError('Invalid Request')
        const query = { product_shop, isDraft: true }

        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }: { product_shop: ObjectId, limit?: number, skip?: number }): Promise<IProduct[]> {
        if (!product_shop) throw new BadRequestError('Invalid Request')
        const query = { product_shop, isPublished: true }

        return await findAllPublishForShop({ query, limit, skip })
    }

    static async publishProductByShop({ product_shop, product_id }: { product_shop: ObjectId, product_id: ObjectId }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }: { product_shop: ObjectId, product_id: ObjectId }): Promise<number> {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    static async getListSearchProduct(keySearch: string) {
        return await searchProductByUser(keySearch)
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
    }

    static async findProduct({ product_id }: { product_id: ObjectId }) {
        return await findProduct({ product_id, unSelect: ['-__v'] });
    }

}

class Product {
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_price: number;
    product_quantity: number;
    product_type: string;
    product_shop: ObjectId;
    product_attributes: any;

    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }: IProduct) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    //create new product
    async createProduct(productId: ObjectId): Promise<IProduct> {
        const newProduct: IProduct = await productModel.create({ ...this, _id: productId });
        if (!newProduct) {
            throw new BadRequestError('Failed to create product');
        }
        await insertInventory({
            productId: newProduct._id as ObjectId,
            shopId: this.product_shop,
            stock: this.product_quantity
        });

        notificationService.pushNotiToSystem({
            type: NotificationTypes.SHOP_001,
            receivedId: 1,
            senderId: this.product_shop,
            options: {
                product_name: this.product_name,
                shop_name: this.product_shop
            }
        }).then(rs => console.log(rs)).catch(console.error);
        return newProduct
    }

    //update product
    async updateProduct(productId: ObjectId, bodyUpdate: Partial<IProduct>): Promise<IProduct | null> {
        return await updateProductById({ productId, bodyUpdate, model: productModel })
    }
}

class Clothing extends Product {
    async createProduct(): Promise<IProduct> {
        const newClothing = clothingModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct((await newClothing)._id as ObjectId)
        if (!newProduct) throw new BadRequestError('create new Clothing error')

        return newProduct
    }

    async updateProduct(productId: ObjectId) {

        const objectParams: Partial<IProduct> = removeUndefinedObject({ ...this })
        if (objectParams.product_attributes) {
            await updateProductById<IProduct>({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: clothingModel });
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
        return updateProduct;
    }
}

class Electronics extends Product {
    async createProduct(): Promise<IProduct> {
        const newElectronics = electronicsModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronics) throw new BadRequestError('create new Electronics error')

        const newProduct = await super.createProduct((await newElectronics)._id as ObjectId)
        if (!newProduct) throw new BadRequestError('create new Electronics error')

        return newProduct
    }
}

class Furniture extends Product {
    async createProduct(): Promise<IProduct> {
        const newFurniture = furnitureModel.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new Furniture error')

        const newProduct = await super.createProduct((await newFurniture)._id as ObjectId)
        if (!newProduct) throw new BadRequestError('create new Furniture error')

        return newProduct
    }
}

ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

export default ProductFactory;