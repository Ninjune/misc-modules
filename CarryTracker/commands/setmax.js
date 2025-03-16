import { registerCommand } from "../commandManager"
import constants from "../util/constants"

registerCommand({
    aliases: ["setmax", "setamount", "max", "amount"],
    description: "Sets kill amount for an ign.",
    options: "(ign) (amount)",
    category: "carry",
    execute: (args) => {
        if(args[1] == undefined ||
            args[2] == undefined
        )
            return ChatLib.chat(`${constants.PREFIX}&bNeeds name that's already being carried & amount (can be trunced)`)
        const found = constants.messages.filter(message => message?.ign != undefined)
        .find(message => message.ign.toLowerCase() == args[1].toLowerCase())
        if(found == undefined)
            return ChatLib.chat(`${constants.PREFIX}Unable to find '${args[1]}'`)
        found.setMax(args[2])

        ChatLib.chat(`${constants.PREFIX}&bSet kill amount to ${found.amount}.`)
    }
})