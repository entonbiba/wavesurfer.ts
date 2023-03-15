const DEFAULT_SAMPLE_RATE = 3000 // Chrome, Safari
const FALLBACK_SAMPLE_RATE = 8000 // Firefox

class Decoder {
  audioCtx: AudioContext | null = null

  constructor() {
    try {
      this.audioCtx = new AudioContext({
        latencyHint: 'playback',
        sampleRate: DEFAULT_SAMPLE_RATE,
      })
    } catch (e) {
      this.audioCtx = new AudioContext({
        latencyHint: 'playback',
        sampleRate: FALLBACK_SAMPLE_RATE,
      })
    }
  }

  public async decode(audioData: ArrayBuffer): Promise<{
    duration: number
    channelData: Float32Array[]
  }> {
    if (!this.audioCtx) {
      throw new Error('AudioContext is not initialized')
    }

    const buffer = await this.audioCtx.decodeAudioData(audioData)
    const channelData = [buffer.getChannelData(0)]
    if (buffer.numberOfChannels > 1) {
      channelData.push(buffer.getChannelData(1))
    }

    return {
      duration: buffer.duration,
      channelData,
    }
  }

  destroy() {
    this.audioCtx?.close()
    this.audioCtx = null
  }
}

export default Decoder
