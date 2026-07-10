import { useCallback } from 'react'
import { useAppStore } from '../store'
import { assembleUserMessage } from '../services/prompt-assembler'
import { streamRefinement } from '../services/refine-api'
import { simulateDemoStreaming } from '../services/demo-streaming'
import { advanceDemoScenario } from '../constants/demo-responses'
import { extractPromptOnly, extractSuggestions } from '../lib/prompt-utils'
import { calculateCost } from '../constants/pricing'
import { DEFAULT_MODEL } from '../constants/models'
import type { RefinementStats } from '../types'

export function useRefine() {
  const refine = useCallback(() => {
    const state = useAppStore.getState()

    if (!state.taskBraindump.trim()) {
      state.showToast('Every burger needs a patty! Add a task description.', 'error')
      return
    }

    const previousPrompt = state.content
    const previousSuggestions = state.suggestions
    const isIteration = !!previousPrompt
    // Answers only make sense alongside the generation whose notes they
    // answer — never send them with a from-scratch request.
    const noteResponses = isIteration
      ? Object.entries(state.noteResponses)
          .map(([note, response]) => ({ note: note.trim(), response: response.trim() }))
          .filter((r) => r.note && r.response)
      : []
    const dismissedNotes = isIteration ? state.dismissedNotes : []

    state.setIsRefining(true)
    state.setStreamedContent('')
    state.setContent('')
    state.setSuggestions('')
    state.setIsEditing(false)
    state.setCurrentStats(null)

    const onChunk = (chunk: string) => {
      useAppStore.getState().appendStreamedContent(chunk)
    }

    const onComplete = (fullText: string, stats: RefinementStats) => {
      const s = useAppStore.getState()
      const promptContent = extractPromptOnly(fullText)
      const suggestionContent = extractSuggestions(fullText)

      // Calculate cost and attach to stats
      const cost = calculateCost(stats.model, stats.inputTokens, stats.outputTokens)
      const statsWithCost: RefinementStats = { ...stats, cost }

      s.setContent(promptContent)
      s.setSuggestions(suggestionContent)
      s.setIsEditable(true)
      s.setIsRefining(false)
      s.setStreamedContent('')
      s.setCurrentStats(statsWithCost)

      // Save to history
      if (promptContent) {
        const title = s.taskBraindump.trim().slice(0, 100) || 'Untitled prompt'
        s.addHistoryEntry({
          title,
          sidebar: {
            selectedRoles: s.selectedRoles,
            context: s.context,
            taskBraindump: s.taskBraindump,
            constraints: s.constraints,
            examples: s.examples,
            blocks: s.blocks,
          },
          canvas: {
            content: promptContent,
            suggestions: suggestionContent,
          },
          stats: statsWithCost,
          isIteration,
          noteResponses: noteResponses.length > 0 ? noteResponses : undefined,
        })
      }

      // The answers are baked into the new generation; a fresh set of
      // notes deserves a clean slate. (Kept on error so a retry re-sends.)
      s.clearNoteResponses()

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
      s.showToast(error.message, 'error')
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
        noteResponses,
        dismissedNotes,
      })

      streamRefinement(
        DEFAULT_MODEL,
        userMessage,
        onChunk,
        onComplete,
        onError,
      )
    }
  }, [])

  return { refine }
}
