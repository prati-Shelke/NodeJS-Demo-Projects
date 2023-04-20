// Node App starts here

const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let server;
logger.info(`Node Environment => ${config.env}`);

// Connect to MongoDB using mongoose
mongoose.connect(config.mongoose.url, config.mongoose.options).then((db) => {
  logger.info(`Connected to MongoDB => ${config.mongoose.url}`);
  
});

server = app.listen(config.port, () => {
  logger.info(`Node server listening on port => ${config.port}`);
});

//socket.io connection
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => { 
  logger.info(`Connected to socket.io`);

  socket.on("setup",(userData)=>{
    socket.join(userData._id)
    logger.info("User has joined our application")
    socket.emit("connected");
  })

  socket.on("join chat",(room)=>{
    socket.join(room)
    logger.info("User Joined Room: " + room);
  })

  socket.on("typing", (room) => socket.to(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message",(newMessageReceived)=>
  {
    socket.broadcast.emit("message recieved", newMessageReceived);
  })

  socket.off("setup", () => {
    logger.info("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

// Manually close the server if an unhandled exception occurs
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

// Listen to unhandled exceptions and call handler when such exceptions occur
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Close the server if command received to close the server. 
// E.g. Node process killed by OS or by the user using kill, pkill, task manager, etc.
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
