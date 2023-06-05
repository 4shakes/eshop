const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors = require("./catchAsyncErrors")
const jwt = require("jsonwebtoken")
const User = require("../model/user")
const Shop = require("../model/shop")

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401))
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = await User.findById(decode.id)

    next()
})

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
    const { seller_token } = req.cookies

    if (!seller_token) {
        return next(new ErrorHandler("Please login to continue", 401))
    }

    const decode = jwt.verify(seller_token, process.env.JWT_SECRET_KEY)

    req.seller = await Shop.findById(decode.id)

    next()
})