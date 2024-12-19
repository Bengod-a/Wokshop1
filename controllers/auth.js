const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { token } = require('morgan')

exports.register = async (req,res)=> {

    try{
        const { email, password }=  req.body
        if(!email){

            return res.status(400).json({ message: 'Email is required!!!!'})
        }
        if(!password){
            return res.status(400).json({ message: 'password is required!!!!' })
        }

        // step 2
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(user){
            return res.status(400).json({ message: "Email already exits!!"})
        }
        
        // step 3
        const hashPassword = await bcrypt.hash(password,10)
        // console.log(hashPassword);

        // step 4
        await prisma.user.create({
            data:{
                email : email,
                password: hashPassword
            }
        })
        



        // console.log(email, password);
        res.send('Register success')
    }catch(err){
        console.log(err);
        res.status(500).json({ message:"Server error" })
    }

}

exports.login = async(req,res)=> {
    try {
        const { email, password} = req.body

        // sptep 1 check email
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(!user || !user.enabled){
            return res.status(400).json({ message: 'User Not foind ro not Enabled'})
        }


        // sptep 2 check password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ message: 'Password invalid!!'})
        }


        // sptep 3 create payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        }

        // console.log(payload);


        // sptep 4 Generate Token
        jwt.sign(payload,process.env.SECRET,{expiresIn: '1d'},(err,token)=>{
            if(err){
                return res.status(500).json({ message: "Server err"})
            }

            res.json({ payload, token})
        })

    }catch(err){
        // console.log(err);
        res.status(500).json({ message:"Server error" })
    }
}

exports.currentUser = async(req,res)=> {
    try{
        const user = await prisma.user.findFirst({
            where:{ email: req.user.email },
            select:{
                id:true,
                email: true,
                name: true,
                role: true
            }
        })
        res.json({ user })
    }catch(err){
        // console.log(err);
        res.status(500).json({ message:"Server error"})
    }
}