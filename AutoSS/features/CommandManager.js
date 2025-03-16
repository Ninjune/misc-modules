import constants from "../constants"
import settings from "../settings";
const commandValues = ["description", "fnCommand", "helpHover", "execute"]
const commands = []; // outside of class to make private
const commandNames = [];

/**
 * A static class that manages commands.
 */
export class CommandManager
{
    static pushCommand(command)
    {
        if(command.aliases == undefined || command.aliases[0] == undefined)
            throw new Error(`Unknown first alias of a command.`);
        for(let i = 0; i < commandValues.length; i++)
        {
            if(command[commandValues[i]] == undefined)
                throw new Error(`Unknown value ${commandValues[i]} for "${command.aliases[0]}" command`);
        }
        commands.push(command);
        commandNames.push(command.aliases[0]);
    }

    static getCommands()
    {
        return commands;
    }
}


register("command", (...args) => {
    let stop = false
    if (args == undefined || args[0] == undefined) { settings.openGUI(); return }

    commands.forEach(command => {
        if((command.fnCommand) && command.aliases.includes(args[0].toString().toLowerCase()))
        {
            command.execute(args)
            stop = true
        }
    })

    if(!stop) ChatLib.chat(`${constants.PREFIX}&bUnknown command. Type "/${constants.commandBase} help" to see all commands.`)
}).setTabCompletions((args) => {
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
}).setName(`${constants.commandBase}`).setAliases([`${constants.moduleName}`]) // add more if want


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


// command registering
import "../commands/help";