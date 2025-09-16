const jwt = require("jsonwebtoken");

function AuthenticateToken(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; // attach payload
    next();
  });
}

module.exports = { AuthenticateToken };
