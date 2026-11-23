// ==============================================================================
// BLITZDEUTSCH BULLETPROOF SPEECH & AUDIO ENGINE
// Synchronous Web Speech (Anna/de-DE) + No-Referrer HD Stream + Audio Diagnostics
// ==============================================================================

const SpeechEngine = {
  synth: typeof window !== 'undefined' ? window.speechSynthesis : null,
  germanVoice: null,
  allVoices: [],
  rate: 0.9,
  pitch: 1.0,
  audioElement: null,
  lastSpokenText: 'Guten Tag',
  isPlaying: false,
  recognition: null,
  isListening: false,
  audioMode: 'synth', // 'synth' (Native Browser Voice) or 'stream' (HD Stream)

  init() {
    // 1. Initial voice loading
    this.loadVoices();

    // In Chromium and WebKit, voices load asynchronously
    if (this.synth && typeof this.synth.onvoiceschanged !== 'undefined') {
      this.synth.onvoiceschanged = () => {
        this.loadVoices();
      };
    }

    // 2. Prepare HTML5 Audio element with no-referrer
    try {
      this.audioElement = new Audio();
      this.audioElement.referrerPolicy = 'no-referrer';
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

      this.audioElement.addEventListener('error', (err) => {
        console.warn('Audio stream playback failed:', err);
        this.isPlaying = false;
        this.updateAudioDock(false);
        this.clearActiveWordHighlight();
      });
    } catch (e) {
      console.warn('Audio element initialization error:', e);
    }

    // 3. User interaction gesture unlocker (Crucial for iOS/macOS Safari & Chrome)
    const unlockAudio = () => {
      if (this.synth && this.synth.paused) {
        this.synth.resume();
      }
      this.loadVoices();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });

    // 4. Initialize Speech Recognition (for pronunciation check)
    this.initRecognition();

    // 5. Create Audio Dock in DOM
    this.createAudioDock();
  },

  loadVoices() {
    if (!this.synth) return;
    try {
      this.allVoices = this.synth.getVoices() || [];
      if (this.allVoices.length > 0) {
        // Prioritize native high-quality German voices
        this.germanVoice = 
          this.allVoices.find(v => v.lang === 'de-DE' && (v.name.includes('Anna') || v.name.includes('Google') || v.name.includes('German'))) ||
          this.allVoices.find(v => v.lang === 'de-DE' || v.lang === 'de_DE') ||
          this.allVoices.find(v => v.lang.startsWith('de')) ||
          null;
      }
    } catch (e) {
      console.warn('Voice loading error:', e);
    }
  },

  // --------------------------------------------------------------------------
  // PRIMARY CLICKABLE PRONUNCIATION METHOD (SYNCHRONOUS USER CALLSTACK)
  // --------------------------------------------------------------------------
  speak(text, speedOverride = null, clickedEl = null) {
    if (!text || typeof text !== 'string') return;

    // Clean text of parenthesis annotations like "(Verb)", "(Direct Object)", etc.
    const cleanText = text.replace(/\s*\([^)]*\)/g, '').trim();
    this.lastSpokenText = cleanText;
    const speed = speedOverride !== null ? parseFloat(speedOverride) : this.rate;

    // Visual feedback
    this.highlightActiveWord(clickedEl);
    this.showFloatingNotice(cleanText);

    if (this.audioMode === 'stream') {
      this.speakWithStream(cleanText, speed);
    } else {
      // Synchronous native browser voice (Anna / de-DE)
      this.speakWithSynth(cleanText, speed);
    }
  },

  // --------------------------------------------------------------------------
  // SYNCHRONOUS BROWSER SPEECH (Guaranteed Safari & Chrome User Activation)
  // --------------------------------------------------------------------------
  speakWithSynth(text, speed = 0.9) {
    if (!this.synth) {
      this.speakWithStream(text, speed);
      return;
    }

    try {
      // 1. Unpause in case browser backgrounded it
      if (this.synth.paused) {
        this.synth.resume();
      }

      // 2. Refresh voice list right now
      this.loadVoices();

      // 3. Cancel any previous speech
      if (this.synth.speaking) {
        this.synth.cancel();
      }

      // 4. Create Utterance synchronously
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
        console.warn('SpeechSynthesis utterance event error:', e);
        this.isPlaying = false;
        this.updateAudioDock(false);
        this.clearActiveWordHighlight();
        // Fallback to stream if synthesis fails
        this.speakWithStream(text, speed);
      };

      // 5. CALL SPEAK DIRECTLY SYNCHRONOUSLY — NO SETTIMEOUT!
      this.synth.speak(utterance);

    } catch (e) {
      console.error('SpeechSynthesis exception, fallback to stream:', e);
      this.speakWithStream(text, speed);
    }
  },

  // --------------------------------------------------------------------------
  // ONLINE AUDIO STREAM (NO REFERRER)
  // --------------------------------------------------------------------------
  speakWithStream(text, speed = 0.9) {
    try {
      if (!this.audioElement) {
        this.audioElement = new Audio();
        this.audioElement.referrerPolicy = 'no-referrer';
      }

      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.playbackRate = speed;
      this.audioElement.referrerPolicy = 'no-referrer';

      const encoded = encodeURIComponent(text);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=de&q=${encoded}`;
      this.audioElement.src = url;

      const promise = this.audioElement.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Audio stream error, trying synth:', err);
          this.speakWithSynth(text, speed);
        });
      }
    } catch (e) {
      console.warn('Stream exception:', e);
      this.speakWithSynth(text, speed);
    }
  },

  // --------------------------------------------------------------------------
  // AUDIO TEST CHIME (Uses Web Audio API to verify speakers are unmuted)
  // --------------------------------------------------------------------------
  playSpeakerChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Web Audio chime error:', e);
    }
  },

  testSound() {
    this.playSpeakerChime();
    setTimeout(() => {
      this.speak('Guten Tag! Willkommen bei BlitzDeutsch!');
    }, 200);
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
          <button onclick="SpeechEngine.openTroubleshooter()" class="p-1 rounded-lg text-slate-400 hover:text-amber-400 transition text-xs" title="Audio Help & Test">
            ⚙️
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
  // AUDIO DIAGNOSTICS & TROUBLESHOOTER MODAL
  // --------------------------------------------------------------------------
  openTroubleshooter() {
    let modal = document.getElementById('audio-troubleshooter-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'audio-troubleshooter-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4';
      document.body.appendChild(modal);
    }

    this.loadVoices();
    const voiceName = this.germanVoice ? `${this.germanVoice.name} (${this.germanVoice.lang})` : 'System Default German';
    const totalVoices = this.allVoices.length;

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 relative">
        <button onclick="SpeechEngine.closeTroubleshooter()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 text-xl font-bold">✕</button>
        
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-500 flex items-center justify-center text-2xl font-bold">
            🔊
          </div>
          <div>
            <h3 class="text-xl font-bold">Audio & Sound Diagnoser</h3>
            <p class="text-xs text-slate-500">Test all audio channels to verify sound works on your device.</p>
          </div>
        </div>

        <div class="space-y-3 mb-6 text-xs">
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span class="text-slate-500">Active German Voice:</span>
            <span class="font-bold text-amber-600 dark:text-amber-400 font-mono">${voiceName}</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span class="text-slate-500">Voices Installed on OS:</span>
            <span class="font-bold text-slate-900 dark:text-white">${totalVoices} detected</span>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span class="text-slate-500">Preferred Engine:</span>
            <select onchange="SpeechEngine.setMode(this.value)" class="bg-transparent font-bold text-amber-600 dark:text-amber-400 focus:outline-none cursor-pointer">
              <option value="synth" ${this.audioMode === 'synth' ? 'selected' : ''}>Native Browser Voice (Anna)</option>
              <option value="stream" ${this.audioMode === 'stream' ? 'selected' : ''}>HD Audio Stream</option>
            </select>
          </div>
        </div>

        <div class="space-y-2.5 mb-6">
          <button onclick="SpeechEngine.testSound()" class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md">
            <span>🔊 1. Play Test Speech ("Guten Tag")</span>
          </button>
          <button onclick="SpeechEngine.playSpeakerChime()" class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2">
            <span>🔔 2. Play Hardware Speaker Beep (Proves sound is unmuted)</span>
          </button>
        </div>

        <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
          <strong>Still no sound?</strong> Check if:
          <br>1. Your Mac/PC volume slider is turned up and headphones/speakers are connected.
          <br>2. This browser tab is not muted (look for the speaker icon with a slash on your browser tab).
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
  },

  closeTroubleshooter() {
    const modal = document.getElementById('audio-troubleshooter-modal');
    if (modal) modal.classList.add('hidden');
  },

  // --------------------------------------------------------------------------
  // SPEECH RECOGNITION (MIC ACCURACY TEST)
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
