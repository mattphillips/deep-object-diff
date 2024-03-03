import * as path from "path";
import * as fs from "fs";

const DIST = "dist";
const MJS = "mjs";
const CJS = "cjs";
const PKG = "package.json";
const FILES = ["README.md", "LICENSE"];

fs.writeFileSync(
    path.join(DIST, CJS, PKG),
    JSON.stringify({ type: "commonjs" }, null, 2)
);
fs.writeFileSync(
    path.join(DIST, MJS, PKG),
    JSON.stringify({ type: "module" }, null, 2)
);

// Inside the MJS folder we need to replace all import x from "y" with import x
// from "y.js"
fs.readdirSync(path.join(DIST, MJS)).forEach((file) => {
    const content = fs
        .readFileSync(path.join(DIST, MJS, file), "utf-8")
        .replace(/from "([^"]+)"/g, 'from "$1.js"');
    fs.writeFileSync(path.join(DIST, MJS, file), content);
});

const pkg = fs.readFileSync(PKG, "utf-8");
const json = JSON.parse(pkg);

delete json.scripts;
delete json.devDependencies;

fs.writeFileSync(path.join(DIST, PKG), JSON.stringify(json, null, 2));

FILES.forEach((file) => fs.copyFileSync(file, path.join(DIST, file)));
