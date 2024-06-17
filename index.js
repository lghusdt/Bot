import { Bot, Context } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// 自动回复和触发规则
const triggers = {
    USDT: "TetherUSDT注意只支持TRC20网络: 💵\nTH8c9nA8wQunRWgQCsyzVHoMKU7oDngQmD",
    能量兑换: "🔋\nTFGtWpBJQqnpZsxytyPfQaQ6EpFBCVuN2",
    联系方式:
        "您可以通过以下方式联系我们：\n- 电话：\n+15185941168\n- 邮箱：\nlghusdt@gmail.com",
};

// 从环境变量中获取允许的用户ID列表，用逗号分隔
const allowedUserIdsString = process.env.ALLOWED_USER_IDS || "";
const allowedUserIds = allowedUserIdsString.split(",").map(Number);

bot.on("business_message", async (ctx) => {
    const conn = await ctx.getBusinessConnection();
    const employee = conn.user;

    if (ctx.from.id !== employee.id) {
        // 仅处理客户消息
        const messageText = ctx.msg.text?.toLowerCase();

        // 检查用户是否在白名单中
        if (!allowedUserIds.includes(ctx.from.id)) {
            await ctx.reply("抱歉，您没有权限使用此机器人。");
            return;
        }

        // 触发回复
        for (const trigger in triggers) {
            if (messageText.includes(trigger.toLowerCase())) {
                await ctx.reply(triggers[trigger]);
                return;
            }
        }
    }
});

bot.start();
