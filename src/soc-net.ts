import VkBot from 'node-vk-bot-api'
const bot = new VkBot(process.env.VK_COMM_TOKEN)

bot.command('/start', (ctx) => {
    ctx.reply('Hello!')
})
