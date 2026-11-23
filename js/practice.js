// ==============================================================================
// BLITZDEUTSCH PRACTICE & INTERACTIVE WORKSHOP
// Flashcards (SRS), Interactive Quiz, Sentence Builder, Der/Die/Das Sprint
// ==============================================================================

const PracticeEngine = {
  // Flashcards State
  flashcards: {
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    activeCategory: 'All',
    stats: { mastered: 0, reviewing: 0, total: 0 }
  },

  // Quiz State
  quiz: {
    questions: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    selectedOption: null,
    answered: false
  },

  // Sentence Builder State
  sentenceBuilder: {
    challenges: [],
    currentIndex: 0,
    currentSelection: [],
    isVerified: false
  },

  // Der Die Das Sprint State
  genderSprint: {
    items: [],
    currentIndex: 0,
    score: 0,
    streak: 0,
    bestStreak: 0,
    answered: false
  },

  // Pronunciation Practice State
  pronounce: {
    words: [
      { text: 'Guten Morgen', ipa: '/ˌɡuːtn̩ ˈmɔʁɡn̩/', tip: 'Vocalized end -er sounds like soft "ah"' },
      { text: 'Entschuldigung', ipa: '/ɛntˈʃʊldɪɡʊŋ/', tip: 'sp/st -> "sh", soft nasal -ung' },
      { text: 'die Straße', ipa: '/diː ˈʃtʁaːsə/', tip: 'st sounds like "sht", sharp ß' },
      { text: 'das Mädchen', ipa: '/daːs ˈmɛːtçn̩/', tip: 'ä = "eh", -chen = soft cat-hiss "ch"' },
      { text: 'die Zeit', ipa: '/diː tsaɪt/', tip: 'Z is strictly "TS", ei sounds like "EYE"' },
      { text: 'das Wasser', ipa: '/daːs ˈvasɐ/', tip: 'W sounds like English "V", -er is "ah"' },
      { text: 'ich möchte', ipa: '/ɪç ˈmœçtə/', tip: 'Soft ich-laut + rounded ö' },
      { text: 'der Bahnhof', ipa: '/deːɐ̯ ˈbaːnhoːf/', tip: 'Long "ah" in Bahn, clear "o" in Hof' }
    ],
    currentIndex: 0
  },

  init() {
    this.initFlashcards();
    this.initQuiz();
    this.initSentenceBuilder();
    this.initGenderSprint();
    this.initPronounceLab();
  },

  // --------------------------------------------------------------------------
  // FLASHCARD SYSTEM
  // --------------------------------------------------------------------------
  initFlashcards() {
    const rawCards = [
      ...GERMAN_DATA.vocabulary.map(v => ({
        id: v.id,
        front: v.german,
        back: v.english,
        category: v.category,
        gender: v.gender,
        example: v.example,
        exTrans: v.exTrans,
        audio: v.german
      })),
      ...GERMAN_DATA.verbs.map(vb => ({
        id: `vb-${vb.infinitive}`,
        front: `${vb.infinitive} (Verb)`,
        back: `${vb.meaning} [Auxiliary: ${vb.auxiliary}]`,
        category: 'Verbs',
        gender: null,
        example: vb.example,
        exTrans: vb.exTrans,
        audio: vb.infinitive
      }))
    ];

    this.flashcards.cards = rawCards;
    this.flashcards.currentIndex = 0;
    this.flashcards.isFlipped = false;
    this.updateFlashcardUI();
  },

  filterFlashcards(category) {
    this.flashcards.activeCategory = category;
    const all = [
      ...GERMAN_DATA.vocabulary.map(v => ({
        id: v.id,
        front: v.german,
        back: v.english,
        category: v.category,
        gender: v.gender,
        example: v.example,
        exTrans: v.exTrans,
        audio: v.german
      })),
      ...GERMAN_DATA.verbs.map(vb => ({
        id: `vb-${vb.infinitive}`,
        front: `${vb.infinitive} (Verb)`,
        back: `${vb.meaning} [Auxiliary: ${vb.auxiliary}]`,
        category: 'Verbs',
        gender: null,
        example: vb.example,
        exTrans: vb.exTrans,
        audio: vb.infinitive
      }))
    ];

    if (category === 'All') {
      this.flashcards.cards = all;
    } else {
      this.flashcards.cards = all.filter(c => c.category === category);
    }

    this.flashcards.currentIndex = 0;
    this.flashcards.isFlipped = false;
    this.updateFlashcardUI();
  },

  flipCard() {
    this.flashcards.isFlipped = !this.flashcards.isFlipped;
    const cardEl = document.getElementById('flashcard-inner');
    if (cardEl) {
      if (this.flashcards.isFlipped) {
        cardEl.classList.add('flipped');
      } else {
        cardEl.classList.remove('flipped');
      }
    }
  },

  nextCard(rating = 'good') {
    if (this.flashcards.cards.length === 0) return;

    if (rating === 'easy') {
      this.flashcards.stats.mastered++;
      AppStorage.addScore(5);
    } else if (rating === 'good') {
      AppStorage.addScore(2);
    }

    this.flashcards.isFlipped = false;
    const cardEl = document.getElementById('flashcard-inner');
    if (cardEl) cardEl.classList.remove('flipped');

    this.flashcards.currentIndex = (this.flashcards.currentIndex + 1) % this.flashcards.cards.length;
    this.updateFlashcardUI();
  },

  prevCard() {
    if (this.flashcards.cards.length === 0) return;
    this.flashcards.isFlipped = false;
    const cardEl = document.getElementById('flashcard-inner');
    if (cardEl) cardEl.classList.remove('flipped');

    this.flashcards.currentIndex = (this.flashcards.currentIndex - 1 + this.flashcards.cards.length) % this.flashcards.cards.length;
    this.updateFlashcardUI();
  },

  updateFlashcardUI() {
    const card = this.flashcards.cards[this.flashcards.currentIndex];
    if (!card) return;

    const frontText = document.getElementById('fc-front-text');
    const frontBadge = document.getElementById('fc-front-badge');
    const backText = document.getElementById('fc-back-text');
    const backExample = document.getElementById('fc-back-example');
    const backTranslation = document.getElementById('fc-back-trans');
    const counter = document.getElementById('fc-counter');
    const progressBar = document.getElementById('fc-progress');

    if (frontText) frontText.textContent = card.front;
    if (frontBadge) {
      frontBadge.textContent = card.category;
      if (card.gender === 'der') frontBadge.className = 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300';
      else if (card.gender === 'die') frontBadge.className = 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300';
      else if (card.gender === 'das') frontBadge.className = 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300';
      else frontBadge.className = 'text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300';
    }

    if (backText) backText.textContent = card.back;
    if (backExample) backExample.textContent = card.example || '';
    if (backTranslation) backTranslation.textContent = card.exTrans || '';
    if (counter) counter.textContent = `${this.flashcards.currentIndex + 1} / ${this.flashcards.cards.length}`;
    if (progressBar) {
      const pct = Math.round(((this.flashcards.currentIndex + 1) / this.flashcards.cards.length) * 100);
      progressBar.style.width = `${pct}%`;
    }
  },

  playFlashcardAudio(e) {
    if (e) e.stopPropagation();
    const card = this.flashcards.cards[this.flashcards.currentIndex];
    if (card && card.audio) {
      SpeechEngine.speak(card.audio, null, e ? e.currentTarget : null);
    }
  },

  // --------------------------------------------------------------------------
  // QUIZ ENGINE
  // --------------------------------------------------------------------------
  initQuiz() {
    this.quiz.questions = [...GERMAN_DATA.quizzes];
    this.quiz.currentIndex = 0;
    this.quiz.score = 0;
    this.quiz.streak = 0;
    this.quiz.answered = false;
    this.renderQuizQuestion();
  },

  renderQuizQuestion() {
    const q = this.quiz.questions[this.quiz.currentIndex];
    if (!q) {
      this.renderQuizResults();
      return;
    }

    this.quiz.answered = false;
    this.quiz.selectedOption = null;

    const container = document.getElementById('quiz-container');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition">
        <div class="flex items-center justify-between mb-4">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            Question ${this.quiz.currentIndex + 1} of ${this.quiz.questions.length}
          </span>
          <div class="flex items-center gap-4 text-sm font-semibold">
            <span class="text-emerald-600 dark:text-emerald-400">Score: ${this.quiz.score}</span>
            <span class="text-amber-500">🔥 Streak: ${this.quiz.streak}</span>
          </div>
        </div>

        <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mb-6 overflow-hidden">
          <div class="bg-gradient-to-r from-amber-500 to-rose-500 h-2 rounded-full transition-all duration-300" style="width: ${((this.quiz.currentIndex) / this.quiz.questions.length) * 100}%"></div>
        </div>

        <h3 class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
          ${q.question}
        </h3>
        ${q.hint ? `<p class="text-sm text-slate-500 dark:text-slate-400 mb-6 italic"><span class="font-medium">💡 Hint:</span> ${q.hint}</p>` : '<div class="mb-4"></div>'}

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6" id="quiz-options">
          ${q.options.map((opt, idx) => `
            <button onclick="PracticeEngine.selectQuizOption('${opt.replace(/'/g, "\\'")}', this)" 
              class="quiz-opt-btn text-left p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50/50 dark:hover:bg-slate-700/60 font-medium text-slate-800 dark:text-slate-200 transition flex items-center justify-between group">
              <span class="flex items-center gap-3">
                <span class="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold group-hover:bg-amber-500 group-hover:text-white transition">
                  ${String.fromCharCode(65 + idx)}
                </span>
                <span>${opt}</span>
              </span>
              <button type="button" onclick="event.stopPropagation(); SpeechEngine.speak('${opt.replace(/'/g, "\\'")}')" class="opacity-40 group-hover:opacity-100 hover:text-amber-500 p-1 rounded" title="Listen">
                🔊
              </button>
            </button>
          `).join('')}
        </div>

        <div id="quiz-feedback" class="hidden mb-6 p-4 rounded-xl"></div>

        <div class="flex justify-end">
          <button id="quiz-next-btn" onclick="PracticeEngine.nextQuizQuestion()" class="hidden px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-900 text-white font-semibold rounded-xl shadow-sm transition flex items-center gap-2">
            <span>Next Question</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    `;
  },

  selectQuizOption(chosen, btnEl) {
    if (this.quiz.answered) return;
    this.quiz.answered = true;
    const q = this.quiz.questions[this.quiz.currentIndex];
    const isCorrect = chosen.trim().toLowerCase() === q.answer.trim().toLowerCase();

    // Disable all options and style correct/incorrect
    const allBtns = document.querySelectorAll('.quiz-opt-btn');
    allBtns.forEach(btn => {
      btn.classList.add('cursor-default');
      const text = btn.querySelector('span > span:last-child').textContent.trim().toLowerCase();
      if (text === q.answer.trim().toLowerCase()) {
        btn.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40', 'dark:border-emerald-500', 'text-emerald-900', 'dark:text-emerald-200');
      } else if (btn === btnEl && !isCorrect) {
        btn.classList.add('border-rose-500', 'bg-rose-50', 'dark:bg-rose-950/40', 'dark:border-rose-500', 'text-rose-900', 'dark:text-rose-200');
      }
    });

    const feedbackEl = document.getElementById('quiz-feedback');
    const nextBtn = document.getElementById('quiz-next-btn');

    if (isCorrect) {
      this.quiz.score += 10;
      this.quiz.streak++;
      AppStorage.addScore(10);
      feedbackEl.className = 'p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200';
      feedbackEl.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="text-xl">🎉</span>
          <div>
            <h4 class="font-bold text-emerald-800 dark:text-emerald-300">Ausgezeichnet! (Excellent / Correct!)</h4>
            <p class="text-sm mt-1 text-emerald-700 dark:text-emerald-400">${q.explanation}</p>
          </div>
        </div>
      `;
    } else {
      this.quiz.streak = 0;
      feedbackEl.className = 'p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200';
      feedbackEl.innerHTML = `
        <div class="flex items-start gap-3">
          <span class="text-xl">💡</span>
          <div>
            <h4 class="font-bold text-rose-800 dark:text-rose-300">Nicht ganz richtig (Not quite right)</h4>
            <p class="text-sm mt-1 text-rose-700 dark:text-rose-400"><strong>Correct Answer:</strong> ${q.answer}</p>
            <p class="text-xs mt-1 text-slate-600 dark:text-slate-400">${q.explanation}</p>
          </div>
        </div>
      `;
    }

    feedbackEl.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
  },

  nextQuizQuestion() {
    this.quiz.currentIndex++;
    this.renderQuizQuestion();
  },

  renderQuizResults() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    const maxScore = this.quiz.questions.length * 10;
    const percentage = Math.round((this.quiz.score / maxScore) * 100);

    container.innerHTML = `
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-500 flex items-center justify-center text-4xl shadow-inner">
          🏆
        </div>
        <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Quiz Complete!</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">You scored <strong>${this.quiz.score}</strong> / ${maxScore} points (${percentage}%)</p>

        <div class="max-w-md mx-auto mb-8 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div class="flex justify-between text-sm font-semibold mb-2">
            <span>Accuracy Level</span>
            <span class="${percentage >= 70 ? 'text-emerald-500' : 'text-amber-500'}">${percentage >= 80 ? 'Mastery' : percentage >= 60 ? 'Proficient' : 'Needs Practice'}</span>
          </div>
          <div class="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-amber-500 to-emerald-500 h-3 rounded-full" style="width: ${percentage}%"></div>
          </div>
        </div>

        <button onclick="PracticeEngine.initQuiz()" class="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5">
          🔄 Retake Quiz & Beat Score
        </button>
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // SENTENCE BUILDER ENGINE (WORD ORDER / V2 TRAINER)
  // --------------------------------------------------------------------------
  initSentenceBuilder() {
    this.sentenceBuilder.challenges = [...GERMAN_DATA.sentenceBuilder];
    this.sentenceBuilder.currentIndex = 0;
    this.renderSentenceChallenge();
  },

  renderSentenceChallenge() {
    const item = this.sentenceBuilder.challenges[this.sentenceBuilder.currentIndex];
    if (!item) return;

    this.sentenceBuilder.currentSelection = [];
    this.sentenceBuilder.isVerified = false;

    const promptEl = document.getElementById('sb-prompt');
    const ruleEl = document.getElementById('sb-rule');
    const dropzone = document.getElementById('sb-dropzone');
    const wordbank = document.getElementById('sb-wordbank');
    const resultBox = document.getElementById('sb-result');
    const checkBtn = document.getElementById('sb-check-btn');
    const nextBtn = document.getElementById('sb-next-btn');

    if (promptEl) promptEl.textContent = item.prompt;
    if (ruleEl) ruleEl.textContent = `Target Rule: ${item.rule}`;
    if (resultBox) {
      resultBox.classList.add('hidden');
      resultBox.innerHTML = '';
    }
    if (checkBtn) checkBtn.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');

    this.renderSentenceDropzone();
    this.renderSentenceWordbank(item.scrambled);
  },

  renderSentenceDropzone() {
    const dropzone = document.getElementById('sb-dropzone');
    if (!dropzone) return;

    if (this.sentenceBuilder.currentSelection.length === 0) {
      dropzone.innerHTML = `<span class="text-slate-400 dark:text-slate-500 text-sm italic py-2">Click word bubbles below in the correct German order...</span>`;
      return;
    }

    dropzone.innerHTML = this.sentenceBuilder.currentSelection.map((word, idx) => `
      <button onclick="PracticeEngine.removeSentenceWord(${idx})" class="px-3.5 py-1.5 bg-amber-500 text-white rounded-lg font-medium text-base shadow-sm hover:bg-rose-500 transition flex items-center gap-1.5 animate-fadeIn">
        <span>${word}</span>
        <span class="text-xs opacity-75">✕</span>
      </button>
    `).join('');
  },

  renderSentenceWordbank(availableWords) {
    const wordbank = document.getElementById('sb-wordbank');
    if (!wordbank) return;

    // Filter out words already picked
    const remaining = [...availableWords];
    this.sentenceBuilder.currentSelection.forEach(chosen => {
      const idx = remaining.indexOf(chosen);
      if (idx > -1) remaining.splice(idx, 1);
    });

    wordbank.innerHTML = remaining.map((word) => `
      <button onclick="PracticeEngine.addSentenceWord('${word.replace(/'/g, "\\'")}')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-medium shadow-sm transition transform hover:scale-105">
        ${word}
      </button>
    `).join('');
  },

  addSentenceWord(word) {
    if (this.sentenceBuilder.isVerified) return;
    this.sentenceBuilder.currentSelection.push(word);
    this.renderSentenceDropzone();
    const item = this.sentenceBuilder.challenges[this.sentenceBuilder.currentIndex];
    this.renderSentenceWordbank(item.scrambled);
  },

  removeSentenceWord(idx) {
    if (this.sentenceBuilder.isVerified) return;
    this.sentenceBuilder.currentSelection.splice(idx, 1);
    this.renderSentenceDropzone();
    const item = this.sentenceBuilder.challenges[this.sentenceBuilder.currentIndex];
    this.renderSentenceWordbank(item.scrambled);
  },

  checkSentence() {
    const item = this.sentenceBuilder.challenges[this.sentenceBuilder.currentIndex];
    const userSentence = this.sentenceBuilder.currentSelection.join(' ');
    const correctSentence = item.correctOrder.join(' ');
    const resultBox = document.getElementById('sb-result');
    const checkBtn = document.getElementById('sb-check-btn');
    const nextBtn = document.getElementById('sb-next-btn');

    this.sentenceBuilder.isVerified = true;

    if (userSentence === correctSentence) {
      AppStorage.addScore(15);
      resultBox.className = 'mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200';
      resultBox.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <h5 class="font-bold text-emerald-800 dark:text-emerald-300">✅ Richtig! (Correct!)</h5>
            <p class="text-sm mt-1">${item.rule}</p>
          </div>
          <button onclick="SpeechEngine.speak('${correctSentence.replace(/'/g, "\\'")}')" class="text-xl p-2 hover:scale-110 transition" title="Listen">🔊</button>
        </div>
      `;
    } else {
      resultBox.className = 'mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200';
      resultBox.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <h5 class="font-bold text-rose-800 dark:text-rose-300">❌ Word Order Mistake</h5>
            <p class="text-sm mt-1"><strong>Correct Order:</strong> ${correctSentence}</p>
            <p class="text-xs mt-1 text-slate-600 dark:text-slate-400">${item.rule}</p>
          </div>
          <button onclick="SpeechEngine.speak('${correctSentence.replace(/'/g, "\\'")}')" class="text-xl p-2 hover:scale-110 transition" title="Listen">🔊</button>
        </div>
      `;
    }

    resultBox.classList.remove('hidden');
    if (checkBtn) checkBtn.classList.add('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
  },

  nextSentence() {
    this.sentenceBuilder.currentIndex = (this.sentenceBuilder.currentIndex + 1) % this.sentenceBuilder.challenges.length;
    this.renderSentenceChallenge();
  },

  // --------------------------------------------------------------------------
  // DER / DIE / DAS RAPID SPRINT
  // --------------------------------------------------------------------------
  initGenderSprint() {
    const rawNouns = GERMAN_DATA.vocabulary.filter(v => v.gender !== null);
    this.genderSprint.items = rawNouns.sort(() => Math.random() - 0.5);
    this.genderSprint.currentIndex = 0;
    this.genderSprint.score = 0;
    this.genderSprint.streak = 0;
    this.renderSprintCard();
  },

  renderSprintCard() {
    const noun = this.genderSprint.items[this.genderSprint.currentIndex];
    if (!noun) return;

    this.genderSprint.answered = false;
    const nounWord = noun.german.replace(/^(der|die|das)\s+/i, '');

    const wordEl = document.getElementById('sprint-word');
    const meanEl = document.getElementById('sprint-meaning');
    const feedbackEl = document.getElementById('sprint-feedback');
    const streakEl = document.getElementById('sprint-streak');
    const scoreEl = document.getElementById('sprint-score');

    if (wordEl) wordEl.textContent = nounWord;
    if (meanEl) meanEl.textContent = noun.english;
    if (streakEl) streakEl.textContent = `Streak: ${this.genderSprint.streak}`;
    if (scoreEl) scoreEl.textContent = `Score: ${this.genderSprint.score}`;
    if (feedbackEl) {
      feedbackEl.classList.add('hidden');
      feedbackEl.innerHTML = '';
    }
  },

  guessGender(chosenGender) {
    if (this.genderSprint.answered) return;
    this.genderSprint.answered = true;

    const noun = this.genderSprint.items[this.genderSprint.currentIndex];
    const correct = noun.gender.toLowerCase();
    const isMatch = chosenGender.toLowerCase() === correct;

    const feedbackEl = document.getElementById('sprint-feedback');
    if (isMatch) {
      this.genderSprint.score += 5;
      this.genderSprint.streak++;
      if (this.genderSprint.streak > this.genderSprint.bestStreak) {
        this.genderSprint.bestStreak = this.genderSprint.streak;
      }
      AppStorage.addScore(5);
      SpeechEngine.speak(`${correct} ${noun.german.replace(/^(der|die|das)\s+/i, '')}`);

      if (feedbackEl) {
        feedbackEl.className = 'mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2';
        feedbackEl.innerHTML = `<span>✅ Ja! <strong>${correct.toUpperCase()} ${noun.german.replace(/^(der|die|das)\s+/i, '')}</strong></span>`;
        feedbackEl.classList.remove('hidden');
      }

      setTimeout(() => {
        this.genderSprint.currentIndex = (this.genderSprint.currentIndex + 1) % this.genderSprint.items.length;
        this.renderSprintCard();
      }, 700);

    } else {
      this.genderSprint.streak = 0;
      SpeechEngine.speak(`${correct} ${noun.german.replace(/^(der|die|das)\s+/i, '')}`);

      if (feedbackEl) {
        feedbackEl.className = 'mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-semibold flex items-center justify-between';
        feedbackEl.innerHTML = `
          <span>❌ Wrong! It is: <strong>${correct.toUpperCase()} ${noun.german.replace(/^(der|die|das)\s+/i, '')}</strong></span>
          <button onclick="PracticeEngine.nextSprintCard()" class="text-xs bg-slate-900 text-white px-3 py-1 rounded-md">Next</button>
        `;
        feedbackEl.classList.remove('hidden');
      }
    }
  },

  nextSprintCard() {
    this.genderSprint.currentIndex = (this.genderSprint.currentIndex + 1) % this.genderSprint.items.length;
    this.renderSprintCard();
  },

  // --------------------------------------------------------------------------
  // PRONUNCIATION LAB & SPEECH RECOGNITION
  // --------------------------------------------------------------------------
  initPronounceLab() {
    this.renderPronounceCard();
  },

  renderPronounceCard() {
    const item = this.pronounce.words[this.pronounce.currentIndex];
    if (!item) return;

    const wordEl = document.getElementById('pron-word');
    const ipaEl = document.getElementById('pron-ipa');
    const tipEl = document.getElementById('pron-tip');
    const resultBox = document.getElementById('pron-result');

    if (wordEl) wordEl.textContent = item.text;
    if (ipaEl) ipaEl.textContent = item.ipa;
    if (tipEl) tipEl.textContent = item.tip;
    if (resultBox) {
      resultBox.classList.add('hidden');
      resultBox.innerHTML = '';
    }
  },

  playPronounceSample(speed = 0.9, el = null) {
    const item = this.pronounce.words[this.pronounce.currentIndex];
    if (item) SpeechEngine.speak(item.text, speed, el);
  },

  recordAndVerify() {
    const item = this.pronounce.words[this.pronounce.currentIndex];
    const micBtn = document.getElementById('pron-mic-btn');
    const micStatus = document.getElementById('pron-mic-status');
    const resultBox = document.getElementById('pron-result');

    if (!micBtn) return;

    micBtn.classList.add('animate-pulse', 'bg-rose-600', 'text-white');
    if (micStatus) micStatus.textContent = 'Listening... Speak now in German!';

    SpeechEngine.listenAndVerify(
      item.text,
      (res) => {
        micBtn.classList.remove('animate-pulse', 'bg-rose-600', 'text-white');
        if (micStatus) micStatus.textContent = 'Click mic to speak';

        if (resultBox) {
          resultBox.classList.remove('hidden');
          if (res.isPass) {
            AppStorage.addScore(10);
            resultBox.className = 'mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-900 dark:text-emerald-200';
            resultBox.innerHTML = `
              <div class="flex items-center gap-3">
                <span class="text-2xl">🎯</span>
                <div>
                  <h5 class="font-bold text-emerald-800 dark:text-emerald-300">Wunderbar! Accuracy: ${res.score}%</h5>
                  <p class="text-xs text-emerald-700 dark:text-emerald-400">Heard: "<em>${res.spoken}</em>" vs Target: "<em>${res.target}</em>"</p>
                </div>
              </div>
            `;
          } else {
            resultBox.className = 'mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-400 text-amber-900 dark:text-amber-200';
            resultBox.innerHTML = `
              <div class="flex items-center gap-3">
                <span class="text-2xl">👂</span>
                <div>
                  <h5 class="font-bold text-amber-800 dark:text-amber-300">Close! Accuracy: ${res.score}%</h5>
                  <p class="text-xs text-amber-700 dark:text-amber-400">Heard: "<em>${res.spoken}</em>". Tip: listen to the audio button and try again!</p>
                </div>
              </div>
            `;
          }
        }
      },
      () => {
        micBtn.classList.remove('animate-pulse', 'bg-rose-600', 'text-white');
        if (micStatus) micStatus.textContent = 'Click mic to speak';
      },
      (err) => {
        micBtn.classList.remove('animate-pulse', 'bg-rose-600', 'text-white');
        if (micStatus) micStatus.textContent = 'Click mic to speak';
        if (resultBox) {
          resultBox.classList.remove('hidden');
          resultBox.className = 'mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs';
          resultBox.innerHTML = `Note: Microphone speech recognition requires browser permission (Chrome/Safari recommended) or HTTPS. Error: ${err}`;
        }
      }
    );
  },

  nextPronounceWord() {
    this.pronounce.currentIndex = (this.pronounce.currentIndex + 1) % this.pronounce.words.length;
    this.renderPronounceCard();
  }
};
