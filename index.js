import { Bot, Context } from "grammy";

const bot = new Bot("7207248508:AAGmbiVCNnOXaGgXBCY2YKjtQPnmglm7-NI"); 

// 自动回复和触发规则
const triggers = {
    USDT: "Tether(USD₮)TRC20:\nTH8c9nA8wQunRWgQCsyzVHoMKU7oDngQmD",
    "TRX": "(TRX)Tron:\nTFGtWpBJQqnpZsxytyPfQaQ6EpFBCVuN2",
    "电话": "+15185941168",
    "Email": "lghusdt@gmail.com",
};

bot.on("business_message", async (ctx) => {
    const conn = await ctx.getBusinessConnection();
    const employee = conn.user;

    if (ctx.from.id !== employee.id) { // 仅处理客户消息
        const messageText = ctx.msg.text?.toLowerCase(); 

        // 触发回复
        for (const trigger in triggers) {
            if (messageText.includes(trigger.toLowerCase())) {
                await ctx.reply(triggers[trigger]);
                return; // 匹配到触发词后立即返回，不再执行后续代码
            }
        }

        // 不再发送默认回复
    }
});

// ... (处理编辑、删除消息和 Business Connection 变更的代码与之前相同)

bot.start();
