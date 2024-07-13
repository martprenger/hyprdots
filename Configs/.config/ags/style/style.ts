/* eslint-disable max-len */
import { type Opt } from "lib/option"
import options from "options"
import { bash, dependencies, sh } from "lib/utils"
import GLib from "gi://GLib?version=2.0"

const deps = [
    "font",
    "theme",
    "bar.flatButtons",
    "bar.position",
    "bar.battery.charging",
    "bar.battery.blocks",
]

const {
    blur,
    scheme,
    padding,
    spacing,
    radius,
    shadows,
    widget,
    border,
} = options.theme

const popoverPaddingMultiplier = 1.6

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $ = (name: string, value: string | Opt<any>) => `$${name}: ${value};`

const variables = () => [

    $("scheme", scheme),
    $("padding", `${padding}pt`),
    $("spacing", `${spacing}pt`),
    $("radius", `${radius}px`),
    $("transition", `${options.transition}ms`),

    $("shadows", `${shadows}`),

    $("border-width", `${border.width}px`),

    $("popover-padding", `$padding * ${popoverPaddingMultiplier}`),
    $("popover-radius", radius.value === 0 ? "0" : "$radius + $popover-padding"),

    $("font-size", `${options.font.size}pt`),
    $("font-name", options.font.name),

    // etc
    $("charging-bg", options.bar.battery.charging),
    $("bar-battery-blocks", options.bar.battery.blocks),
    $("bar-position", options.bar.position),
    $("hyprland-gaps-multiplier", options.hyprland.gaps),
]

async function resetCss() {
    if (!dependencies("sass", "fd"))
        return

    try {
        const vars = `${TMP}/variables.scss`
        await Utils.writeFile(variables().join("\n"), vars)


        const cache_dir = GLib.get_user_cache_dir()
        const additionalColors = `${cache_dir}/material/colors.scss`
        const fd = await sh(`fd ".scss" ${App.configDir}`)
        const files = fd.split(/\s+/).map(f => `@import '${f}';`)
        const scss = [
            `@import '${vars}';`,
            `@import '${additionalColors}';`, // Import the additional colors file
            ...files
        ].join("\n")
        
        const css = await bash`echo "${scss}" | sass --stdin`

        App.applyCss(css, true)
    } catch (error) {
        logError(error)
    }
}

Utils.monitorFile(App.configDir, resetCss)
options.handler(deps, resetCss)
await resetCss()
