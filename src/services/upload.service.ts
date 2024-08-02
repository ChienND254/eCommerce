
// upload from url image

import cloudinary from "../configs/cloundinary.config"
import crypto from 'node:crypto'
import { PutObjectCommand, GetObjectCommand, s3Client } from '../configs/s3.config'
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
const randomImageName = () => crypto.randomBytes(16).toString('hex')
const uploadImageFromLocalS3 = async (file: Express.Multer.File) => {
    try {
        const imageName = randomImageName()

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })

        const result = await s3Client.send(command)

        // const signedUrl = new GetObjectCommand({
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: imageName
        // })
        // const url = await getSignedUrl(s3Client, signedUrl, { expiresIn: 3600 });

        const signedUrl = getSignedUrl({
            url: `${process.env.URL_CLOUDFRONT_S3}/${imageName}`,
            keyPairId: process.env.CLOUDFRONT_S3_PUBLIC_KEY_ID!,
            dateLessThan: new Date(Date.now() + 60 * 1000).toISOString(),
            privateKey: process.env.AWS_S3_BUCKET_PRIVATE_KEY!,
        });
        return {
            signedUrl,
            result
        };

    } catch (error) {
        console.error(error);
    }
}
const uploadImageFromUrl = async () => {
    try {
        const urlImage: string = 'https://down-vn.img.susercontent.com/file/vn-11134258-7r98o-ly4uncqs4jv44b'
        const folderPorduct: string = 'product/shopId/'
        const newFileName: string = 'test'

        const result = await cloudinary.uploader.upload(urlImage, {
            public_id: newFileName,
            folder: folderPorduct
        })
        return result;

    } catch (error) {
        console.error(error);

    }
}

const uploadImageFromLocal = async (path: string, folderName: string = 'product/123') => {
    try {
        const newFileName: string = 'thumb'

        const result = await cloudinary.uploader.upload(path, {
            public_id: newFileName,
            folder: folderName
        })
        return {
            image_url: result.secure_url,
            shopId: 123,
            thumn_url: await cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                format: "png",
            })
        };

    } catch (error) {
        console.error(error);

    }
}


const uploadImageFromLocalFiles = async (files: Express.Multer.File[], folderName: string = 'product/123') => {
    try {
        const uploadUrls = []
        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: folderName
            })

            uploadUrls.push({
                image_url: result.secure_url,
                shopId: 123,
                thumn_url: await cloudinary.url(result.public_id, {
                    height: 100,
                    width: 100,
                    format: "png",
                })
            })
        }
        const newFileName: string = 'thumb'


        return uploadUrls
    } catch (error) {
        console.error(error);

    }
}

export { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalFiles, uploadImageFromLocalS3 }