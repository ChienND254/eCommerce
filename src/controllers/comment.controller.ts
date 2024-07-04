import { Request, Response, NextFunction } from 'express'
import CommentService from '../services/comment.service';
import { SuccessResponse } from '../core/success.response';
import { ObjectId } from 'mongoose';


interface CommentQueryParams {
    productId: ObjectId;
    parentCommentId: ObjectId | null;
    limit: number;
    offset: number;
}
class CommentController {

    /**
     * @desc create comment
     * @return {JSON} 
     */
    createComment = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Create New Comment Success',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    /**
     * @desc get comment
     * @return {JSON} 
     */
    getComment = async (req: Request, res: Response, next: NextFunction) => {
        const query: CommentQueryParams = req.query as unknown as CommentQueryParams;
        new SuccessResponse({
            message: 'get Comment',
            metadata: await CommentService.getCommentByParentId(query)
        }).send(res)
    }

    /**
     * @desc delete comment
     * @return {JSON} 
     */
    deleteComment = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'delete comment',
            metadata: await CommentService.deleteComment(req.body)
        }).send(res)
    }
}

export default new CommentController()