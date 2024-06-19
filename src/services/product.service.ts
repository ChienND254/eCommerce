import { ObjectId } from "mongoose";
import { IProduct } from "../interface/product";
import { productModel, clothingModel, electronicsModel, furnitureModel } from "../models/product.model";
import { BadRequestError } from "../core/error.response";
import { 
    findAllDraftsForShop, 
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
} from "../models/repositories/product.repo";

class ProductFactory {

    static productRegistry: { [key: string]: any } = {};

    static registerProductType (type:string,classRef: any) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type: string, data: IProduct): Promise<IProduct> {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        const productInstance = new productClass(data);
        return await productInstance.createProduct();
    }

    static async findAllDraftsForShop({product_shop, limit = 50, skip = 0}:{product_shop: ObjectId, limit?: number, skip?: number}) : Promise<IProduct[]> {
        if (!product_shop) throw new BadRequestError('Invalid Request')
        const query = {product_shop, isDraft: true}
        
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishForShop({product_shop, limit = 50, skip = 0}:{product_shop: ObjectId, limit?: number, skip?: number}) : Promise<IProduct[]> {
        if (!product_shop) throw new BadRequestError('Invalid Request')
        const query = {product_shop, isPublished: true}
        
        return await findAllPublishForShop({query, limit, skip})
    }

    static async publishProductByShop({product_shop, product_id}:{product_shop: ObjectId, product_id: ObjectId}) {
        return await publishProductByShop({product_shop, product_id})
    }

    static async unPublishProductByShop({product_shop, product_id}:{product_shop: ObjectId, product_id: ObjectId}): Promise<number> {
        return await unPublishProductByShop({product_shop, product_id})
    }

    static async getListSearchProduct(keySearch: string) {
        return await searchProductByUser(keySearch)
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

    async createProduct(product_id: ObjectId): Promise<IProduct> {
        return await productModel.create({ ...this, _id: product_id })
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