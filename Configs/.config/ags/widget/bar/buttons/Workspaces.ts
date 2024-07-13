import PanelButton from "../PanelButton"
import { sh, range } from "lib/utils"

const hyprland = await Service.import("hyprland")

const dispatch = (arg: string | number) => {
    sh(`hyprctl dispatch workspace ${arg}`)
}

const Workspaces = (monitor: number) => {
    const activeId = hyprland.active.workspace.bind("id")
    const workspaces = hyprland.bind("workspaces")
        .as(ws => ws
            .filter(w => w.monitorID == monitor) // Filter workspaces by monitor ID
            .map(({ id, monitor }) => Widget.Label({
                attribute: id,
                vpack: "center",
                label: `${id%10}`,
                class_name: activeId.as(i => `${i === id ? "active" : ""}`),
            }))
            .sort((a, b) => a.attribute - b.attribute)
        )

    return Widget.Box({
        class_name: "workspaces",
        children: workspaces,
    })
}


export default (monitor: number) => PanelButton({
    window: "overview",
    class_name: "workspaces",
    on_scroll_up: () => dispatch("m+1"),
    on_scroll_down: () => dispatch("m-1"),
    on_clicked: () => App.toggleWindow("overview"),
    child: Workspaces(monitor), // Pass the monitor variable
})