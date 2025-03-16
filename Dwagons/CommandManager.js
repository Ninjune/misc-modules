export class CommandManager
{
    /**
     * 
     * @param {boolean} makeCommand if should register new command default false
     * @param {string} commandName command name
     * @param {string} prefix prefix to messages
     */
    constructor(makeCommand = false, commandName, prefix)
    {
        this.commands = [];
        this.prefix = prefix;
        if(makeCommand)
        {
            register("command", (...args) => {
                this.execute(0, args);
            }).setCommandName(commandName);
        }
    }


    /**
     * Searchs the commands for an argument to run.
     * @param {number} currentArg the index of the argument to search commands for
     * @param {string[]} args remaining args
     */
    execute(currentArg, args)
    {
        let found = false;
        for(let command in commands)
        {
            if(command.aliases.includes(args[currentArg]))
            {
                found = true;
                if(!command.execute(currentArg+1, args))
                    ChatLib.chat(prefix + "&aUnable to run command.");
            }
        }

        if(!found)
            ChatLib.prefix(prefix + "&aUnable to find command.");
    }

    /**
     * Registers a command.
     * @param {string[]} aliases first alias is used as the base
     * @param {CallableFunction} execute callback to what you want to run when the command is ran. return whether the command ran successfully (default true)
     */
    register(aliases, execute = () => {return false;})
    {
        this.commands.push({aliases, execute});
    }
}

