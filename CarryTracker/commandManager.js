//import settings from "./settings"
import constants from "./util/constants"

let commands = [],
 commandNames = [],
 helpCommands = {carry: [], settings: []}

export function registerCommand(command)
{
    commands.push(command)
    commandNames.push(command.aliases[0])
    if(command.showInHelp ?? true)
        helpCommands[command.category].push({name: command.aliases[0], description: command.description, options: command.options})
}

export default helpCommands

register("command", (...args) => {
    stop = false
    //if (args == undefined || args[0] == undefined) { settings.openGUI(); return }

    commands.forEach(command => {
        if(command.aliases.includes(args[0].toString().toLowerCase()))
        {
            command.execute(args)
            stop = true
        }
    })

    if(!stop) ChatLib.chat(`${constants.PREFIX}&bUnknown command. Type "/carry help" to see all commands.`)
}).setTabCompletions((args) => {
    if(args[0] != undefined && args[0].toLowerCase() == "kill")
    {
        return World.getAllPlayers().map((p) => p.getName())
        .filter((n) =>
            n.toLowerCase().startsWith(args.length > 1 ? args[1].toLowerCase() : "")
        )
        .sort()
    }

    let output = []

    if(args[0].length == 0 || args[0] == undefined)
        return commandNames

    if(args[1] == undefined)
        output = findTabOutput(args[0], commandNames)

    commands.forEach(command => {
        if(command.aliases.includes(args[0].toLowerCase()) && command.subcommands != undefined)
        {
            for(let i = 0; i < command.subcommands.length && i <= args.length-1; i++)
                output = findTabOutput(args[i+1], command.subcommands[i])
        }
    })

    if(output.length == 0)
        output = findTabOutput(args[0], commandNames)

    return output
}).setName("carry")


function findTabOutput(input, options)
{
    let output = []

    if(input == undefined || input == "") return options
    options.forEach(option => {
        for(let char = 0; char < input.length; char++)
        {
            if(option[char] != input[char])
                break
            else if(char == input.length - 1)
                output.push(option)
        }
    })

    return output
}

// command registering (I HATE WRITING THESE)
import "./commands/clear"
import "./commands/help"
import "./commands/kill"
import "./commands/list"
import "./commands/manual"
import "./commands/nitroze"
import "./commands/pay"
import "./commands/sbm"
import "./commands/setmax"
import "./commands/unkill"