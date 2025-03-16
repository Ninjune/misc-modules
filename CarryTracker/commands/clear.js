import { registerCommand } from "../commandManager"
import constants from "../util/constants"
let confirm = false

registerCommand({
    aliases: ["clear", "remove"],
    description: "Clears the carry list or a specific user.",
    options: "[ign]",
    category: "carry",
    execute: (args) => {
        if(args[1] == undefined)
        {
            if(confirm)
                ChatLib.chat(`${constants.PREFIX}Cleared list.`)
            else
                ChatLib.chat(`${constants.PREFIX}Run this command again to remove all carriers.`)
            confirm = !confirm
        }
        else
        {
            const found = constants.messages.filter(message => message?.ign != undefined)
            .findIndex(message => message.ign.toLowerCase() == args[1].toLowerCase())
            if(found == -1)
                return ChatLib.chat(`${constants.PREFIX}Unable to find '${args[1]}'`)

            constants.messages.splice(found, 1)
            ChatLib.chat(`${constants.PREFIX}&b${found.ign} now has ${found.kills} / ${found.amount} bosses killed.`)
        }

    }
})