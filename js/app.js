// ==============================================================================
// BLITZDEUTSCH MAIN APP CONTROLLER
// State Management, Navigation, LocalStorage, Renderers & Event Handlers
// ==============================================================================

const AppStorage = {
  KEY: 'blitzdeutsch_user_state_v1',

  getState() {
    try {
      const data = localStorage.getItem(this.KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return {
      points: 50,
      streak: 1,
      lastActive: new Date().toISOString().split('T')[0],
      completedMilestones: ['m1'],
      darkMode: false,
      speed: 0.9
    };
  },

  saveState(state) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
    App.updateUserStatsBadge();
  },

  addScore(pts) {
    const state = this.getState();
    state.points = (state.points || 0) + pts;
    this.saveState(state);
  },

  toggleMilestone(milestoneId) {
    const state = this.getState();
    const idx = state.completedMilestones.indexOf(milestoneId);
    if (idx > -1) {
      state.completedMilestones.splice(idx, 1);
    } else {
      state.completedMilestones.push(milestoneId);
      state.points += 25; // Reward 25 XP for completing a roadmap milestone!
    }
    this.saveState(state);
    App.renderRoadmap();
  }
};

const App = {
  currentTab: 'roadmap',

  init() {
    this.initTheme();
    this.initNavigation();
    this.renderRoadmap();
    this.renderPhonetics();
    this.renderVocabulary();
    this.renderVerbs();
    this.renderPhrases();
    this.renderFalseFriends();
    this.renderGrammar();
    this.updateUserStatsBadge();

    // Initialize practice components
    if (typeof PracticeEngine !== 'undefined') {
      PracticeEngine.init();
    }
  },

  initTheme() {
    const state = AppStorage.getState();
    if (state.darkMode || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && state.darkMode === undefined)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme() {
    const state = AppStorage.getState();
    const isDark = document.documentElement.classList.toggle('dark');
    state.darkMode = isDark;
    AppStorage.saveState(state);
  },

  initNavigation() {
    const navLinks = document.querySelectorAll('[data-tab-target]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-tab-target');
        this.switchTab(target);
      });
    });
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active nav styling
    const allLinks = document.querySelectorAll('[data-tab-target]');
    allLinks.forEach(link => {
      if (link.getAttribute('data-tab-target') === tabId) {
        link.className = 'tab-btn active px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 bg-amber-500 text-white shadow-md shadow-amber-500/20';
      } else {
        link.className = 'tab-btn px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800';
      }
    });

    // Show/hide sections
    const sections = document.querySelectorAll('.tab-section');
    sections.forEach(sec => {
      if (sec.id === `section-${tabId}`) {
        sec.classList.remove('hidden');
        sec.classList.add('animate-fadeIn');
      } else {
        sec.classList.add('hidden');
        sec.classList.remove('animate-fadeIn');
      }
    });

    // Scroll to top of section smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateUserStatsBadge() {
    const state = AppStorage.getState();
    const ptsEl = document.getElementById('user-points');
    const streakEl = document.getElementById('user-streak');
    const milestoneCountEl = document.getElementById('user-milestones-count');

    if (ptsEl) ptsEl.textContent = `${state.points || 0} XP`;
    if (streakEl) streakEl.textContent = `${state.streak || 1} d`;
    if (milestoneCountEl) milestoneCountEl.textContent = `${state.completedMilestones.length || 0}/25`;
  },

  // --------------------------------------------------------------------------
  // RENDER: ROADMAP SECTION
  // --------------------------------------------------------------------------
  renderRoadmap() {
    const container = document.getElementById('roadmap-timeline');
    if (!container) return;

    const state = AppStorage.getState();
    let totalMilestones = 0;
    let completedCount = 0;

    container.innerHTML = GERMAN_DATA.roadmap.map(phase => {
      const phaseMilestones = phase.milestones.map(m => {
        totalMilestones++;
        const isDone = state.completedMilestones.includes(m.id);
        if (isDone) completedCount++;

        return `
          <div class="flex items-start gap-3.5 p-3.5 rounded-xl transition ${isDone ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40' : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-amber-400'}">
            <button onclick="AppStorage.toggleMilestone('${m.id}')" class="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border-2 transition ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'border-slate-300 dark:border-slate-600 hover:border-amber-500'}">
              ${isDone ? '<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>' : ''}
            </button>
            <div class="flex-1">
              <h5 class="text-sm font-bold ${isDone ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-85' : 'text-slate-800 dark:text-slate-200'}">
                ${m.title}
              </h5>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                ${m.desc}
              </p>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="relative pl-6 md:pl-8 pb-10 border-l-2 border-slate-200 dark:border-slate-700 last:pb-0">
          <div class="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900 shadow"></div>
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900">
                ${phase.level}
              </span>
              <h4 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                ${phase.title}
              </h4>
            </div>
            <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/50">
              ⏱️ ${phase.duration}
            </span>
          </div>
          <p class="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
            🎯 <strong>Core Competency:</strong> ${phase.focus}
          </p>
          <div class="grid grid-cols-1 gap-2.5">
            ${phaseMilestones}
          </div>
        </div>
      `;
    }).join('');

    // Update global roadmap progress bar
    const progressPct = totalMilestones > 0 ? Math.round((completedCount / totalMilestones) * 100) : 0;
    const progressEl = document.getElementById('roadmap-overall-progress');
    const progressText = document.getElementById('roadmap-progress-text');
    if (progressEl) progressEl.style.width = `${progressPct}%`;
    if (progressText) progressText.textContent = `${completedCount} of ${totalMilestones} Milestones Completed (${progressPct}%)`;
  },

  // --------------------------------------------------------------------------
  // RENDER: PHONETICS & PRONUNCIATION SECTION
  // --------------------------------------------------------------------------
  renderPhonetics() {
    // Alphabet Grid
    const alphaContainer = document.getElementById('alphabet-grid');
    if (alphaContainer) {
      alphaContainer.innerHTML = GERMAN_DATA.phonetics.alphabet.map(letter => `
        <div class="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-amber-400 dark:hover:border-amber-400 transition group flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between">
              <span class="text-xl font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition">${letter.letter}</span>
              <span class="text-xs font-mono text-slate-400 dark:text-slate-500">${letter.ipa}</span>
            </div>
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Name: <span class="font-bold text-slate-700 dark:text-slate-300">${letter.name}</span></p>
            <div class="mt-2 text-xs text-slate-600 dark:text-slate-400">
              <span class="font-semibold text-amber-600 dark:text-amber-400">${letter.example}</span>: ${letter.meaning}
            </div>
            ${letter.note ? `<p class="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 leading-tight italic">${letter.note}</p>` : ''}
          </div>
          <button onclick="SpeechEngine.speak('${letter.audio}')" class="mt-3 w-full py-1.5 px-2 bg-slate-100 hover:bg-amber-500 hover:text-white dark:bg-slate-700 dark:hover:bg-amber-500 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5">
            <span>🔊 Pronounce</span>
          </button>
        </div>
      `).join('');
    }

    // Phonetic Rules
    const rulesContainer = document.getElementById('phonetics-rules-list');
    if (rulesContainer) {
      rulesContainer.innerHTML = GERMAN_DATA.phonetics.rules.map(rule => `
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h4 class="text-lg font-bold text-slate-900 dark:text-white">${rule.title}</h4>
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
              ${rule.summary}
            </span>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            ${rule.explanation}
          </p>
          <div class="bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 mb-4">
            💡 <strong>Fast Hack:</strong> ${rule.mnemonic}
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            ${rule.examples.map(ex => `
              <div class="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <div class="font-bold text-xs text-slate-900 dark:text-white">${ex.german}</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400">${ex.meaning}</div>
                </div>
                <button onclick="SpeechEngine.speak('${ex.german.replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-amber-500 transition p-1" title="Play Sound">
                  🔊
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    // Minimal Pairs
    const pairsContainer = document.getElementById('minimal-pairs-grid');
    if (pairsContainer) {
      pairsContainer.innerHTML = GERMAN_DATA.phonetics.minimalPairs.map(p => `
        <div class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div class="grid grid-cols-2 gap-2 text-center pb-3 border-b border-slate-100 dark:border-slate-700">
            <button onclick="SpeechEngine.speak('${p.word1}')" class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 hover:bg-amber-50 dark:hover:bg-slate-700 transition">
              <span class="block font-bold text-sm text-slate-900 dark:text-white">${p.word1}</span>
              <span class="text-xs text-slate-500">${p.mean1}</span>
              <span class="block text-[11px] text-amber-600 dark:text-amber-400 mt-1">🔊 Play</span>
            </button>
            <button onclick="SpeechEngine.speak('${p.word2}')" class="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 hover:bg-amber-50 dark:hover:bg-slate-700 transition">
              <span class="block font-bold text-sm text-slate-900 dark:text-white">${p.word2}</span>
              <span class="text-xs text-slate-500">${p.mean2}</span>
              <span class="block text-[11px] text-amber-600 dark:text-amber-400 mt-1">🔊 Play</span>
            </button>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 font-medium">
            🎯 ${p.note}
          </p>
        </div>
      `).join('');
    }
  },

  // --------------------------------------------------------------------------
  // RENDER: VOCABULARY LIST (SEARCH & FILTER)
  // --------------------------------------------------------------------------
  renderVocabulary(query = '', categoryFilter = 'All') {
    const container = document.getElementById('vocabulary-table-body');
    if (!container) return;

    let items = GERMAN_DATA.vocabulary;

    if (categoryFilter !== 'All') {
      items = items.filter(v => v.category === categoryFilter);
    }

    if (query.trim() !== '') {
      const q = query.toLowerCase().trim();
      items = items.filter(v => v.german.toLowerCase().includes(q) || v.english.toLowerCase().includes(q));
    }

    if (items.length === 0) {
      container.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-400">No words match your search.</td></tr>`;
      return;
    }

    container.innerHTML = items.map(v => {
      let genderBadge = '';
      if (v.gender === 'der') genderBadge = '<span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">der (Masc)</span>';
      else if (v.gender === 'die') genderBadge = '<span class="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300">die (Fem)</span>';
      else if (v.gender === 'das') genderBadge = '<span class="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">das (Neut)</span>';
      else genderBadge = '<span class="text-xs text-slate-400">-</span>';

      return `
        <tr class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>${v.german}</span>
              <button onclick="SpeechEngine.speak('${v.german.replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-amber-500 transition" title="Listen">🔊</button>
            </div>
          </td>
          <td class="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">${v.english}</td>
          <td class="py-3 px-4">${genderBadge}</td>
          <td class="py-3 px-4">
            <div class="text-xs text-slate-600 dark:text-slate-400">
              <span class="italic text-slate-800 dark:text-slate-200">${v.example}</span>
              <div class="text-slate-400 dark:text-slate-500 mt-0.5">${v.exTrans}</div>
            </div>
          </td>
          <td class="py-3 px-4 text-xs font-medium text-slate-500">${v.category}</td>
        </tr>
      `;
    }).join('');
  },

  filterVocab(cat) {
    const searchInput = document.getElementById('vocab-search-input');
    const query = searchInput ? searchInput.value : '';
    this.renderVocabulary(query, cat);
  },

  // --------------------------------------------------------------------------
  // RENDER: VERBS LIST
  // --------------------------------------------------------------------------
  renderVerbs(query = '') {
    const container = document.getElementById('verbs-container');
    if (!container) return;

    let items = GERMAN_DATA.verbs;
    if (query.trim() !== '') {
      const q = query.toLowerCase().trim();
      items = items.filter(v => v.infinitive.toLowerCase().includes(q) || v.meaning.toLowerCase().includes(q));
    }

    container.innerHTML = items.map(v => `
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>${v.infinitive}</span>
              <button onclick="SpeechEngine.speak('${v.infinitive}')" class="text-slate-400 hover:text-amber-500 transition text-sm">🔊</button>
            </h4>
            <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${v.auxiliary === 'sein' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}">
              Perfekt: + ${v.auxiliary}
            </span>
          </div>
          <p class="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">${v.meaning}</p>
          
          <div class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <div><span class="text-slate-400">Präsens:</span> <strong>${v.present}</strong></div>
            <div><span class="text-slate-400">Präteritum:</span> <strong>${v.preterite}</strong> | <span class="text-slate-400">Partizip II:</span> <strong>${v.participle}</strong></div>
          </div>
        </div>

        <div class="text-xs border-t border-slate-100 dark:border-slate-700/80 pt-3">
          <p class="text-slate-800 dark:text-slate-200 font-medium italic">"${v.example}"</p>
          <p class="text-slate-400 dark:text-slate-500 mt-0.5">${v.exTrans}</p>
        </div>
      </div>
    `).join('');
  },

  // --------------------------------------------------------------------------
  // RENDER: CONVERSATIONAL PHRASES
  // --------------------------------------------------------------------------
  renderPhrases() {
    const container = document.getElementById('phrases-grid');
    if (!container) return;

    container.innerHTML = GERMAN_DATA.phrases.map(p => `
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="text-base font-bold text-slate-900 dark:text-white leading-snug">${p.german}</h4>
            <button onclick="SpeechEngine.speak('${p.german.replace(/'/g, "\\'")}')" class="text-slate-400 hover:text-amber-500 transition flex-shrink-0 text-base" title="Listen">🔊</button>
          </div>
          <p class="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">${p.english}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">📍 Context: ${p.context}</p>
        </div>
        ${p.response ? `
          <div class="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <span class="text-slate-400">Typical response:</span>
            <div class="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">${p.response}</div>
          </div>
        ` : ''}
      </div>
    `).join('');
  },

  // --------------------------------------------------------------------------
  // RENDER: FALSE FRIENDS
  // --------------------------------------------------------------------------
  renderFalseFriends() {
    const container = document.getElementById('false-friends-grid');
    if (!container) return;

    container.innerHTML = GERMAN_DATA.falseFriends.map(ff => `
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-950 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <span class="text-lg font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <span>${ff.german}</span>
            <button onclick="SpeechEngine.speak('${ff.german}')" class="text-slate-400 hover:text-amber-500 text-sm">🔊</button>
          </span>
          <span class="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 px-2.5 py-0.5 rounded-full">
            ⚠️ Trap Alert
          </span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
          <div class="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200">
            <span class="block text-slate-400">Looks like English:</span>
            <strong class="line-through">${ff.looksLike}</strong>
          </div>
          <div class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-950 dark:text-emerald-200">
            <span class="block text-slate-400">Actually means:</span>
            <strong>${ff.actualMeaning}</strong>
          </div>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          ${ff.trapAlert}
        </p>
      </div>
    `).join('');
  },

  // --------------------------------------------------------------------------
  // RENDER: GRAMMAR RULES & CASES TABLE
  // --------------------------------------------------------------------------
  renderGrammar() {
    const casesBody = document.getElementById('cases-table-body');
    if (casesBody) {
      casesBody.innerHTML = GERMAN_DATA.grammar.casesTable.map(c => `
        <tr class="border-b border-slate-100 dark:border-slate-800 text-xs">
          <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">
            <div>${c.caseName}</div>
            <div class="text-[11px] text-slate-400 font-normal mt-0.5">${c.role}</div>
          </td>
          <td class="py-3 px-4 text-blue-600 dark:text-blue-400 font-bold">${c.mascDef} / ${c.mascIndef}</td>
          <td class="py-3 px-4 text-red-600 dark:text-red-400 font-bold">${c.femDef} / ${c.femIndef}</td>
          <td class="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">${c.neutDef} / ${c.neutIndef}</td>
          <td class="py-3 px-4 text-amber-600 dark:text-amber-400 font-bold">${c.plurDef} / ${c.plurIndef}</td>
        </tr>
      `).join('');
    }

    const prepsContainer = document.getElementById('prepositions-grid');
    if (prepsContainer) {
      prepsContainer.innerHTML = GERMAN_DATA.grammar.prepositionMnemonic.map(pm => `
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h4 class="font-bold text-slate-900 dark:text-white text-base mb-1">${pm.group}</h4>
          <p class="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">${pm.preps}</p>
          ${pm.rule ? `<p class="text-xs text-slate-500 dark:text-slate-400 mb-2"><strong>Rule:</strong> ${pm.rule}</p>` : ''}
          <div class="text-xs bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
            <strong>Example:</strong> <em>"${pm.example}"</em>
          </div>
        </div>
      `).join('');
    }
  }
};

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
