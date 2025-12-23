import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import './FinalInvitationScreen.css'

function FinalInvitationScreen({ config, onReplay }) {
  const { couple, event, assets, share } = config
  const [showGallery, setShowGallery] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  
  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration
    
    const colors = ['#e8b4b8', '#d4919a', '#c9a227', '#f8e8e8']
    
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      })
      
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    
    frame()
  }, [])
  
  // Generate WhatsApp share message
  const generateShareMessage = () => {
    const message = `You're invited to ${couple.partner1} & ${couple.partner2}'s wedding! 💕

📅 Date: ${event.dateLabel}
⏰ Time: ${event.timeLabel}
📍 Venue: ${event.venueName}
👗 Dress Code: ${event.dressCode}

🎮 Play our invitation game: ${share.gameUrl}

💌 RSVP: ${event.rsvpUrl}

See you there! 🎉`
    
    return encodeURIComponent(message)
  }
  
  const whatsappLink = `https://wa.me/?text=${generateShareMessage()}`

  const gallery = Array.isArray(assets.gallery) && assets.gallery.length > 0
    ? assets.gallery
    : (Array.isArray(assets.couplePhotos) ? assets.couplePhotos : []).map((src, idx) => ({
        src,
          caption: `Memory ${idx + 1}` // simple, avoids new UX/content
      }))
  
  const nextPhoto = () => {
    setCurrentPhoto((prev) => (prev + 1) % gallery.length)
  }
  
  const prevPhoto = () => {
    setCurrentPhoto((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  const openGallery = () => {
    setCurrentPhoto(0)
    setShowGallery(true)
  }
  
  return (
    <div className="screen final-screen">
      <div className="invitation-card card fade-in">
        {/* Header */}
        <div className="invitation-header">
          <span className="invitation-emoji">💍</span>
          <p className="invitation-tagline">You're Invited!</p>
        </div>
        
        {/* Couple names */}
        <h1 className="couple-names">
          {couple.partner1} <span className="ampersand">&</span> {couple.partner2}
        </h1>
        
        <p className="invitation-subtitle">request the pleasure of your company</p>
        
        {/* Details */}
        <div className="invitation-details">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <div>
              <span className="detail-label">Date</span>
              <span className="detail-value">{event.dateLabel}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">⏰</span>
            <div>
              <span className="detail-label">Time</span>
              <span className="detail-value">{event.timeLabel}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <div>
              <span className="detail-label">Venue</span>
              <span className="detail-value">{event.venueName}</span>
              {event.venueAddress && (
                <span className="detail-address">{event.venueAddress}</span>
              )}
            </div>
          </div>
          
          <div className="detail-item">
            <span className="detail-icon">👗</span>
            <div>
              <span className="detail-label">Dress Code</span>
              <span className="detail-value">{event.dressCode}</span>
            </div>
          </div>
        </div>
        
        {/* RSVP button */}
        <a 
          href={event.rsvpUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary rsvp-button"
        >
          RSVP Now 💌
        </a>
        
        {/* Actions */}
        <div className="invitation-actions">
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary share-button"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </a>
          
          <button className="btn-secondary replay-button" onClick={onReplay}>
            🔄 Play Again
          </button>
        </div>
        
        {/* View Gallery button */}
        {gallery.length > 0 && (
          <button 
            className="btn-primary gallery-button" 
            onClick={openGallery}
          >
            📸 View Our Memories
          </button>
        )}
        
        {/* Couple photo (optional) */}
        {assets.couplePhotos?.[0] && (
          <div className="couple-photo">
            <img src={assets.couplePhotos[0]} alt={`${couple.partner1} and ${couple.partner2}`} />
          </div>
        )}
      </div>
      
      {/* Photo Gallery Modal */}
      {showGallery && gallery.length > 0 && (
        <div className="gallery-overlay" onClick={() => setShowGallery(false)}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gallery-close" onClick={() => setShowGallery(false)}>
              ✕
            </button>
            
            <h3 className="gallery-title">Our Sweet Memories 💕</h3>
            
            <div className="gallery-content">
              <button className="gallery-nav prev" onClick={prevPhoto}>
                ‹
              </button>
              
              <div className="gallery-photo-container">
                <img 
                  src={gallery[currentPhoto].src} 
                  alt={gallery[currentPhoto].caption}
                  className="gallery-photo"
                />
                <p className="gallery-caption">{gallery[currentPhoto].caption}</p>
              </div>
              
              <button className="gallery-nav next" onClick={nextPhoto}>
                ›
              </button>
            </div>
            
            <div className="gallery-dots">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  className={`gallery-dot ${idx === currentPhoto ? 'active' : ''}`}
                  onClick={() => setCurrentPhoto(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinalInvitationScreen
