const jwt = require("jsonwebtoken");

const AuthenticateToken = (req, res , next) =>{

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if(token == null){
    return res.status(401).json({message: "Authnetication token required"});
  }
  jwt.verify(token, process.env.SECRET, (err, user)=>{
    if(err){
      return res.status(403).json({message: "Token Expired, Please SignIn again"});
    }
    req.user = user;
    next();
  });
}
module.exports = {AuthenticateToken}