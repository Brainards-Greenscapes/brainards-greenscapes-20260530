import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAreas = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAreas.json"), "utf8")
);

// Las Cruces leads the list (flagship market), then everything else
// alphabetical by name. Single source of truth shared by the nav
// dropdown and the /service-areas/ index page.
export default function () {
  const lead = serviceAreas.filter((area) => area.name === "Las Cruces");
  const rest = serviceAreas
    .filter((area) => area.name !== "Las Cruces")
    .sort((a, b) => a.name.localeCompare(b.name));
  return [...lead, ...rest];
}
