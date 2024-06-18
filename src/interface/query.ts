import { ObjectId } from "mongoose";

interface Query {
    product_shop?: ObjectId;
    isDraft?: boolean;
}

export default Query