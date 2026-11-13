// Builds preview/index.html from preview/episodes.json + preview/template.html.
// Only episodes that have preview/media/<id>.mp4 are listed. Publish the preview folder with the Artifact tool
// (index.html + media/<id>.mp4 + media/<id>.jpg) to get a private page reachable from any device.
import fs from "node:fs";
const eps = JSON.parse(fs.readFileSync("preview/episodes.json", "utf8")).filter((e) => fs.existsSync(`preview/media/${e.id}.mp4`));
const tpl = fs.readFileSync("preview/template.html", "utf8");
fs.writeFileSync("preview/index.html", tpl.replace("/*EPISODES*/[]", JSON.stringify(eps)), "utf8");
console.log("preview/index.html:", eps.map((e) => e.code).join(", "));
