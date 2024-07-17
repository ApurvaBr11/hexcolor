import * as vscode from 'vscode';
import { trendyPalettes } from './palettes';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.showColorPalettes', () => {
            const panel = vscode.window.createWebviewPanel(
                'colorPalettes',
                'Trendy Color Palettes',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            panel.webview.html = getWebviewContent(trendyPalettes);

            panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'copy':
                            vscode.env.clipboard.writeText(message.color);
                            vscode.window.showInformationMessage(`Color ${message.color} copied to clipboard!`);
                            return;
                    }
                },
                undefined,
                context.subscriptions
            );
        })
    );
}

function getWebviewContent(palettes: any): string {
    const paletteHtml = palettes.map((palette: any) => `
        <div class="palette">
            <h3>${palette.name}</h3>
            <div class="colors">
                ${palette.colors.map((color: string) => `
                    <div class="color" style="background-color: ${color};" data-color="${color}"></div>
                `).join('')}
            </div>
        </div>
    `).join('');

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
            </script>
        </body>
        </html>
    `;
}

export function deactivate() {}
