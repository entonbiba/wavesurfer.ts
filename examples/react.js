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
// Import React stuff
const { createElement: jsx, useRef, useState, useEffect, useCallback } = React

// Create a React component that will render wavesurfer.
// Props are wavesurfer options.
const WaveSurferPlayer = (props) => {
  const containerRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const wavesurfer = useWavesurfer(containerRef, props)

  // On play button click
  const onPlayClick = useCallback(() => {
    wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play()
  }, [wavesurfer])

  // Initialize wavesurfer when the container mounts
  // or any of the props change
  useEffect(() => {
    if (!wavesurfer) return

    setCurrentTime(0)
    setIsPlaying(false)

    const subscriptions = [
      wavesurfer.on('play', () => setIsPlaying(true)),
      wavesurfer.on('pause', () => setIsPlaying(false)),
      wavesurfer.on('audioprocess', ({ currentTime }) => setCurrentTime(currentTime))
    ]

    return () => {
      subscriptions.forEach(unsub => unsub())
    }
  }, [props, wavesurfer])

  return (
    <div>
      <div ref={containerRef} />

      <button onClick={onPlayClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      <p>Seconds played: {currentTime}</p>
    </div>
  )
}

// Another React component that will render two wavesurfers
const App = () => {
  const urls = [
    'https://wavesurfer-js.org/example/media/demo.wav',
    'https://wavesurfer-js.org/example/media/stereo.mp3',
  ]
  const [audioUrl, setAudioUrl] = useState(urls[0])

  // Swap the audio URL
  const onUrlChange = useCallback(() => {
    urls.reverse()
    setAudioUrl(urls[0])
  }, [])

  // Render the wavesurfer component
  // and a button to load a different audio file
  return (
    <>
      <WaveSurferPlayer
        height={100}
        waveColor="rgb(200, 0, 200)"
        progressColor="rgb(100, 0, 100)"
        url={audioUrl}
      />

      <button onClick={onUrlChange}>
        Change audio
      </button>
    </>
  )
}

// Create a React root and render the app
const root = ReactDOM.createRoot(document.body)
root.render(jsx(App))
