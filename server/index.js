const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');
dotenv.config('./.env');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
  }
});

const socketCalls = require('./socketCalls');
socketCalls(io);

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDB = async () => {
  console.log(`Connecting to MongoDB...`);
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { // await is necessary
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    return console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    throw new Error(`Failed to connect to MongoDB. ${err}`);
  }
}

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/chat', chatRoutes);
const messageRoutes = require('./routes/messageRoutes');
app.use('/message', messageRoutes);

server.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server started on port ${process.env.PORT}`);
});