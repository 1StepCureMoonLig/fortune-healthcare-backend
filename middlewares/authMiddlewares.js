const jwt = require("jsonwebtoken")
const user = require('../models/user')

const requireAuth = (req,res,next)=>{
    const token = req.cookies.ftune
    const secretKey = "Mnet2024"
    if(token){
        jwt.verify(token,secretKey,(err,decodedToken) =>
        {
            if(err){
                res.status(403).json("Bhak")
            }else{
                res.status(200).json("aaja andar")
                //next()
            }
        })
    }else{
        res.status(400).json("token lek ah")
    }
}

module.exports={
    requireAuth
}