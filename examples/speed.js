/*
  Load React:
  <html>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </html>
*/

// Import useWavesurfer hook
import useWavesurfer from '/dist/react/useWavesurfer.js'

const { useRef, useState, useCallback } = React

const url = 'https://wavesurfer-js.org/example/media/demo.wav'

const playerOptions = {
  url,
  height: 100,
  waveColor: 'rgb(200, 0, 200)',
  progressColor: 'rgb(100, 0, 100)',
}

const App = () => {
  // Create a ref for the player container
  const containerRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const wavesurfer = useWavesurfer(containerRef, playerOptions)

  // Toggle play/pause and optimistically set state
  const onClickPlay = useCallback(() => {
    if (wavesurfer.isPlaying()) {
      wavesurfer.pause()
      setIsPlaying(false)
    } else {
      wavesurfer.play()
      setIsPlaying(true)
    }
  }, [wavesurfer])

  const playButtonLabel = isPlaying ? 'Pause' : 'Play'

  const playbackRateList = [0.5, 1, 2]

  return (
    <>
      <div ref={containerRef} />
      <button onClick={onClickPlay}>{playButtonLabel}</button>{' '}
      {playbackRateList.map((rate) => {
        const playbackRateLabel = `${rate.toFixed(1)}x`
        const onClickPlaybackRate = () => {
          // TODO: move this to a method
          wavesurfer.player.media.playbackRate = rate
        }
        return (
          <>
            <button onClick={onClickPlaybackRate}>{playbackRateLabel}</button>{' '}
          </>
        )
      })}
    </>
  )
}

// Create a React root and render the app
const root = ReactDOM.createRoot(document.body)
root.render(<App />)
