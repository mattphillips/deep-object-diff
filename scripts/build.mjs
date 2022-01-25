import * as path from "path";
import * as fs from "fs";

const DIST = "dist";
const SRC = "src";
const MJS = "mjs";
const CJS = "cjs";
const PKG = "package.json";
const FILES = ["index.d.ts", "README.md", "LICENSE"];

fs.mkdirSync(path.join(DIST, MJS));
fs.readdirSync("./src").forEach((file) => fs.copyFileSync(path.join(SRC, file), path.join(DIST, MJS, file)));

fs.writeFileSync(path.join(DIST, CJS, PKG), JSON.stringify({ type: "commonjs" }, null, 2));
fs.writeFileSync(path.join(DIST, MJS, PKG), JSON.stringify({ type: "module" }, null, 2));

const pkg = fs.readFileSync(PKG, "utf-8");
const json = JSON.parse(pkg);

delete json.scripts;
delete json.devDependencies;
delete json.babel;

fs.writeFileSync(path.join(DIST, PKG), JSON.stringify(json, null, 2));

FILES.forEach((file) => fs.copyFileSync(file, path.join(DIST, file)));
