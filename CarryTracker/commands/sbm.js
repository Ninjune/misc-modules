import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { createBossMessage } from "../BossMessage"

registerCommand({
    aliases: ["sbm"],
    description: "Starts an sbm carry. They don't provide ign or amount so you must add them manually.",
    options: "(channel id) (ign) (amount)",
    category: "carry",
    execute: (args) => {
        if(args[1] == undefined || args[2] == undefined || args[3] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&bRequires channel id, ign, amount.`)
        createBossMessage(args[1], "sbm", args[2], args[3])
        .then(res => {
            constants.messages.push(res)
        })
    }
})