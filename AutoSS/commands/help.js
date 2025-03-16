import { CommandManager } from "../features/CommandManager"
import { Command } from "../features/Command"
import constants from "../constants"

const helpCommand = new Command(["help"], "Does this menu.", "", true, (args) => {
    ChatLib.chat(ChatLib.getCenteredText(`&b--------------[ &a&l${constants.moduleName} &b]--------------`))
    ChatLib.chat(ChatLib.getCenteredText("&7(Hover over command to see usage.)"))
    CommandManager.getCommands().forEach(command => {
        helpMessage(command.aliases[0], command.description, command.helpHover)
    })
    ChatLib.chat(ChatLib.getCenteredText("&b--------------------------------------------"))
})


/**
Chats a chat message with specified parameters.
@param {string} command - Command
@param {string} desc - Description
@param {string} usage - Usage
*/
export function helpMessage(command, desc, usage)
{
    ChatLib.chat(new TextComponent(`&a◆ ${constants.commandBase} ${command} => &b${desc}`).setHoverValue(`${constants.commandBase} ` + command + " " + usage))
}