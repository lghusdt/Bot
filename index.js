import { Bot, Context, Markup } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// 自动回复和触发规则（使用 Markdown 和表情符号）
const triggers = {
    USDT: `**Tether (USDT) 充值地址（仅支持 TRC20 网络）**

₮ **TRC20 (Tron):**
\`TH8c9nA8wQunRWgQCsyzVHoMKU7oDngQmD\`

⚠️ **注意：**
* 请确保您的钱包支持 TRC20 网络。
* 充值前请仔细核对地址，以免造成资产损失。`,

    能量兑换: `🔋 **能量 (Energy) 租赁地址**

\`TFGtWpBJQqnpZsxytyPfQaQ6EpFBCVuN2\`

您可以通过向此地址转账 TRX 来租赁能量，以便进行 USDT 转账。
* **租赁比例：** 请以实际转账时为准，具体比例可能会有所波动。
* **最低租赁量：** 1.1 TRX`, 

    联系方式: `📞 **联系我们**

电话：+15185941168
邮箱：lghusdt@gmail.com`
};

// 从环境变量中获取允许的用户ID列表，用逗号分隔
const allowedUserIdsString = process.env.ALLOWED_USER_IDS || "";
const allowedUserIds = allowedUserIdsString.split(",").map(Number);

bot.on("business_message", async (ctx) => {
    const conn = await ctx.getBusinessConnection();
    const employee = conn.user;
    console.log("Received business message:", ctx.msg);

    if (ctx.from.id !== employee.id) { // 仅处理客户消息
        const messageText = ctx.msg.text?.toLowerCase();

        // 检查用户是否在白名单中
        if (!allowedUserIds.includes(ctx.from.id)) {
            try {
                await ctx.reply("抱歉，您没有权限使用此机器人。");
            } catch (error) {
                console.error("Error sending message:", error.message);
            }
            return;
        }

        // 触发回复
        for (const trigger in triggers) {
            if (messageText.includes(trigger.toLowerCase())) {
                try {
                    const reply = triggers[trigger];
                    const keyboard = Markup.keyboard([
                        Markup.button.text("USDT"),
                        Markup.button.text("能量兑换"),
                        Markup.button.text("联系方式")
                    ]).resize();

                    await ctx.reply(reply, { parse_mode: "Markdown", reply_markup: keyboard });
                } catch (error) {
                    console.error("Error sending message:", error.message);
                }
                return;
            }
        }

        // 默认回复（如果没有匹配到触发词）
        await ctx.reply("您好，请问有什么可以帮您？", { reply_markup: keyboard });
    }
});

// 错误处理
bot.catch((err) => {
    console.error("Bot error:", err);
});

bot.start();
