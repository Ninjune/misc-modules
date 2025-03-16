import { registerCommand } from "../commandManager"
import constants from "../util/constants"

registerCommand({
    aliases: ["unkill"],
    description: "Removes one kill from the counter for a cariee.",
    options: "(ign)",
    category: "carry",
    execute: (args) => {
        if(args[1] == undefined)
            return ChatLib.chat(`${constants.PREFIX}&bRequires ign.`)
        const found = constants.messages.filter(message => message?.ign != undefined)
        .find(message => message.ign.toLowerCase() == args[1].toLowerCase())
        if(found == undefined)
            return ChatLib.chat(`${constants.PREFIX}Unable to find '${args[1]}'`)
        found.kill(-1)

        ChatLib.chat(`${constants.PREFIX}&b${found.ign} now has ${found.kills} / ${found.amount} bosses killed.`)
    }
})