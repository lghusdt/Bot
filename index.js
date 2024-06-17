import { Bot, Context, InlineKeyboard } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const users = {};

const allowedUserIdsString = process.env.ALLOWED_USER_IDS || "";
const allowedUserIds = allowedUserIdsString.split(",").map(Number);

const triggersMap = new Map([
    ["usdt", "usdt_options"],
    ["能量兑换", "🔋\nTFGtWpBJQqnpZsxytyPfQaQ6EpFBCVuN2"],
    ["联系方式", "您可以通过以下方式联系我们：\n- 电话：+15185941168\n- 邮箱：lghusdt@gmail.com"],
]);

bot.on("business_message", async (ctx) => {
    const userId = ctx.from.id;

    // 检查用户是否在白名单中
    if (!allowedUserIds.includes(userId)) {
        await ctx.reply("抱歉，您没有权限使用此机器人。");
        return;
    }

    let user = users[userId];

    if (!user) {
        user = {
            firstName: ctx.from.first_name,
            lastName: ctx.from.last_name,
        };
        users[userId] = user;
    }

    const messageText = ctx.msg.text?.toLowerCase();

    if (messageText === "usdt") {
        const keyboard = new InlineKeyboard()
            .text("TRC20 地址", "usdt_trc20")
            .text("ERC20 地址", "usdt_erc20");
        await ctx.reply("请选择 USDT 网络类型：", { reply_markup: keyboard });
    } else {
        const reply = triggersMap.get(messageText);
        if (reply) {
            if (reply === "usdt_options") {
                // 处理 USDT 选项
                const keyboard = new InlineKeyboard()
                    .text("TRC20 地址", "usdt_trc20")
                    .text("ERC20 地址", "usdt_erc20");
                await ctx.reply("请选择 USDT 网络类型：", { reply_markup: keyboard });
            } else {
                await ctx.reply(reply);
            }
        } else {
            await ctx.reply("您好，请问有什么可以帮您？");
        }
    }
});

bot.callbackQuery("usdt_trc20", async (ctx) => {
    await ctx.reply("TRC20 地址: 💵\nTH8c9nA8wQunRWgQCsyzVHoMKU7oDngQmD\n\n请注意：\n- 仅支持 TRC20 网络\n- 充值前请仔细核对地址");
});

bot.callbackQuery("usdt_erc20", async (ctx) => {
    await ctx.reply("ERC20 地址: 💵\n0x1234567890abcdef..."); // 替换为实际的 ERC20 地址
});

// ... (处理编辑、删除消息和 Business Connection 变更的代码与之前相同)

bot.start();
