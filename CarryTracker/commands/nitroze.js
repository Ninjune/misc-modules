import { registerCommand } from "../commandManager"
import constants from "../util/constants"
import { createBossMessage } from "../BossMessage"

registerCommand({
    aliases: ["nitroze"],
    description: "Starts a nitroze carry.",
    options: "(channel id)",
    category: "carry",
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&bRequires channel id.`)
        createBossMessage(args[1], "nitroze")
        .then(res => {
            constants.messages.push(res)
        })
    }
})