import axios from "../axios"
import constants from "./util/constants"
import { Promise } from "../PromiseV2"
// dont u dare distribute this with this hard coded
const discordToken = "thanks me from a year ago"


export function createBossMessage(channelID, mode, ign = undefined, amount = undefined, price = undefined)
{
    return new Promise((resolve, reject) => {
        const B = new BossMessage(channelID, mode, ign, amount, price)
        B.init()
        .then(res => {
            resolve(B)
        })
    })
}


class BossMessage
{
    /**
     *
     * @param {string} channelID - id of channel to check & post message
     * @param {string} mode - sbm or nitroze
     * @param {string} ign - ign (not required for nitroze)
     * @param {int} amount - amount (not required for nitroze)
     */
    constructor(channelID, mode, ign = undefined, amount = undefined, price = undefined)
    {
        // mode = nitroze, sbm, manual
        this.mode = mode?.toLowerCase()
        this.channelID = channelID
        this.sentMessage = false
        this.kills = 0
        this.paid = 0
        this.debug = false
        this.isCarry = false
        this.ign = ign
        this.amount = !isNaN(parseInt(amount)) ? parseInt(amount) : undefined
        this.singlePrice = untrunc(price)
        this.bulkPrice = untrunc(price)
        this.slayerAlive = false
        this.died = false
        this.slayerAliveCheck = 0

        register("chat", (name) => {
            if(name.toLowerCase() != this.ign.toLowerCase())
                return
            this.isCarry = true
        })
        .setChatCriteria(/&.&.Trade completed with &.&.(?:\[.+\] )?(.+)&.&.&.&.!&./g)


        register("chat", (coins) => {
            if(!this.isCarry) return
            this.paid = parseFloat(this.paid) + untrunc(coins)
            this.update()
            setTimeout(() => {
                this.isCarry = false
            }, 500) // set timeout for if they send multiple + (coin) messages (dogshit solution come back to this)
        }).setChatCriteria(/&. &.&.&.\+ &.&.(.+).? coins&./g)


        register("step", () => {
            if(this.ign == undefined)
                return

            if(this.died && this.slayerAlive) // player died
            {
                this.died = false
                this.slayerAlive = false
                return
            }

            let found = false
            World.getAllEntitiesOfType(Java.type("net.minecraft.entity.item.EntityArmorStand").class)
            .filter(entity => entity.getName().removeFormatting().toLowerCase() == `spawned by: ${this.ign.toLowerCase()}`)
            .forEach(named => {
                this.slayerAlive = true // check for time out too maybe?
                found = true
                this.slayerAliveCheck = 15
            })

            if(!found && this.slayerAlive) // boss died
            {
                this.slayerAliveCheck -= 1
                if(this.slayerAliveCheck <= 0)
                {
                    this.slayerAlive = false
                    this.kill(1)
                    new TextComponent(`${constants.PREFIX}${this.ign} boss has died. They now have ${this.kills} / ${this.amount} bosses killed. Click this message to undo.`)
                    .setClickAction("run_command")
                    .setClickValue(`/carry unkill ${this.ign}`)
                    .chat()
                }
            }
        }).setFps(1)


        register("chat", (message) => {
            if(!this.slayerAlive)
                return
            const regex = / ☠ (\w+) (?:was|were) killed by (?:.+)./g
            matches = regex.exec(message.removeFormatting())
            if(matches == undefined || !(matches[1].toLowerCase() == this.ign.toLowerCase()))
                return
            this.died = true
        }).setChatCriteria(/(.+)/g) // set criteria cause otherwise message is sometimes event
    }


    init()
    {
        return new Promise((resolve, reject) => {
            if(this.mode == "nitroze")
            {
                this.nitrozeConstruct()
                .then(res => {
                    clearOldIGN(this.ign)
                    this.sendMessage()
                    .then(res => {
                        resolve(0)
                    })
                })
            }
            else if (this.mode == "sbm")
            {
                this.sbmConstruct()
                .then(res => {
                    clearOldIGN(this.ign)
                    this.sendMessage()
                    .then(res => {
                        resolve(0)
                    })
                })
            }
            else if (this.mode == "manual")
            {
                clearOldIGN(this.ign)
                this.sendMessage()
                .then(res => {
                    resolve(0)
                })
                resolve(0)
            }
        })
    }


    kill(amount)
    {
        if(!this.sentMessage)
            return ChatLib.chat(`${constants.PREFIX}Carry message not sent yet.`)
        this.kills = parseInt(this.kills) + amount
        this.update()
    }


    update()
    {
        return new Promise((resolve, reject) => {
            this.priceTotal = this.amount >= 10 ? this.amount*untrunc(this.bulkPrice)
                : this.amount*untrunc(this.singlePrice)
            const message = `Hello **${this.ign ?? "???"}**! Please read <https://pastebin.com/LpK7JRah> so you know what to do. ` +
            "Ask me if you need help finding the void sepulture spot.\n\n" +
            `**${this.ign ?? "???"}'s Carries:**\n\n**Bosses Killed**: ${this.kills ?? "???"} / ${this.amount ?? "???"}` +
            `\n**Money paid**: ${trunc(Math.round(this.paid*100)/100) ?? "???"} / ${trunc(this.priceTotal) ?? "???"}` +
            `\n**Bosses paid for**: ${Math.round(this.paid/this.priceTotal*this.amount*100)/100 ?? "???"} / ${this.amount ?? "???"}`

            axios.patch(`https://discord.com/api/v9/channels/${this.channelID}/messages/${this.carryMessage.id}`, {
                body: { content: message },
                headers: {
                    "authorization": discordToken,
                    "content-type": "application/json",
                },
            })
            .then(res => {
                resolve(0)
            })
            .catch(err => {
                console.log(`CarryTracker edit fail (channel id: ${channelID}): ${err}`)
            })
        })
    }


