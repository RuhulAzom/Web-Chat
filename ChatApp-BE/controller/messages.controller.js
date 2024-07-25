const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

exports.SentMessages = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        const Conversations = await prisma.chatApp_Conversations.findFirst({
            where: {
                AND: [
                    { members: { has: senderId } },
                    { members: { has: receiverId } }
                ]
            }
        })

        // Jika Conversations Belum Ada
        if (!Conversations) {
            const newConveersations = await prisma.chatApp_Conversations.create({
                data: {
                    members: [senderId, receiverId]
                }
            })
            const AddMessages = await prisma.chatApp_Messages.create({
                data: {
                    conversationsId: newConveersations.id,
                    message,
                    senderId
                }
            })
            return res.status(201).json({
                status: 201,
                message: "Conversations made and sent message",
                data: AddMessages,
                conversationsId: newConveersations.id
            })
        }

        // Jika Conversations Sudah Ada
        const AddMessages = await prisma.chatApp_Messages.create({
            data: {
                conversationsId: Conversations.id,
                message,
                senderId
            }
        })
        if (AddMessages) {
            await prisma.chatApp_Conversations.update({
                where: {
                    id: Conversations.id
                },
                data: {
                    updateAt: new Date()
                }
            })
        }
        return res.status(200).json({
            status: 200,
            message: "Succesfully sent message",
            data: AddMessages
        })
    } catch (error) {
        console.log("Error Pada AddConversations", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.GetMessagesByConversationsId = async (req, res) => {
    try {
        const { conversationsId } = req.params
        const page = req.query.page || 1;
        const perPage = 10;

        const totalCount = await prisma.chatApp_Messages.count({ where: { conversationsId } });
        const totalPage = Math.ceil(totalCount / perPage);
        const userData = await prisma.chatApp_Messages.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            where: {
                conversationsId
            },
            orderBy: {
                createAt: "desc"
            },
            include: {
                senderData: true
            }
        })
        if (!userData) {
            return res.status(201).json({
                status: 201,
                message: "Messages not found",
                data
            })
        }
        return res.status(200).json({
            status: 200,
            message: "Succesfully get message",
            data: userData,
            page,
            totalPage
        })
    } catch (error) {
        console.log("Error Pada GetMessages", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.GetLastMessagesByConversationsId = async (req, res) => {
    try {
        const { conversationsId } = req.params
        const page = req.query.page || 1;
        const perPage = 10;

        const totalCount = await prisma.chatApp_Messages.count({ where: { conversationsId } });
        const totalPage = Math.ceil(totalCount / perPage);

        const data = await prisma.chatApp_Messages.findMany({
            skip: (page - 1) * perPage,
            take: perPage,
            where: {
                conversationsId
            },
            orderBy: {
                createAt: "desc"
            }
        })
        const lastMessage = data[0];
        if (!data) {
            return res.status(201).json({
                status: 201,
                message: "Messages not found",
                data
            })
        }
        return res.status(200).json({
            status: 200,
            message: "Succesfully get message",
            data: lastMessage,
            page,
            totalPage
        })
    } catch (error) {
        console.log("Error Pada GetMessages", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}