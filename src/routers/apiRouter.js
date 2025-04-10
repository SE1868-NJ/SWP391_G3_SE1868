const express = require('express');
const userRouter = require('./userRouter');
const fileRouter = require('./fileRouter');
const conversationRouter = require('./conversationRouter');
const messageRouter = require('./messageRouter');
const shopRouter = require('./shopRouter');
const supplierRouter = require('./supplierRouter');
const orderRouter = require('./orderRouter');
const addressRouter = require('./addressRouter');
const paymentRouter = require('./paymentRouter');
const feedbackRouter = require('./feedbackRouter');
const emailRouter = require('./emailRouter');
const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/file', fileRouter);
apiRouter.use('/conversation', conversationRouter);
apiRouter.use('/message', messageRouter);
apiRouter.use('/shop', shopRouter);
apiRouter.use('/supplier', supplierRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/address', addressRouter);
apiRouter.use('/payment', paymentRouter);
apiRouter.use('/feedback', feedbackRouter);
apiRouter.use('/email', emailRouter);


module.exports = apiRouter;