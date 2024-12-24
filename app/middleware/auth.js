const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const db = require("../models");
const Users = db.users;
const DataUsers = db.data_users;
let blacklist = [];

require("dotenv-safe").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Função de login
async function login(req, res) {
  try {
    const { login, password } = req.body;

    const md5Hash = crypto.createHash("md5").update(password).digest("hex");

    const user = await Users.findOne({
      where: {
        login: login,
        password: md5Hash,
        status: 1,
      },
    });

    if (user) {
      const datauser = await DataUsers.findOne({
        where: { user_id: user.id },
      });

      const token = jwt.sign(
        {
          id: user.id,
          uuid: user.uuid,
          id_empresa: user.empresa_id,
          login: user.login,
          fullname: datauser.fullname,
          profile: user.profile
        },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN } // Token expira em 6 horas
      );

      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + parseInt(process.env.JWT_EXPIRES_HOURS));

      return res.json({
        status: true,
        user: {
          id: user.id,
          login: user.login,
          fullname: datauser.fullname,
          profile: user.profile,
          status: user.status,
          createdAt: user.createdAt,
          token: token,
          dt_expired: expirationDate.toISOString()
        },
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error retrieving Data",
    });
  }
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  // Verificar se o token está na blacklist
  if (blacklist.includes(token)) {
    return res.status(401).json({ status: false, message: "Token is blacklisted." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ status: false, message: "Invalid token." });
  }
}

// Função de logout
function logout(req, res) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, JWT_SECRET); // Verificar se o token é válido
    blacklist.push(token); // Adicionar o token à blacklist
    console.log("Blacklist:", blacklist);
    res.json({ auth: false, token: null, message: "Logged out successfully." });
  } catch (err) {
    res.status(400).json({ status: false, message: "Invalid token." });
  }
}

function decodeTokenFromHeader(req) {
  // Obter o cabeçalho Authorization
  const authHeader = req.header("Authorization");

  // Verificar se o cabeçalho Authorization está presente e começa com "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Access denied. No token provided or invalid token format.");
  }

  // Extrair o token do cabeçalho Authorization
  const token = authHeader.split(" ")[1];

  // Decodificar o token (sem validar a assinatura)
  const decodedToken = jwt.decode(token);

  if (!decodedToken) {
    throw new Error("Invalid token.");
  }

  // Retornar o conteúdo decodificado do token
  return decodedToken;
}

module.exports = {
  login,
  logout,
  authenticateToken,
  decodeTokenFromHeader
};
