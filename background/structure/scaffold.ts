import fs from "fs"
import path from "path"
import { projectStructure, DirectoryStructure } from "./structureConfig"

function createStructure(base: string, structure: DirectoryStructure) {
  for (const [name, sub] of Object.entries(structure)) {
    const fullPath = path.join(base, name)
    if (sub === null) {
      if (name.includes(".")) {
        fs.writeFileSync(fullPath, "")
      } else {
        fs.mkdirSync(fullPath, { recursive: true })
      }
    } else {
      fs.mkdirSync(fullPath, { recursive: true })
      createStructure(fullPath, sub)
    }
  }
}

const root = process.cwd()
createStructure(root, projectStructure)
console.log("Project scaffold created.")
