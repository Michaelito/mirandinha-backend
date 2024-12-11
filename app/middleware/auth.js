require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const db = require("../models");
const Users = db.users;
const DataUsers = db.data_users;
var blacklist = [];

function verifyJWT(req, res, next) {
  const token = req.headers["Authorization"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  const index = blacklist.findIndex((item) => item === token);
  if (index !== -1) return res.status(401).end();

  jwt.verify(token, process.env.JWT, function (err, decoded) {
    if (err)
      return res
        .status(401)
        .json({ auth: false, message: "Failed to authenticate token." });

    req.userId = decoded.id;
    next();
  });
}

async function login(req, res) {
  //try {
  const crypto = require("crypto");
  const md5Hash = crypto.createHash("md5");
  md5Hash.update(req.body.password);
  const password_md5 = md5Hash.digest("hex");

  try {
    // Find the first user whose age is greater than or equal to 18
    const user = await Users.findOne({
      where: {
        login: req.body.login,
        password: password_md5,
        status: 1,
      },
    });

    if (user) {
      const datauser = await DataUsers.findOne({
        where: { user_id: user.id },
      });

      return res.json({
        status: true,
        user: {
          id: user.id,
          uuid: user.uuid,
          empresa_id: user.empresa_id,
          login: user.login,
          fullname: datauser.fullname,
          token: user.token,
          refresh_token: user.refresh_token,
          profile: user.profile,
          status: user.status,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(200).send({
        status: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Error retrieving Data",
    });
  }
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



