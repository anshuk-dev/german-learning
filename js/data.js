// ==============================================================================
// BLITZDEUTSCH COMPREHENSIVE DATA ENGINE
// High-yield vocabulary, phonetics rules, verbs, phrases, roadmap, and quizzes
// ==============================================================================

const GERMAN_DATA = {
  // ----------------------------------------------------------------------------
  // 1. PHONETICS & PRONUNCIATION DATA
  // ----------------------------------------------------------------------------
  phonetics: {
    alphabet: [
      { letter: 'A a', name: 'ah', ipa: '/aː/, /a/', example: 'der Apfel', meaning: 'the apple', audio: 'Apfel' },
      { letter: 'B b', name: 'beh', ipa: '/b/, [p]', example: 'das Buch', meaning: 'the book', audio: 'Buch', note: 'Voiced at start, voiceless /p/ at end of word' },
      { letter: 'C c', name: 'tseh', ipa: '/ts/, /k/', example: 'das Café', meaning: 'the café', audio: 'Café', note: 'Rare alone; usually in ch, ck' },
      { letter: 'D d', name: 'deh', ipa: '/d/, [t]', example: 'der Tag', meaning: 'the day', audio: 'Tag', note: 'Voiceless /t/ at end of word (Auslautverhärtung)' },
      { letter: 'E e', name: 'eh', ipa: '/eː/, /ɛ/, /ə/', example: 'das Essen', meaning: 'the food / eating', audio: 'Essen' },
      { letter: 'F f', name: 'eff', ipa: '/f/', example: 'die Familie', meaning: 'the family', audio: 'Familie' },
      { letter: 'G g', name: 'geh', ipa: '/ɡ/, [k]', example: 'gut', meaning: 'good', audio: 'gut', note: 'Sounds like /k/ at the end (Tag -> Tahk)' },
      { letter: 'H h', name: 'hah', ipa: '/h/, silent', example: 'das Haus', meaning: 'the house', audio: 'Haus', note: 'Silent after vowel, elongates vowel (sehen)' },
      { letter: 'I i', name: 'ee', ipa: '/iː/, /ɪ/', example: 'die Insel', meaning: 'the island', audio: 'Insel' },
      { letter: 'J j', name: 'yott', ipa: '/j/', example: 'das Jahr', meaning: 'the year', audio: 'Jahr', note: 'Always like English "Y" in "yes"' },
      { letter: 'K k', name: 'kah', ipa: '/k/', example: 'der Kaffee', meaning: 'the coffee', audio: 'Kaffee' },
      { letter: 'L l', name: 'ell', ipa: '/l/', example: 'das Leben', meaning: 'the life', audio: 'Leben', note: 'Clear European "L", never dark American "L"' },
      { letter: 'M m', name: 'emm', ipa: '/m/', example: 'die Musik', meaning: 'the music', audio: 'Musik' },
      { letter: 'N n', name: 'enn', ipa: '/n/', example: 'die Nacht', meaning: 'the night', audio: 'Nacht' },
      { letter: 'O o', name: 'oh', ipa: '/oː/, /ɔ/', example: 'die Sonne', meaning: 'the sun', audio: 'Sonne' },
      { letter: 'P p', name: 'peh', ipa: '/p/', example: 'der Platz', meaning: 'the square / seat', audio: 'Platz' },
      { letter: 'Q q', name: 'koo', ipa: '/kv/', example: 'die Quelle', meaning: 'the source / spring', audio: 'Quelle', note: 'Always "qu", pronounced "kv"' },
      { letter: 'R r', name: 'err', ipa: '/ʁ/, /ɐ/', example: 'die Reise', meaning: 'the trip', audio: 'Reise', note: 'Gargled throat "R" or vocalized /ɐ/ after vowel' },
      { letter: 'S s', name: 'ess', ipa: '/z/, /s/', example: 'die Sonne', meaning: 'the sun', audio: 'Sonne', note: 'Like English "Z" before vowels! Voiceless at end.' },
      { letter: 'T t', name: 'teh', ipa: '/t/', example: 'der Tee', meaning: 'the tea', audio: 'Tee' },
      { letter: 'U u', name: 'oo', ipa: '/uː/, /ʊ/', example: 'die Uhr', meaning: 'the clock / hour', audio: 'Uhr' },
      { letter: 'V v', name: 'fow', ipa: '/f/, /v/', example: 'der Vater', meaning: 'the father', audio: 'Vater', note: 'Almost always pronounced like English "F"!' },
      { letter: 'W w', name: 'veh', ipa: '/v/', example: 'das Wasser', meaning: 'the water', audio: 'Wasser', note: 'Always pronounced like English "V"!' },
      { letter: 'X x', name: 'iks', ipa: '/ks/', example: 'das Taxi', meaning: 'the taxi', audio: 'Taxi' },
      { letter: 'Y y', name: 'üpsilon', ipa: '/yː/, /j/', example: 'das System', meaning: 'the system', audio: 'System' },
      { letter: 'Z z', name: 'tsett', ipa: '/ts/', example: 'die Zeit', meaning: 'the time', audio: 'Zeit', note: 'Always pronounced like "TS" in "tsunami" or "cats"!' },
      // Special German Letters
      { letter: 'Ä ä', name: 'a-umlaut', ipa: '/ɛː/, /ɛ/', example: 'die Äpfel', meaning: 'the apples', audio: 'Äpfel', note: 'Sounds like "e" in "bed" or "air"' },
      { letter: 'Ö ö', name: 'o-umlaut', ipa: '/øː/, /œ/', example: 'schön', meaning: 'beautiful', audio: 'schön', note: 'Round lips as if for "O", then say "Ay"' },
      { letter: 'Ü ü', name: 'u-umlaut', ipa: '/yː/, /ʏ/', example: 'über', meaning: 'over / about', audio: 'über', note: 'Round lips as if for "Oo", then say "Ee"' },
      { letter: 'ß', name: 'Eszett / scharfes S', ipa: '/s/', example: 'die Straße', meaning: 'the street', audio: 'Straße', note: 'Sharp voiceless "S", never voiced. Follows long vowels.' }
    ],

    rules: [
      {
        id: 'rule-ei-ie',
        title: 'Rule 1: "ei" vs "ie" (The Walking Vowel Rule)',
        summary: 'ei = English "EYE" | ie = English "EE"',
        explanation: 'In German, when two vowels meet in these combinations, the second vowel decides the sound! "ei" has "i" second, which sounds like English "eye". "ie" has "e" second, sounding like English "ee".',
        mnemonic: 'Second vowel does the talking: e-I = EYE, i-E = EE.',
        examples: [
          { german: 'mein Wein', meaning: 'my wine', ipa: '/maɪn vaɪn/' },
          { german: 'das Bier', meaning: 'the beer', ipa: '/daːs biːɐ̯/' },
          { german: 'wie viel', meaning: 'how much', ipa: '/viː fiːl/' },
          { german: 'klein', meaning: 'small', ipa: '/klaɪn/' }
        ]
      },
      {
        id: 'rule-ch',
        title: 'Rule 2: "ch" - Soft Ich-Laut vs Hard Ach-Laut',
        summary: 'Soft hiss after e, i, ä, ö, ü | Throat rasp after a, o, u, au',
        explanation: 'German has two "ch" sounds: 1) The soft "Ich-Laut" (like a cat hiss or huge whisper "hy") after front vowels (ich, Milch, echt, Küche). 2) The hard "Ach-Laut" (raspy friction back of throat, like clearing throat) after back vowels a, o, u, au (Bach, Buch, Woche, auch).',
        mnemonic: 'Front mouth = soft cat hiss. Back mouth (A, O, U) = rough throat friction.',
        examples: [
          { german: 'ich möchte', meaning: 'I would like (soft ch)', ipa: '/ɪç ˈmœçtə/' },
          { german: 'das Buch', meaning: 'the book (hard ch)', ipa: '/daːs buːx/' },
          { german: 'die Nacht', meaning: 'the night (hard ch)', ipa: '/diː naxt/' },
          { german: 'sprechen', meaning: 'to speak (soft ch)', ipa: '/ˈʃpʁɛçn̩/' }
        ]
      },
      {
        id: 'rule-sp-st',
        title: 'Rule 3: "sp" and "st" at Word/Syllable Beginnings',
        summary: 'sp = "shp" | st = "sht"',
        explanation: 'Whenever a word or syllable root begins with "sp" or "st", the "s" turns into a soft "sh" sound (/ʃ/). English speakers often miss this!',
        mnemonic: 'Think "Sh-port" and "Sh-tadt"!',
        examples: [
          { german: 'der Sport', meaning: 'the sport ("shport")', ipa: '/ʃpɔʁt/' },
          { german: 'die Stadt', meaning: 'the city ("shtadt")', ipa: '/ʃtat/' },
          { german: 'sprechen', meaning: 'to speak ("shprechen")', ipa: '/ˈʃpʁɛçn̩/' },
          { german: 'verstehen', meaning: 'to understand ("fershteyen")', ipa: '/fɛɐ̯ˈʃteːən/' }
        ]
      },
      {
        id: 'rule-v-w',
        title: 'Rule 4: "V" sounds like "F", and "W" sounds like "V"',
        summary: 'V = /f/ | W = /v/',
        explanation: 'The letter V in native German words is always pronounced as an unvoiced "F" sound (Vater = Fah-ter). The letter W is always pronounced as a voiced English "V" sound (Wasser = Vasser).',
        mnemonic: 'German V flips to F, German W becomes V!',
        examples: [
          { german: 'der Vater', meaning: 'the father (pron. Fah-tah)', ipa: '/ˈfaːtɐ/' },
          { german: 'viel', meaning: 'much / a lot (pron. feel)', ipa: '/fiːl/' },
          { german: 'das Wasser', meaning: 'the water (pron. Vah-ssah)', ipa: '/ˈvasɐ/' },
          { german: 'wohnen', meaning: 'to live / reside (pron. voh-nen)', ipa: '/ˈvoːnən/' }
        ]
      },
      {
        id: 'rule-z',
        title: 'Rule 5: "Z" is Always "TS"',
        summary: 'Z = /ts/ (like "cats" or "pizza")',
        explanation: 'There is never a soft buzzing English "Z" sound in German. The letter Z is strictly pronounced as "TS", explosive and crisp.',
        mnemonic: 'Think of "tsunami" or the "ts" at the end of "cats".',
        examples: [
          { german: 'die Zeit', meaning: 'time (pron. Tsite)', ipa: '/tsaɪt/' },
          { german: 'zusammen', meaning: 'together (pron. tsoo-zah-men)', ipa: '/tsuˈzamən/' },
          { german: 'der Zug', meaning: 'the train (pron. Tsook)', ipa: '/tsuːk/' },
          { german: 'zwei', meaning: 'two (pron. tsvy)', ipa: '/tsvaɪ/' }
        ]
      },
      {
        id: 'rule-s-voiced',
        title: 'Rule 6: "S" before vowels is voiced like English "Z"',
        summary: 'S + vowel = voiced /z/ | End S / ss / ß = voiceless /s/',
        explanation: 'When a single "s" precedes a vowel at the beginning of a word or syllable, it is pronounced like an English "Z" (buzzing vocal cords). At the end of words or with double ss/ß, it is a crisp unvoiced "S".',
        mnemonic: 'Sonne sounds like "Zonne", Suppe sounds like "Zuppe".',
        examples: [
          { german: 'die Sonne', meaning: 'the sun (pron. Zonne)', ipa: '/ˈzɔnə/' },
          { german: 'sieben', meaning: 'seven (pron. zee-ben)', ipa: '/ˈziːbn̩/' },
          { german: 'der Bus', meaning: 'the bus (voiceless /s/)', ipa: '/bʊs/' },
          { german: 'die Straße', meaning: 'the street (sharp /s/)', ipa: '/ˈʃtʁaːsə/' }
        ]
      },
      {
        id: 'rule-end-er-ig',
        title: 'Rule 7: Endings "-er" and "-ig"',
        summary: '-er -> relaxed "ah" /ɐ/ | -ig -> soft "ich" /ɪç/',
        explanation: 'In standard High German, an unstressed "-er" at the end of a word is vocalized into an open, relaxed vowel sound resembling "ah" (Wasser -> Vass-ah, Mutter -> Mutt-ah). The ending "-ig" is pronounced softly as "-ich" (richtig -> richt-ich, zwanzig -> tsvan-tsich).',
        mnemonic: 'Don\'t roll the final "er", relax it to "ah"! Say "richt-ich" not "richt-ik".',
        examples: [
          { german: 'das Wasser', meaning: 'the water ("vass-ah")', ipa: '/ˈvasɐ/' },
          { german: 'die Mutter', meaning: 'the mother ("mutt-ah")', ipa: '/ˈmʊtɐ/' },
          { german: 'richtig', meaning: 'correct / right ("richt-ich")', ipa: '/ˈʁɪçtɪç/' },
          { german: 'wichtig', meaning: 'important ("wicht-ich")', ipa: '/ˈvɪçtɪç/' }
        ]
      },
      {
        id: 'rule-auslaut',
        title: 'Rule 8: Auslautverhärtung (Final Consonant Hardening)',
        summary: 'Final b -> p | d -> t | g -> k',
        explanation: 'Whenever voiced consonants b, d, g appear at the end of a syllable or word, German speakers automatically devoice them to p, t, k. This is why German sounds crisp and rhythmic!',
        mnemonic: 'Word ends in D? Say T! Ends in G? Say K! Ends in B? Say P!',
        examples: [
          { german: 'der Hund', meaning: 'the dog (sounds like "Hunt")', ipa: '/hʊnt/' },
          { german: 'der Tag', meaning: 'the day (sounds like "Tahk")', ipa: '/taːk/' },
          { german: 'das Geld', meaning: 'the money (sounds like "Gelt")', ipa: '/ɡɛlt/' },
          { german: 'ab', meaning: 'off / from (sounds like "Ap")', ipa: '/ap/' }
        ]
      }
    ],

    minimalPairs: [
      { word1: 'schon', mean1: 'already', word2: 'schön', mean2: 'beautiful', note: 'Standard O vs Rounded lips Ö' },
      { word1: 'bieten', mean1: 'to offer', word2: 'bitten', mean2: 'to ask/beg', note: 'Long tense [iː] vs short lax [ɪ]' },
      { word1: 'die Höhle', mean1: 'the cave', word2: 'die Hölle', mean2: 'hell', note: 'Long Ö vs short Ö' },
      { word1: 'der Weg', mean1: 'the path/way', word2: 'weg', mean2: 'away/gone', note: 'Long [eː] vs short [ɛ]' },
      { word1: 'fühlen', mean1: 'to feel', word2: 'füllen', mean2: 'to fill', note: 'Long Ü vs short Ü' },
      { word1: 'der Staat', mean1: 'the state', word2: 'die Stadt', mean2: 'the city', note: 'Long [aː] vs short crisp [a]' }
    ]
  },

  // ----------------------------------------------------------------------------
  // 2. CEFR ACCELERATED ROADMAP (A1 -> B1)
  // ----------------------------------------------------------------------------
  roadmap: [
    {
      level: 'A1.1',
      title: 'Phase 1: Phonetics & Survival Engine',
      duration: 'Week 1–2 (Days 1–14)',
      focus: 'Sound system, high-frequency survival core, basic present tense, gender decoding',
      color: 'blue',
      milestones: [
        { id: 'm1', title: 'Master German Alphabet & 12 Golden Phonetic Rules', desc: 'Accurately pronounce umlauts (ä, ö, ü), ß, ei/ie, and Auslautverhärtung with audio tester.' },
        { id: 'm2', title: 'Top 50 Core Survival Chunks', desc: 'Greetings, polite requests (Bitte, Danke, Entschuldigung, Auf Wiedersehen), numbers 1-100.' },
        { id: 'm3', title: 'Power Verbs: Sein (to be) & Haben (to have)', desc: 'Conjugate the two building blocks of all German speech across all personal pronouns.' },
        { id: 'm4', title: 'Der, Die, Das Suffix Hacking System', desc: 'Stop memorizing articles blindly! Master predictable endings: -ung, -heit, -keit (Die), -chen (Das), -or (Der).' },
        { id: 'm5', title: 'The V2 Sentence Blueprint', desc: 'The golden rule of German: in main statements, the conjugated verb ALWAYS sits in position 2!' }
      ]
    },
    {
      level: 'A1.2',
      title: 'Phase 2: Conversational Sentences & Accusative Case',
      duration: 'Week 3–4 (Days 15–28)',
      focus: 'Modal verbs, direct objects (Akkusativ), asking questions, daily life interactions',
      color: 'indigo',
      milestones: [
        { id: 'm6', title: 'The 6 Modal Verbs (The Conversation Multiplier)', desc: 'können (can), müssen (must), wollen (want), dürfen (allowed to), sollen (should), möchten (would like).' },
        { id: 'm7', title: 'Master the Akkusativ (Direct Object) Case', desc: 'Only masculine changes: Der -> Den, Ein -> Einen. Feminine, Neuter, and Plural stay identical!' },
        { id: 'm8', title: 'Top 100 High-Frequency Present Tense Verbs', desc: 'Regular stem endings (-e, -st, -t, -en, -t, -en) plus stem-changing verbs (sehen -> sieht, essen -> isst).' },
        { id: 'm9', title: 'Ja/Nein Questions & W-Questions', desc: 'Form questions instantly by flipping verb to Position 1 (Kommst du?) or with W-words (Wo, Wann, Wie, Warum).' },
        { id: 'm10', title: 'Real-world Simulations: Cafe, Shopping, Directions', desc: 'Confidently order food, ask for the check (Die Rechnung bitte), and ask for directions.' }
      ]
    },
    {
      level: 'A2.1',
      title: 'Phase 3: The Past Tense & The Dative Case',
      duration: 'Week 5–7 (Days 29–49)',
      focus: 'Das Perfekt (spoken past), indirect objects (Dativ), prepositions that control cases',
      color: 'teal',
      milestones: [
        { id: 'm11', title: 'Das Perfekt: Spoken Past Tense', desc: 'Combine haben/sein + Partizip II (ge- -t / ge- -en). Learn when to use sein (movement & state change).' },
        { id: 'm12', title: 'The Dativ Case (Indirect Object / Recipient)', desc: 'The "giving" case: Dem (masc), Der (fem), Dem (neut), Den + -n (plural). Mir, dir, ihm, ihr.' },
        { id: 'm13', title: 'Prepositions: FUDOG (Accusative) vs AUS-BEI-MIT... (Dative)', desc: 'Accusative: Für, Um, Durch, Ohne, Gegen. Dative: Aus, Bei, Mit, Nach, Seit, Von, Zu.' },
        { id: 'm14', title: 'Two-Way Prepositions (Wechselpräpositionen)', desc: 'Movement/Direction (Wohin?) = Akkusativ. Stationary/Location (Wo?) = Dativ (in, an, auf, vor, hinter).' },
        { id: 'm15', title: 'Separable Verbs (Trennbare Verben)', desc: 'Prefix splits and shoots to sentence end: einkaufen -> Ich kaufe im Supermarkt ein.' }
      ]
    },
    {
      level: 'A2.2',
      title: 'Phase 4: Complex Thoughts & Subordinate Clauses',
      duration: 'Week 8–10 (Days 50–70)',
      focus: 'Subordinate clauses (weil, dass, wenn), reflexives, comparative adjectives, TeKaMoLo',
      color: 'emerald',
      milestones: [
        { id: 'm16', title: 'Subordinate Clauses & Verb-Kicker Rules', desc: 'Connect thoughts with weil (because), dass (that), wenn (if/when), obwohl (although) -> verb kicks to very end!' },
        { id: 'm17', title: 'TeKaMoLo Word Order Blueprint', desc: 'Natural German adverb order: Temporal (when) -> Kausal (why) -> Modal (how) -> Lokal (where).' },
        { id: 'm18', title: 'Reflexive Verbs (sich freuen, sich fühlen)', desc: 'Expressing feelings and routines: Ich freue mich, Ich wasche mir die Hände.' },
        { id: 'm19', title: 'Adjective Endings & Comparisons', desc: 'Comparative (schneller als) and Superlative (am schnellsten), essential adjective declension patterns.' },
        { id: 'm20', title: 'Expressing Opinions, Agreement & Disagreement', desc: 'Ich denke, dass... Meiner Meinung nach... Ich bin damit (nicht) einverstanden.' }
      ]
    },
    {
      level: 'B1',
      title: 'Phase 5: Conversational Independence & Polish',
      duration: 'Week 11–14 (Days 71–100)',
      focus: 'Konjunktiv II (wishes/politeness), relative clauses, passive voice, natural fluency',
      color: 'purple',
      milestones: [
        { id: 'm21', title: 'Konjunktiv II: Politeness & Hypotheticals', desc: 'Master würde + infinitive, hätte (would have), wäre (would be), könnte (could).' },
        { id: 'm22', title: 'Relative Clauses (Relativsätze)', desc: 'Connect descriptions seamlessly: Das ist der Mann, den ich gestern gesehen habe.' },
        { id: 'm23', title: 'Passive Voice Fundamentals (Passiv)', desc: 'Describing processes in work and news: Das Auto wird repariert (The car is being repaired).' },
        { id: 'm24', title: 'Written Past (Präteritum) for Core Verbs', desc: 'Recognize war, hatte, ging, kam, sagte in newspapers, books, and formal emails.' },
        { id: 'm25', title: 'B1 Fluency Simulation: 500 Active Flashcards Complete', desc: 'Achieve conversational autonomy: express opinions, argue points, resolve travel/work hurdles.' }
      ]
    }
  ],

  // ----------------------------------------------------------------------------
  // 3. ESSENTIAL HIGH-FREQUENCY VOCABULARY (PARETO 80/20)
  // ----------------------------------------------------------------------------
  vocabulary: [
    // Essentials & Greetings
    { id: 'v1', german: 'Hallo', english: 'Hello', category: 'Greetings', gender: null, audio: 'Hallo', example: 'Hallo, wie geht es dir?', exTrans: 'Hello, how are you?' },
    { id: 'v2', german: 'Guten Morgen', english: 'Good morning', category: 'Greetings', gender: null, audio: 'Guten Morgen', example: 'Guten Morgen, haben Sie gut geschlafen?', exTrans: 'Good morning, did you sleep well?' },
    { id: 'v3', german: 'Guten Tag', english: 'Good day / Hello', category: 'Greetings', gender: null, audio: 'Guten Tag', example: 'Guten Tag, wie kann ich helfen?', exTrans: 'Good day, how can I help?' },
    { id: 'v4', german: 'Guten Abend', english: 'Good evening', category: 'Greetings', gender: null, audio: 'Guten Abend', example: 'Guten Abend allerseits!', exTrans: 'Good evening everyone!' },
    { id: 'v5', german: 'Tschüss', english: 'Bye (informal)', category: 'Greetings', gender: null, audio: 'Tschüss', example: 'Tschüss, bis morgen!', exTrans: 'Bye, see you tomorrow!' },
    { id: 'v6', german: 'Auf Wiedersehen', english: 'Goodbye (formal)', category: 'Greetings', gender: null, audio: 'Auf Wiedersehen', example: 'Auf Wiedersehen, Frau Müller.', exTrans: 'Goodbye, Mrs. Müller.' },
    { id: 'v7', german: 'Bitte', english: 'Please / You are welcome', category: 'Greetings', gender: null, audio: 'Bitte', example: 'Einen Kaffee, bitte.', exTrans: 'A coffee, please.' },
    { id: 'v8', german: 'Danke schön', english: 'Thank you very much', category: 'Greetings', gender: null, audio: 'Danke schön', example: 'Danke schön für deine Hilfe.', exTrans: 'Thank you very much for your help.' },
    { id: 'v9', german: 'Entschuldigung', english: 'Excuse me / Sorry', category: 'Greetings', gender: 'die', audio: 'Entschuldigung', example: 'Entschuldigung, wo ist der Bahnhof?', exTrans: 'Excuse me, where is the train station?' },
    { id: 'v10', german: 'Es tut mir leid', english: 'I am sorry', category: 'Greetings', gender: null, audio: 'Es tut mir leid', example: 'Es tut mir leid, ich bin zu spät.', exTrans: 'I am sorry, I am too late.' },
    { id: 'v11', german: 'Ja / Nein / Vielleicht', english: 'Yes / No / Maybe', category: 'Essentials', gender: null, audio: 'Ja, Nein, Vielleicht', example: 'Ja, das stimmt genau.', exTrans: 'Yes, that is completely correct.' },
    { id: 'v12', german: 'Alles klar', english: 'All right / Got it', category: 'Essentials', gender: null, audio: 'Alles klar', example: 'Alles klar, machen wir so.', exTrans: 'All right, let us do it that way.' },

    // Food & Dining
    { id: 'v13', german: 'das Wasser', english: 'the water', category: 'Food & Drinks', gender: 'das', audio: 'das Wasser', example: 'Ich trinke gerne kaltes Wasser.', exTrans: 'I like drinking cold water.' },
    { id: 'v14', german: 'das Brot', english: 'the bread', category: 'Food & Drinks', gender: 'das', audio: 'das Brot', example: 'Deutsches Brot schmeckt fantastisch.', exTrans: 'German bread tastes fantastic.' },
    { id: 'v15', german: 'der Kaffee', english: 'the coffee', category: 'Food & Drinks', gender: 'der', audio: 'der Kaffee', example: 'Möchten Sie einen Kaffee?', exTrans: 'Would you like a coffee?' },
    { id: 'v16', german: 'der Tee', english: 'the tea', category: 'Food & Drinks', gender: 'der', audio: 'der Tee', example: 'Ich trinke morgens schwarzen Tee.', exTrans: 'I drink black tea in the morning.' },
    { id: 'v17', german: 'das Bier', english: 'the beer', category: 'Food & Drinks', gender: 'das', audio: 'das Bier', example: 'Ein Bier bitte!', exTrans: 'A beer please!' },
    { id: 'v18', german: 'der Käse', english: 'the cheese', category: 'Food & Drinks', gender: 'der', audio: 'der Käse', example: 'Ich esse Brot mit Käse.', exTrans: 'I eat bread with cheese.' },
    { id: 'v19', german: 'der Apfel', english: 'the apple', category: 'Food & Drinks', gender: 'der', audio: 'der Apfel', example: 'Ein Apfel am Tag hält gesund.', exTrans: 'An apple a day keeps you healthy.' },
    { id: 'v20', german: 'die Rechnung', english: 'the bill / check', category: 'Food & Drinks', gender: 'die', audio: 'die Rechnung', example: 'Wir möchten bezahlen, die Rechnung bitte!', exTrans: 'We would like to pay, the bill please!' },
    { id: 'v21', german: 'das Restaurant', english: 'the restaurant', category: 'Food & Drinks', gender: 'das', audio: 'das Restaurant', example: 'Das Restaurant ist heute voll.', exTrans: 'The restaurant is full today.' },
    { id: 'v22', german: 'das Frühstück', english: 'breakfast', category: 'Food & Drinks', gender: 'das', audio: 'das Frühstück', example: 'Was gibt es zum Frühstück?', exTrans: 'What is there for breakfast?' },

    // Travel, Transport & Places
    { id: 'v23', german: 'der Bahnhof', english: 'train station', category: 'Travel & Transport', gender: 'der', audio: 'der Bahnhof', example: 'Der Hauptbahnhof ist in der Nähe.', exTrans: 'The central station is nearby.' },
    { id: 'v24', german: 'der Zug', english: 'the train', category: 'Travel & Transport', gender: 'der', audio: 'der Zug', example: 'Der Zug fährt um acht Uhr ab.', exTrans: 'The train departs at eight o\'clock.' },
    { id: 'v25', german: 'der Flughafen', english: 'the airport', category: 'Travel & Transport', gender: 'der', audio: 'der Flughafen', example: 'Wie komme ich zum Flughafen?', exTrans: 'How do I get to the airport?' },
    { id: 'v26', german: 'die Fahrkarte', english: 'the ticket (transit)', category: 'Travel & Transport', gender: 'die', audio: 'die Fahrkarte', example: 'Ich muss eine Fahrkarte kaufen.', exTrans: 'I have to buy a ticket.' },
    { id: 'v27', german: 'die Straße', english: 'the street', category: 'Travel & Transport', gender: 'die', audio: 'die Straße', example: 'Biegen Sie in diese Straße ab.', exTrans: 'Turn into this street.' },
    { id: 'v28', german: 'das Hotel', english: 'the hotel', category: 'Travel & Transport', gender: 'das', audio: 'das Hotel', example: 'Das Hotel hat freie Zimmer.', exTrans: 'The hotel has free rooms.' },
    { id: 'v29', german: 'die Stadt', english: 'the city', category: 'Travel & Transport', gender: 'die', audio: 'die Stadt', example: 'Berlin ist eine lebendige Stadt.', exTrans: 'Berlin is a vibrant city.' },
    { id: 'v30', german: 'das Auto', english: 'the car', category: 'Travel & Transport', gender: 'das', audio: 'das Auto', example: 'Mein Auto steht vor der Tür.', exTrans: 'My car is parked in front of the door.' },

    // Time, Calendar & Numbers
    { id: 'v31', german: 'heute', english: 'today', category: 'Time', gender: null, audio: 'heute', example: 'Heute lerne ich Deutsch.', exTrans: 'Today I learn German.' },
    { id: 'v32', german: 'morgen', english: 'tomorrow', category: 'Time', gender: null, audio: 'morgen', example: 'Morgen habe ich einen Termin.', exTrans: 'Tomorrow I have an appointment.' },
    { id: 'v33', german: 'gestern', english: 'yesterday', category: 'Time', gender: null, audio: 'gestern', example: 'Gestern war das Wetter herrlich.', exTrans: 'Yesterday the weather was wonderful.' },
    { id: 'v34', german: 'die Zeit', english: 'time', category: 'Time', gender: 'die', audio: 'die Zeit', example: 'Ich habe jetzt Zeit.', exTrans: 'I have time right now.' },
    { id: 'v35', german: 'die Woche', english: 'the week', category: 'Time', gender: 'die', audio: 'die Woche', example: 'Diese Woche vergeht schnell.', exTrans: 'This week is passing quickly.' },
    { id: 'v36', german: 'das Jahr', english: 'the year', category: 'Time', gender: 'das', audio: 'das Jahr', example: 'Ein neues Jahr beginnt.', exTrans: 'A new year begins.' },
    { id: 'v37', german: 'die Stunde', english: 'the hour / lesson', category: 'Time', gender: 'die', audio: 'die Stunde', example: 'In einer Stunde bin ich da.', exTrans: 'In an hour I will be there.' },
    { id: 'v38', german: 'jetzt / später', english: 'now / later', category: 'Time', gender: null, audio: 'jetzt später', example: 'Nicht jetzt, sondern später.', exTrans: 'Not now, but later.' },

    // People, Family & Work
    { id: 'v39', german: 'der Mann', english: 'the man / husband', category: 'People & Family', gender: 'der', audio: 'der Mann', example: 'Der Mann spricht drei Sprachen.', exTrans: 'The man speaks three languages.' },
    { id: 'v40', german: 'die Frau', english: 'the woman / wife / Mrs.', category: 'People & Family', gender: 'die', audio: 'die Frau', example: 'Die Frau leitet das Projekt.', exTrans: 'The woman manages the project.' },
    { id: 'v41', german: 'das Kind', english: 'the child', category: 'People & Family', gender: 'das', audio: 'das Kind', example: 'Das Kind spielt im Garten.', exTrans: 'The child plays in the garden.' },
    { id: 'v42', german: 'der Freund', english: 'the friend / boyfriend', category: 'People & Family', gender: 'der', audio: 'der Freund', example: 'Mein bester Freund wohnt in München.', exTrans: 'My best friend lives in Munich.' },
    { id: 'v43', german: 'die Arbeit', english: 'the work / job', category: 'Work & Daily Life', gender: 'die', audio: 'die Arbeit', example: 'Ich beginne um 9 Uhr mit der Arbeit.', exTrans: 'I start work at 9 o\'clock.' },
    { id: 'v44', german: 'der Beruf', english: 'the profession / occupation', category: 'Work & Daily Life', gender: 'der', audio: 'der Beruf', example: 'Was sind Sie von Beruf?', exTrans: 'What is your occupation?' },
    { id: 'v45', german: 'das Geld', english: 'the money', category: 'Work & Daily Life', gender: 'das', audio: 'das Geld', example: 'Zeit ist Geld.', exTrans: 'Time is money.' },
    { id: 'v46', german: 'das Haus', english: 'the house', category: 'Work & Daily Life', gender: 'das', audio: 'das Haus', example: 'Wir gehen nach Hause.', exTrans: 'We are going home.' },
    { id: 'v47', german: 'die Wohnung', english: 'the apartment / flat', category: 'Work & Daily Life', gender: 'die', audio: 'die Wohnung', example: 'Die Wohnung hat drei Zimmer.', exTrans: 'The apartment has three rooms.' },
    { id: 'v48', german: 'die Frage', english: 'the question', category: 'Essentials', gender: 'die', audio: 'die Frage', example: 'Darf ich eine Frage stellen?', exTrans: 'May I ask a question?' },
    { id: 'v49', german: 'die Antwort', english: 'the answer', category: 'Essentials', gender: 'die', audio: 'die Antwort', example: 'Das ist die richtige Antwort.', exTrans: 'That is the correct answer.' },
    { id: 'v50', german: 'das Problem', english: 'the problem', category: 'Essentials', gender: 'das', audio: 'das Problem', example: 'Kein Problem, das machen wir!', exTrans: 'No problem, we will do it!' }
  ],

  // ----------------------------------------------------------------------------
  // 4. TOP 50 MOST ESSENTIAL VERBS (WITH CONJUGATIONS & AUXILIARIES)
  // ----------------------------------------------------------------------------
  verbs: [
    {
      infinitive: 'sein',
      meaning: 'to be',
      auxiliary: 'sein',
      present: 'ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind',
      preterite: 'war',
      participle: 'gewesen',
      example: 'Ich bin glücklich.',
      exTrans: 'I am happy.',
      level: 'A1'
    },
    {
      infinitive: 'haben',
      meaning: 'to have',
      auxiliary: 'haben',
      present: 'ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben',
      preterite: 'hatte',
      participle: 'gehabt',
      example: 'Wir haben einen Traum.',
      exTrans: 'We have a dream.',
      level: 'A1'
    },
    {
      infinitive: 'werden',
      meaning: 'to become / will (future auxiliary)',
      auxiliary: 'sein',
      present: 'ich werde, du wirst, er/sie/es wird, wir werden, ihr werdet, sie/Sie werden',
      preterite: 'wurde',
      participle: 'geworden',
      example: 'Es wird bald dunkel.',
      exTrans: 'It will soon become dark.',
      level: 'A1'
    },
    {
      infinitive: 'können',
      meaning: 'can / to be able to (Modal)',
      auxiliary: 'haben',
      present: 'ich kann, du kannst, er/sie/es kann, wir können, ihr könnt, sie/Sie können',
      preterite: 'konnte',
      participle: 'gekonnt',
      example: 'Kannst du Deutsch sprechen?',
      exTrans: 'Can you speak German?',
      level: 'A1'
    },
    {
      infinitive: 'müssen',
      meaning: 'must / to have to (Modal)',
      auxiliary: 'haben',
      present: 'ich muss, du musst, er/sie/es muss, wir müssen, ihr müsst, sie/Sie müssen',
      preterite: 'musste',
      participle: 'gemusst',
      example: 'Ich muss heute viel lernen.',
      exTrans: 'I have to study a lot today.',
      level: 'A1'
    },
    {
      infinitive: 'wollen',
      meaning: 'to want (Modal)',
      auxiliary: 'haben',
      present: 'ich will, du willst, er/sie/es will, wir wollen, ihr wollt, sie/Sie wollen',
      preterite: 'wollte',
      participle: 'gewollt',
      example: 'Wir wollen nach Deutschland reisen.',
      exTrans: 'We want to travel to Germany.',
      level: 'A1'
    },
    {
      infinitive: 'machen',
      meaning: 'to do / to make',
      auxiliary: 'haben',
      present: 'ich mache, du machst, er/sie/es macht, wir machen, ihr macht, sie/Sie machen',
      preterite: 'machte',
      participle: 'gemacht',
      example: 'Was machst du am Wochenende?',
      exTrans: 'What are you doing at the weekend?',
      level: 'A1'
    },
    {
      infinitive: 'gehen',
      meaning: 'to go / to walk',
      auxiliary: 'sein',
      present: 'ich gehe, du gehst, er/sie/es geht, wir gehen, ihr geht, sie/Sie gehen',
      preterite: 'ging',
      participle: 'gegangen',
      example: 'Wie geht es dir? - Es geht mir gut.',
      exTrans: 'How are you? - I am doing well.',
      level: 'A1'
    },
    {
      infinitive: 'kommen',
      meaning: 'to come',
      auxiliary: 'sein',
      present: 'ich komme, du kommst, er/sie/es kommt, wir kommen, ihr kommt, sie/Sie kommen',
      preterite: 'kam',
      participle: 'gekommen',
      example: 'Woher kommst du? - Ich komme aus Indien.',
      exTrans: 'Where do you come from? - I come from India.',
      level: 'A1'
    },
    {
      infinitive: 'sagen',
      meaning: 'to say / to tell',
      auxiliary: 'haben',
      present: 'ich sage, du sagst, er/sie/es sagt, wir sagen, ihr sagt, sie/Sie sagen',
      preterite: 'sagte',
      participle: 'gesagt',
      example: 'Was hast du gesagt?',
      exTrans: 'What did you say?',
      level: 'A1'
    },
    {
      infinitive: 'sehen',
      meaning: 'to see',
      auxiliary: 'haben',
      present: 'ich sehe, du siehst, er/sie/es sieht, wir sehen, ihr seht, sie/Sie sehen',
      preterite: 'sah',
      participle: 'gesehen',
      example: 'Ich sehe die schöne Stadt.',
      exTrans: 'I see the beautiful city.',
      level: 'A1'
    },
    {
      infinitive: 'geben',
      meaning: 'to give',
      auxiliary: 'haben',
      present: 'ich gebe, du gibst, er/sie/es gibt, wir geben, ihr gebt, sie/Sie geben',
      preterite: 'gab',
      participle: 'gegeben',
      example: 'Es gibt viele Möglichkeiten.',
      exTrans: 'There are many possibilities (Es gibt = There is/are).',
      level: 'A1'
    },
    {
      infinitive: 'wissen',
      meaning: 'to know (a fact)',
      auxiliary: 'haben',
      present: 'ich weiß, du weißt, er/sie/es weiß, wir wissen, ihr wisst, sie/Sie wissen',
      preterite: 'wusste',
      participle: 'gewusst',
      example: 'Ich weiß es nicht genau.',
      exTrans: 'I do not know for sure.',
      level: 'A1'
    },
    {
      infinitive: 'sprechen',
      meaning: 'to speak',
      auxiliary: 'haben',
      present: 'ich spreche, du sprichst, er/sie/es spricht, wir sprechen, ihr sprecht, sie/Sie sprechen',
      preterite: 'sprach',
      participle: 'gesprochen',
      example: 'Sprechen Sie Deutsch?',
      exTrans: 'Do you speak German?',
      level: 'A1'
    },
    {
      infinitive: 'verstehen',
      meaning: 'to understand',
      auxiliary: 'haben',
      present: 'ich verstehe, du verstehst, er/sie/es versteht, wir verstehen, ihr versteht, sie/Sie verstehen',
      preterite: 'verstand',
      participle: 'verstanden',
      example: 'Ich verstehe nur Bahnhof! (Idiom)',
      exTrans: 'It\'s all Greek to me! (Lit: I only understand train station!)',
      level: 'A1'
    },
    {
      infinitive: 'arbeiten',
      meaning: 'to work',
      auxiliary: 'haben',
      present: 'ich arbeite, du arbeitest, er/sie/es arbeitet, wir arbeiten, ihr arbeitet, sie/Sie arbeiten',
      preterite: 'arbeitete',
      participle: 'gearbeitet',
      example: 'Ich arbeite als Softwareentwickler.',
      exTrans: 'I work as a software developer.',
      level: 'A1'
    },
    {
      infinitive: 'brauchen',
      meaning: 'to need',
      auxiliary: 'haben',
      present: 'ich brauche, du brauchst, er/sie/es braucht, wir brauchen, ihr braucht, sie/Sie brauchen',
      preterite: 'brauchte',
      participle: 'gebraucht',
      example: 'Brauchst du Hilfe?',
      exTrans: 'Do you need help?',
      level: 'A1'
    },
    {
      infinitive: 'finden',
      meaning: 'to find / to think (opinion)',
      auxiliary: 'haben',
      present: 'ich finde, du findest, er/sie/es findet, wir finden, ihr findet, sie/Sie finden',
      preterite: 'fand',
      participle: 'gefunden',
      example: 'Ich finde Deutsch sehr logisch.',
      exTrans: 'I find German very logical.',
      level: 'A1'
    },
    {
      infinitive: 'bleiben',
      meaning: 'to stay / remain',
      auxiliary: 'sein',
      present: 'ich bleibe, du bleibst, er/sie/es bleibt, wir bleiben, ihr bleibt, sie/Sie bleiben',
      preterite: 'blieb',
      participle: 'geblieben',
      example: 'Wir bleiben heute zu Hause.',
      exTrans: 'We are staying at home today.',
      level: 'A2'
    },
    {
      infinitive: 'ankommen',
      meaning: 'to arrive (separable: an + kommen)',
      auxiliary: 'sein',
      present: 'ich komme an, du kommst an, er/sie/es kommt an, wir kommen an',
      preterite: 'kam an',
      participle: 'angekommen',
      example: 'Wann kommt der Zug an?',
      exTrans: 'When does the train arrive?',
      level: 'A2'
    }
  ],

  // ----------------------------------------------------------------------------
  // 5. CONVERSATIONAL PHRASES & IDIOMS (NATURAL SPEECH)
  // ----------------------------------------------------------------------------
  phrases: [
    {
      german: 'Wie geht\'s?',
      english: 'How is it going?',
      context: 'Daily informal greeting',
      response: 'Gut, danke! Und dir? (Good, thanks! And you?)'
    },
    {
      german: 'Ich heiße... / Mein Name ist...',
      english: 'My name is...',
      context: 'Self introduction',
      response: 'Freut mich! (Pleased to meet you!)'
    },
    {
      german: 'Ich lerne Deutsch, weil ich in Deutschland leben möchte.',
      english: 'I am learning German because I would like to live in Germany.',
      context: 'Explaining your motivation (Subordinate clause with weil + verb at end)'
    },
    {
      german: 'Könnten Sie das bitte wiederholen?',
      english: 'Could you please repeat that? (Polite Konjunktiv II)',
      context: 'When someone speaks too fast'
    },
    {
      german: 'Sprechen Sie bitte ein bisschen langsamer.',
      english: 'Please speak a bit slower.',
      context: 'Essential learner life-saver'
    },
    {
      german: 'Was bedeutet dieses Wort auf Englisch?',
      english: 'What does this word mean in English?',
      context: 'Asking for meaning'
    },
    {
      german: 'Ich hätte gern einen Kaffee mit Milch.',
      english: 'I would like to have a coffee with milk.',
      context: 'Ordering politely in a café'
    },
    {
      german: 'Zahlen, bitte! / Die Rechnung, bitte!',
      english: 'The check / bill please!',
      context: 'Paying at a restaurant'
    },
    {
      german: 'Getrennt oder zusammen?',
      english: 'Separate or together? (Standard German restaurant question)',
      context: 'When paying: Germans almost always split the bill!'
    },
    {
      german: 'Das ist mir Wurst! (Idiom)',
      english: 'I don\'t care! / It makes no difference to me! (Lit: That is sausage to me!)',
      context: 'Very common German colloquial idiom'
    },
    {
      german: 'Ich drücke dir die Daumen! (Idiom)',
      english: 'I keep my fingers crossed for you! (Lit: I press the thumbs for you!)',
      context: 'Wishing someone luck before an exam or interview'
    },
    {
      german: 'Alles Gute zum Geburtstag!',
      english: 'Happy Birthday! (Lit: All the best for your birthday!)',
      context: 'Celebrations'
    }
  ],

  // ----------------------------------------------------------------------------
  // 6. FALSE FRIENDS ("FALSCHE FREUNDE") - TRAPS FOR ENGLISH SPEAKERS
  // ----------------------------------------------------------------------------
  falseFriends: [
    {
      german: 'bekommen',
      looksLike: 'to become',
      actualMeaning: 'to get / receive',
      correctWordForLooksLike: 'werden (= to become)',
      trapAlert: 'Never say "I become a steak" in a restaurant! In German, "Ich bekomme ein Steak" means "I will get a steak". If you say "Ich werde ein Steak", you say you are turning into a piece of meat!'
    },
    {
      german: 'das Gift',
      looksLike: 'a gift / present',
      actualMeaning: 'poison / venom',
      correctWordForLooksLike: 'das Geschenk (= gift/present)',
      trapAlert: 'Never tell a German friend you brought them some "Gift"! You would be saying you brought them poison. A present is "ein Geschenk".'
    },
    {
      german: 'der Chef',
      looksLike: 'chef (culinary)',
      actualMeaning: 'boss / manager / supervisor',
      correctWordForLooksLike: 'der Koch (= culinary cook/chef)',
      trapAlert: 'Your "Chef" at work is your company boss or manager. A cooking chef is "der Koch".'
    },
    {
      german: 'bald',
      looksLike: 'bald (hairless)',
      actualMeaning: 'soon',
      correctWordForLooksLike: 'kahl / glatzköpfig (= bald/hairless)',
      trapAlert: '"Bis bald!" means "See you soon!", NOT "Until you lose your hair!"'
    },
    {
      german: 'aktuell',
      looksLike: 'actual',
      actualMeaning: 'current / topical / up-to-date',
      correctWordForLooksLike: 'tatsächlich / wirklich (= actual/real)',
      trapAlert: '"Aktuelle Nachrichten" means "current news", not "actual news".'
    },
    {
      german: 'brav',
      looksLike: 'brave',
      actualMeaning: 'well-behaved / obedient (kids or pets)',
      correctWordForLooksLike: 'mutig (= brave/courageous)',
      trapAlert: 'If you praise someone for being "brav", you mean they follow rules politely like a good boy, not that they are fearless!'
    },
    {
      german: 'die Fabrik',
      looksLike: 'fabric (cloth)',
      actualMeaning: 'factory / manufacturing plant',
      correctWordForLooksLike: 'der Stoff (= fabric/cloth)',
      trapAlert: 'A "Fabrik" is where industrial production happens, not clothing textile.'
    },
    {
      german: 'sensibel',
      looksLike: 'sensible',
      actualMeaning: 'sensitive',
      correctWordForLooksLike: 'vernünftig (= sensible/prudent)',
      trapAlert: '"Er ist sehr sensibel" means he is very emotionally sensitive, not that he makes sensible choices.'
    }
  ],

  // ----------------------------------------------------------------------------
  // 7. GRAMMAR ENGINE CHEAT-SHEETS & SUFFIX RULES
  // ----------------------------------------------------------------------------
  grammar: {
    genderRules: {
      der: {
        gender: 'Masculine (Der)',
        color: '#2563eb', // Blue
        suffixes: ['-or (Motor, Professor)', '-ling (Schmetterling)', '-ismus (Optimismus)', '-ist (Journalist)', '-ant (Praktikant)', '-er (Agent nouns: Fahrer, Lehrer)'],
        categories: ['Days of week (Montag, Dienstag)', 'Months & Seasons (Januar, Sommer)', 'Compass directions (Norden, Süden)', 'Car brands & Alcoholic drinks (except das Bier)']
      },
      die: {
        gender: 'Feminine (Die)',
        color: '#dc2626', // Red
        suffixes: ['-ung (Wohnung, Hoffnung)', '-heit (Freiheit, Gesundheit)', '-keit (Möglichkeit)', '-schaft (Freundschaft)', '-tät (Universität)', '-ion (Station)', '-ik (Musik)', '-ei (Bäckerei)', '-in (Lehrerin, Ärztin)'],
        categories: ['90% of nouns ending in "-e" (Katze, Lampe, Blume)', 'Names of ships and motorbikes', 'Numbers as nouns (die Eins)']
      },
      das: {
        gender: 'Neuter (Das)',
        color: '#16a34a', // Green
        suffixes: ['-chen (Mädchen, Brötchen)', '-lein (Fräulein)', '-ment (Dokument)', '-um (Zentrum, Museum)', '-tum (Eigentum)', '-ma (Thema, Drama)'],
        categories: ['Verbs turned into nouns (das Essen, das Leben)', 'Colors as nouns (das Blau)', 'Fractions (das Drittel)', 'Metals (das Gold, das Silber)']
      }
    },
    casesTable: [
      { caseName: 'Nominativ (Subject)', role: 'The person/thing doing the action ("Wer?")', mascDef: 'der', mascIndef: 'ein', femDef: 'die', femIndef: 'eine', neutDef: 'das', neutIndef: 'ein', plurDef: 'die', plurIndef: 'keine' },
      { caseName: 'Akkusativ (Direct Object)', role: 'The receiver of the action ("Wen / Was?")', mascDef: 'den', mascIndef: 'einen', femDef: 'die', femIndef: 'eine', neutDef: 'das', neutIndef: 'ein', plurDef: 'die', plurIndef: 'keine' },
      { caseName: 'Dativ (Indirect Object)', role: 'Recipient / benefactor ("Wem?")', mascDef: 'dem', mascIndef: 'einem', femDef: 'der', femIndef: 'einer', neutDef: 'dem', neutIndef: 'einem', plurDef: 'den +n', plurIndef: 'keinen +n' },
      { caseName: 'Genitiv (Possession)', role: 'Possession / "of" ("Wessen?")', mascDef: 'des +s', mascIndef: 'eines +s', femDef: 'der', femIndef: 'einer', neutDef: 'des +s', neutIndef: 'eines +s', plurDef: 'der', plurIndef: 'keiner' }
    ],
    prepositionMnemonic: [
      { group: 'Always Akkusativ (FUDOG)', preps: 'Für (for), Um (around/at), Durch (through), Ohne (without), Gegen (against)', example: 'Ohne dich kann ich nicht gehen.' },
      { group: 'Always Dativ (AUS-BEI-MIT-NACH-SEIT-VON-ZU)', preps: 'Aus (out of), Bei (at/with), Mit (with), Nach (after/to), Seit (since), Von (from), Zu (to)', example: 'Ich fahre mit dem Bus zur Arbeit.' },
      { group: 'Two-Way (Wechselpräpositionen)', preps: 'An, Auf, Hinter, In, Neben, Über, Unter, Vor, Zwischen', rule: 'Movement towards (Wohin?) -> Akkusativ | Location/stationary (Wo?) -> Dativ', example: 'Ich gehe in das (ins) Kino (Akk). Ich bin im (in dem) Kino (Dat).' }
    ]
  },

  // ----------------------------------------------------------------------------
  // 8. INTERACTIVE QUIZZES
  // ----------------------------------------------------------------------------
  quizzes: [
    {
      id: 'q1',
      type: 'gender',
      question: 'Which gender article belongs to "Wohnung" (apartment)?',
      hint: 'Look at the suffix "-ung"!',
      options: ['der', 'die', 'das'],
      answer: 'die',
      explanation: 'Any German noun ending with the suffix "-ung" is ALWAYS feminine (die). E.g., die Wohnung, die Zeitung, die Hoffnung.'
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'How is the word "Wasser" pronounced in German?',
      options: ['Like English "Wass-er"', 'Like "Vass-ah" (/ˈvasɐ/)', 'Like "Vass-err"', 'Like "Wass-ah"'],
      answer: 'Like "Vass-ah" (/ˈvasɐ/)',
      explanation: 'In German: W is pronounced like English V, and final unstressed "-er" is vocalized into a soft "ah" sound.'
    },
    {
      id: 'q3',
      type: 'grammar',
      question: 'Complete the sentence in Akkusativ: "Ich kaufe _____ (the/masculine) Tisch."',
      options: ['der', 'den', 'dem', 'das'],
      answer: 'den',
      explanation: 'In the Akkusativ case (direct object), the masculine article changes from "der" to "den". "Ich kaufe den Tisch."'
    },
    {
      id: 'q4',
      type: 'false-friends',
      question: 'You are at a bakery and want to ask for a bread roll. What should you say?',
      options: [
        'Ich werde ein Brötchen.',
        'Ich bekomme bitte ein Brötchen.',
        'Ich habe ein Gift für Sie.',
        'Ich bin ein Brötchen.'
      ],
      answer: 'Ich bekomme bitte ein Brötchen.',
      explanation: '"bekommen" means "to receive/get". "Ich werde ein Brötchen" would mean "I will turn into a bread roll"!'
    },
    {
      id: 'q5',
      type: 'word-order',
      question: 'Where does the conjugated verb go in a German main statement (V2 rule)?',
      options: [
        'At the very end of the sentence',
        'Always at the very beginning',
        'Always in Position 2 (the second grammatical element)',
        'Position doesn\'t matter'
      ],
      answer: 'Always in Position 2 (the second grammatical element)',
      explanation: 'The German V2 rule states that the finite verb ALWAYS occupies the 2nd position in main clauses, regardless of whether the sentence starts with the subject, time, or place!'
    },
    {
      id: 'q6',
      type: 'subordinate',
      question: 'What happens to the verb in a "weil" (because) clause?',
      options: [
        'It stays in position 2',
        'It kicks all the way to the very end of the clause',
        'It comes right after "weil"',
        'It disappears'
      ],
      answer: 'It kicks all the way to the very end of the clause',
      explanation: 'Subordinating conjunctions like "weil", "dass", "wenn", and "obwohl" kick the conjugated verb to the very end of the clause: "Ich lerne, weil ich Deutsch sprechen will."'
    },
    {
      id: 'q7',
      type: 'phonetics',
      question: 'How do you pronounce "zwei" (two) correctly?',
      options: ['z-way', 'ts-vy', 'sway', 'tway'],
      answer: 'ts-vy',
      explanation: 'German "z" is always "ts", "w" is always "v", and "ei" sounds like English "eye". Therefore "zwei" = "ts-vy"!'
    },
    {
      id: 'q8',
      type: 'dative',
      question: 'Choose the correct Dative preposition: "Ich fahre _____ dem Bus."',
      options: ['ohne', 'für', 'mit', 'durch'],
      answer: 'mit',
      explanation: '"mit" is always followed by the Dativ case (mit dem Bus). "ohne", "für", and "durch" take Akkusativ.'
    }
  ],

  // ----------------------------------------------------------------------------
  // 9. SENTENCE BUILDER CHALLENGES (WORD ORDER TRAINER)
  // ----------------------------------------------------------------------------
  sentenceBuilder: [
    {
      id: 'sb1',
      prompt: 'I drink water today.',
      rule: 'V2 Rule: "Heute" (Pos 1) -> Verb "trinke" (Pos 2) -> Subject "ich" (Pos 3)',
      correctOrder: ['Heute', 'trinke', 'ich', 'Wasser.'],
      scrambled: ['ich', 'Heute', 'Wasser.', 'trinke']
    },
    {
      id: 'sb2',
      prompt: 'I cannot come because I am sick.',
      rule: 'Subordinate clause: "weil" sends the conjugated verb "bin" to the end!',
      correctOrder: ['Ich', 'kann', 'nicht', 'kommen,', 'weil', 'ich', 'krank', 'bin.'],
      scrambled: ['krank', 'weil', 'kommen,', 'Ich', 'bin.', 'kann', 'ich', 'nicht']
    },
    {
      id: 'sb3',
      prompt: 'Can you please speak slower?',
      rule: 'Polite question: Modal verb "Können" in Pos 1, Infinitive "sprechen" at the end!',
      correctOrder: ['Können', 'Sie', 'bitte', 'langsamer', 'sprechen?'],
      scrambled: ['sprechen?', 'bitte', 'Können', 'langsamer', 'Sie']
    },
    {
      id: 'sb4',
      prompt: 'Yesterday I saw a beautiful film.',
      rule: 'Perfekt Tense: "habe" in Pos 2, past participle "gesehen" at the very end!',
      correctOrder: ['Gestern', 'habe', 'ich', 'einen', 'schönen', 'Film', 'gesehen.'],
      scrambled: ['gesehen.', 'habe', 'Film', 'Gestern', 'einen', 'ich', 'schönen']
    }
  ]
};

// Export for module/script usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GERMAN_DATA;
}
