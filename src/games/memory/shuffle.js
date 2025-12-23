// Shuffle array using Fisher-Yates
export function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Create card pairs from icons
export function createCards(pairs) {
  const cards = []
  
  for (const pair of pairs) {
    // Create two cards for each pair
    cards.push({
      id: `${pair.id}-a`,
      pairId: pair.id,
      iconPath: pair.iconPath,
      label: pair.label,
      state: 'DOWN'
    })
    cards.push({
      id: `${pair.id}-b`,
      pairId: pair.id,
      iconPath: pair.iconPath,
      label: pair.label,
      state: 'DOWN'
    })
  }
  
  return shuffle(cards)
}
