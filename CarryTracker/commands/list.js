import { registerCommand } from "../commandManager"
import constants from "../util/constants"

registerCommand({
    aliases: ["list"],
    description: "List trackers and their current kill count.",
    options: "",
    category: "carry",
    execute: (args) => {
        ChatLib.chat("")
        constants.messages.forEach(message => {
            ChatLib.chat(`${constants.PREFIX}&b${message.ign} ${message.kills} / ${message.amount}`)
        })
        ChatLib.chat("")
    }
})