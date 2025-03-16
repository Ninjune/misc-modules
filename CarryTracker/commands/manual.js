import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { createBossMessage } from "../BossMessage"

registerCommand({
    aliases: ["manual", "start"],
    description: "Starts a manual carry. Price can be trunced.",
    options: "(channel id) (ign) (amount) (price)",
    category: "carry",
    execute: (args) => {
        if(args[1] == undefined || args[2] == undefined || args[3] == undefined || args[4] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&bUsage: /carry manual (channel id) (ign) (amount) (price)`)
        createBossMessage(args[1], "manual", args[2], args[3], args[4])
        .then(res => {
            constants.messages.push(res)
        })
    }
})