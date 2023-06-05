const express = require("express")
const path = require("path")
const router = express.Router()
const fs = require("fs")
const jwt = require("jsonwebtoken")
const sendMail = require("../utils/sendMail")
const { isAuthenticated, isSeller } = require("../middleware/auth")
const { upload } = require("../multer")
const ErrorHandler = require("../utils/ErrorHandler")
const Shop = require("../model/shop")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const sendShopToken = require("../utils/shopToken")

//CREATE SHOP
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
    try {
        const { email } = req.body

        const sellerEmail = await Shop.findOne({ email })

        if (sellerEmail) {
            const filename = req.file.filename
            const filePath = `uploads/${filename}`
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Error deleting file" })
                } else {
                    res.json({ message: "File deleted successfully" })
                }
            })
            return next(new ErrorHandler("Shop already exists", 400))
        }

        const filename = req.file.filename
        const fileUrl = path.join(filename)

        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode
        }


        const activationToken = createActivationToken(seller)

        const activationUrl = `http://localhost:5173/seller/activation?token=${activationToken}`

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your shop",
                message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
            })
            res.status(201).json({
                success: true,
                message: `please check your email:- ${seller.email} to activate shop`
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 500))
        }

    } catch (error) {
        return next(new ErrorHandler(error.message), 400)
    }
})

//CREATE ACTIVATION TOKEN
const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    })
}

//ACTIVATE Shop
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { activation_token } = req.body

        const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET)

        if (!newSeller) {
            return next(new ErrorHandler("Invalid token", 400))
        }
        const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller

        let seller = await Shop.findOne({ email })

        if (seller) {
            return next(new ErrorHandler("Shop already exist", 400))
        }

        seller = await Shop.create({
            name,
            email,
            avatar,
            password,
            zipCode,
            address,
            phoneNumber
        })

        sendShopToken(seller, 201, res)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

//LOGIN SHOP
router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return next(new ErrorHandler("Please provide the all fields!", 400))
        }

        //.select("+password") Este método selecciona el campo de la contraseña para incluirlo en el resultado. 
        const user = await Shop.findOne({ email }).select("+password")

        if (!user) {
            return next(new ErrorHandler("User doesn't exists!", 400))
        }

        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            return next(new ErrorHandler("Please provide the correct information", 400))
        }

        sendShopToken(user, 201, res)

    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}))

// LOAD SHOP
router.get("/getSeller", isSeller, catchAsyncErrors(async (req, res, next) => {

    try {
        const seller = await Shop.findById(req.seller._id)


        if (!seller) {
            return next(new ErrorHandler("Seller doesnt't exists", 400))
        }

        res.status(200).json({
            success: true,
            seller,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}))



module.exports = router