const { query, json } = require("express");
const prisma = require("../config/prisma");
const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUND_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.create = async (req, res) => {
    try {

        const { title, description, price, quantity, categoryId, images } = req.body
        // console.log(title, description, price, quantity, imges );

        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url,
                    }))
                }
            }
        })
        res.status(201).json({
            message: "Product created successfully!",
            product
        });
    } catch (err) {
        // console.log("Error:", err);
        res.status(500).json({ message: err.message })
    }
}

exports.list = async (req, res) => {
    try {
        const { count } = req.params
        console.log(typeof count);
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                images: true
            }
        })

        res.send(products)
    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: "server error" })
    }
}

exports.read = async (req, res) => {
    try {
        const { id } = req.params
        console.log(typeof count);
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                category: true,
                images: true
            }
        })

        res.send(products)
    } catch (err) {
        res.status(500).json({ message: "server error" })
    }
}

exports.update = async (req, res) => {
    try {


        const { title, description, price, quantity, categoryId, images } = req.body
        // console.log(title, description, price, quantity, imges );


        // clear img 
        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id)
            }
        })

        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => ({
                        asset_id: item.asset_id,
                        public_id: item.public_id,
                        url: item.url,
                        secure_url: item.secure_url,
                    }))
                }
            }
        })




        res.send("Hello create product")

    } catch (err) {
        res.status(500).json({ message: "server error" })
    }
}

exports.remov = async (req, res) => {
    try {

        const { id } = req.params;

        // step 1: ค้นหาผลิตภัณฑ์
        const product = await prisma.product.findFirst({
            where: { id: Number(id) },
            include: { images: true }
        });

        if (!product) {
            return res.status(400).json({ message: 'Product not found!' });
        }

        // console.log(product);

        // step 2: ลบภาพจาก Cloudinary
        const deleteImage = product.images.map((image) =>
            new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(image.public_id, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result); // ใช้ `result` จาก Cloudinary
                    }
                });
            })
        );

        await Promise.all(deleteImage); // รอให้การลบภาพทั้งหมดเสร็จสิ้น

        // step 3: ลบผลิตภัณฑ์จากฐานข้อมูล
        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        });


        res.send("Product deleted successfully");
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.listby = async (req, res) => {
    try {

        const { sort, order, limit } = req.body
        console.log(sort, order, limit);
        const product = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: { 
                category: true,
                images: true
            }
        })

        res.send(product)
    } catch (err) {
        res.status(500).json({ message: "server error" })
    }
}
// const handleQuery = async (req, res, query) => {
//     try {
//         //code
//         const products = await prisma.product.findMany({
//             where: {
//                 title: {
//                     contains: query,
//                 }
//             },
//             include: {
//                 category: true,
//                 images: true
//             }

//         })
//         res.send(products)
//     } catch (err) {
//         //err
//         console.log(err)
//         res.status(500).json({ message: "Search Error" })
//     }
// }

const handleQuery = async (req, res, query) => {
    try {

        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)


    } catch (err) {
        res.status(500).json({ message: "Search Error" })
    }
}

const handlePrice = async (req, res, priceRange) => {
    try {

        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)

    } catch (err) {
        res.status(500).json({ message: "Search Error" })
    }
}


const handleCategory = async (req, res, categoryId) => {
    try {

        const products = await prisma.product.findMany({
            where: {
                categoryId: {
                    in: categoryId.map((id) => Number(id))
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)

    } catch (err) {
        res.status(500).json({ message: "Search Error" })
    }
}



exports.searchFiltsrs = async (req, res) => {
    try {
        // code
        const { query, category, price } = req.body

        if (query) {
            // console.log('query-->', query)
            await handleQuery(req, res, query)
        }
        if (category) {
            // console.log('category-->', category)
            await handleCategory(req, res, category)
        }
        if (price) {
            // console.log('price-->', price)
            await handlePrice(req, res, price)
        }

        // res.send('Hello searchFilters Product')
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}





exports.createImages = async (req, res) => {
    try {
        // console.log(req.body);
        const result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `BenGod-${Date.now()}`,
            resource_type: 'auto',
            folder: 'Ecom2024'
        })
        res.send(result)
    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }
}

exports.removeImage = async (req, res) => {
    try {
        const { public_id } = req.body
        // console.log(public_id);
        cloudinary.uploader.destroy(public_id, (result) => {
            res.send('Remove Img success')
        })
    } catch (err) {
        res.status(500).json({ message: "Server Error" })
    }
}