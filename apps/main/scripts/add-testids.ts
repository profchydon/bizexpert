import { Project, SyntaxKind } from "ts-morph";
import path from "path";

const project = new Project();
project.addSourceFilesAtPaths("src/**/**/*.{tsx,jsx}");

const componentsToModify = [
  "Input",
  "Select",
  "Button",
  "Checkbox",
  "RadioGroup",
  "Dialog",
  "DrawerRight",
  "Autocomplete",
];

// Map to track component usage count per file
const componentUsageCount: {
  [filePath: string]: { [component: string]: number };
} = {};

project.getSourceFiles().forEach((sourceFile) => {
  const filePath = sourceFile.getFilePath();
  let baseName = path.basename(filePath, path.extname(filePath)).toLowerCase();
  const folderName = path.basename(path.dirname(filePath)).toLowerCase();

  // If the file is named "index", use the parent directory name
  if (baseName === "index") {
    baseName = folderName;
  }

  // Special handling for "tableActions", "tableColumn", and "tableHeader" files
  if (
    [
      "tableactions",
      "tableaction",
      "tablecolumns",
      "tablecolumn",
      "tableheader",
      "tableheaders",
    ].includes(baseName)
  ) {
    const suffix = baseName.replace(/^table/, ""); // Remove 'table' prefix
    baseName = `${folderName}${suffix}`;
  }

  // Initialize usage count for this file
  componentUsageCount[filePath] = {};

  sourceFile.forEachDescendant((node) => {
    if (
      node.getKind() === SyntaxKind.JsxSelfClosingElement ||
      node.getKind() === SyntaxKind.JsxOpeningElement
    ) {
      const element = node.asKindOrThrow(
        node.getKind() as
          | SyntaxKind.JsxSelfClosingElement
          | SyntaxKind.JsxOpeningElement,
      );
      const tagName = element.getTagNameNode().getText();

      if (componentsToModify.includes(tagName)) {
        // Initialize or increment usage count for this component
        componentUsageCount[filePath][tagName] =
          (componentUsageCount[filePath][tagName] || 0) + 1;
        const count = componentUsageCount[filePath][tagName];

        // Construct testId: baseName-componentTagName[-count]
        const testId =
          count > 1
            ? `${baseName}-${tagName.toLowerCase()}-${count}`
            : `${baseName}-${tagName.toLowerCase()}`;

        // Check for existing data-testid attribute
        let hasTestId = false;
        let existingTestId = "";
        const attributes = element.getAttributes();
        for (const attr of attributes) {
          const attrText = attr.getText();
          if (attrText.startsWith("data-testid=")) {
            hasTestId = true;
            existingTestId = attrText.split("=")[1].replace(/"/g, "");
            if (existingTestId !== testId) {
              attr.remove(); // Remove old attribute
              element.addAttribute({
                name: "data-testid",
                initializer: `"${testId}"`,
              });
            }
            break;
          }
        }

        // Add new data-testid attribute if none exists
        if (!hasTestId) {
          element.addAttribute({
            name: "data-testid",
            initializer: `"${testId}"`,
          });
        }
      }
    }
  });

  sourceFile.saveSync();
});

console.log("✅ Dynamic data-testid attributes processed successfully!");
