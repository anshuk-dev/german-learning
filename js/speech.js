// ==============================================================================
// BLITZDEUTSCH SPEECH & AUDIO ENGINE
// German Speech Synthesis (TTS) & Web Speech Recognition (Mic Pronunciation Check)
// ==============================================================================

const SpeechEngine = {
  synth: window.speechSynthesis || null,
  germanVoice: null,
  rate: 0.9, // Default comfortable learner speed
  pitch: 1.0,
  recognition: null,
  isListening: false,

  init() {
    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
    this.initRecognition();
  },

  loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural German voices
    this.germanVoice = voices.find(v => v.lang === 'de-DE' || v.lang.startsWith('de')) || null;
  },

  speak(text, speedOverride = null) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean text of articles or grammar annotations if needed for natural utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = speedOverride !== null ? speedOverride : this.rate;
    utterance.pitch = this.pitch;

    if (this.germanVoice) {
      utterance.voice = this.germanVoice;
    }

    this.synth.speak(utterance);
  },

  setSpeed(newRate) {
    this.rate = parseFloat(newRate);
  },

  // --------------------------------------------------------------------------
  // Pronunciation Evaluation via Web Speech Recognition
  // --------------------------------------------------------------------------
  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) {
      console.info('Web Speech Recognition API is not supported in this browser environment.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'de-DE';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 3;
  },

  listenAndVerify(targetPhrase, onResultCallback, onEndCallback, onErrorCallback) {
    if (!this.recognition) {
      if (onErrorCallback) onErrorCallback('Speech recognition is supported on Chrome, Edge, and Safari with microphone access.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      return;
    }

    this.isListening = true;

    this.recognition.onstart = () => {
      console.log('Listening for German speech...');
    };

    this.recognition.onresult = (event) => {
      this.isListening = false;
      const transcript = event.results[0][0].transcript.trim();
      const confidence = event.results[0][0].confidence;
      
      // Calculate match score
      const cleanTarget = targetPhrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();
      const cleanSpoken = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();

      const isExactMatch = cleanTarget === cleanSpoken;
      const isSubMatch = cleanTarget.includes(cleanSpoken) || cleanSpoken.includes(cleanTarget);
      
      let score = 0;
      if (isExactMatch) score = 100;
      else if (isSubMatch) score = 85;
      else {
        // Simple Levenshtein distance similarity calculation
        score = Math.max(0, Math.round((1 - SpeechEngine.levenshtein(cleanTarget, cleanSpoken) / Math.max(cleanTarget.length, cleanSpoken.length)) * 100));
      }

      if (onResultCallback) {
        onResultCallback({
          spoken: transcript,
          target: targetPhrase,
          score: score,
          confidence: confidence,
          isPass: score >= 75
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onErrorCallback) onErrorCallback(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEndCallback) onEndCallback();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error(e);
      this.isListening = false;
    }
  },

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
};

// Auto initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    SpeechEngine.init();
  });
}
