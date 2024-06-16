import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config(); // 加载环境变量

const bot = new Bot(process.env.BOT_TOKEN); // 从环境变量中获取机器人令牌
const allowedChatIds = process.env.ALLOWED_CHAT_IDS?.split(",").map(Number) || []; // 从环境变量中获取白名单，并转换为数字数组

// 自动回复和触发规则（可以从配置文件中读取）
const triggers = {
    USDT: "Tether(USD₮)TRC20:\nTH8c9nA8wQunRWgQCsyzVHoMKU7oDngQmD",
    TRX: "(TRX)Tron:\nTFGtWpBJQqnpZsxytyPfQaQ6EpFBCVuN2",
    电话: "+15185941168",
    Email: "lghusdt@gmail.com",
};

bot.on("business_message", async (ctx) => {
    try {
        // 白名单检查
        if (!allowedChatIds.includes(ctx.chat.id)) {
            console.log(`Received message from unauthorized chat ID: ${ctx.chat.id}`);
            return;
        }

        // 获取当前用户的信息
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
        console.error("Error handling business message:", error);
    }
});

// 处理编辑、删除消息和 Business Connection 变更的代码可以添加在这里

bot.start();
