import { Bot, GrammyError, Context } from "grammy";
import dotenv from "dotenv";

dotenv.config(); // 加载 .env 文件

const bot = new Bot(process.env.BOT_TOKEN); // 从环境变量中获取 Bot Token

const allowedChatIds = process.env.ALLOWED_CHAT_IDS?.split(",").map(Number) || [];

// 触发词和回复
const triggers = {
    USDT: "Tether(USD₮)TRC20:\nTH8c9nA8wQunRWgQCsyzVHoMKU7oDngQmD",
    TRX: "(TRX)Tron:\nTFGtWpBJQqnpZsxytyPfQaQ6EpFBCVuN2",
    电话: "+15185941168",
    Email: "lghusdt@gmail.com",
};

// 在 bot.start() 之前设置 Webhook
bot.api.setWebhook(process.env.WEBHOOK_URL).then(() => {
    console.log(`Webhook set to ${process.env.WEBHOOK_URL}`);
}).catch((error) => {
    console.error("Error setting webhook:", error);
});

// 监听消息事件
bot.on("message", async (ctx: Context) => {
    try {
        // 白名单检查
        if (!allowedChatIds.includes(ctx.chat.id)) {
            console.log(`Received message from unauthorized chat ID: ${ctx.chat.id}`);
            return;
        }

        const messageText = ctx.message.text?.toLowerCase();

        // 触发回复
        for (const trigger in triggers) {
            if (messageText.includes(trigger.toLowerCase())) {
                await ctx.reply(triggers[trigger]);
                console.log(`Sent reply to chat ID ${ctx.chat.id}: ${triggers[trigger]}`);
                return; // 避免多次回复
            }
        }
    } catch (error) {
        if (error instanceof GrammyError) {
            console.error("Grammy error:", error.description);
        } else {
            console.error("Error handling message:", error);
        }
    }
});

bot.start(); // 启动机器人
