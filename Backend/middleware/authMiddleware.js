// Middleware de autenticación
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken || !accessToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No se proporcionó un token de acceso válido" });
  }

  const token = accessToken.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = { userId: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token de acceso expirado" });
    }
    return res.status(403).json({ message: "Token de acceso inválido" });
  }
};

module.exports = authMiddleware;
