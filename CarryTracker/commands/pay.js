import { registerCommand } from "../commandManager"
import constants from "../util/constants"

registerCommand({
    aliases: ["pay"],
    description: "Adds whatever value to the selected cariee's amount (for if a payment is not detected automatically). The amount can be truncated (1.2m, 3.4k, etc.)",
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
        found.pay(args[2])

        ChatLib.chat(`${constants.PREFIX}&bPaid.`)
    }
})