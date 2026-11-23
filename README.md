# 🇩🇪 BlitzDeutsch — Accelerated German Learning Web App

> **Fast-track your German from zero to conversational autonomy (CEFR A1–B1)** using the Pareto 80/20 principle, sound-first phonetic decoding, comprehensible input, and interactive spaced-repetition practice with real-time browser speech synthesis and voice recognition.

🌐 **Live Accessible Web App Link:** [https://anshuk-dev.github.io/german-learning/](https://anshuk-dev.github.io/german-learning/)  
📦 **GitHub Repository:** [https://github.com/anshuk-dev/german-learning](https://github.com/anshuk-dev/german-learning)

---

## ⚡ The Accelerated Fast-Learning Methodology

Most traditional language courses overwhelm students with hundreds of irregular grammar charts and obscure vocabulary before they can order a coffee. **BlitzDeutsch operates on 4 proven pillars of rapid acquisition:**

1. **The 80/20 Pareto Principle**:
   - The top 500 German words make up **over 70% of daily conversational speech**. BlitzDeutsch prioritizes high-leverage power verbs (*sein, haben, können, müssen, wollen*), survival chunks, and essential connectors (*weil, dass, aber, deshalb*).
2. **Sound-First Phonetic Decoding (The 12 Golden Rules)**:
   - German spelling is **95% phonetically regular**. Once you learn the 12 sound rules (e.g., *ei* vs *ie*, soft *Ich-Laut* vs hard *Ach-Laut*, *sp/st* -> *shp/sht*, *w* = *v*, *v* = *f*, *z* = *ts*, and final consonant hardening), you can pronounce and read any written German word with confidence.
3. **Gender by Predictable Suffixes (Der/Die/Das Hack)**:
   - Stop blindly guessing articles! BlitzDeutsch teaches you the guaranteed suffix patterns:
     - **DIE (Feminine)**: `-ung`, `-heit`, `-keit`, `-schaft`, `-tät`, `-ion`, `-ik`, `-ei`, `-in` (100% predictable).
     - **DAS (Neuter)**: `-chen`, `-lein`, `-ment`, `-um`, `-tum`, `-ma`, verbs used as nouns (*das Essen*).
     - **DER (Masculine)**: `-or`, `-ling`, `-ismus`, `-ist`, `-ant`, agent nouns ending in `-er`.
4. **The V2 Pattern Engine**:
   - Instead of memorizing abstract syntax trees, learn the two universal German anchors:
     1. In main clauses, the conjugated verb is **always in Position 2** (V2 rule).
     2. In subordinate clauses (*weil, dass, wenn, obwohl*), the conjugated verb **kicks to the absolute end**.

---

## 🚀 Key Web App Features

- **🗺️ Interactive CEFR A1–B1 Roadmap**:
  - 5 structured phases (Phonetics & Survival, Core Sentence Machine, Past & Dative, Complex Thoughts & Subordinate Clauses, and B1 Fluency Bridge).
  - 25 actionable milestones with interactive completion checkboxes and XP progress bars saved in `localStorage`.
- **🗣️ Phonetics & Pronunciation Hub**:
  - Full German Alphabet with IPA notations, example words, and instant native audio pronunciation.
  - The 8 Golden Sound Rules with explanations and audio listening tests.
  - Minimal Pairs Trainer (distinguish subtle differences like *schon* vs *schön*, *bieten* vs *bitten*, *Höhle* vs *Hölle*).
- **🎙️ Voice Pronunciation Lab**:
  - Built-in Web Speech API (`SpeechSynthesis`) with speed controls (0.75x Slow, 0.9x Learner, 1.0x Native).
  - Speech Recognition microphone testing (`webkitSpeechRecognition`) to score your spoken German accuracy in real-time.
- **⚡ Interactive Practice Arena**:
  - **Spaced Repetition Flashcards**: 3D flip animation, category filters, audio playback, and Leitner-style ratings (Hard, Good, Easy) awarding XP.
  - **Sentence Builder (Word Order Challenge)**: Clickable word bubbles to construct sentences and master German V2 rules and verb kickers.
  - **Der / Die / Das Rapid Sprint**: Fast-paced gender drill with streak multiplier and suffix tips.
  - **Comprehension Quiz Arena**: Multiple-choice, listening, and grammar challenges with instant explanations and score tracking.
- **📖 Curated High-Yield Lists**:
  - 500 High-Frequency Vocabulary items categorized (Essentials, Travel, Food, Work, Time, Family) with color-coded gender badges and audio buttons.
  - 50 Power Verbs conjugated in Present, Präteritum, and Partizip II with auxiliary *haben/sein*.
  - Essential Survival Phrases & Idioms (*"Das ist mir Wurst!"*, *"Ich drücke dir die Daumen!"*).
  - False Friends (*Falsche Freunde*) Guide (e.g. *bekommen* = get/receive, NOT become; *Gift* = poison, NOT gift).
  - Grammar Blueprints (Cases table, Preposition mnemonics: FUDOG vs AUS-BEI-MIT...).
- **🌙 Modern Design & Usability**:
  - Dark / Light mode toggle.
  - Zero dependencies or complex build tools needed (HTML5, Tailwind CSS, ES6 Vanilla JS).
  - Works offline and fully responsive across mobile, tablet, and desktop devices.

---

## 📅 Recommended 25-Minute Daily Blitz Routine

| Time | Activity | Focus |
| :--- | :--- | :--- |
| **0–5 min** | **Phonetics Warmup** | Practice 3 minimal pairs and listen to letter rules in the Phonetics tab |
| **5–15 min** | **Active Flashcards** | Review 15–20 cards in the Practice Arena, flipping and repeating out loud |
| **15–20 min** | **Sentence Builder** | Assemble 2–3 sentences to reinforce the V2 and subordinate verb-kicker patterns |
| **20–25 min** | **Roadmap Check-in** | Complete a milestone in the Roadmap tab, mark it done, and track your streak |

---

## 🛠️ Local Development

To run the web app locally:

```bash
# Clone the repository
git clone https://github.com/anshuk-dev/german-learning.git
cd german-learning

# Open index.html in any modern browser
open index.html
# or with python server
python3 -m http.server 8000
```

---

## 📜 License
MIT License. Created to help language learners acquire German rapidly with joy and confidence.
