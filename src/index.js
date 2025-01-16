const express = require('express');
const userRouter = require('./routers/userRouter');
const fileRouter = require('./routers/fileRouter');
const scheduleTelegramJob = require('./jobs/telegramJob');
const app = express();
const port = 3000;

app.use('/api', userRouter);
app.use('/api/file', fileRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

scheduleTelegramJob();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
