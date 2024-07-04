import { ObjectId } from "mongoose";
import { CommentModel } from "../models/comment.model";
import { NotFoundError } from "../core/error.response";
import { IComment } from "../interface/comment";
import { findProduct } from "../models/repositories/product.repo";

class CommentService {
    static async createComment(
        {productId, userId, content, parentCommentId = null}:{productId: ObjectId, userId: number, content: string, parentCommentId: ObjectId | null}) {
        const newComment = new CommentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue: number = 0
        if (parentCommentId) {
            const parentComment = await CommentModel.findById(parentCommentId)
            if(!parentComment) throw new NotFoundError("Comment parent not found")

            rightValue = parentComment.comment_right

            await CommentModel.updateMany({
                comment_productId: productId,
                comment_right: { $gte: rightValue}
            },{$inc: {comment_right: 2}})

            await CommentModel.updateMany({
                comment_productId: productId,
                comment_left: { $gte: rightValue}
            },{$inc: {comment_left: 2}})
        } else {
            const maxRightValue = await CommentModel.findOne({
                comment_productId: productId,
            }, 'comment_right', {sort: {comment_right: -1}})
            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        newComment.comment_left = rightValue
        newComment.comment_right = rightValue + 1
        await newComment.save()

        return newComment
    }

    static async getCommentByParentId(
        {productId, parentCommentId = null, limit = 50, offset = 0}:{productId:ObjectId, parentCommentId: ObjectId | null, limit: number, offset: number}
    ): Promise<IComment[]> {
        if (parentCommentId) {
            const parent = await CommentModel.findById(parentCommentId)
            if (!parent) throw new NotFoundError("Commetn not found")
            
            const comments = await CommentModel.find({
                comment_productId: productId,
                comment_left: {$gt: parent.comment_left},
                comment_right: {$lte: parent.comment_right}
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parent: 1
            }).sort({
                comment_left: 1
            })

            return comments
        }

        const comments = await CommentModel.find({
            comment_productId: productId,
            comment_parentId: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parent: 1
        }).sort({
            comment_left: 1
        })

        return comments
    }

    static async deleteComment({commentId, productId}:{commentId: ObjectId, productId: ObjectId }): Promise<boolean>{
        const foundProduct = await findProduct({product_id: productId, unSelect: null})
        if (!foundProduct) throw new NotFoundError("product not found")

        const foundComment = await CommentModel.findById(commentId)

        if (!foundComment) throw new NotFoundError("comment not found")

        const leftValue: number = foundComment.comment_left
        const rightValue: number = foundComment.comment_right

        const width: number = rightValue - leftValue + 1

        await CommentModel.deleteMany({
            comment_productId: productId,
            comment_left: { $gte: leftValue, $lte: rightValue}
        })

        await CommentModel.updateMany({
            comment_productId: productId,
            comment_right: { $gt: rightValue}
        }, {
            $inc: {comment_right: -width}
        })

        await CommentModel.updateMany({
            comment_productId: productId,
            comment_left: { $gt: rightValue}
        }, {
            $inc: {comment_left: -width}
        })

        return true
    }
}

export default CommentService