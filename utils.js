// import jwt from 'jsonwebtoken';

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      password: user.password,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

const isAuth = (req, res, next) => {
  // console.log(req.headers);

  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length); //header xxxxx

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token Found' });
  }
};

const isAdmin = (req, res, next) => {
  isAdmin(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).send('Access Denied');
    }
  });
};

module.exports = {
  isAdmin,
  isAuth,
  generateToken,
};
