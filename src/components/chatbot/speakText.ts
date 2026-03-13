// Utility to handle speech synthesis for the chatbot
export function speakText(text: string) {
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = 'ta-IN'; // Tamil
    window.speechSynthesis.speak(utter);
  }
}