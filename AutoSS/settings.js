import { @Vigilant, @ButtonProperty, @SwitchProperty, @SelectorProperty, @SliderProperty, @TextProperty, @ColorProperty, Color } from "../Vigilance/index"
import constants from "./constants"

@Vigilant(`${constants.moduleName}/config`, `${constants.moduleName} Settings`, {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General"]; // add any categories

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})


class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", `&a${constants.moduleName} &bv${JSON.parse(FileLib.read(constants.moduleName, "metadata.json")).version}` + 
        `\n&aBy &bNinjune`)
    }

    @ButtonProperty({
        name: "Example",
        description: "Example",
        category: "General",
        placeholder: "Example"
    })
    anyName() {
        // Add code
    }

    @SwitchProperty({
        name: "Example 2",
        description: "Example 2",
        category: "General",
        subcategory: "Example Subcategory"
    })
    exampleBool = true;

    @TextProperty({
        name: "Example 3",
        description: "Example 3",
        category: "General",
        subcategory: "Example Subcategory"
    })
    exampleString = "127.0.0.1";
}

export default new Settings()