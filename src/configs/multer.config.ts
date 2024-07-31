import { Request, Express } from 'express';
import multer, { StorageEngine } from 'multer';

// Cấu hình lưu trữ trong bộ nhớ
const uploadMemory = multer({
    storage: multer.memoryStorage()
});

// Cấu hình lưu trữ trên đĩa
const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, './src/uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadDisk = multer({ storage: storage });

export { uploadMemory, uploadDisk };