// ==============================================================================
// BLITZDEUTSCH BULLETPROOF SPEECH & AUDIO ENGINE (DUAL-ENGINE)
// Native German Audio Stream + Web Speech Synthesis Fallback + Visual Audio Dock
// ==============================================================================

const SpeechEngine = {
  synth: window.speechSynthesis || null,
  germanVoice: null,
  rate: 0.9, // Default comfortable learner speed
  pitch: 1.0,
  audioElement: null,
  currentAudioUrl: null,
  lastSpokenText: '',
  isPlaying: false,
  recognition: null,
  isListening: false,
  audioMode: 'native', // 'native' (High-Def Google Stream) or 'synth' (Browser TTS)

  init() {
    // 1. Initialize Browser Speech Synthesis & Voices
    if (this.synth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }

    // 2. Initialize Single Audio Element for instant responsive playback
    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateAudioDock(true);
    });

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.updateAudioDock(false);
      this.clearActiveWordHighlight();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Native audio stream error, falling back to Browser SpeechSynthesis:', e);
      this.isPlaying = false;
      // Immediate fallback to speech synthesis if audio stream fails
      if (this.lastSpokenText) {
        this.speakWithSynth(this.lastSpokenText);
      }
    });

    // 3. Unlock Web Audio & Speech on first user interaction
    const unlockAudio = () => {
      if (this.synth && this.synth.paused) {
        this.synth.resume();
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    // 4. Initialize Web Speech Recognition
    this.initRecognition();

    // 5. Create Audio Dock UI in DOM
    this.createAudioDock();
  },

  loadVoices() {
    if (!this.synth) return;
    try {
      const voices = this.synth.getVoices();
      // Look for de-DE or any German voice
      this.germanVoice = voices.find(v => v.lang === 'de-DE') || 
                         voices.find(v => v.lang.startsWith('de')) || null;
    } catch (e) {
      console.warn('Error loading speech voices:', e);
    }
  },

  // --------------------------------------------------------------------------
  // PRIMARY CLICKABLE PRONUNCIATION METHOD
  // --------------------------------------------------------------------------
  speak(text, speedOverride = null, clickedEl = null) {
    if (!text || typeof text !== 'string') return;

    // Clean text: strip parenthesis annotations like "(Verb)", "(Direct Object)", etc.
    const cleanText = text
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/^(der|die|das)\s+/i, '') // keep or speak with article depending on context
      .trim();

    // The full utterance including article for maximum learning benefit
    const utteranceText = text.replace(/\s*\([^)]*\)/g, '').trim();

    this.lastSpokenText = utteranceText;
    const speed = speedOverride !== null ? parseFloat(speedOverride) : this.rate;

    // Visual feedback on clicked element
    this.highlightActiveWord(clickedEl);
    this.showFloatingNotice(utteranceText);

    // Try Native Human-Like Audio Stream first (zero dependencies, works on all devices)
    if (this.audioMode === 'native' && navigator.onLine !== false) {
      this.speakWithNativeAudio(utteranceText, speed);
    } else {
      this.speakWithSynth(utteranceText, speed);
    }
  },

  speakWithNativeAudio(text, speed = 0.9) {
    try {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } else {
        this.audioElement = new Audio();
      }

      // Encode query for Google Translate TTS high-definition German audio
      const encoded = encodeURIComponent(text);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=de&q=${encoded}`;
      
      this.audioElement.src = url;
      this.audioElement.playbackRate = speed;

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Native audio play error, trying SpeechSynthesis fallback:', err);
          this.speakWithSynth(text, speed);
        });
      }
    } catch (e) {
      console.warn('Native audio exception, fallback to synth:', e);
      this.speakWithSynth(text, speed);
    }
  },

  speakWithSynth(text, speed = 0.9) {
    if (!this.synth) {
      console.warn('SpeechSynthesis not supported.');
      this.updateAudioDock(false);
      return;
    }

    try {
      // Resume in case browser paused it
      if (this.synth.paused) {
        this.synth.resume();
      }

      // Cancel ongoing speech with a safe micro-timeout to avoid Chrome abort bug
      this.synth.cancel();

      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = speed;
        utterance.pitch = this.pitch;

        if (this.germanVoice) {
          utterance.voice = this.germanVoice;
        }

        utterance.onstart = () => {
          this.isPlaying = true;
          this.updateAudioDock(true);
        };

        utterance.onend = () => {
          this.isPlaying = false;
          this.updateAudioDock(false);
          this.clearActiveWordHighlight();
        };

        utterance.onerror = (e) => {
          console.warn('Utterance error:', e);
          this.isPlaying = false;
          this.updateAudioDock(false);
          this.clearActiveWordHighlight();
        };

        this.synth.speak(utterance);
      }, 20);

    } catch (e) {
      console.error('Speech synthesis execution failed:', e);
      this.isPlaying = false;
      this.updateAudioDock(false);
    }
  },

  replayLast() {
    if (this.lastSpokenText) {
      this.speak(this.lastSpokenText);
    }
  },

  setSpeed(newRate) {
    this.rate = parseFloat(newRate);
    if (this.audioElement) {
      this.audioElement.playbackRate = this.rate;
    }
  },

  setMode(mode) {
    this.audioMode = mode;
  },

  // --------------------------------------------------------------------------
  // VISUAL ACTIVE HIGHLIGHT & FLOATING NOTIFICATION
  // --------------------------------------------------------------------------
  highlightActiveWord(el) {
    this.clearActiveWordHighlight();
    if (!el) return;

    // Find closest container or use element directly
    const target = el.closest ? (el.closest('.clickable-german-word') || el) : el;
    target.classList.add('speaking-pulse', 'ring-2', 'ring-amber-500');
    target.setAttribute('data-speaking', 'true');
  },

  clearActiveWordHighlight() {
    const active = document.querySelectorAll('[data-speaking="true"]');
    active.forEach(el => {
      el.classList.remove('speaking-pulse', 'ring-2', 'ring-amber-500');
      el.removeAttribute('data-speaking');
    });
  },

  createAudioDock() {
    if (document.getElementById('blitz-audio-dock')) return;

    const dock = document.createElement('div');
    dock.id = 'blitz-audio-dock';
    dock.className = 'fixed bottom-4 right-4 z-50 transition-all duration-300 transform translate-y-24 opacity-0 pointer-events-none';
    dock.innerHTML = `
      <div class="bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/50 flex items-center gap-3">
        <div id="dock-speaker-icon" class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg animate-bounce">
          🔊
        </div>
        <div class="max-w-[200px] sm:max-w-[280px]">
          <div class="text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Pronouncing German
          </div>
          <div id="dock-word-text" class="text-sm font-extrabold truncate text-white">
            Guten Tag
          </div>
        </div>
        <div class="flex items-center gap-1.5 pl-2 border-l border-slate-700">
          <button onclick="SpeechEngine.replayLast()" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition" title="Replay">
            🔄
          </button>
          <button onclick="SpeechEngine.speak(SpeechEngine.lastSpokenText, 0.75)" class="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-300 transition" title="Slow 0.75x">
            0.75x
          </button>
          <button onclick="SpeechEngine.closeAudioDock()" class="p-1 rounded-lg text-slate-500 hover:text-white transition text-xs">
            ✕
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(dock);
  },

  showFloatingNotice(text) {
    const dock = document.getElementById('blitz-audio-dock');
    const wordText = document.getElementById('dock-word-text');
    if (!dock) return;

    if (wordText) wordText.textContent = text;
    dock.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    dock.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');

    // Auto hide after 4 seconds
    clearTimeout(this._dockTimer);
    this._dockTimer = setTimeout(() => {
      this.closeAudioDock();
    }, 4500);
  },

  closeAudioDock() {
    const dock = document.getElementById('blitz-audio-dock');
    if (dock) {
      dock.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      dock.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
    }
  },

  updateAudioDock(isSpeaking) {
    const icon = document.getElementById('dock-speaker-icon');
    if (!icon) return;
    if (isSpeaking) {
      icon.classList.add('animate-pulse', 'bg-amber-400');
    } else {
      icon.classList.remove('animate-pulse', 'bg-amber-400');
    }
  },

  // --------------------------------------------------------------------------
  // SPEECH RECOGNITION (VOICE PRACTICE / MIC TESTING)
  // --------------------------------------------------------------------------
  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) return;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'de-DE';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
    } catch (e) {
      console.warn('SpeechRecognition init error:', e);
    }
  },

  listenAndVerify(targetPhrase, onResultCallback, onEndCallback, onErrorCallback) {
    if (!this.recognition) {
      if (onErrorCallback) onErrorCallback('Microphone recognition works in Chrome, Edge, and Safari with mic permissions.');
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
      
      const cleanTarget = targetPhrase.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();
      const cleanSpoken = transcript.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').trim();

      const isExactMatch = cleanTarget === cleanSpoken;
      const isSubMatch = cleanTarget.includes(cleanSpoken) || cleanSpoken.includes(cleanTarget);
      
      let score = 0;
      if (isExactMatch) score = 100;
      else if (isSubMatch) score = 85;
      else {
        score = Math.max(0, Math.round((1 - SpeechEngine.levenshtein(cleanTarget, cleanSpoken) / Math.max(cleanTarget.length, cleanSpoken.length)) * 100));
      }

      if (onResultCallback) {
        onResultCallback({
          spoken: transcript,
          target: targetPhrase,
          score: score,
          confidence: confidence,
          isPass: score >= 70
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
