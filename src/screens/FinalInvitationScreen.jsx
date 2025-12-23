import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import './FinalInvitationScreen.css'

function FinalInvitationScreen({ config, onReplay }) {
  const { couple, event, assets, share, families } = config
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
    const contactLines = Array.isArray(event.contacts)
      ? event.contacts
          .map(c => {
            const phones = Array.isArray(c.phones) ? c.phones.join(', ') : ''
            return `${c.name}${phones ? `: ${phones}` : ''}`
          })
          .filter(Boolean)
          .join('\n')
      : ''

    const dressLine = event.dressCode ? `👗 Dress Code: ${event.dressCode}\n` : ''
    const message = `Wedding Invitation 💍\n\n${couple.partner1} & ${couple.partner2}\n\n📅 Date: ${event.dateLabel}\n⏰ Time: ${event.timeLabel}\n📍 Venue: ${event.venueName}\n${event.venueAddress ? `🏠 Address: ${event.venueAddress}\n` : ''}${event.locationUrl ? `🗺️ Location: ${event.locationUrl}\n` : ''}${dressLine}\n🎮 Invitation game: ${share.gameUrl}${contactLines ? `\n\n☎️ Contact:\n${contactLines}` : ''}`
    
    return encodeURIComponent(message)
  }

  const whatsappNumber = share?.whatsappNumber
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${generateShareMessage()}`
    : `https://wa.me/?text=${generateShareMessage()}`

  const generateRsvpMessage = () => {
    const message = `Hi Aditi, main bahut excited hoon aur main party mein aa raha/rahi hoon! RSVP confirmed for ${couple.partner1} & ${couple.partner2}.`
    return encodeURIComponent(message)
  }

  const rsvpLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${generateRsvpMessage()}`
    : event.rsvpUrl

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
        {/* Couple Illustration at top */}
        <div className="invitation-illustration">
          <img src="/assets/images/couple-art-colour-658482-indian-dressed.png" alt="Aditi & Ashish" />
        </div>

        {/* Header */}
        <div className="invitation-header">
          <p className="invitation-tagline">Wedding Invitation 💍</p>
        </div>

        {/* Family names first */}
        {(families?.brideParents || families?.groomParents) && (
          <div className="families">
            {families?.brideParents && (
              <p className="family-line">{families.brideParents}</p>
            )}
            <p className="family-line-small">cordially invite you to celebrate the marriage of their daughter</p>
          </div>
        )}
        
        {/* Couple names */}
        <h1 className="couple-names">
          {couple.partner1} <span className="ampersand">&</span> {couple.partner2}
        </h1>

        {families?.groomParents && (
          <div className="families">
            <p className="family-line-small">son of</p>
            <p className="family-line">{families.groomParents}</p>
          </div>
        )}
        
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
              {event.locationUrl && (
                <a
                  href={event.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-location-inline"
                >
                  📍 Open Location
                </a>
              )}
            </div>
          </div>

          {event.dressCode && (
            <div className="detail-item">
              <span className="detail-icon">👗</span>
              <div>
                <span className="detail-label">Dress Code</span>
                <span className="detail-value">{event.dressCode}</span>
              </div>
            </div>
          )}

          {Array.isArray(event.contacts) && event.contacts.length > 0 && (
            <div className="detail-item">
              <span className="detail-icon">☎️</span>
              <div>
                <span className="detail-label">Contact</span>
                {event.contacts.map((c) => (
                  <div key={c.name} className="contact-entry">
                    <span className="detail-value">{c.name}</span>
                    {Array.isArray(c.phones) && c.phones.length > 0 && (
                      <div className="contact-phones">
                        {c.phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone.replace(/\s/g, '')}`}
                            className="btn-call"
                          >
                            📞 {phone}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* RSVP button */}
        <a 
          href={rsvpLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary rsvp-button"
        >
          💬 Talk with Aditi
        </a>
        
        {/* Actions */}
        <div className="invitation-actions">
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
