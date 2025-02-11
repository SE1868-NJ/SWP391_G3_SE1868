const express = require('express');
const userRouter = require('./userRouter');
const fileRouter = require('./fileRouter');
const conversationRouter = require('./conversationRouter');
const messageRouter = require('./messageRouter');

const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/file', fileRouter);
apiRouter.use('/conversation', conversationRouter);
apiRouter.use('/message', messageRouter);

module.exports = apiRouter;