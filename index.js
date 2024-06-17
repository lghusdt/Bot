import { Bot, Context } from "grammy";

const bot = new Bot("7207248508:AAGmbiVCNnOXaGgXBCY2YKjtQPnmglm7-NI");

// 自动回复和触发规则
const triggers = {
    USDT: "TRC20: 💵\nTH8c9nA8wQunRWgQCsyzVHoMKU7oDngQmD",
    能量兑换: "🔋\nTFGtWpBJQqnpZsxytyPfQaQ6EpFBCVuN2",
    联系方式:
        "您可以通过以下方式联系我们：\n- 电话：\n+15185941168\n- 邮箱：\nlghusdt@gmail.com",
};

// 指定的聊天 ID
const targetChatId = -6700197699; // 替换为实际的聊天 ID

bot.on("business_message", async (ctx) => {
    const conn = await ctx.getBusinessConnection();
    const employee = conn.user;

    if (ctx.from.id !== employee.id) {
        // 仅处理客户消息
        const messageText = ctx.msg.text?.toLowerCase();

        // 触发回复
        for (const trigger in triggers) {
            if (messageText.includes(trigger.toLowerCase())) {
                // 在指定的聊天中回复
                await bot.api.sendMessage(targetChatId, triggers[trigger]); 
                return;
            }
        }
    }
});

// ... (处理编辑、删除消息和 Business Connection 变更的代码与之前相同)

bot.start();
