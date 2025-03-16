import Async from "../Async"
import RenderLib from "../RenderLib/index"
import PogData from "../PogData/index"
import PogObject from "../PogData/index"
import { trace } from "../Coleweight/util/renderUtil"
const Minecraft = Java.type("net.minecraft.client.Minecraft")
let renderBlocks = [],
 promise,
 time
let data = new PogObject("StructureFinder", {
    "searching": false
}, "config.json")

const PREFIX = "&7[&aSF&7] ",
 renderDistance = Minecraft.func_71410_x().field_71474_y.field_151451_c * 16

register("command", (...args) => {
    switch(args[0])
    {
        case "help":
            ChatLib.chat(`/sf find - Finds structure.\n/sf toggle - Toggles structure visibility and finding automatically of structures.\n`)
            break
        case "find":
            if(!check()) return ChatLib.chat(`${PREFIX}&cNot in the Crystal Hollows.`)
            if(!data.searching) {data.searching = true; data.save(); ChatLib.chat(`${PREFIX}&aStructures set to being shown. /sf toggle to hide.`)}
            findStructures()
            break
        case "toggle":
            if(!data.searching) {data.searching = true; ChatLib.chat(`${PREFIX}&aStructures set to being shown.`)}
            else {data.searching = false; ChatLib.chat(`${PREFIX}&aStructures set to being hidden.`)}
            data.save()
            break
        case "showing":
            ChatLib.chat(data.searching)
            break
        default:
            ChatLib.chat(`${PREFIX}&cUnkown command. /sf help for help.`)
    }
}).setTabCompletions((args) => {
    let output = [],
     commands = ["help", "find", "toggle"]

    if(args[0] == undefined) output = commands
    else
    {
        commands.forEach(command => {
            for(let char = 0; char < args[0].length; char++)
            {
                if(command[char] != args[0][char])
                    break
                else if(char == args[0].length - 1)
                    output.push(command)
            }
        })
    }
    return output
}).setCommandName("sf").setAliases(["structurefinder", "sfinder"])


/*register("command", () => {
    ChatLib.chat(Player.lookingAt().type.getRegistryName())
}).setCommandName("blockfind")*/


register("tick", () => {
    if (promise != null) 
    {
        if(promise.isFinished())
        {
            ChatLib.chat(`${PREFIX}&bFinished searching. Took ${(Date.now() - time)/1000}s`)
            promise = null
        }
    }
})

register("worldLoad", () => {
    renderBlocks = []
    if(data.searching)
    {
        setTimeout(() => {
            findStructures()
        }, 3000)
    }
})


register("renderWorld", () => {
    if(renderBlocks.length < 1 || !data.searching) return
    for(let i = 0; i < renderBlocks.length; i++)
    {
        RenderLib.drawEspBox(renderBlocks[i][0], renderBlocks[i][1], renderBlocks[i][2], 1, 1, 0, 1, 1, 1, true)
        trace(renderBlocks[i][0], renderBlocks[i][1], renderBlocks[i][2], 1, 0, 0, 1)
    }
        
})


function findStructures()
{
    if(check() == false) return
    ChatLib.chat(`${PREFIX}&bStarting search...`)
    time = Date.now()
    let x = xCalc(),
     y = yCalc(),
     z = zCalc()

    promise = Async.run(() => {
        while(true)
        {
            if(x <= Math.round(Player.getX()) + 0.5 + renderDistance && x < 824)
            {
                x++
            }
            else if(z <= Math.round(Player.getZ()) + 0.5 + renderDistance && z < 824)
            {
                x = xCalc()
                z++
            }
            else if(y < 190)
            {
                x = xCalc()
                z = zCalc()
                y++
            }
            else break

            if(renderBlocks.includes([x, y, z])) continue
            if(World.getBlockAt(x, y, z).type.getRegistryName() !== "minecraft:stained_glass") continue
            if(World.getBlockAt(x, y, z).getMetadata() !== 2) continue
            ChatLib.chat(`${PREFIX}&bFound structure at &a${Math.round(x)} ${Math.round(y)} ${Math.round(z)}`)
            renderBlocks.push([x, y, z])
            break
        }
    })
}


const locations = ["Goblin", "Jungle", "Mithril", "Precursor", "Magma", "Crystal", "Khazad", "Divan"]
function check() 
{
    const scoreboard = Scoreboard.getLines()
    for(let lineIndex = 0; lineIndex < scoreboard.length; lineIndex++) 
    {
        for(let locationsIndex = 0; locationsIndex < locations.length; locationsIndex++) 
        {
            if(scoreboard[lineIndex].toString().includes(locations[locationsIndex])) 
                return true
        }
    }
    return false
}

function xCalc()
{
    if(Math.round(Player.getX()) + 0.5 - renderDistance >= 512)
        return Math.round(Player.getX()) + 0.5 - renderDistance
    else
        return 512.5
}

function yCalc()
{
    return 32.5
}

function zCalc()
{
    if(Math.round(Player.getY()) + 0.5 - renderDistance >= 512)
        return Math.round(Player.getY()) + 0.5 - renderDistance
    else
        return 512.5
}