// Mock wedding data - replace with your actual details
export const config = {
  couple: {
    partner1: "Priya",
    partner2: "Arjun"
  },
  event: {
    dateLabel: "12 February 2026",
    timeLabel: "6:30 PM onwards",
    venueName: "The Grand Palace",
    venueAddress: "123 Royal Gardens, Mumbai",
    dressCode: "Pastel / Indian Festive",
    rsvpUrl: "https://forms.google.com/your-rsvp-form"
  },
  wordPuzzle: {
    words: ["PRIYA", "ARJUN", "LOVE", "WEDDING"],
    gridSize: 10,
    allowDiagonal: false
  },
  tapHearts: {
    reveals: [
      { key: "VENUE", label: "Venue", value: "The Grand Palace" },
      { key: "TIME", label: "Time", value: "6:30 PM onwards" },
      { key: "DRESS", label: "Dress Code", value: "Pastel / Indian Festive" },
      { key: "RSVP", label: "RSVP Hint", value: "Link at the end! 💌" }
    ]
  },
  memoryGame: {
    pairs: [
      { id: "rings", iconPath: "/assets/icons/rings.svg", label: "Rings" },
      { id: "cake", iconPath: "/assets/icons/cake.svg", label: "Cake" },
      { id: "flowers", iconPath: "/assets/icons/flowers.svg", label: "Flowers" },
      { id: "heart", iconPath: "/assets/icons/heart-rose.svg", label: "Heart" },
      { id: "toast", iconPath: "/assets/icons/toast.svg", label: "Toast" },
      { id: "invitation", iconPath: "/assets/icons/invitation.svg", label: "Card" }
    ]
  },
  share: {
    gameUrl: "https://priya-arjun.wedding"
  },
  assets: {
    backgroundMusic: "/assets/audio/romantic-bg.mp3",
    couplePhotos: [
      "/assets/images/couple-1.jpg",
      "/assets/images/couple-2.jpg"
    ],
    // Gallery - Sweet memories photos
    gallery: [
      { src: "/assets/images/couple-1.jpg", caption: "Our first date 💕" },
      { src: "/assets/images/couple-2.jpg", caption: "The proposal day 💍" },
      { src: "/assets/images/couple-1.jpg", caption: "Engagement party 🎉" },
      { src: "/assets/images/couple-2.jpg", caption: "Pre-wedding shoot 📸" }
    ]
  }
};
