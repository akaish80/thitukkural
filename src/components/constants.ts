const nav = [
  {
    text: 'Home',
    link: '/',
    isClicked: true,
  },
  
  {
    text: 'Learn Tamil',
    link: '',
    isClicked: false,
    children: [
      { text: 'Tamil Letters', link: '/tamil-letters', isClicked: false },
      { text: 'Tamil Numbers', link: '/tamil-numbers', isClicked: false },
      { text: 'Letter Exercise', link: '/letter-exercise', isClicked: false },
      { text: 'Image Recognition', link: '/learn-tamil/image-letter-recognition', isClicked: false },
      // { text: 'Printable Picture Chart', link: '/learn-tamil/picture-chart', isClicked: false },
      // { text: 'Practice Writing Tamil', link: '/practice', isClicked: false },
      { text: 'Draw Tamil Letters', link: '/draw-letter', isClicked: false },
      { text: 'Free-Type Tamil', link: '/free-type', isClicked: false },
    ],
  },
  {
    text: 'Learning Path',
    link: '',
    isClicked: false,
    children: [
      { text: 'Learning Path', link: '/learn', isClicked: false },
      { text: 'Planner', link: '/planner', isClicked: false },
      { text: 'Tamil Evaluation', link: '/tamil-evaluation', isClicked: false },
    ],
  },{
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
    text: 'Aathichudi',
    link: '/aathichudi',
    isClicked: false,
  }
];

export { nav };
