const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

exports.authCheck = async (req,res, next)=>{
    try{

        const headerToken = req.headers.authorization
        if(!headerToken){
            return res.status(401).json({ message: "Notoken, Authorization"})
        }

        const token = headerToken.split(" ")[1]
        
        const decode = jwt.verify(token,process.env.SECRET)
        req.user = decode

        
        const user = await prisma.user.findFirst({
            where:{
                email: req.user.email
            }
        })
        if(!user.enabled){
            res.status(400).json({ message: "This account cannot access"})
        }


        next()

    }catch(err){
        res.status(500).json({ message: 'Token invalid'})
    }
}

exports.adminCheck = async(req,res,next)=>{
    try{

        const { email } = req.user
        const adminUser = await prisma.user.findFirst({
            where:{
                email:email
            }
        })
        if(!adminUser || adminUser.role !== 'admin'){
            res.status(403).json({ message:'Acecc Denied: Admin only'})
        }
        // console.log("admin check", adminUser);
        
        
        next()

    }catch(err){
        res.status(500).json({ message: 'Admin access denied'})
    }
}