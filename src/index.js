const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routers/apiRouter');
const authRoutes = require('./routers/authRouter');
const scheduleTelegramJob = require('./jobs/telegramJob');
const scheduleUpdateStatusOrder = require('./jobs/updateStatusOrder');
const passport = require('passport');
const chatSocket = require('./socket/chatSocket');
const checkoutSocket = require('./socket/checkoutSocket');
require('./config/passport');

const fileUpload = require('express-fileupload');
const fs = require('fs'); // Import module fs
const path = require('path'); // Import module path


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

chatSocket(io);
checkoutSocket(io);

const port = 4000;

const uploadDir = path.join(__dirname, 'uploads'); // Đảm bảo thư mục đúng với vị trí file
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}


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

app.use((req, res, next) => {
	// Bỏ qua express-fileupload cho các route sử dụng multer
	if (req.originalUrl.includes('/api/file/upload') ||
		(req.originalUrl.includes('/api/shop') && req.method === 'POST') ||
		(req.originalUrl.includes('/api/user') && req.method === 'POST')) {
		return next();
	}

	// Sử dụng express-fileupload cho các route khác
	return fileUpload({
		limits: { fileSize: 5 * 1024 * 1024 }
	})(req, res, next);
});

// Add this line to serve avatar directories
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));
app.use('/uploads/shop_logos', express.static(path.join(__dirname, 'uploads/shop_logos')));

//routes
app.use('/api', apiRouter);
app.use('/', authRoutes);

// scheduleTelegramJob();
scheduleUpdateStatusOrder();

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});

server.listen(3001, () => {
	console.log('Server is running on http://localhost:3001');
});
