import { useCallback } from 'react'
import { useAppStore } from '../store'
import { META_PROMPT } from '../constants/meta-prompt'
import { assembleUserMessage } from '../services/prompt-assembler'
import { streamRefinement } from '../services/anthropic'
import { simulateDemoStreaming } from '../services/demo-streaming'
import { advanceDemoScenario } from '../constants/demo-responses'
import { extractPromptOnly, extractSuggestions } from '../lib/prompt-utils'

export function useRefine() {
  const refine = useCallback(() => {
    const state = useAppStore.getState()

    if (!state.isDemoMode && !state.apiKey) {
      state.showToast('Set your API key in Kitchen Settings first.', 'error')
      return
    }

    if (!state.taskBraindump.trim()) {
      state.showToast('Every burger needs a patty! Add a task description.', 'error')
      return
    }

    const previousPrompt = state.content
    const previousSuggestions = state.suggestions

    state.setIsRefining(true)
    state.setStreamedContent('')
    state.setContent('')
    state.setSuggestions('')
    state.setIsEditing(false)

    const onChunk = (chunk: string) => {
      useAppStore.getState().appendStreamedContent(chunk)
    }

    const onComplete = (fullText: string) => {
      const s = useAppStore.getState()
      s.setContent(extractPromptOnly(fullText))
      s.setSuggestions(extractSuggestions(fullText))
      s.setIsEditable(true)
      s.setIsRefining(false)
      s.setStreamedContent('')

      if (s.isDemoMode) {
        const next = advanceDemoScenario()
        s.setSelectedRoles(next.sidebar.roles)
        s.setContext(next.sidebar.context)
        s.setTaskBraindump(next.sidebar.task)
        s.setConstraints(next.sidebar.constraints)
        s.setExamples(next.sidebar.examples)
      }
    }

    const onError = (error: Error) => {
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
    }

    if (state.isDemoMode) {
      simulateDemoStreaming(onChunk, onComplete, onError)
    } else {
      const userMessage = assembleUserMessage({
        selectedRoles: state.selectedRoles,
        context: state.context,
        taskBraindump: state.taskBraindump,
        constraints: state.constraints,
        examples: state.examples,
        blocks: state.blocks,
        previousPrompt,
        previousSuggestions,
      })

      streamRefinement(
        state.apiKey,
        state.selectedModel,
        META_PROMPT,
        userMessage,
        onChunk,
        onComplete,
        onError,
      )
    }
  }, [])

  return { refine }
}
