import './IntroScreen.css'

function IntroScreen({ guestName, couple, onStart }) {
  return (
    <div className="screen intro-screen">
      <div className="intro-content fade-in">
        {/* Heart icon */}
        <div className="intro-heart float">
          <img src="/assets/icons/heart-rose.svg" alt="" />
        </div>
        
        {/* Welcome message */}
        {guestName && (
          <p className="intro-greeting">Welcome, {guestName}! 💕</p>
        )}
        
        <h1 className="intro-title">
          {couple.partner1} & {couple.partner2}
        </h1>
        
        <p className="intro-subtitle">
          You're invited to celebrate our love!
        </p>
        
        <p className="intro-description">
          Play this fun game to reveal our wedding invitation!
        </p>
        
        {/* Start button */}
        <button className="btn-primary pulse" onClick={onStart}>
          Start the Journey 💍
        </button>
        
        <p className="intro-hint">3 quick games await...</p>
      </div>
    </div>
  )
}

export default IntroScreen
