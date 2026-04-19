const nav = [
  {
    text: 'Home',
    link: '/',
    isClicked: true,
  },
  {
    text: 'Thirukkural',
    link: '',
    isClicked: false,
    children: [
      { text: 'Kurral', link: '/kurral', isClicked: false },
      { text: 'Explore Kurral', link: '/kurral/explore', isClicked: false },
      { text: 'Exercise Kurral', link: '/kurral/exercise', isClicked: false },
    ],
  },
  {
    text: 'Tamil Letter',
    link: '',
    isClicked: false,
    children: [
      { text: 'Tamil Letters', link: '/tamil-letters', isClicked: false },
      { text: 'Letter Exercise', link: '/letter-exercise', isClicked: false },
      // { text: 'Practice Writing Tamil', link: '/practice', isClicked: false },
      { text: 'Draw Tamil Letters', link: '/draw-letter', isClicked: false },
      { text: 'Free-Type Tamil', link: '/free-type', isClicked: false },
    ],
  },
  {
    text: 'Aathichudi',
    link: '/aathichudi',
    isClicked: false,
  }
];

export { nav };
