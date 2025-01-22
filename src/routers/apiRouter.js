const express = require('express');
const userRouter = require('./userRouter');
const fileRouter = require('./fileRouter');
const authRouter = require('./authRouter');

const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/file', fileRouter);
apiRouter.use('/auth', authRouter);

module.exports = apiRouter;