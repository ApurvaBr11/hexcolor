var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/extension.ts
__export(exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
var vscode = __toModule(require("vscode"));

// src/palettes.ts
var trendyPalettes = [
  {
    name: "Summer Vibes",
    colors: ["#FF5733", "#FFBD33", "#DBFF33", "#75FF33", "#33FF57"]
  },
  {
    name: "Ocean Blues",
    colors: ["#001F3F", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970"]
  }
];

// src/extension.ts
function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand("extension.showColorPalettes", () => {
    const panel = vscode.window.createWebviewPanel("colorPalettes", "Trendy Color Palettes", vscode.ViewColumn.One, {
      enableScripts: true
    });
    panel.webview.html = getWebviewContent(trendyPalettes);
    panel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "copy":
          vscode.env.clipboard.writeText(message.color);
          vscode.window.showInformationMessage(`Color ${message.color} copied to clipboard!`);
          return;
      }
    }, void 0, context.subscriptions);
  }));
}
function getWebviewContent(palettes) {
  const paletteHtml = palettes.map((palette) => `
        <div class="palette">
            <h3>${palette.name}</h3>
            <div class="colors">
                ${palette.colors.map((color) => `
                    <div class="color" style="background-color: ${color};" data-color="${color}"></div>
                `).join("")}
            </div>
        </div>
    `).join("");
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Trendy Color Palettes</title>
            <style>
                .palette { margin-bottom: 20px; }
                .colors { display: flex; }
                .color {
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                    cursor: pointer;
                    border: 1px solid #ccc;
                }
            </style>
        </head>
        <body>
            ${paletteHtml}
            <script>
                const vscode = acquireVsCodeApi();
                document.querySelectorAll('.color').forEach(colorDiv => {
                    colorDiv.addEventListener('click', () => {
                        const color = colorDiv.getAttribute('data-color');
                        vscode.postMessage({ command: 'copy', color });
                    });
                });
            <\/script>
        </body>
        </html>
    `;
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
