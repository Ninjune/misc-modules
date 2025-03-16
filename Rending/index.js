import RenderLib from "../RenderLib"
const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
let bone, damage, returning = false, lastPos, releaseTime

register("renderWorld", () => {
    if(bone == undefined)
        return
    const pos = bone.getPos()
    let r=0,g=0.7,b=0.7
    if(returning)
    {
        b=0.2
        g=1
    }
    RenderLib.drawEspBox(pos.x, pos.y+1.5, pos.z, 1, 1, r, g, b, 0.7, true)
})


register("step", () => {
    let found = false

    World.getAllEntitiesOfType(EntityArmorStand.class)
    .forEach(entity => {
        const head = entity.getEntity().func_71124_b(0) // getEquipmentInSlot
        const name = entity.getName().removeFormatting().toLowerCase()
        const playerPos = new Vec3i(Player.getX(), Player.getY(), Player.getZ())

        if(head != null && head.func_77977_a() == "item.bone") // getUnlocalizedName
        {
            if(bone == undefined && entity.getPos().distance(playerPos) < 4)
            {
                bone = entity
                releaseTime = Date.now()
            }
            else if (entity.getPos().distance(lastPos) > 4)
                return
            bone = entity

            if(Date.now()-releaseTime > 1000 && !returning)
            {
                //Client.showTitle("&aMACE", "", 2, 5, 2)
                returning = true
            }

            found = true
            lastPos = entity.getPos()
        }
        else if (bone != undefined &&
            entity.getPos().distance(bone.getPos()) < 3 &&
            name != undefined &&
            name.startsWith("✯") &&
            damage != parseDamage(name)
        )
        {
            if (damage != undefined &&
                returning &&
                parseDamage(name) > damage*2-250000
            ) // - 250k just in case hypixel mess up
            {
                ChatLib.chat(`${damage} ${parseDamage(name)}`)
                Client.showTitle("", name, 4, 10, 4)
                damage = parseDamage(name)
            }
            else if (!returning)
                damage = parseDamage(name)
        }
    })

    if(!found)
    {
        bone = undefined
        returning = false
    }
}).setFps(20)


function parseDamage(damage)
{
    damage = String(damage).replaceAll(",", "")
    damage = damage.replaceAll("✯", "")
    return parseInt(damage)
}


function dotProduct(travellingPrev, travellingCurrent, constant)
{
    // Calculate displacement vectors
    const displacementVector1 = [
        travellingCurrent.x - travellingPrev.x,
        travellingCurrent.y - travellingPrev.y,
        travellingCurrent.z - travellingPrev.z
    ]

    const displacementVector2 = [
        constant.x - travellingPrev.x,
        constant.y - travellingPrev.y,
        constant.z - travellingPrev.z
    ]

    // Calculate the dot product
    const dotProduct = displacementVector1[0] * displacementVector2[0] +
                       displacementVector1[1] * displacementVector2[1] +
                       displacementVector1[2] * displacementVector2[2]

    return dotProduct
}


// head 4
// chest 3
// leg 2
// boots 1
// hand 0