import type { RoleOption, SidebarBlock } from '../types'

interface AssemblerInput {
  selectedRoles: RoleOption[]
  context: string
  taskBraindump: string
  constraints: string
  examples: string
  blocks: SidebarBlock[]
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

  return parts.join('\n\n')
}
