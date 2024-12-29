require('dotenv').config();
//const dotenv = require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
var jwt = require('jsonwebtoken');


const fetchuser = (req, res, next) => {
    //GET the user using JWT_Token and add the id to req object
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send({ error: "Please verify using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user
        //res.send(data)
        next();

    } catch (error) {
        res.status(401).send({ error: "Please verify using a valid token" });

        //const data = jwt.verify(token, JWT_SECRET);
        // res.send(token)
        //res.send(data)
    }


}


module.exports = fetchuser;