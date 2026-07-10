import type { NoteResponse, RoleOption, SidebarBlock } from '../types'

interface AssemblerInput {
  selectedRoles: RoleOption[]
  context: string
  taskBraindump: string
  constraints: string
  examples: string
  blocks: SidebarBlock[]
  previousPrompt?: string
  previousSuggestions?: string
  noteResponses?: NoteResponse[]
  dismissedNotes?: string[]
}

export function assembleUserMessage(input: AssemblerInput): string {
  const parts: string[] = []

  if (input.selectedRoles.length > 0) {
    const roleNames = input.selectedRoles.map((r) => r.label).join(', ')
    parts.push(`**Roles:** ${roleNames}`)
  }

  if (input.context.trim()) {
    parts.push(`**Context:**\n${input.context.trim()}`)
  }

  if (input.taskBraindump.trim()) {
    parts.push(`**Task:**\n${input.taskBraindump.trim()}`)
  }

  if (input.constraints.trim()) {
    parts.push(`**Constraints:**\n${input.constraints.trim()}`)
  }

  if (input.examples.trim()) {
    parts.push(`**Examples:**\n${input.examples.trim()}`)
  }

  for (const block of input.blocks) {
    if (block.enabled && block.content.trim()) {
      parts.push(`**${block.label}:**\n${block.content.trim()}`)
    }
  }

  if (input.previousPrompt?.trim()) {
    const prevParts = [`**Previous Prompt Output:**\n${input.previousPrompt.trim()}`]
    if (input.previousSuggestions?.trim()) {
      prevParts.push(`**Previous Suggestions:**\n${input.previousSuggestions.trim()}`)
    }
    parts.push(`---\n\n**Previous Generation (for iteration):**\n\n${prevParts.join('\n\n')}`)
  }

  const answered = (input.noteResponses ?? []).filter(
    (r) => r.note.trim() && r.response.trim(),
  )
  if (answered.length > 0) {
    const qaPairs = answered
      .map((r) => `Q: ${r.note.trim()}\nA: ${r.response.trim()}`)
      .join('\n\n')
    parts.push(`**Responses to Chef's Notes:**\n\n${qaPairs}`)
  }

  const dismissed = (input.dismissedNotes ?? []).map((n) => n.trim()).filter(Boolean)
  if (dismissed.length > 0) {
    parts.push(
      `**Dismissed Chef's Notes (the user marked these as not relevant):**\n${dismissed
        .map((n) => `- ${n}`)
        .join('\n')}`,
    )
  }

  return parts.join('\n\n')
}
