import { useCallback } from 'react'
import { useAppStore } from '../store'
import { META_PROMPT } from '../constants/meta-prompt'
import { assembleUserMessage } from '../services/prompt-assembler'
import { streamRefinement } from '../services/anthropic'
import { extractPromptOnly, extractSuggestions } from '../lib/prompt-utils'

export function useRefine() {
  const refine = useCallback(() => {
    const state = useAppStore.getState()

    if (!state.apiKey) {
      state.showToast('Please set your API key in Settings.', 'error')
      return
    }

    if (!state.taskBraindump.trim()) {
      state.showToast('Please enter a task description.', 'error')
      return
    }

    const userMessage = assembleUserMessage({
      selectedRoles: state.selectedRoles,
      taskBraindump: state.taskBraindump,
      constraints: state.constraints,
      blocks: state.blocks,
    })

    state.setIsRefining(true)
    state.setStreamedContent('')
    state.setContent('')
    state.setSuggestions('')
    state.setIsEditing(false)

    streamRefinement(
      state.apiKey,
      state.selectedModel,
      META_PROMPT,
      userMessage,
      (chunk) => {
        useAppStore.getState().appendStreamedContent(chunk)
      },
      (fullText) => {
        const s = useAppStore.getState()
        s.setContent(extractPromptOnly(fullText))
        s.setSuggestions(extractSuggestions(fullText))
        s.setIsEditable(true)
        s.setIsRefining(false)
        s.setStreamedContent('')
      },
      (error) => {
        const s = useAppStore.getState()
        s.showToast(`Refinement failed: ${error.message}`, 'error')
        s.setIsRefining(false)
        const streamed = s.streamedContent
        if (streamed) {
          s.setContent(extractPromptOnly(streamed))
          s.setSuggestions(extractSuggestions(streamed))
          s.setIsEditable(true)
        }
        s.setStreamedContent('')
      },
    )
  }, [])

  return { refine }
}
