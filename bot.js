require('dotenv').config()
const { Telegraf, Markup } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const api = require('covid19-api')
const COUNTRIES_LIST = require('./constants')


bot.start((ctx) => ctx.reply(
    `Hello there ${ctx.message.from.first_name}!
Here you can get out info about COVID-19 in different countries.
You can get list of countries with help command /help.`,
    Markup.keyboard([
        ["US", "Belarus"],
        ["UK", "Russia"],
    ]).resize()

))

bot.help((ctx) => ctx.reply(COUNTRIES_LIST))

bot.on('text', async (ctx) => {
    let data = {}
    try {
        data = await api.getReportsByCountries(ctx.message.text)
        const formatData = ` 
        Country: ${data[0][0].country}
        Cases:  ${data[0][0].cases},
        Deaths: ${data[0][0].deaths},
        Recovered: ${data[0][0].recovered},
        `
        ctx.reply(formatData)
    } catch (error) {
        ctx.reply(`Check /help and try again!`)
    }

})
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))