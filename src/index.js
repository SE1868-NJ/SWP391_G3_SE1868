const express = require('express');
const cors = require('cors');
const session = require('express-session');
const apiRouter = require('./routers/apiRouter');
const authRoutes = require('./routers/authRouter');
const scheduleTelegramJob = require('./jobs/telegramJob')
const passport = require('passport');
require('./config/passport');

const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: 'qtwqhdfhdfagasdggasdagsg', 
  resave: false,
  saveUninitialized: true, 
  cookie: { secure: false } // Cài đặt cookie cho session (đặt `secure: true` nếu chạy trên HTTPS)
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);
app.use('/', authRoutes);

scheduleTelegramJob();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
