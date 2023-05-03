// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { QuickPickItem, window } from "vscode";

interface FontMenuItem extends QuickPickItem {
  type: "font" | "button";
}

let fontLabel: vscode.StatusBarItem;
let fontRefresh: vscode.StatusBarItem;

const refreshRate =
  vscode.workspace
    .getConfiguration("fontRandomizer")
    .get<string>("autoRefresh") || "Never";

let interval: number;

switch (refreshRate) {
  case "Every half hour":
    interval = 0.5;
    break;
  case "Every hour":
    interval = 1;
    break;
  case "Every two hours":
    interval = 2;
    break;
  case "Every day":
    interval = 24;
    break;
  default:
    interval = 0;
    break;
}

function randomize() {
  let currentFont = vscode.workspace
    .getConfiguration()
    .get("editor.fontFamily") as string;
  currentFont = currentFont.split(", ")[0];

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

  updateFontLabel(randomFont);
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate({ subscriptions }: vscode.ExtensionContext) {
  const activateOnStartup = vscode.workspace
    .getConfiguration("fontRandomizer")
    .get<boolean>("activateOnStartup");

  fontLabel = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  fontRefresh = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  subscriptions.push(fontLabel, fontRefresh);

  fontRefresh.command = "font-randomizer.randomize";
  fontRefresh.text = "$(refresh)";
  fontRefresh.tooltip = "Randomize font";
  fontRefresh.show();

  if (activateOnStartup) {
    randomize();
  }

  if (interval !== 0) {
    setInterval(() => {
      randomize();
    }, interval * 60 * 60 * 1000);
  }

  let disposable = vscode.commands.registerCommand(
    "font-randomizer.randomize",
    randomize
  );

  subscriptions.push(
    disposable,
    vscode.commands.registerCommand("font-randomizer.pick-font", () =>
      pickFont()
    )
  );
}

function updateFontLabel(font: string) {
  fontLabel.text = font.split(",")[0];
  fontLabel.tooltip = "Change font";
  fontLabel.command = "font-randomizer.pick-font";
  fontLabel.show();
}

// font picker function
async function pickFont(): Promise<void> {
  // get fonts
  let menuFonts = vscode.workspace
    .getConfiguration("fontRandomizer")
    .get<string[]>("fontList") || ["monospace"];
  // construct menu items
  const menuItems: FontMenuItem[] = [
    ...menuFonts.map(
      (font) =>
        <FontMenuItem>{
          label: font,
          type: "font",
        }
    ),
    {
      alwaysShow: true,
      label: "$(debug-configure) Manage fonts...",
      type: "button",
    },
  ];

  let config = vscode.workspace.getConfiguration("editor");
  let currentFont = config.get("fontFamily") as string;

  // show picker
  const selection = await window.showQuickPick(menuItems, {
    placeHolder: "Select Font",
    onDidSelectItem: (selection: FontMenuItem) => {
      // show original settings or selected fong
      config.update(
        "fontFamily",
        selection.type === "button" ? config.fontFamily : selection.label,
        true
      );
      updateFontLabel(selection.label);
    },
  });

  // in case of cancel
  if (!selection) {
    config.update("fontFamily", currentFont, true);
    updateFontLabel(currentFont);
  }

  if (selection && selection.type === "button") {
    // open settings if "manage fonts" is selected
    openSetting("fontRandomizer.fontList");
    updateFontLabel(currentFont);
  }
}

// helper function to open a certain setting
function openSetting(setting: string) {
  const section = setting.includes(".")
    ? setting.substring(0, setting.lastIndexOf("."))
    : setting;
  vscode.commands
    .executeCommand("workbench.action.openSettings", section)
    .then(() => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const regex = new RegExp(`"${setting}":`);
        const line = editor.document
          .getText()
          .split("\n")
          .findIndex((text) => regex.test(text));
        if (line !== -1) {
          const position = new vscode.Position(line, 0);
          editor.selection = new vscode.Selection(position, position);
          editor.revealRange(new vscode.Range(position, position));
        }
      }
    });
}

// This method is called when your extension is deactivated
export function deactivate() {
  /* TODO document why this function 'deactivate' is empty */
}
