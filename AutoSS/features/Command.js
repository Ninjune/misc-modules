import { CommandManager } from "./CommandManager"

export class Command
{
    /**
     * A Farm Notif command.
     * @param {Array<string>} aliases Aliases for the command. First one is used in ${constants.commandBase} help.
     * @param {string} description Description for help.
     * @param {string} helpHover Hover message for help. 
     * @param {boolean} fnCommand Whether or not the command is a subset of ${constants.commandBase} [command].
     * @param {CallableFunction} execute Callback to run when command is executed.
     */
    constructor(aliases, description, helpHover, fnCommand, execute)
    {
        this.aliases = aliases
        this.description = description
        this.helpHover = helpHover
        this.fnCommand = fnCommand
        this.execute = execute

        CommandManager.pushCommand(this);
    }
}