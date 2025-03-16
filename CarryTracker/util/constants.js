import PogObject from "PogData"

let PogData = new PogObject("CarryTracker", {
    "token": ""
}, "config/data.json")

const PREFIX = "&7[&cCT&7] &b"
export default constants = {
    data: PogData,
    messages: [],
    PREFIX
}