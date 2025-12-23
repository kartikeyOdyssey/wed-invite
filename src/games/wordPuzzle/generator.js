// Word puzzle generator - places words in a grid
export function generateGrid(words, gridSize, allowDiagonal = false) {
  // Normalize words
  const normalizedWords = words.map(w => w.toUpperCase().replace(/\s/g, ''))
  
  // Create empty grid
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''))
  
  // Directions: horizontal, vertical, (optional diagonal)
  const directions = [
    { dr: 0, dc: 1, name: 'right' },
    { dr: 1, dc: 0, name: 'down' },
    { dr: 0, dc: -1, name: 'left' },
    { dr: -1, dc: 0, name: 'up' }
  ]
  
  if (allowDiagonal) {
    directions.push(
      { dr: 1, dc: 1, name: 'diag-down-right' },
      { dr: 1, dc: -1, name: 'diag-down-left' },
      { dr: -1, dc: 1, name: 'diag-up-right' },
      { dr: -1, dc: -1, name: 'diag-up-left' }
    )
  }
  
  const placed = []
  
  // Sort words by length (longest first for better placement)
  const sortedWords = [...normalizedWords].sort((a, b) => b.length - a.length)
  
  for (const word of sortedWords) {
    let wordPlaced = false
    const maxAttempts = 100
    
    for (let attempt = 0; attempt < maxAttempts && !wordPlaced; attempt++) {
      const dir = directions[Math.floor(Math.random() * directions.length)]
      
      // Calculate valid start positions
      const maxRow = gridSize - (dir.dr > 0 ? word.length : 1) - (dir.dr < 0 ? word.length - 1 : 0)
      const maxCol = gridSize - (dir.dc > 0 ? word.length : 1) - (dir.dc < 0 ? word.length - 1 : 0)
      const minRow = dir.dr < 0 ? word.length - 1 : 0
      const minCol = dir.dc < 0 ? word.length - 1 : 0
      
      if (maxRow < minRow || maxCol < minCol) continue
      
      const startRow = minRow + Math.floor(Math.random() * (maxRow - minRow + 1))
      const startCol = minCol + Math.floor(Math.random() * (maxCol - minCol + 1))
      
      // Check if word fits
      let canPlace = true
      const positions = []
      
      for (let i = 0; i < word.length; i++) {
        const r = startRow + i * dir.dr
        const c = startCol + i * dir.dc
        
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
          canPlace = false
          break
        }
        
        const existing = grid[r][c]
        if (existing !== '' && existing !== word[i]) {
          canPlace = false
          break
        }
        
        positions.push({ row: r, col: c, char: word[i] })
      }
      
      if (canPlace) {
        // Place the word
        for (const pos of positions) {
          grid[pos.row][pos.col] = pos.char
        }
        
        placed.push({
          word,
          start: { row: startRow, col: startCol },
          end: { row: startRow + (word.length - 1) * dir.dr, col: startCol + (word.length - 1) * dir.dc },
          direction: dir
        })
        
        wordPlaced = true
      }
    }
    
    if (!wordPlaced) {
      console.warn(`Could not place word: ${word}`)
    }
  }
  
  // Fill empty cells with random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)]
      }
    }
  }
  
  return { grid, placed }
}

// Validate a selection (start and end cells)
export function validateSelection(start, end, placed, found) {
  if (!start || !end) return null
  if (start.row === end.row && start.col === end.col) return null
  
  for (const p of placed) {
    if (found.has(p.word)) continue
    
    // Check forward direction
    if (
      start.row === p.start.row && start.col === p.start.col &&
      end.row === p.end.row && end.col === p.end.col
    ) {
      return p.word
    }
    
    // Check reverse direction
    if (
      start.row === p.end.row && start.col === p.end.col &&
      end.row === p.start.row && end.col === p.start.col
    ) {
      return p.word
    }
  }
  
  return null
}

// Get all cells for a placed word
export function getWordCells(placedWord) {
  const cells = []
  const { start, end, direction, word } = placedWord
  
  for (let i = 0; i < word.length; i++) {
    cells.push({
      row: start.row + i * direction.dr,
      col: start.col + i * direction.dc
    })
  }
  
  return cells
}
