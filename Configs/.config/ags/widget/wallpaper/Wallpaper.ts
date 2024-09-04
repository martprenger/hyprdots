import { type Binding } from "lib/utils";
import PopupWindow, { Padding } from "widget/PopupWindow";
import options from "options";
import nix from "service/nix";

import { icon, sh } from "lib/utils";

import GLib from "gi://GLib?version=2.0";
import Gio from "gi://Gio?version=2.0";

const { width, margin } = options.launcher;
const isnix = nix.available;

const { bar, wallpaper } = options;
const layout = Utils.derive(
  [bar.position, wallpaper.position],
  (bar, qs) => `${bar}-${qs}` as const,
);

function Wallpaper() {
  function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const fileEnum = Gio.File.new_for_path(dirPath).enumerate_children(
      "standard::*",
      Gio.FileQueryInfoFlags.NONE,
      null,
    );
    let fileInfo;

    while ((fileInfo = fileEnum.next_file(null)) !== null) {
      const filePath = GLib.build_filenamev([dirPath, fileInfo.get_name()]);
      if (fileInfo.get_file_type() === Gio.FileType.DIRECTORY) {
        getAllFiles(filePath, arrayOfFiles);
      } else {
        arrayOfFiles.push(filePath);
      }
    }

    return arrayOfFiles;
  }

  const wallpaperFiles = getAllFiles(wallpaper.wallpaperDir.value);

  const wallpaperItems = wallpaperFiles.map((filePath) =>
    Widget.Button({
      class_name: "wallpaper-button",
      child: Widget.Icon({
        icon: icon(filePath),
        size: 300,
      }),
      on_clicked: () => {
        App.closeWindow("wallpaper");
        console.log(
          `${GLib.get_home_dir()}/.config/hypr/scripts/wallpaper.sh -s ${filePath}`,
        );
        sh(
          `${GLib.get_home_dir()}/.config/hypr/scripts/wallpaper.sh -s ${filePath}`,
        );
      },
    }),
  );

  const sortedWallpaperItems = wallpaperItems
    .reduce(
      (resultArray: Widget.Button[][], item: Widget.Button, index: number) => {
        const chunkIndex = Math.floor(index / 6);

        if (!resultArray[chunkIndex]) {
          // start a new chunk
          resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      },
      [] as Widget.Button[][],
    )
    .map((item) =>
      Widget.Box({
        vertical: true,
        children: item,
      }),
    );

  const wallpapers = Widget.Scrollable({
    vexpand: true,
    hscroll: "never",
    css: `min-height: 600px;
              min-width: 800px;`,
    class_name: "app-scrollable",
    child: Widget.Box({
      vertical: false,
      class_name: "wallpaper-list",
      children: sortedWallpaperItems,
    }),
  });

  const layout = Widget.Box({
    css: width.bind().as((v) => `min-width: ${v}pt;`),
    class_name: "wallpaper",
    vertical: true,
    vpack: "start",
    children: [wallpapers],
  });

  return Widget.Box({ vertical: true, css: "padding: 1px" }, layout);
}

const WallpaperWindow = () =>
  PopupWindow({
    name: "wallpaper",
    exclusivity: "exclusive",
    layout: layout.value,
    child: Wallpaper(),
  });

export function setupWallpaperWindow() {
  App.addWindow(WallpaperWindow());
  layout.connect("changed", () => {
    App.removeWindow("wallpaper");
    App.addWindow(WallpaperWindow());
  });
}
