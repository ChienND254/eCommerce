import { model, Schema } from 'mongoose';
import { IComment } from '../interface/comment'
const DOCUMENT_NAME: string = 'Comment'
const COLLECTION_NAME: string = 'Comments'

const commentSchema: Schema = new Schema({
    comment_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    comment_userId: { type: Number, default: 1 },
    comment_content: { type: String, default: 'text' },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const CommentModel = model<IComment>(DOCUMENT_NAME, commentSchema);

export { CommentModel };