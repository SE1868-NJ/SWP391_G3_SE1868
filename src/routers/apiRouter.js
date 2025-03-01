const express = require("express");
const userRouter = require("./userRouter");
const fileRouter = require("./fileRouter");
const conversationRouter = require("./conversationRouter");
const messageRouter = require("./messageRouter");
const shopRouter = require("./shopRouter");

const apiRouter = express.Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/file", fileRouter);
apiRouter.use("/conversation", conversationRouter);
apiRouter.use("/message", messageRouter);
apiRouter.use("/shop", shopRouter);

module.exports = apiRouter;