    pay(amount)
    {
        this.paid = parseFloat(this.paid) + untrunc(amount)
        this.update()
    }


    nitrozeConstruct()
    {
        return new Promise((resolve, reject) => {
            axios.get(`https://discord.com/api/v9/channels/${this.channelID}/messages`, {
                headers: {
                    "authorization": discordToken,
                    "content-type": "application/json"
                }
            })
            .then(res => {
                let botMessage
                if(this.debug)
                    botMessage = res.data[0/*res.data.length-1*/].content/*?.embeds[0]?.fields[0]?.value*/
                else
                    botMessage = res.data[res.data.length-1]?.embeds[0]?.fields[0]?.value

                if(botMessage == undefined)
                    return console.log("Bot message not found.")
                const regex = /COMPLETION\s*([\w.]+)\s*Bulk order \(\w+\+\) ([\w.]+)\s*IGN: (\w+)\s*Amount: (\d+)/g
                const matches = regex.exec(botMessage)

                if(matches == undefined)
                    return ChatLib.chat(`${constants.PREFIX}Not nitroze carry.`)

                this.singlePrice = matches[1]
                this.bulkPrice = matches[2]
                if(this.ign == undefined)
                    this.ign = matches[3]
                if(this.amount == undefined)
                    this.amount = matches[4]

                resolve(0)
            })
            .catch(err => {
                console.log(`CarryTracker nitroze get constructor req ${this.channelID}:\n`)
                console.dir(err)
                reject(err)
            })
        })
    }

    sbmConstruct()
    {
        return new Promise((resolve, reject) => {
            axios.get(`https://discord.com/api/v9/channels/${this.channelID}/messages`, {
                headers: {
                    "authorization": discordToken,
                    "content-type": "applications/json"
                }
            })
            .then(res => {
                let botMessage
                if(this.debug)
                    botMessage = res.data[0]?.content
                else
                    botMessage = res.data[res.data.length-1]?.embeds[0]?.description

                if(botMessage == undefined)
                    return ChatLib.chat(`${constants.PREFIX}Bot message not found.`)

                const regex = /The prices are as follows:\s*- Voidgloom Seraph 4: ([\d.]+.?)\s*Bulk price \(10 or more\): ([\d.]+.?)/g
                const matches = regex.exec(botMessage)

                if(matches == undefined)
                    return ChatLib.chat(`${constants.PREFIX}Not sbm carry.`)

                this.singlePrice = matches[1]
                this.bulkPrice = matches[2]

                resolve(0)
            })
            .catch(err => {
                console.log(`CarryTracker sbm get constructor req ${this.channelID}:\n`)
                console.dir(err)
                reject(err)
            })
        })
    }


    sendMessage()
    {
        return new Promise((resolve, reject) => {
            axios.post(`https://discord.com/api/v9/channels/${this.channelID}/messages`, {
                    body: { content: "."},
                    headers: {
                        "authorization": discordToken,
                        "content-type": "application/json"
                    }
                }
            )
            .then(res2 => {
                this.sentMessage = true
                this.carryMessage = res2.data
                ChatLib.chat(`${constants.PREFIX}&bAdded new carrier ${this.ign}. ` +
                `They need ${this.amount} carries.`)
                this.update()
                .then(res => {
                    resolve(0)
                })
            })
            .catch(err => {
                console.log(`CarryTracker send fail (channel id: ${this.channelID}): ${err}`)
                console.dir(err)
                console.dir(err.response)
                console.dir(err.response.headers)
                console.dir(err.response.data)
                reject(1)
            })
        })
    }


    setMax(amount)
    {
        this.amount = !isNaN(parseInt(amount)) ? parseInt(amount) : 0
        this.update()
    }
}


function untrunc(value) {
    const number = parseFloat(value)
    if(isNaN(number))
        return undefined
    const suffix = value[value.length - 1]?.toLowerCase()
    if(suffix == undefined)
        return value

    switch (suffix) {
        case "K":
        case "k":
            return number * 1000
        case "M":
        case "m":
            return number * 1000000
        case "B":
        case "b":
            return number * 1000000000
        default:
            return number
    }
}


function trunc(value) {
    if (value >= 1000000000) {
        return (value / 1000000000).toFixed(1) + "b"
    } else if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + "m"
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + "k"
    }
    return value.toString()
}


export function clearOldIGN(ign)
{
    for(let i = 0; i < constants.messages.length; i++)
    {
        if(constants.messages[i].ign == undefined ||
            constants.messages[i].ign.toLowerCase() == ign.toLowerCase()
        )
            constants.messages.splice(i, 1)
    }
}