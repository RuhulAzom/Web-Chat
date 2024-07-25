const router = require("express").Router()
require("dotenv")

const messagesController = require("../controller/messages.controller")

router.post("/messages", messagesController.SentMessages)
router.get("/messages/:conversationsId", messagesController.GetMessagesByConversationsId)
router.get("/last-messages/:conversationsId", messagesController.GetLastMessagesByConversationsId)


module.exports = router