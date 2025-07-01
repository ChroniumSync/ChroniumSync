
import dotenv from "dotenv"
import readline from "readline"
import { SafeboxService } from "./safeboxService"

dotenv.config()

const service = new SafeboxService(process.env.AZURE_STORAGE_CONNECTION_STRING!)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

async function prompt() {
  rl.question(
    "Choose action (upload/download/delete): ",
    async (action) => {
      rl.question("Container name: ", async (container) => {
        rl.question("Blob name: ", async (blob) => {
          try {
            if (action === "upload") {
              rl.question("Enter content: ", async (content) => {
                await service.upload(container, blob, content)
                console.log("Upload complete")
                rl.close()
              })
            } else if (action === "download") {
              const data = await service.download(container, blob)
              console.log("Downloaded content:")
              console.log(data.toString())
              rl.close()
            } else if (action === "delete") {
              await service.delete(container, blob)
              console.log("Blob deleted (if existed)")
              rl.close()
            } else {
              console.error("Unknown action")
              rl.close()
            }
          } catch (err: any) {
            console.error("Error:", err.message)
            rl.close()
          }
        })
      })
    }
  )
}

prompt()
