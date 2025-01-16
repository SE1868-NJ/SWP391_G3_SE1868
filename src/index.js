const express = require('express');
const cors = require('cors');
const apiRouter = require('./routers/apiRouter');
const scheduleTelegramJob = require('./jobs/telegramJob');

const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', apiRouter);

scheduleTelegramJob();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
