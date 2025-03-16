import { CommandManager } from "./CommandManager";

const commandManager = new CommandManager(true, "dwagons", "&7[&6dwagons&7]&f ");
const whitelistCommandManager = new CommandManager(false);
const whitelist = new Set();


whitelistCommandManager.register("add", (currentArg, args) => {
    whitelist.add(args[currentArg]);
});


whitelistCommandManager.register("list", (currentArg, args) => {
    whitelist.forEach(player => {
        ChatLib.chat(commandManager.prefix + player);
    });
});


whitelistCommandManager.register("remove", (currentArg, args) => {
    whitelist.delete(args[currentArg]);
});


commandManager.register("whitelist", (currentArg, args) => {
    whitelistCommandManager.execute(currentArg, args);
});


register("chat", (rank, player) => {
    if(!whitelist.has(player)) return;
    
}).setChatCriteria(/\[\d+\] . (\[\w+\+{0,2}\] )?(\w{1,16}) is holding \[\[Lvl 1\] Ender Dragon\]/g);