require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const db = require("../models");
var blacklist = [];

function verifyJWT(req, res, next) {

    const token = req.headers['Authorization'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    const index = blacklist.findIndex(item => item === token);
    if (index !== -1) return res.status(401).end();

    jwt.verify(token, process.env.JWT, function (err, decoded) {
        if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' })

        req.userId = decoded.id;
        next();
    });
}

async function login(req, res,) {

    var User = db.users;
    var DataUsers = db.data_users;

    const crypto = require('crypto');

    // Create an MD5 hash object
    const md5Hash = crypto.createHash('md5');

    // Update the hash object with the password
    md5Hash.update(req.body.password);

    // Get the hexadecimal representation of the hash
    const password_md5 = md5Hash.digest('hex');

    const user = await User.findOne({
        where: {
            login: req.body.login,
            password: password_md5,
            status: 1
        }
    })
    
    const datauser = await DataUsers.findOne({
        where: { user_id: user.id}
    })
    

    if (user != null) {
        const id = user.id;
        console.log(id);
        const token = jwt.sign({ id }, process.env.JWT, {
            expiresIn: 300 // expires in 5min

        });
        await user.update({ token: token });

        return res.json({
            id: id,
            uuid: user.uuid,
            login: user.login,
            fullname: datauser.fullname,
            token: user.token,
            refresh_token: token,
            profile: user.profile,
            status: user.status,
            createdAt: user.createdAt,
        });
    }
    
    res.status(500).json({ message: 'Login inválido!' });

}
function logout(req, res) {
    blacklist.push(req.headers['Authorization']);
    console.log("lista" + blacklist);
    res.json({ auth: false, token: null, blacklist: blacklist });
}

function verifyRoute(req, res, next) {

    const token = req.headers['access-route'];
    const secret_route = process.env.SECRET_ROUTE
    console.log(token)
    if (!token) return res.status(401).json({ status: false, message: 'No token provided.' });

    if (token != secret_route)
        return res.status(403).json({ status: false, message: 'Failed to authenticate.' })

    next();
}

module.exports = {
    verifyJWT,
    login,
    logout,
    verifyRoute
};



