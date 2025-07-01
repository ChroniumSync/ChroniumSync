import dotenv from "dotenv"
import readline from "readline"
import { AICenterService } from "./aicenterService"

dotenv.config()

const service = new AICenterService(
  process.env.AICENTER_API_URL!,
  process.env.AICENTER_API_KEY!
)

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function promptAction() {
  console.log("\n1) Analyze Text\n2) Summarize Text\n3) Detect Anomalies\n4) Exit")
  rl.question("Select action: ", handleAction)
}

async function handleAction(choice: string) {
  if (choice === "4") {
    rl.close()
    return
  }
  const actions: Record<string, (input: string) => Promise<any>> = {
    "1": (inp) => service.analyzeText(inp),
    "2": (inp) => service.generateSummary(inp),
    "3": (inp) => service.detectAnomalies(inp),
  }
  const action = actions[choice.trim()]
  if (!action) {
    console.log("Invalid choice")
    return promptAction()
  }
  rl.question("Enter text: ", async (input) => {
    try {
      const result = await action(input)
      console.log(JSON.stringify(result, null, 2))
    } catch (err: any) {
      console.error("Error:", err.message)
    }
    promptAction()
  })
}

promptAction()
