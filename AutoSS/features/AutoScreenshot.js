const mc = Client.getMinecraft();
const ScreenShotHelper = Java.type("net.minecraft.util.ScreenShotHelper");
const ScreenshotKey = new KeyBind(mc.field_71474_y.field_151447_Z);
let takeSS = false;

register("command", () => {
    setTimeout(() => {
        takeSS = true;
    }, 1000);
}).setCommandName("testss")


register("tick", () => {
    if(takeSS)
    {
        ScreenShotHelper.func_148260_a(mc.field_71412_D, mc.field_71443_c, mc.field_71440_d, mc.func_147110_a());
        takeSS = false;
    }
})


register("chat", () => {
    setTimeout(() => {
        takeSS = true;
    }, 1000);
}).setChatCriteria(/Your Golden Dragon leveled up to level \d*!/g)