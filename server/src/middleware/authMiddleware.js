import jwt from 'jsonwebtoken';

const authJWT = (req, res, next) => { 
         
     const token =req.header('Authentication');

     if(!token){
        return res.status(401).json({message: "Unauthorised"})
     }

     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({message: "forbidden"});
        }

        res.user =user;
        next();
     })
}

export default authJWT;