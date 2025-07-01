import readline from "readline"
import { TaskService } from "./tasksService"

const svc = new TaskService()
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function showMenu() {
  console.log("\n1) List tasks\n2) Add task\n3) Complete task\n4) Remove task\n5) Exit")
  rl.question("Choose an option: ", handleChoice)
}

async function handleChoice(choice: string) {
  switch (choice.trim()) {
    case "1":
      console.table(svc.list())
      showMenu()
      break
    case "2":
      rl.question("Title: ", (title) => {
        rl.question("Prompt: ", (prompt) => {
          rl.question("Schedule (VEVENT): ", (schedule) => {
            const task = svc.add(title, prompt, schedule)
            console.log("Added:", task)
            showMenu()
          })
        })
      })
      break
    case "3":
      rl.question("Task ID to complete: ", (id) => {
        const ok = svc.complete(id)
        console.log(ok ? "Marked complete" : "Not found or already done")
        showMenu()
      })
      break
    case "4":
      rl.question("Task ID to remove: ", (id) => {
        const ok = svc.remove(id)
        console.log(ok ? "Removed" : "Not found")
        showMenu()
      })
      break
    case "5":
      rl.close()
      break
    default:
      console.log("Invalid choice")
      showMenu()
  }
}

showMenu()
