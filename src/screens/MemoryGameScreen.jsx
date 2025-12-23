import { useState, useEffect, useMemo, useCallback } from 'react'
import { createCards } from '../games/memory/shuffle'
import './MemoryGameScreen.css'

function MemoryGameScreen({ pairs, onComplete }) {
  const initialCards = useMemo(() => createCards(pairs), [pairs])
  
  const [cards, setCards] = useState(initialCards)
  const [flippedIds, setFlippedIds] = useState([])
  const [locked, setLocked] = useState(false)
  const [matchedCount, setMatchedCount] = useState(0)
  const [showComplete, setShowComplete] = useState(false)
  
  const totalPairs = pairs.length
  
  // Check for match when two cards are flipped
  useEffect(() => {
    if (flippedIds.length !== 2) return
    
    setLocked(true)
    
    const [id1, id2] = flippedIds
    const card1 = cards.find(c => c.id === id1)
    const card2 = cards.find(c => c.id === id2)
    
    if (card1.pairId === card2.pairId) {
      // Match!
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          c.id === id1 || c.id === id2 
            ? { ...c, state: 'MATCHED' } 
            : c
        ))
        setFlippedIds([])
        setLocked(false)
        setMatchedCount(prev => {
          const newCount = prev + 1
          if (newCount >= totalPairs) {
            setTimeout(() => setShowComplete(true), 500)
          }
          return newCount
        })
      }, 400)
    } else {
      // No match - flip back
      setTimeout(() => {
        setCards(prev => prev.map(c => 
          c.id === id1 || c.id === id2 
            ? { ...c, state: 'DOWN' } 
            : c
        ))
        setFlippedIds([])
        setLocked(false)
      }, 800)
    }
  }, [flippedIds, cards, totalPairs])
  
  const handleCardClick = useCallback((cardId) => {
    if (locked) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.state !== 'DOWN') return
    if (flippedIds.includes(cardId)) return
    if (flippedIds.length >= 2) return
    
    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, state: 'UP' } : c
    ))
    setFlippedIds(prev => [...prev, cardId])
  }, [locked, cards, flippedIds])
  
  const handleContinue = () => {
    onComplete()
  }
  
  // Calculate grid columns based on card count
  const gridCols = cards.length <= 8 ? 4 : cards.length <= 12 ? 4 : 4
  
  return (
    <div className="screen memory-game-screen">
      <div className="memory-content fade-in">
        <h2 className="memory-title">Match the Pairs!</h2>
        <p className="memory-instruction">Find all matching wedding icons</p>
        
        <div className="memory-progress">
          {matchedCount} / {totalPairs} pairs matched
        </div>
        
        {/* Card grid */}
        <div 
          className="memory-grid"
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
        >
          {cards.map(card => (
            <button
              key={card.id}
              className={`memory-card ${card.state.toLowerCase()}`}
              onClick={() => handleCardClick(card.id)}
              disabled={card.state !== 'DOWN' || locked}
              aria-label={card.state === 'DOWN' ? 'Hidden card' : card.label}
            >
              <div className="card-inner">
                <div className="card-front">
                  <img src="/assets/icons/heart-rose.svg" alt="" />
                </div>
                <div className="card-back">
                  <img src={card.iconPath} alt={card.label} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Completion overlay */}
      {showComplete && (
        <div className="reward-overlay fade-in">
          <div className="reward-card card">
            <span className="reward-emoji">🎊</span>
            <h3>You Did It!</h3>
            <p>All pairs matched! Your invitation awaits...</p>
            <button className="btn-primary" onClick={handleContinue}>
              See Invitation 💌
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemoryGameScreen
