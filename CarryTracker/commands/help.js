import { registerCommand } from "../commandManager"
import { capitalizeFirst, helpCommand } from "../util/helperFunctions.js"
import helpCommands from "../commandManager"


registerCommand({
    aliases: ["help"],
    description: "This.",
    options: "",
    showInHelp: false,
    execute: (args) => {
        ChatLib.chat(ChatLib.getCenteredText("&7--------------[ &c&lCarryTracker &7]--------------"))
        ChatLib.chat(ChatLib.getCenteredText("&7(Hover over command to see usage.)"))
        Object.keys(helpCommands).forEach(key => {
            ChatLib.chat(ChatLib.getCenteredText("&a&l" + capitalizeFirst(key)))
            helpCommands[key].forEach(command => {
                helpCommand(command.name, command.description, command.options)
            })
        })
        ChatLib.chat(ChatLib.getCenteredText("&7--------------------------------------------"))
    },
})