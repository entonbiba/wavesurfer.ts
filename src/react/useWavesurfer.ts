/// <reference types="react" />
import WaveSurfer, { type WaveSurferOptions } from '../index.js'

const { useEffect, useState } = React

// A React hook to use WaveSurfer
export const useWavesurfer = (
  containerRef: { current: HTMLElement },
  options: WaveSurferOptions,
): WaveSurfer | null => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!containerRef.current) return

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    })

    setWavesurfer(ws)

    return () => {
      ws.destroy()
    }
  }, [options, containerRef])

  return wavesurfer
}

export default useWavesurfer
