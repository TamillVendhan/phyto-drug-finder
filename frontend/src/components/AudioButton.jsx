import { useState } from "react";

export default function AudioButton({ text, label }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  return (
    <button 
      onClick={speak} 
      className={`audio-btn ${speaking ? "speaking" : ""}`}
      title={`Listen to ${label}`}
    >
      {speaking ? "🔊" : "🔈"} {label}
    </button>
  );
}