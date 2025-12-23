import { useState, useEffect } from 'react'
import './TapHeartsScreen.css'

function TapHeartsScreen({ reveals, onComplete }) {
  const [hearts, setHearts] = useState([])
  const [tappedCount, setTappedCount] = useState(0)
  const [currentReveal, setCurrentReveal] = useState(null)
  const [showComplete, setShowComplete] = useState(false)
  
  // Initialize hearts with random positions
  useEffect(() => {
    const initialHearts = reveals.map((reveal, i) => ({
      id: i,
      reveal,
      x: 15 + Math.random() * 60, // 15-75% from left
      y: 20 + Math.random() * 50, // 20-70% from top
      size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)],
      delay: i * 0.3,
      tapped: false
    }))
    setHearts(initialHearts)
  }, [reveals])
  
  const handleHeartTap = (heartId) => {
    const heart = hearts.find(h => h.id === heartId)
    if (!heart || heart.tapped) return
    
    // Mark as tapped
    setHearts(prev => prev.map(h => 
      h.id === heartId ? { ...h, tapped: true } : h
    ))
    
    // Show reveal
    setCurrentReveal(heart.reveal)
    setTappedCount(prev => prev + 1)
  }
  
  const handleCloseReveal = () => {
    setCurrentReveal(null)
    
    // Check if all hearts tapped
    if (tappedCount >= reveals.length) {
      setTimeout(() => setShowComplete(true), 300)
    }
  }
  
  const handleContinue = () => {
    onComplete()
  }

  const handleSkip = () => {
    setCurrentReveal(null)
    setHearts(prev => prev.map(h => ({ ...h, tapped: true })))
    setTappedCount(reveals.length)
    setShowComplete(true)
  }
  
  return (
    <div className="screen tap-hearts-screen">
      <div className="tap-hearts-header fade-in">
        <h2>Tap the Hearts!</h2>
        <p>Each heart reveals a special detail 💕</p>
        <div className="tap-progress">
          {tappedCount} / {reveals.length} revealed
        </div>

        <div className="skip-row">
          <button className="btn-secondary" onClick={handleSkip}>
            Skip
          </button>
        </div>
      </div>
      
      {/* Floating hearts */}
      <div className="hearts-container">
        {hearts.map(heart => (
          <button
            key={heart.id}
            className={`floating-heart ${heart.size} ${heart.tapped ? 'tapped' : ''}`}
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              animationDelay: `${heart.delay}s`
            }}
            onClick={() => handleHeartTap(heart.id)}
            disabled={heart.tapped}
            aria-label={`Tap to reveal ${heart.reveal.label}`}
          >
            <img src="/assets/icons/heart-rose.svg" alt="" />
          </button>
        ))}
      </div>
      
      {/* Reveal list */}
      <div className="reveals-list fade-in">
        {hearts.filter(h => h.tapped).map(h => (
          <div key={h.id} className="reveal-item card">
            <span className="reveal-label">{h.reveal.label}:</span>
            <span className="reveal-value">{h.reveal.value}</span>
          </div>
        ))}
      </div>
      
      {/* Current reveal popup */}
      {currentReveal && (
        <div className="reveal-popup-overlay" onClick={handleCloseReveal}>
          <div className="reveal-popup card fade-in" onClick={e => e.stopPropagation()}>
            <span className="reveal-emoji">✨</span>
            <h3>{currentReveal.label}</h3>
            <p className="reveal-popup-value">{currentReveal.value}</p>
            <button className="btn-secondary" onClick={handleCloseReveal}>
              Got it!
            </button>
          </div>
        </div>
      )}
      
      {/* Completion overlay */}
      {showComplete && (
        <div className="reward-overlay fade-in">
          <div className="reward-card card">
            <span className="reward-emoji">💖</span>
            <h3>All Details Revealed!</h3>
            <p>You're doing great! One more game to go...</p>
            <button className="btn-primary" onClick={handleContinue}>
              Continue →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TapHeartsScreen
