const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { hashPassword, generateToken, comparePassword } = require("../utils/function")
require("dotenv").config()

// Supabase

const { createClient } = require("@supabase/supabase-js")

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.SUPABASE_API_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)


exports.Register = async (req, res) => {
    try {
        const { username, email, image, password } = req.body;
        const checkUser = await prisma.chatApp_Users.findFirst({ where: { email } })
        if (checkUser) {
            return res.status(301).json({
                status: 301,
                message: "Email is already used"
            })
        }

        await prisma.chatApp_Users.create({
            data: {
                username,
                email,
                image,
                password: hashPassword(password)
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully"
        })
    } catch (error) {
        console.log("Error Pada Register", error)
        // if (error?.meta.target[0] === "email" && error?.code === "P2002") {
        //     return res.status(400).json({
        //         status: 400,
        //         message: "Email is already used",
        //     })
        // }
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await prisma.chatApp_Users.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Email not found"
            })
        }
        const login = comparePassword(password, user.password)
        if (!login) {
            return res.status(400).json({
                status: 400,
                message: "Email or Password is wrong!"
            })
        }
        const data = {
            id: user.id,
            username: user.username,
            email: user.email,
            image: user.image,
            createAt: user.createAt
        }
        const token = generateToken(data);

        // res.cookie("user_data", { ...data, token }, {
        //     httpOnly: true,
        //     // maxAge: 2 * 60 * 60 * 1000
        //     maxAge: 1 * 60 * 1000
        // });

        return res.status(200).json({
            status: 200,
            message: "Succesfully",
            userData: data,
            token
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.UpdateProfile = async (req, res) => {
    try {
        const { email, username } = req.body;

        const data = await prisma.chatApp_Users.update({
            where: {
                email: email
            },
            data: {
                email: email,
                username: username
            }
        })

        return res.status(200).json({
            status: 200,
            message: "Succesfully Update Your Profile",
            userData: data,
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.GetAll = async (req, res) => {
    try {
        const users = await prisma.chatApp_Users.findMany({
            orderBy: [
                { online: "desc" },
                { username: "asc" }
            ]
        });
        const Users = users.map((item) => {
            return {
                id: item.id,
                username: item.username,
                email: item.email,
                image: item.image,
                online: item.online,
                createAt: item.createAt
            }
        })
        return res.status(200).json({
            status: 200,
            message: "Succesfully",
            data: Users,
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetAllLength = async (req, res) => {
    try {
        const users = await prisma.chatApp_Users.count();
        return res.status(200).json({
            status: 200,
            message: "Succesfully",
            data: users,
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetUserById = async (req, res) => {
    try {
        const users = await prisma.chatApp_Users.findFirst({ where: { id: req.params.id } });
        const Users = {
            id: users.id,
            username: users.username,
            email: users.email,
            image: users.image,
            online: users.online,
            createAt: users.createAt
        }
        return res.status(200).json({
            status: 200,
            message: "Succesfully",
            data: Users,
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetUserByUsername = async (req, res) => {
    try {
        const users = await prisma.chatApp_Users.findMany({
            where: {
                username: {
                    contains: req.params.username,
                    mode: "insensitive"
                }
            }
        });
        const Users = users.map((item) => {
            return {
                id: item.id,
                username: item.username,
                email: item.email,
                image: item.image,
                online: item.online,
                createAt: item.createAt
            }
        })
        return res.status(200).json({
            status: 200,
            message: "Succesfully",
            data: Users,
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.GetUserByConversationsId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await prisma.chatApp_Conversations.findFirst({ where: { id } })
        const user1 = await prisma.chatApp_Users.findFirst({ where: { id: data.members[0] } })
        const user2 = await prisma.chatApp_Users.findFirst({ where: { id: data.members[1] } })
        // console.log(data, user1, user2)
        const Users1 = {
            id: user1.id,
            username: user1.username,
            email: user1.email,
            online: user1.online,
            image: user1.image,
            createAt: user1.createAt
        }
        const Users2 = {
            id: user2.id,
            username: user2.username,
            email: user2.email,
            online: user2.online,
            image: user2.image,
            createAt: user2.createAt
        }
        return res.status(200).json({
            status: 200,
            message: "Succesfully",
            data: [
                Users1,
                Users2
            ],
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
