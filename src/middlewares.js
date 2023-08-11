const jwt = require("jsonwebtoken");

const fetchPerson = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
      return res
        .status(401)
        .send({ success: false, message: "Token not found"});
    }
  
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      req.mongoID = data.mongoID;
      req.isAdmin = data.isAdmin;
  
      next();
    } catch (err) {  
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  };

module.exports = fetchPerson;