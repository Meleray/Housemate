const jwt = require("jsonwebtoken");

const checkJWT = async (req, res, next) => {
  if (process.env.VERTICAL == 'test') {
    next();
  } else {
    const token = req.cookies.jwtToken;
    if (!token) {
      return res
        .status(403)
        .send({ error: "No JWT token provided" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
      if (error) {
        return res.status(401).send({ error: "Received Invalid JWT token" });
      }
      req.body.userId = payload.userId;
    });
    next();
  }
};

module.exports = { checkJWT };
