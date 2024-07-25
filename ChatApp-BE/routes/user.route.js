const router = require("express").Router()
require("dotenv")

const userController = require("../controller/user.controller")
const { Authentication } = require("../middleware/middleware")

router.post("/auth/register", userController.Register)
router.post("/auth/login", userController.Login)
router.get("/auth/users", userController.GetAll)
router.get("/auth/users-length", userController.GetAllLength)
router.get("/auth/users/:id", userController.GetUserById)
router.get("/auth/users/conversations/:id", userController.GetUserByConversationsId)
router.get("/users/:username", userController.GetUserByUsername)
router.put("/users/profile", userController.UpdateProfile)

router.get("/authentication", Authentication, (req, res) => {
    return res.status(200).json({
        status: 200,
        message: "Authenticated",
        data: req.decoded.data
    })
})


module.exports = router