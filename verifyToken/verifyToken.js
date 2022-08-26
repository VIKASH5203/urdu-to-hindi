const jwt = require('jsonwebtoken')

verifyToken = (req,res,next) => {
 
    const bearerHeader = req.headers['authorization']
    if( typeof(bearerHeader) !== 'undefined')
    {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        const token = bearerToken

        if (!token) 
        return res.status(403).send({ auth: false, message: 'No token provided.' })

        jwt.verify(token, process.env.SECRET_KEY , (err, result)=>{
            if(err)
             res.status(404).send({
                 message : "failed to authenticate"
             })
            else{
                // req.userId = decoded.id;
                req.token = token
                req.username = result.username
            }
        })

    }else{
        res.status(404).send({
            message:"no  token"
        })
    }
   
    next()
}
module.exports = verifyToken