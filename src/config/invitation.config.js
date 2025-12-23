// Mock wedding data - replace with your actual details
export const config = {
  couple: {
    partner1: "Aditi Verma",
    partner2: "Ashish Soni"
  },
  families: {
    brideParents: "Mr Awadhesh Narain Verma & Mrs Mintu Verma",
    groomParents: "Mr Subhash Ji Seth & Mrs Kiran Soni"
  },
  event: {
    dateLabel: "Friday, 20 February 2026",
    timeLabel: "7 PM",
    venueName: "Narayan Vatika",
    venueAddress: "345, 239, Mutthi Ganj, Prayagraj, Uttar Pradesh, 211003",
    dressCode: "Indian Party Dress",
    locationUrl: "https://maps.app.goo.gl/p4TPhi5oSYwdQGhe9",
    contacts: [
      { name: "Awadhesh Narain Verma (Pappu Ji)", phones: ["+91 9415233098", "+91 7355905285"] }
    ],
    rsvpUrl: "https://wa.me/918318172041"
  },
  wordPuzzle: {
    words: ["ADITI", "ASHISH", "LOVE", "WEDDING"],
    gridSize: 10,
    allowDiagonal: false
  },
  tapHearts: {
    reveals: [
      { key: "VENUE", label: "Venue", value: "Narayan Vatika" },
      { key: "TIME", label: "Time", value: "7 PM" },
      { key: "DRESS", label: "Dress Code", value: "Indian Party Dress" },
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
    gameUrl: "https://aditi-ashish.wedding",
    whatsappNumber: "918318172041"
  },
  assets: {
    backgroundMusic: "/assets/audio/romantic-bg.mp3",
    coupleIllustration: "/assets/images/couple-art-colour-e7928d-indian-dressed.png",
    coupleIllustration2: "/assets/images/couple-art-colour-658482-indian-dressed.png",
    couplePhotos: [
      "/assets/images/couple-art-colour-e7928d-indian-dressed.png",
      "/assets/images/couple-art-colour-658482-indian-dressed.png"
    ],
    // Gallery - Couple illustrations
    gallery: [
      { src: "/assets/images/couple-art-colour-e7928d-indian-dressed.png", caption: "Aditi & Ashish 💕" },
      { src: "/assets/images/couple-art-colour-658482-indian-dressed.png", caption: "Together Forever 💍" }
    ]
  }
};
