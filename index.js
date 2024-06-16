import { Bot, GrammyError } from "grammy";
import dotenv from "dotenv";

dotenv.config(); // 加载环境变量

const bot = new Bot({
    token: process.env.BOT_TOKEN,
});

const allowedChatIds = process.env.ALLOWED_CHAT_IDS?.split(",").map(Number) || [];

// 自动回复和触发规则（可以从配置文件中读取）
const triggers = {
    USDT: "Tether(USD₮)TRC20:\nTH8c9nA8wQunRWgQCsyzVHoMKU7oDngQmD",
    TRX: "(TRX)Tron:\nTFGtWpBJQqnpZsxytyPfQaQ6EpFBCVuN2",
    电话: "+15185941168",
    Email: "lghusdt@gmail.com",
};

// 监听消息事件（假设为 business_message，需要根据实际情况修改）
bot.on("business_message", async (ctx) => {
    try {
        // 白名单检查
        if (!allowedChatIds.includes(ctx.chat.id)) {
            console.log(`Received message from unauthorized chat ID: ${ctx.chat.id}`);
            return;
        }

        // 获取当前用户的信息（这里的实现需要根据你的业务逻辑进行调整）
        const conn = await ctx.getBusinessConnection();
        const employee = conn.user;

        // 仅处理客户消息
        if (ctx.from.id !== employee.id) {
            const messageText = ctx.message.text?.toLowerCase();

            // 触发回复
            for (const trigger in triggers) {
                if (messageText.includes(trigger.toLowerCase())) {
                    await ctx.reply(triggers[trigger]);
                    console.log(`Sent reply to chat ID ${ctx.chat.id}: ${triggers[trigger]}`);
                    return;
                }
            }
        }
    } catch (error) {
        if (error instanceof GrammyError) {
            console.error("Grammy error:", error.description);
        } else {
            console.error("Error handling business message:", error);
        }
    }
});

// 其他处理编辑、删除消息和 Business Connection 变更的代码可以添加在这里

bot.start();
