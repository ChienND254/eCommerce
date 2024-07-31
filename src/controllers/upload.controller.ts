import { Request, Response, NextFunction } from 'express'
import {uploadImageFromLocal, uploadImageFromLocalFiles, uploadImageFromUrl} from '../services/upload.service';
import { SuccessResponse } from '../core/success.response';
import { BadRequestError } from '../core/error.response';

class UploadController {

    uploadFile = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'upload success',
            metadata: await uploadImageFromUrl()
        }).send(res)
    }

    uploadThumb = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) {
            throw new BadRequestError('File missing')
        }
        
        const file = req.file as Express.Multer.File;
        const path = file.path; 
        new SuccessResponse({
            message: 'upload success',
            metadata: await uploadImageFromLocal(path)
        }).send(res)
    }

    uploadImageFromLocalFiles = async (req: Request, res: Response, next: NextFunction) => {
        const { files } = req

        if (!files || !Array.isArray(files) || files.length === 0) {
            throw new BadRequestError('File missing');
        }
        
        new SuccessResponse({
            message: 'upload success',
            metadata: await uploadImageFromLocalFiles(
                files
            )
        }).send(res)
    }
}

export default new UploadController()