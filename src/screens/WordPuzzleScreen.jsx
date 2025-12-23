import { useState, useEffect, useMemo } from 'react'
import { generateGrid, validateSelection, getWordCells } from '../games/wordPuzzle/generator'
import './WordPuzzleScreen.css'

function WordPuzzleScreen({ config, dateLabel, onComplete }) {
  const { words, gridSize, allowDiagonal } = config
  
  // Generate grid once
  const { grid, placed } = useMemo(() => {
    return generateGrid(words, gridSize, allowDiagonal)
  }, [])
  
  const [found, setFound] = useState(new Set())
  const [selection, setSelection] = useState({ start: null, end: null })
  const [showReward, setShowReward] = useState(false)
  const [highlightedCells, setHighlightedCells] = useState(new Set())
  
  // Build set of highlighted cell keys
  useEffect(() => {
    const cells = new Set()
    for (const word of found) {
      const placedWord = placed.find(p => p.word === word)
      if (placedWord) {
        for (const cell of getWordCells(placedWord)) {
          cells.add(`${cell.row}-${cell.col}`)
        }
      }
    }
    setHighlightedCells(cells)
  }, [found, placed])
  
  const handleCellClick = (row, col) => {
    if (showReward) return
    
    if (!selection.start) {
      setSelection({ start: { row, col }, end: null })
    } else if (!selection.end) {
      const newSelection = { ...selection, end: { row, col } }
      setSelection(newSelection)
      
      // Validate
      const foundWord = validateSelection(newSelection.start, newSelection.end, placed, found)
      
      if (foundWord) {
        setFound(prev => new Set([...prev, foundWord]))
        
        // Check if all words found
        if (found.size + 1 === words.length) {
          setTimeout(() => setShowReward(true), 500)
        }
      }
      
      // Reset selection after short delay
      setTimeout(() => {
        setSelection({ start: null, end: null })
      }, 300)
    }
  }
  
  const isSelected = (row, col) => {
    if (selection.start?.row === row && selection.start?.col === col) return true
    if (selection.end?.row === row && selection.end?.col === col) return true
    return false
  }
  
  const handleContinue = () => {
    onComplete()
  }

  const handleSkip = () => {
    setFound(new Set(words.map(w => w.toUpperCase())))
    setSelection({ start: null, end: null })
    setShowReward(true)
  }
  
  return (
    <div className="screen word-puzzle-screen">
      <div className="word-puzzle-content fade-in">
        <div className="skip-row">
          <button className="btn-secondary" onClick={handleSkip}>
            Skip
          </button>
        </div>
        <h2 className="word-puzzle-title">Find the Words!</h2>
        <p className="word-puzzle-instruction">
          Tap the first and last letter of each word
        </p>
        
        {/* Word list */}
        <div className="word-list">
          {words.map(word => (
            <span
              key={word}
              className={`word-item ${found.has(word.toUpperCase()) ? 'found' : ''}`}
            >
              {word}
            </span>
          ))}
        </div>
        
        {/* Grid */}
        <div 
          className="word-grid"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`
          }}
        >
          {grid.map((row, r) =>
            row.map((char, c) => (
              <button
                key={`${r}-${c}`}
                className={`grid-cell 
                  ${isSelected(r, c) ? 'selected' : ''} 
                  ${highlightedCells.has(`${r}-${c}`) ? 'highlighted' : ''}`
                }
                onClick={() => handleCellClick(r, c)}
              >
                {char}
              </button>
            ))
          )}
        </div>
        
        {/* Reward overlay */}
        {showReward && (
          <div className="reward-overlay fade-in">
            <div className="reward-card card">
              <span className="reward-emoji">🎉</span>
              <h3>Amazing!</h3>
              <p>You unlocked the wedding date:</p>
              <p className="reward-date">{dateLabel}</p>
              <button className="btn-primary" onClick={handleContinue}>
                Continue →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WordPuzzleScreen
