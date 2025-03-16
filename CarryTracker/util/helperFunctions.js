export function capitalizeFirst(sentence)
{
    if(sentence == undefined) return sentence
    let words = sentence.split(" "),
     capitalized = words.map(word => {
        return word[0].toUpperCase() + word.slice(1)
    })

    return capitalized.join(" ")
}


/**
Chats a chat message with specified parameters.
@param {string} command - Command
@param {string} desc - Description
@param {string} usage - Usage
*/
export function helpCommand(command, desc, usage)
{
    ChatLib.chat(new TextComponent(`&c◆ /carry ${command} => &b${desc}`).setHoverValue(`${"/carry " + command + " " + usage}`))
}

