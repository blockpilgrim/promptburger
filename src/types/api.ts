export interface RefinementCallbacks {
  onChunk: (text: string) => void
  onComplete: (fullText: string) => void
  onError: (error: Error) => void
}
