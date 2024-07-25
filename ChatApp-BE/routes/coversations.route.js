const router = require("express").Router()
require("dotenv")

const conversationsController = require("../controller/conversations.controller")

router.post("/conversations", conversationsController.AddConversations)
router.get("/conversations/:id", conversationsController.GetConversationsById)
router.get("/conversations/search/:id", conversationsController.GetConversationsByUserIdAndUsername)
// router.get("/conversations/member/:senderId/:receiverId", conversationsController.GetConversationsByMemberId)
router.get("/conversations/member/user", conversationsController.GetConversationsByMemberId)
router.get("/conversations/user/:id", conversationsController.GetConversationsByUserId)
router.get("/conversations-length/user/:id", conversationsController.GetConversationsLengthByUserId)



module.exports = router