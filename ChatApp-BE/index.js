const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

const corsConfig = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.json());

app.get("/", (req, res) => {
    res.send({
        status: 200,
        message: "Cari apa bro!!"
    });
});

const UserRoute = require("./routes/user.route");
const ConversationsRoute = require("./routes/coversations.route");
const MessagesRoute = require("./routes/messages.route");
const { Authentication } = require("./middleware/middleware");

app.use(UserRoute);
app.use(ConversationsRoute);
app.use(MessagesRoute);

app.get("/test", Authentication, (req, res) => {
    return res.send("berhasil");
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let userOnline = [];
io.on('connection', socket => {
    socket.on("addUser", async ({ id, username, email, image }) => {
        console.log(`io-addUser | ${email} - ${username}\n`);
        const checkUser = userOnline.find((item) => item.id === id);
        const checkUserDb = await prisma.chatApp_Users.findFirst({ where: { id } });
        if (!checkUser && checkUserDb) {
            await prisma.chatApp_Users.update({
                where: { id },
                data: { online: true }
            });
            userOnline.push({
                id, username, email, image, socketId: socket.id, online: true
            });
            io.emit("onlineUsers", userOnline);
        }
    });

    socket.on("sendMessages", async ({ conversationId, senderId, message, receiverId }) => {
        const receiver = userOnline.find((item) => item.id === receiverId);
        const sender = userOnline.find((item) => item.id === senderId);
        if (sender) {
            console.log(`io-sendingMesssages \n >Sender: ${sender.email} - ${sender.username} - ${sender.socketId}`);
            io.to(sender.socketId).emit("getMessages", {
                conversationId,
                senderId,
                message,
                senderData: {
                    id: sender.id,
                    username: sender.username,
                    email: sender.email,
                    image: sender.image
                },
                createAt: new Date()
            });
        }
        if (receiver) {
            console.log(`io-sendingMesssages \n >Receiver: ${receiver.email} - ${receiver.username} - ${receiver.socketId}\n`);
            io.to(receiver.socketId).emit("getMessages", {
                conversationId,
                senderId,
                message,
                senderData: {
                    id: sender.id,
                    username: sender.username,
                    email: sender.email,
                    image: sender.image
                },
                createAt: new Date()
            });
        } else {
            console.log(`io-sendingMesssages \n >Receiver: offline - id: ${receiverId}\n`);
        }
    });

    socket.on("addConversations", ({ senderId, receiverId }) => {
        const receiver = userOnline.find((item) => item.id === receiverId);
        const sender = userOnline.find((item) => item.id === senderId);
        console.log("io-addConversations \n");
        if (sender) {
            io.to(sender.socketId).emit("getConversations", { message: "berhasil" });
        }
        if (receiver) {
            io.to(receiver.socketId).emit("getConversations", { message: "berhasil" });
        }
    });

    socket.on("disconnect", async () => {
        const updateData = userOnline.find((item) => item.socketId === socket.id);
        userOnline = userOnline.filter((item) => item.socketId !== socket.id);
        if (updateData) {
            console.log(`io-disconnect | ${updateData.email} - ${updateData.username} - ${updateData.socketId}\n`);
            await prisma.chatApp_Users.update({
                where: { id: updateData.id },
                data: { online: false }
            });
            io.emit("onlineUsers", userOnline);
        }
    });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
