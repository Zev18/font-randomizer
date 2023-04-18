// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

function randomize() {
  let currentFont = vscode.workspace
    .getConfiguration()
    .get("editor.fontFamily")
    .split(", ")[0];
  const fonts = vscode.workspace
    .getConfiguration("fontRandomizer")
    .get<string[]>("fontList") || ["monospace"];
  let randomFont = fonts[Math.floor(Math.random() * fonts.length)];

  if (fonts.length > 1) {
    while (randomFont === currentFont) {
      randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    }
  }

  vscode.workspace
    .getConfiguration()
    .update("editor.fontFamily", randomFont + ", monospace", true);
  vscode.window.showInformationMessage("Font changed to " + randomFont);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const activateOnStartup = vscode.workspace
    .getConfiguration("fontRandomizer")
    .get<boolean>("activateOnStartup");

  if (activateOnStartup) {
    randomize();
  }

  let disposable = vscode.commands.registerCommand(
    "font-randomizer.randomize",
    randomize
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
  /* TODO document why this function 'deactivate' is empty */
}
