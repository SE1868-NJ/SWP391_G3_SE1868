const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/apiRouter');
const authRoutes = require('./routers/authRouter');
const scheduleTelegramJob = require('./jobs/telegramJob');
const passport = require('passport');
const chatSocket = require('./socket/chatSocket');
require('./config/passport');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

chatSocket(io);

const port = 4000;

//middleware
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
	origin: '*',
	credentials: true,
};
app.use(cors(corsOptions));

app.use(
	session({
		secret: 'qtwqhdfhdfagasdggasdagsg',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

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

server.listen(3001, () => {
	console.log('Server is running on http://localhost:3001');
});
