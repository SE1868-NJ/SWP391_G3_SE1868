const express = require('express');
const userRouter = require('./userRouter');
const fileRouter = require('./fileRouter');

const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/file', fileRouter);

module.exports = apiRouter;