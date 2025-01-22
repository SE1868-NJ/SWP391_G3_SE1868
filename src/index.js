const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/apiRouter');
const authRoutes = require('./routers/authRouter');
const scheduleTelegramJob = require('./jobs/telegramJob')
const passport = require('passport');
require('./config/passport');

const app = express();
const port = 3000;

//middleware
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

app.use(session({
  secret: 'qtwqhdfhdfagasdggasdagsg', 
  resave: false,
  saveUninitialized: true, 
  cookie: { secure: false } // Cài đặt cookie cho session (đặt `secure: true` nếu chạy trên HTTPS)
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/api', apiRouter);
app.use('/', authRoutes);

scheduleTelegramJob();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
