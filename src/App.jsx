import { useState, useEffect, useRef } from 'react'
import { config } from './config/invitation.config'
import IntroScreen from './screens/IntroScreen'
import WordPuzzleScreen from './screens/WordPuzzleScreen'
import TapHeartsScreen from './screens/TapHeartsScreen'
import MemoryGameScreen from './screens/MemoryGameScreen'
import FinalInvitationScreen from './screens/FinalInvitationScreen'
import MusicToggle from './ui/MusicToggle'
import './styles/App.css'

const SCREENS = {
  INTRO: 'INTRO',
  WORD: 'WORD',
  HEARTS: 'HEARTS',
  MEMORY: 'MEMORY',
  FINAL: 'FINAL'
}

const STORAGE_KEY = 'unlock-our-love-progress'

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {}
  
  return {
    screen: SCREENS.INTRO,
    musicEnabled: true,
    completed: {
      wordPuzzle: false,
      tapHearts: false,
      memory: false
    }
  }
}

function App() {
  const [state, setState] = useState(getInitialState)
  const audioRef = useRef(null)
  
  // Get guest name from URL
  const urlParams = new URLSearchParams(window.location.search)
  const guestName = urlParams.get('name')
  
  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])
  
  // Handle background music
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(config.assets.backgroundMusic)
      audioRef.current.loop = true
      audioRef.current.volume = 0.3
    }
    
    if (state.musicEnabled) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked - will play on first user interaction
      })
    } else {
      audioRef.current.pause()
    }
  }, [state.musicEnabled])
  
  // Try to start music on first user interaction (for browsers that block autoplay)
  useEffect(() => {
    const tryPlayMusic = () => {
      if (state.musicEnabled && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
      }
      document.removeEventListener('click', tryPlayMusic)
      document.removeEventListener('touchstart', tryPlayMusic)
    }
    
    document.addEventListener('click', tryPlayMusic)
    document.addEventListener('touchstart', tryPlayMusic)
    
    return () => {
      document.removeEventListener('click', tryPlayMusic)
      document.removeEventListener('touchstart', tryPlayMusic)
    }
  }, [state.musicEnabled])
  
  const goToScreen = (screen) => {
    setState(s => ({ ...s, screen }))
  }
  
  const completeLevel = (level) => {
    setState(s => ({
      ...s,
      completed: { ...s.completed, [level]: true }
    }))
  }
  
  const toggleMusic = () => {
    setState(s => ({ ...s, musicEnabled: !s.musicEnabled }))
  }
  
  const replay = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState({
      screen: SCREENS.INTRO,
      musicEnabled: state.musicEnabled,
      completed: {
        wordPuzzle: false,
        tapHearts: false,
        memory: false
      }
    })
  }
  
  const renderScreen = () => {
    switch (state.screen) {
      case SCREENS.INTRO:
        return (
          <IntroScreen
            guestName={guestName}
            couple={config.couple}
            onStart={() => goToScreen(SCREENS.WORD)}
          />
        )
      
      case SCREENS.WORD:
        return (
          <WordPuzzleScreen
            config={config.wordPuzzle}
            dateLabel={config.event.dateLabel}
            onComplete={() => {
              completeLevel('wordPuzzle')
              goToScreen(SCREENS.HEARTS)
            }}
          />
        )
      
      case SCREENS.HEARTS:
        return (
          <TapHeartsScreen
            reveals={config.tapHearts.reveals}
            onComplete={() => {
              completeLevel('tapHearts')
              goToScreen(SCREENS.MEMORY)
            }}
          />
        )
      
      case SCREENS.MEMORY:
        return (
          <MemoryGameScreen
            pairs={config.memoryGame.pairs}
            onComplete={() => {
              completeLevel('memory')
              goToScreen(SCREENS.FINAL)
            }}
          />
        )
      
      case SCREENS.FINAL:
        return (
          <FinalInvitationScreen
            config={config}
            onReplay={replay}
          />
        )
      
      default:
        return null
    }
  }
  
  const getLevelNumber = () => {
    switch (state.screen) {
      case SCREENS.WORD: return 'Level 1 of 3'
      case SCREENS.HEARTS: return 'Level 2 of 3'
      case SCREENS.MEMORY: return 'Level 3 of 3'
      default: return null
    }
  }
  
  const levelNum = getLevelNumber()
  
  return (
    <div className="app">
      {/* Corner decorations */}
      <img src="/assets/images/floral-corner-tl.svg" className="corner-decor top-left" alt="" />
      <img src="/assets/images/floral-corner-tr.svg" className="corner-decor top-right" alt="" />
      <img src="/assets/images/floral-corner.svg" className="corner-decor bottom-left" alt="" />
      <img src="/assets/images/floral-corner-br.svg" className="corner-decor bottom-right" alt="" />
      
      {/* Music toggle */}
      <MusicToggle enabled={state.musicEnabled} onToggle={toggleMusic} />
      
      {/* Level indicator */}
      {levelNum && <div className="level-indicator">{levelNum}</div>}
      
      {/* Current screen */}
      {renderScreen()}
    </div>
  )
}

export default App
