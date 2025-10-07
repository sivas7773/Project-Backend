const jwt = require("jsonwebtoken");
const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    //step 1: Receive token from headers and validate the token
    const authHeaders = req.headers.authorization;
  
    //"Bearer" space token
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "unauthorised: No token provided" });
    }
    const token = authHeaders.split(" ")[1]; //['Bearer','token'];
 
    try {
      //step 2: Decode token with secret key and take the "role" from decoded-token

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
    
      //step 3: conditions for allowing api
      //if login but no roles need to access
   
      if (allowedRoles.length === 0) {
        return next();
      }

      //authorization for api
      //if logined in and paticular roles to access
      if (!allowedRoles.includes(decoded.role)) {
      
        return res
          .status(403)
          .json({ message: "Forbidden: You dont have the access" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
module.exports = authMiddleware;
