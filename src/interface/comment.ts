import { Document, ObjectId } from "mongoose";

interface IComment extends Document {
    comment_productId: ObjectId;
    comment_userId: number;
    comment_content: string;
    comment_left: number;
    comment_right: number;
    comment_parentId: ObjectId | null;
    isDeleted: boolean;
}

export { IComment }