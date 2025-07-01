import { AssistantProfile } from "@/ai/agent"
import { SOLANA_AGENT_DESCRIPTION as DESCRIPTION } from "./solanaAgentDescription"
import { SOLANA_TOOLKIT } from "./tools"
import { SOLANA_CAPABILITIES, CAPABILITY_FLAGS } from "./capabilities"
import { SOLANA_AGENT_ID, VERSION_TAG } from "./name"

export const solanaAgent: AssistantProfile = {
  id: SOLANA_AGENT_ID,
  version: VERSION_TAG,
  label: "solana-agent",
  promptBase: DESCRIPTION.trim(),
  features: {
    ...SOLANA_CAPABILITIES,
    flags: CAPABILITY_FLAGS
  },
  extensions: SOLANA_TOOLKIT
}
