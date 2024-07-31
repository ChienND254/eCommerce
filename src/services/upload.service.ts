
// upload from url image

import cloudinary from "../configs/cloundinary.config"

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

export { uploadImageFromUrl, uploadImageFromLocal, uploadImageFromLocalFiles }