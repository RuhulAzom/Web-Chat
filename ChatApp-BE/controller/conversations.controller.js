const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

exports.AddConversations = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        const checkConversations = await prisma.chatApp_Conversations.findFirst({
            where: {
                AND: [
                    { members: { has: senderId } },
                    { members: { has: receiverId } }
                ]
            }
        });

        if (checkConversations) {
            return res.status(201).json({
                status: 201,
                message: "Conversations is already exist",
            })
        }

        const data = await prisma.chatApp_Conversations.create({
            data: {
                members: [senderId, receiverId]
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully add conversations",
            data
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

exports.GetConversationsByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.chatApp_Conversations.findMany({
            where: {
                members: {
                    has: id
                },
            },
            orderBy: {
                updateAt: "desc"
            }
        })
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: "Conversations is not found",
            })
        }
        const userData = await Promise.all(data.map(async (item) => {
            const receiverId = item.members.filter((item) => item !== id)[0];
            const receiver = await prisma.chatApp_Users.findFirst({ where: { id: receiverId } })
            const lastMessage = await prisma.chatApp_Messages.findMany({ where: { conversationsId: item.id }, orderBy: { createAt: "desc" } })
            return {
                ...item,
                lastMessage: lastMessage[0],
                receiver: {
                    id: receiver.id,
                    username: receiver.username,
                    online: receiver.online,
                    email: receiver.email,
                    image: receiver.image
                }
            }
        }))
        return res.status(200).json({
            status: 200,
            message: "Succesfully get conversations",
            data: userData
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

exports.GetConversationsLengthByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.chatApp_Conversations.count({
            where: {
                members: {
                    has: id
                },
            }
        })
        return res.status(200).json({
            status: 200,
            message: "Succesfully get conversations",
            data: data
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

exports.GetConversationsByUserIdAndUsername = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(req.query.username)

        const data = await prisma.chatApp_Conversations.findMany({
            where: {
                members: {
                    has: id
                },
            },
            orderBy: {
                updateAt: "desc"
            }
        })
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: "Conversations is not found",
            })
        }

        const userData = await Promise.all(data.map(async (item) => {
            const receiverId = item.members.filter((item) => item !== id)[0];
            const receiver = await prisma.chatApp_Users.findFirst({ where: { id: receiverId } })
            const lastMessage = await prisma.chatApp_Messages.findMany({ where: { conversationsId: item.id }, orderBy: { createAt: "desc" } })
            return {
                ...item,
                lastMessage: lastMessage[0],
                receiver: {
                    id: receiver.id,
                    username: receiver.username,
                    online: receiver.online,
                    email: receiver.email,
                    image: receiver.image
                }
            }
        }))

        const searchData = userData.filter((item) => item.receiver.username.toLowerCase().includes(req.query.username.toLowerCase()))

        return res.status(200).json({
            status: 200,
            message: "Succesfully get conversations",
            data: searchData
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

exports.GetConversationsById = async (req, res) => {
    try {
        const { id } = req.params;

        const data = await prisma.chatApp_Conversations.findFirst({
            where: {
                id: id
            }
        })

        if (!data) {
            return res.status(404).json({
                status: 404,
                message: "Conversations is not found",
            })
        }

        return res.status(200).json({
            status: 200,
            message: "Succesfully get conversations",
            data
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

exports.GetConversationsByMemberId = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;
        const data = await prisma.chatApp_Conversations.findFirst({
            where: {
                AND: [
                    { members: { has: senderId } },
                    { members: { has: receiverId } }
                ]
            }
        });

        if (!data) {
            return res.status(404).json({
                status: 404,
                message: "Conversations is not found",
            })
        }

        return res.status(200).json({
            status: 200,
            message: "Succesfully get conversations",
            data
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