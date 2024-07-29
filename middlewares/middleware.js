const jwt = require("jsonwebtoken");
require("dotenv").config();

// it is user sign
const authentication = (userData) => {
  return jwt.sign(userData, process.env.TOKEN_SAFTY);
};

// it is verify sign
const autherization = (req, res, next) => {
  const bToken = req.headers["authorization"];
  const token = bToken?.split(" ")[1] || null;
  const data = jwt.decode(token);
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SAFTY, (err, email) => {
    if (err) return res.sendStatus(403);
  });
  next();
};

module.exports = { authentication, autherization };
