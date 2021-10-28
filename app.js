require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
const userRouter = require("./api/users/user.router");

const io = require("socket.io")(server, {
	cors: {
		origin:`*`,
    methods:["GET","POST"]
	}
});

app.use(cors());
app.use(express.json());
app.use(userRouter);

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(process.env.APP_PORT,()=>{
  console.log("Server listening at :" + process.env.APP_PORT);
});

