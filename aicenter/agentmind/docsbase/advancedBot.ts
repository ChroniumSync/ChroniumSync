import { AssistantProfile } from "@/ai/agent"
import { ADVANCED_TOOLKIT as TOOLKIT } from "./tools"
import { ADVANCED_ASSISTANT_CAPABILITIES as CAPABILITIES, CAPABILITY_FLAGS } from "./capabilities"
import { VERSION_TAG, ADVANCED_ASSISTANT_DESCRIPTION as DESCRIPTION } from "./description"
import { ADVANCED_ASSISTANT_ID as BOT_ID } from "./name"

export const advancedBot: AssistantProfile = Object.freeze({
  id: BOT_ID,
  version: VERSION_TAG,
  label: "advanced-bot",
  promptBase: DESCRIPTION,
  features: {
    ...CAPABILITIES,
    flags: CAPABILITY_FLAGS
  },
  extensions: TOOLKIT
})
