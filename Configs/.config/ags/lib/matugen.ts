import wallpaper from "service/wallpaper"
import options from "options"
import { sh, dependencies } from "./utils"

export default function init() {
    wallpaper.connect("changed", () => matugen())
    options.autotheme.connect("changed", () => matugen())
}

function animate(...setters: Array<() => void>) {
    const delay = options.transition.value / 2
    setters.forEach((fn, i) => Utils.timeout(delay * i, fn))
}

export async function matugen(
    type: "image" | "color" = "image",
    arg = wallpaper.wallpaper,
) {
    if (!options.autotheme.value || !dependencies("matugen"))
        return

    const colors = await sh(`matugen --dry-run -j hex ${type} ${arg}`)
    const c = JSON.parse(colors).colors as { light: Colors, dark: Colors }

    animate(
        () => {
            options.bar.battery.charging.value = options.theme.scheme.value === "dark"
                ? c.dark.primary : c.light.primary
        },
    )
}

type Colors = {
    background: string
    error: string
    error_container: string
    inverse_on_surface: string
    inverse_primary: string
    inverse_surface: string
    on_background: string
    on_error: string
    on_error_container: string
    on_primary: string
    on_primary_container: string
    on_primary_fixed: string
    on_primary_fixed_variant: string
    on_secondary: string
    on_secondary_container: string
    on_secondary_fixed: string
    on_secondary_fixed_variant: string
    on_surface: string
    on_surface_variant: string
    on_tertiary: string
    on_tertiary_container: string
    on_tertiary_fixed: string
    on_tertiary_fixed_variant: string
    outline: string
    outline_variant: string
    primary: string
    primary_container: string
    primary_fixed: string
    primary_fixed_dim: string
    scrim: string
    secondary: string
    secondary_container: string
    secondary_fixed: string
    secondary_fixed_dim: string
    shadow: string
    surface: string
    surface_bright: string
    surface_container: string
    surface_container_high: string
    surface_container_highest: string
    surface_container_low: string
    surface_container_lowest: string
    surface_dim: string
    surface_variant: string
    tertiary: string
    tertiary_container: string
    tertiary_fixed: string
    tertiary_fixed_dim: string
}
