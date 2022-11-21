"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Chat = require("../models/chats");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get("/", auth_1.default, async (req, res) => {
    try {
        const user = req.user;
        const chats = await Chat.find({ users: user._id });
        res.send(chats);
    }
    catch (e) {
        res.status(500).send();
    }
});
exports.default = router;
//# sourceMappingURL=chats.js.map