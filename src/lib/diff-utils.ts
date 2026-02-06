import { diffLines } from 'diff'

export interface DiffLine {
  type: 'add' | 'remove' | 'unchanged'
  content: string
  oldLineNum?: number
  newLineNum?: number
}

export function computeLineDiff(oldText: string, newText: string): DiffLine[] {
  const changes = diffLines(oldText, newText)
  const result: DiffLine[] = []
  let oldLine = 1
  let newLine = 1

  for (const change of changes) {
    const lines = change.value.replace(/\n$/, '').split('\n')

    for (const line of lines) {
      if (change.added) {
        result.push({ type: 'add', content: line, newLineNum: newLine++ })
      } else if (change.removed) {
        result.push({ type: 'remove', content: line, oldLineNum: oldLine++ })
      } else {
        result.push({ type: 'unchanged', content: line, oldLineNum: oldLine++, newLineNum: newLine++ })
      }
    }
  }

  return result
}
