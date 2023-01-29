const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Users = require('../models/userModels.js');
const { isAuth, generateToken, isAdmin } = require('../utils.js');
const bcrypt = require('bcryptjs');
const User = require('../models/userModels.js');
const userRouter = express.Router();

// SIGNUP
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    let user;

    // MAIL VALIDATION
    const email = req?.body?.email
      ? typeof req.body?.email !== 'string'
        ? null
        : req?.body?.email?.toLowerCase()?.trim()
      : null;

    if (!email) {
      return res.status(400).send('Please provide required credentials');
    }

    const userExists = await Users.findOne({ email });

    if (userExists) {
      return res.send('User already exist');
    }
    //   NAME VALIDATION

    const name = req?.body?.name
      ? typeof req?.body?.name !== 'string'
        ? null
        : req?.body?.name?.toLowerCase()?.trim()
      : null;

    if (!name) {
      return res.status(400).send({ message: 'User already exist' });
    }

    //   VALIDATE PASSWORD

    const password = req?.body?.password
      ? typeof req?.body?.password !== 'string'
        ? null
        : req?.body?.password?.toLowerCase()?.trim()
      : null;

    if (!password) {
      return res.status(400).send('Please provide required credentials');
    }

    user = await Users.create({
      name: req?.body?.name,
      email: req?.body?.email,
      isAdmin: req.body.admin,
      password: bcrypt.hashSync(req?.body?.password),
    });

    // user = await newUser.save();

    const token = generateToken(user);
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
      message: 'Account created successfully',
    });
  })
);

// SIGNIN
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    let user;
    const email = req?.body?.email
      ? typeof req?.body?.email !== 'string'
        ? null
        : req?.body?.email?.toLowerCase()?.trim()
      : null;

    if (!email) {
      return res.status(400).send('Please provide required credentials');
    }

    const password = req?.body?.password
      ? typeof req?.body?.password !== 'string'
        ? null
        : req?.body?.password?.toLowerCase()?.trim()
      : null;
    if (!password) {
      return res.status(400).send('Please provide valid credentials');
    }

    user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).send('Invalid Credentials');
    }

    const passwordMatch = bcrypt.compareSync(
      req?.body?.password,
      user?.password
    );

    if (!passwordMatch) {
      return res.status(404).send('invalid credentials');
    }

    const token = generateToken(user);

    if (!token) {
      return res
        .status(500)
        .send(
          'An error occured while signin in. Try again within few seconds.'
        );
    }

    return res.send({
      _id: user?._id,
      name: user?.name,
      email: user?.email,
      isAdmin: user?.isAdmin,
      token,
      success: true,
      message: 'Logged in successfully',
    });
  })
);

// GET ALL USERS

userRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    // console.log('got heres');
    try {
      const documents = await Users.countDocuments({});
      const users = await Users.find({}).select('-password');

      if (users.length > 0) {
        return res.status(201).send({ users, documents });
      }
      res.status(404).json({ message: 'There are no users in the system' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Unable to find users' });
    }
  })
);

// GET SINGLE USER

userRouter.get(
  '/singleUser/:userId',
  expressAsyncHandler(async (req, res) => {
    const singleUser = await Users.findOne({ _id: req.params.userId });

    if (!singleUser) {
      return res.status(404).send('User does not exist');
    }

    res.send({ singleUser });
  })
);

// INCOMPLETE
userRouter.post(
  '/forgotpassword',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    let user;
    // MAIL VALIDATION
    const email = req?.body?.email
      ? typeof req?.body?.email !== 'string'
        ? null
        : req?.body?.email?.toLowerCase()?.trim()
      : null;
    if (!email) {
      return res.status(400).send('Please provide required credentials');
    }

    user = await User.findOne({ email });

    const token = generateToken(user);

    // http://localhost:3000/reset-password/:token
    // http://localhost:3000/reset-password/token

    res.send({ message: 'Check you email to continue' });
  })
);

// INCOMPLETE

// userRouter.put(
//   '/reset',
//   expressAsyncHandler(async (req, res) => {
//     let user;
//     // MAIL VALIDATION
//     const email = req?.body?.email
//       ? typeof req.body?.email !== 'string'
//         ? null
//         : req?.body?.email?.toLowerCase()?.trim()
//       : null;

//     if (!email) {
//       return res.status(400).send('Please provide required credentials');
//     }

//     user = await User.findOne({ email: req?.body?.email });

//     //   VALIDATE PASSWORD

//     const password = req?.body?.password
//       ? typeof req?.body?.password !== 'string'
//         ? null
//         : req?.body?.password?.toLowerCase()?.trim()
//       : null;

//     if (!password) {
//       return res.status(400).send('Please provide required credentials');
//     }

//     // console.log(user);

//     if (user) {
//       user.password = bycrypt.hashSync(password, 8);
//       console.log(user.password);
//     }

//     const updatedUser = await user.save();
//     const token = generateToken;

//     res.send({
//       name: updatedUser?.name,
//       password: updatedUser?.password,
//       email: updatedUser?.email,
//       token,
//       message: 'Password Successfully Updated. Bravo!',
//     });
//   })
// );

// THIS ROUTE IS USE TO PROMOTE OR DEMOTE A USER (ADMIN OR NOT ADMIN)
userRouter.post(
  '/update-user/:userId',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId });

    if (!user) {
      res.status(404).send('User Not Found');
    }

    user.isAdmin = !user.isAdmin;
    const updated = await user.save();
    res.status(201).json({ updated });
  })
);

userRouter.delete(
  '/delete-user/:userId',
  expressAsyncHandler(async (req, res) => {
    const userToDelete = await User.findOne({ _id: req.params.userId });

    if (!userToDelete) {
      res.status(404).send('User does not exist');
    }

    await userToDelete.remove();
    res.status(201).json({ message: 'Deleted successfully' });
  })
);

module.exports = {
  userRouter,
};
