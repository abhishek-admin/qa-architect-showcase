/* quiz.js — Quiz Arena + Interview Simulator */
(function initQuizArena() {
  var root = document.getElementById('quiz-root');
  if (!root) return;

  var OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
  var MODEL = 'openai/gpt-4o-mini';
  var LS_KEY = 'qa_quiz_history';

  var state = {
    sector: '',
    difficulty: '',
    mode: '',
    questions: [],
    currentIdx: 0,
    score: 0,
    answers: [],          // { question, modelAnswer, userAnswer, score, feedback, wrong }
    interviewLog: [],     // { role, content }
    interviewQA: [],      // { q, yourAnswer, correct } tracked per exchange
    timer: null,
    timeLeft: 1800,
    apiKey: localStorage.getItem('or_api_key') || '',
    loading: false,
    phase: 'setup',       // setup | quiz | review | interview | localreport | aireport
    localReport: null,    // built locally, no API needed
    aiReport: ''
  };

  var SECTORS = [
    { value: 'playwright', label: '🎭 Playwright' },
    { value: 'javascript', label: '⚡ JavaScript' },
    { value: 'typescript', label: '🔷 TypeScript' },
    { value: 'java',       label: '☕ Java' },
    { value: 'sql',        label: '🗄️ SQL' },
    { value: 'api',        label: '🔌 API Testing' },
    { value: 'bdd',        label: '🥒 BDD' },
    { value: 'all',        label: '🌐 All Sectors' }
  ];

  var DIFFICULTIES = [
    { value: 'basic',        label: '🟢 Basic' },
    { value: 'intermediate', label: '🟡 Intermediate' },
    { value: 'advanced',     label: '🔴 Advanced' },
    { value: 'mixed',        label: '🎲 Mixed' }
  ];

  /* ================================================================
     RENDER ROUTER
     ================================================================ */
  function render() {
    var map = { setup: renderSetup, quiz: renderQuestion, review: renderReview,
                interview: renderInterview, localreport: renderLocalReport, aireport: renderAiReport };
    if (map[state.phase]) map[state.phase]();
  }

  /* ================================================================
     SETUP
     ================================================================ */
  function renderSetup() {
    root.innerHTML =
      '<div class="quiz-setup-card">' +
        '<h2 class="quiz-title">🧠 Quiz Arena</h2>' +
        '<p class="quiz-subtitle">Practice questions · AI grading · Interview simulation</p>' +

        '<div class="quiz-field">' +
          '<label class="quiz-label">🔑 OpenRouter API Key <span class="quiz-label-opt">(for AI feedback only)</span></label>' +
          '<input id="quiz-apikey" type="password" class="quiz-input" placeholder="sk-or-..." value="' + escHtml(state.apiKey) + '">' +
        '</div>' +

        '<div class="quiz-field">' +
          '<label class="quiz-label">📚 Sector</label>' +
          '<div class="quiz-pill-group">' +
          SECTORS.map(function(s) {
            return '<button class="quiz-pill' + (state.sector === s.value ? ' active' : '') + '" data-quiz-sector="' + s.value + '">' + s.label + '</button>';
          }).join('') +
          '</div>' +
        '</div>' +

        (state.sector === 'all' ? renderCodingLangPicker() : '') +

        '<div class="quiz-field">' +
          '<label class="quiz-label">📊 Difficulty</label>' +
          '<div class="quiz-pill-group">' +
          DIFFICULTIES.map(function(d) {
            return '<button class="quiz-pill' + (state.difficulty === d.value ? ' active' : '') + '" data-quiz-diff="' + d.value + '">' + d.label + '</button>';
          }).join('') +
          '</div>' +
        '</div>' +

        '<div class="quiz-field">' +
          '<label class="quiz-label">🎮 Mode</label>' +
          '<div class="quiz-pill-group">' +
          '<button class="quiz-pill' + (state.mode === 'quiz' ? ' active' : '') + '" data-quiz-mode="quiz">⚡ Quick Quiz</button>' +
          '<button class="quiz-pill' + (state.mode === 'interview' ? ' active' : '') + '" data-quiz-mode="interview">🎙️ 30-Min Interview</button>' +
          '</div>' +
        '</div>' +

        '<button id="quiz-start-btn" class="quiz-start-btn"' + ((!state.sector || !state.difficulty || !state.mode) ? ' disabled' : '') + '>' +
          (state.mode === 'interview' ? '🎙️ Start Interview' : '▶ Start Quiz') +
        '</button>' +
      '</div>';
  }

  function renderCodingLangPicker() {
    return '<div class="quiz-field">' +
      '<label class="quiz-label">💻 Coding Language <span class="quiz-label-opt">(for Java questions)</span></label>' +
      '<div class="quiz-pill-group">' +
      '<button class="quiz-pill' + (state.codingLang === 'java' ? ' active' : '') + '" data-quiz-lang="java">☕ Java</button>' +
      '<button class="quiz-pill' + (state.codingLang === 'js' ? ' active' : '') + '" data-quiz-lang="js">⚡ JavaScript</button>' +
      '<button class="quiz-pill' + (state.codingLang === 'ts' ? ' active' : '') + '" data-quiz-lang="ts">🔷 TypeScript</button>' +
      '</div>' +
    '</div>';
  }

  /* ================================================================
     QUIZ QUESTION
     ================================================================ */
  function renderQuestion() {
    var q = state.questions[state.currentIdx];
    if (!q) { buildLocalReport(); state.phase = 'review'; render(); return; }
    var pct = Math.round((state.currentIdx / state.questions.length) * 100);

    root.innerHTML =
      '<div class="quiz-question-card">' +
        '<div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="quiz-meta">Q ' + (state.currentIdx + 1) + ' / ' + state.questions.length +
          ' &nbsp;·&nbsp; ' + capFirst(state.sector) + ' &nbsp;·&nbsp; ' + capFirst(state.difficulty) + '</div>' +
        '<div class="quiz-question-text">' + escHtml(q.q) + '</div>' +
        (q.hint ? '<div class="quiz-hint-box">💡 ' + escHtml(q.hint) + '</div>' : '') +
        '<textarea id="quiz-answer-input" class="quiz-textarea" placeholder="Type your answer..." rows="5"></textarea>' +
        '<div id="quiz-feedback" class="quiz-feedback" style="display:none"></div>' +
        '<div class="quiz-btn-row">' +
          '<button id="quiz-submit-btn" class="quiz-btn quiz-btn-primary">✅ Submit</button>' +
          '<button id="quiz-skip-btn" class="quiz-btn quiz-btn-secondary">⏭ Skip</button>' +
        '</div>' +
      '</div>';
  }

  /* ================================================================
     REVIEW (local, instant)
     ================================================================ */
  function renderReview() {
    if (!state.localReport) buildLocalReport();
    var lr = state.localReport;

    var wrongCards = lr.wrong.map(function(a, i) {
      return '<div class="review-wrong-card">' +
        '<div class="review-wrong-q">Q: ' + escHtml(a.question) + '</div>' +
        '<div class="review-wrong-yours"><span class="review-label-bad">Your answer:</span> ' + escHtml(a.userAnswer || '(skipped)') + '</div>' +
        '<div class="review-wrong-expected"><span class="review-label-good">Expected:</span> ' + escHtml(a.modelAnswer) + '</div>' +
        (a.feedback && a.feedback !== 'Skipped.' ? '<div class="review-wrong-fb">🤖 ' + escHtml(a.feedback) + '</div>' : '') +
      '</div>';
    }).join('');

    root.innerHTML =
      '<div class="quiz-review-card">' +
        '<h2>📊 Quiz Results</h2>' +
        '<div class="review-scoreboard">' +
          '<div class="review-score-tile review-score-right">✅ ' + lr.right + '<span>Correct</span></div>' +
          '<div class="review-score-tile review-score-wrong">❌ ' + lr.wrong.length + '<span>Needs Work</span></div>' +
          '<div class="review-score-tile review-score-skip">⏭ ' + lr.skipped + '<span>Skipped</span></div>' +
          '<div class="review-score-tile review-score-pct">' + lr.pct + '%<span>Score</span></div>' +
        '</div>' +
        (lr.wrong.length ? '<h3 class="review-section-label">📌 Wrong / Skipped — Expected Answers</h3>' + wrongCards : '<div class="review-all-good">🎉 All answered correctly!</div>') +
        '<div class="quiz-btn-row" style="margin-top:20px">' +
          '<button id="quiz-again-btn" class="quiz-btn quiz-btn-primary">🔄 Try Again</button>' +
          (state.apiKey ? '<button id="quiz-ai-report-btn" class="quiz-btn quiz-btn-secondary">🤖 AI Report</button>' : '') +
        '</div>' +
      '</div>';
  }

  /* ================================================================
     AI REPORT (quiz)
     ================================================================ */
  function renderAiReport() {
    root.innerHTML =
      '<div class="quiz-review-card">' +
        '<h2>🤖 AI Performance Report</h2>' +
        '<div id="ai-report-content" class="report-content">' +
          (state.loading ? '<div class="quiz-spinner">⏳ Generating…</div>' : formatReport(state.aiReport)) +
        '</div>' +
        '<div class="quiz-btn-row">' +
          '<button id="quiz-again-btn" class="quiz-btn quiz-btn-primary">🔄 New Quiz</button>' +
          '<button id="report-copy-btn" class="quiz-btn quiz-btn-secondary">📋 Copy</button>' +
        '</div>' +
      '</div>';
  }

  /* ================================================================
     INTERVIEW CHAT — improved UI
     ================================================================ */
  function renderInterview() {
    var msgs = state.interviewLog.map(function(m) {
      var isAI = m.role === 'assistant';
      return '<div class="iv-msg ' + (isAI ? 'iv-msg-ai' : 'iv-msg-user') + '">' +
        '<div class="iv-avatar">' + (isAI ? '🤖' : '👤') + '</div>' +
        '<div class="iv-bubble">' +
          '<div class="iv-name">' + (isAI ? 'Interviewer' : 'You') + '</div>' +
          '<div class="iv-text">' + escHtml(m.content) + '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    var m = String(Math.floor(state.timeLeft / 60)).padStart(2, '0');
    var s = String(state.timeLeft % 60).padStart(2, '0');
    var warn = state.timeLeft < 300;

    root.innerHTML =
      '<div class="iv-shell">' +
        '<div class="iv-topbar">' +
          '<div class="iv-topbar-left">' +
            '<span class="iv-dot"></span>' +
            '<span class="iv-title">🎙️ Interview &mdash; ' + capFirst(state.sector === 'all' ? 'All Sectors' : state.sector) + '</span>' +
          '</div>' +
          '<span id="interview-timer" class="iv-timer' + (warn ? ' iv-timer-warn' : '') + '">⏱ ' + m + ':' + s + '</span>' +
        '</div>' +
        '<div id="chat-window" class="iv-chat-window">' +
          (msgs || '<div class="iv-placeholder">Waiting for the interviewer to start…</div>') +
          (state.loading ? '<div class="iv-typing"><span></span><span></span><span></span></div>' : '') +
        '</div>' +
        '<div class="iv-input-area">' +
          '<textarea id="interview-input" class="iv-textarea" placeholder="Type your answer… (Enter to send, Shift+Enter for new line)" rows="3" ' + (state.loading ? 'disabled' : '') + '></textarea>' +
          '<button id="interview-send-btn" class="iv-send-btn" ' + (state.loading ? 'disabled' : '') + '>➤</button>' +
        '</div>' +
        '<div class="iv-footer">' +
          '<button id="interview-end-btn" class="quiz-btn quiz-btn-secondary" style="font-size:0.8rem;padding:6px 14px">🏁 End &amp; Get Report</button>' +
        '</div>' +
      '</div>';

    /* Only scroll to bottom when a new message was just added, not on every render */
    if (state._scrollToBottom) {
      var cw = document.getElementById('chat-window');
      if (cw) cw.scrollTop = cw.scrollHeight;
      state._scrollToBottom = false;
    }

    /* Block textarea scroll from bubbling into chat window */
    var ta = document.getElementById('interview-input');
    if (ta) {
      ta.focus();
      ta.addEventListener('wheel', function(e) { e.stopPropagation(); }, { passive: true });
      ta.addEventListener('scroll', function(e) { e.stopPropagation(); }, { passive: true });
    }
  }

  /* ================================================================
     LOCAL REPORT (interview) — shown first, no API
     ================================================================ */
  function renderLocalReport() {
    var lr = state.localReport;
    var wrongCards = (lr.wrong || []).map(function(a) {
      return '<div class="review-wrong-card">' +
        '<div class="review-wrong-q">Q: ' + escHtml(a.question) + '</div>' +
        '<div class="review-wrong-yours"><span class="review-label-bad">Your answer:</span> ' + escHtml(a.yourAnswer || '(not answered)') + '</div>' +
        (a.expected ? '<div class="review-wrong-expected"><span class="review-label-good">Expected:</span> ' + escHtml(a.expected) + '</div>' : '') +
      '</div>';
    }).join('');

    root.innerHTML =
      '<div class="quiz-review-card">' +
        '<h2>📋 Interview Summary</h2>' +
        '<div class="review-scoreboard">' +
          '<div class="review-score-tile review-score-right">✅ ' + (lr.right||0) + '<span>Good</span></div>' +
          '<div class="review-score-tile review-score-wrong">❌ ' + (lr.wrongCount||0) + '<span>Needs Work</span></div>' +
          '<div class="review-score-tile review-score-pct">' + (lr.exchanges||0) + '<span>Exchanges</span></div>' +
        '</div>' +
        (wrongCards ? '<h3 class="review-section-label">📌 Areas That Need Work</h3>' + wrongCards : '') +
        '<div class="quiz-btn-row" style="margin-top:20px">' +
          '<button id="quiz-again-btn" class="quiz-btn quiz-btn-primary">🔄 New Session</button>' +
          (state.apiKey ? '<button id="quiz-ai-report-btn" class="quiz-btn quiz-btn-secondary">🤖 Full AI Report</button>' : '') +
        '</div>' +
      '</div>';
  }

  /* ================================================================
     AI REPORT (interview)
     ================================================================ */
  function renderAiReport() {
    root.innerHTML =
      '<div class="quiz-review-card">' +
        '<h2>🤖 Interview Performance Report</h2>' +
        '<div id="ai-report-content" class="report-content">' +
          (state.loading ? '<div class="quiz-spinner">⏳ Generating…</div>' : formatReport(state.aiReport)) +
        '</div>' +
        '<div class="quiz-btn-row">' +
          '<button id="quiz-again-btn" class="quiz-btn quiz-btn-primary">🔄 New Session</button>' +
          '<button id="report-copy-btn" class="quiz-btn quiz-btn-secondary">📋 Copy</button>' +
        '</div>' +
      '</div>';
  }

  /* ================================================================
     OPENROUTER
     ================================================================ */
  async function gradeAnswer(question, modelAnswer, userAnswer) {
    if (!state.apiKey) return { score: null, feedback: '' };
    var prompt = 'Grade 1-10. Q: ' + question + '\nExpected: ' + modelAnswer + '\nAnswer: ' + userAnswer + '\nJSON: {"score":<1-10>,"feedback":"<1 sentence>"}';
    try {
      var res = await callOR([{ role: 'user', content: prompt }], 120);
      var txt = res.choices[0].message.content.trim().replace(/```json|```/g, '').trim();
      var j = JSON.parse(txt);
      return { score: j.score, feedback: j.feedback };
    } catch(e) { return { score: null, feedback: '' }; }
  }

  async function sendInterviewMessage(userMsg) {
    if (!state.apiKey) {
      state.interviewLog.push({ role: 'assistant', content: 'No API key set. Please add your OpenRouter key on the setup screen.' });
      state.loading = false; render(); return;
    }
    var sectorLabel = state.sector === 'all' ? 'full-stack QA' : (SECTORS.find(function(s){return s.value===state.sector;})||{}).label || state.sector;
    var sys = 'You are a concise technical interviewer for a ' + sectorLabel + ' role. Ask one focused question per turn. Give brief feedback (1 sentence) on the answer, then ask next question. After 8-10 questions or on end, stop and say INTERVIEW_COMPLETE.';
    var msgs = [{ role: 'system', content: sys }].concat(state.interviewLog).concat([{ role: 'user', content: userMsg }]);
    try {
      var res = await callOR(msgs, 300);
      var reply = res.choices[0].message.content;
      state.interviewLog.push({ role: 'user', content: userMsg });
      state.interviewLog.push({ role: 'assistant', content: reply });
    } catch(e) {
      state.interviewLog.push({ role: 'assistant', content: '⚠️ API error: ' + e.message });
    }
    state.loading = false;
    state._scrollToBottom = true;
    render();
  }

  async function generateAIReport() {
    if (!state.apiKey) { state.aiReport = 'No API key — AI report unavailable.'; state.loading = false; render(); return; }

    var wrongOnly = (state.localReport && state.localReport.wrong && state.localReport.wrong.length)
      ? state.localReport.wrong.map(function(w, i) {
          return (i+1) + '. Q: ' + (w.question||w.q||'?') + '\n   Given: ' + (w.userAnswer||w.yourAnswer||'skipped') + '\n   Expected: ' + (w.modelAnswer||w.expected||'');
        }).join('\n')
      : '';

    var prompt = state.mode === 'interview'
      ? 'Interview transcript (last 15 exchanges):\n' + state.interviewLog.slice(-30).map(function(m){ return (m.role==='user'?'C: ':'I: ')+m.content; }).join('\n') +
        (wrongOnly ? '\n\nWeak areas:\n' + wrongOnly : '') +
        '\n\nWrite: Rating/10, Strengths (3 bullets), Gaps (3 bullets with correct answer), 7-day study plan. Be specific, no filler.'
      : 'Quiz wrong answers:\n' + wrongOnly +
        '\nScore: ' + (state.localReport ? state.localReport.pct : '?') + '%' +
        '\n\nWrite: Gaps (bullet each wrong Q with correct answer explained in 2 sentences), 7-day study plan. No filler.';

    try {
      var res = await callOR([{ role: 'user', content: prompt }], 600);
      state.aiReport = res.choices[0].message.content;
    } catch(e) { state.aiReport = 'Report generation failed: ' + e.message; }
    /* Save to localStorage */
    saveHistory();
    state.loading = false; render();
  }

  function callOR(messages, maxTokens) {
    return fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + state.apiKey,
        'HTTP-Referer': 'chrome-extension://qa-showcase',
        'X-Title': 'QA Quiz'
      },
      body: JSON.stringify({ model: MODEL, messages: messages, max_tokens: maxTokens || 400 })
    }).then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }

  /* ================================================================
     LOCAL REPORT BUILDER
     ================================================================ */
  function buildLocalReport() {
    if (state.mode === 'quiz') {
      var wrong = state.answers.filter(function(a) { return !a.score || a.score < 7; });
      var right = state.answers.filter(function(a) { return a.score && a.score >= 7; }).length;
      var skipped = state.answers.filter(function(a) { return !a.userAnswer; }).length;
      var pct = state.answers.length ? Math.round((right / state.answers.length) * 100) : 0;
      state.localReport = { right: right, wrong: wrong, skipped: skipped, pct: pct };
    } else {
      /* Interview: parse interviewLog to find Q&A pairs */
      var wrongItems = [];
      var rightCount = 0;
      var exchanges = 0;
      for (var i = 0; i < state.interviewLog.length - 1; i++) {
        var msg = state.interviewLog[i];
        var next = state.interviewLog[i + 1];
        if (msg.role === 'assistant' && next && next.role === 'user') {
          exchanges++;
          /* Heuristic: if AI feedback contains 'good','great','correct','right','exactly','well' = positive */
          var aiFollowup = state.interviewLog[i + 2] ? state.interviewLog[i + 2].content || '' : '';
          var positive = /\b(good|great|correct|right|exactly|well done|nice|perfect|excellent)\b/i.test(aiFollowup);
          if (positive) { rightCount++; }
          else { wrongItems.push({ question: msg.content.slice(0, 200), yourAnswer: next.content.slice(0, 300) }); }
        }
      }
      state.localReport = { right: rightCount, wrongCount: wrongItems.length, wrong: wrongItems, exchanges: exchanges };
    }
    /* Persist to localStorage */
    saveHistory();
  }

  function saveHistory() {
    try {
      var history = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      history.unshift({
        ts: new Date().toISOString(),
        sector: state.sector,
        mode: state.mode,
        difficulty: state.difficulty,
        localReport: state.localReport,
        answers: state.answers.slice()
      });
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem(LS_KEY, JSON.stringify(history));
    } catch(e) {}
  }

  /* ================================================================
     EVENTS
     ================================================================ */
  function saveSetupInputs() {
    var k = document.getElementById('quiz-apikey');
    if (k && k.value.trim()) { state.apiKey = k.value.trim(); localStorage.setItem('or_api_key', state.apiKey); }
  }

  document.addEventListener('click', function(e) {
    var sectorBtn = e.target.closest('[data-quiz-sector]');
    if (sectorBtn && root.contains(sectorBtn)) {
      saveSetupInputs();
      state.sector = sectorBtn.getAttribute('data-quiz-sector');
      if (state.sector !== 'all') state.codingLang = '';
      render(); return;
    }
    var langBtn = e.target.closest('[data-quiz-lang]');
    if (langBtn && root.contains(langBtn)) {
      saveSetupInputs();
      state.codingLang = langBtn.getAttribute('data-quiz-lang');
      render(); return;
    }
    var diffBtn = e.target.closest('[data-quiz-diff]');
    if (diffBtn && root.contains(diffBtn)) {
      saveSetupInputs(); state.difficulty = diffBtn.getAttribute('data-quiz-diff'); render(); return;
    }
    var modeBtn = e.target.closest('[data-quiz-mode]');
    if (modeBtn && root.contains(modeBtn)) {
      saveSetupInputs(); state.mode = modeBtn.getAttribute('data-quiz-mode'); render(); return;
    }
    if (e.target.id === 'quiz-start-btn')       { saveSetupInputs(); startSession(); return; }
    if (e.target.id === 'quiz-submit-btn')       { submitAnswer(); return; }
    if (e.target.id === 'quiz-skip-btn')         { skipQuestion(); return; }
    if (e.target.id === 'quiz-next-btn')         { nextQuestion(); return; }
    if (e.target.id === 'quiz-again-btn')        { resetSession(); return; }
    if (e.target.id === 'quiz-ai-report-btn')    { state.phase = 'aireport'; state.loading = true; render(); generateAIReport(); return; }
    if (e.target.id === 'interview-send-btn')    { sendFromInterview(); return; }
    if (e.target.id === 'interview-end-btn')     { endInterview(); return; }
    if (e.target.id === 'report-copy-btn') {
      var el = document.getElementById('ai-report-content');
      if (el) navigator.clipboard.writeText(el.innerText).catch(function(){});
      e.target.textContent = '✅ Copied!'; return;
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.target.id === 'interview-input' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); sendFromInterview();
    }
  });

  /* ================================================================
     ACTIONS
     ================================================================ */
  function startSession() {
    if (state.sector === 'all') {
      state.questions = buildAllSectorQuestions();
    } else {
      state.questions = QA_QUESTIONS.getQuestions(state.sector, state.difficulty);
    }
    if (!state.questions.length) { alert('No questions found.'); return; }
    state.currentIdx = 0; state.score = 0; state.answers = [];
    state.interviewLog = []; state.localReport = null; state.aiReport = ''; state.timeLeft = 1800;

    if (state.mode === 'interview') {
      state.phase = 'interview'; state.loading = true; state._scrollToBottom = true; render(); startInterviewTimer();
      sendInterviewMessage('Ready. Start with your first question.');
    } else {
      state.phase = 'quiz'; render();
    }
  }

  function buildAllSectorQuestions() {
    var codeSectors = { java: 'java', js: 'javascript', ts: 'typescript' };
    var lang = state.codingLang || 'js';
    var nonCodeSectors = ['playwright', 'api', 'bdd', 'sql'];
    var codeSector = codeSectors[lang] || 'javascript';
    var all = [];
    nonCodeSectors.forEach(function(sec) {
      var qs = QA_QUESTIONS.getQuestions(sec, state.difficulty || 'mixed');
      all = all.concat(qs.slice(0, 3));
    });
    var codeQs = QA_QUESTIONS.getQuestions(codeSector, state.difficulty || 'mixed');
    all = all.concat(codeQs.slice(0, 4));
    /* shuffle */
    for (var i = all.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = all[i]; all[i] = all[j]; all[j] = tmp;
    }
    return all;
  }

  async function submitAnswer() {
    var input = document.getElementById('quiz-answer-input');
    var userAnswer = (input ? input.value : '').trim();
    var q = state.questions[state.currentIdx];
    var btn = document.getElementById('quiz-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Grading…'; }

    var result = await gradeAnswer(q.q, q.a, userAnswer);
    var wrong = !result.score || result.score < 7;
    state.answers.push({ question: q.q, modelAnswer: q.a, userAnswer: userAnswer, score: result.score, feedback: result.feedback, wrong: wrong });
    if (!wrong) state.score++;

    var fb = document.getElementById('quiz-feedback');
    if (fb) {
      fb.style.display = 'block';
      var scoreLabel = result.score !== null ? result.score + '/10' : '—';
      var scoreColor = result.score >= 7 ? '#48bb78' : result.score >= 4 ? '#ecc94b' : '#fc8181';
      fb.innerHTML =
        '<div class="fb-score" style="color:' + scoreColor + '">Score: <strong>' + scoreLabel + '</strong></div>' +
        (result.feedback ? '<div class="fb-text">' + escHtml(result.feedback) + '</div>' : '') +
        '<div class="fb-model"><strong>Expected:</strong> ' + escHtml(q.a) + '</div>' +
        '<button id="quiz-next-btn" class="quiz-btn quiz-btn-primary" style="margin-top:10px">Next ➡</button>';
    }
  }

  function nextQuestion() {
    state.currentIdx++;
    if (state.currentIdx >= state.questions.length) {
      buildLocalReport(); state.phase = 'review';
    }
    render();
  }

  function skipQuestion() {
    var q = state.questions[state.currentIdx];
    state.answers.push({ question: q.q, modelAnswer: q.a, userAnswer: '', score: 0, feedback: 'Skipped.', wrong: true });
    state.currentIdx++;
    if (state.currentIdx >= state.questions.length) { buildLocalReport(); state.phase = 'review'; }
    render();
  }

  function resetSession() {
    clearInterval(state.timer);
    state.phase = 'setup'; state.questions = []; state.currentIdx = 0;
    state.answers = []; state.interviewLog = []; state.localReport = null; state.aiReport = '';
    render();
  }

  function sendFromInterview() {
    var input = document.getElementById('interview-input');
    var text = (input ? input.value : '').trim();
    if (!text || state.loading) return;
    if (input) input.value = '';
    state.loading = true; render();
    sendInterviewMessage(text);
  }

  function endInterview() {
    clearInterval(state.timer);
    buildLocalReport();
    state.phase = 'localreport';
    render();
  }

  function startInterviewTimer() {
    clearInterval(state.timer);
    state.timer = setInterval(function() {
      state.timeLeft--;
      var el = document.getElementById('interview-timer');
      if (el) {
        var m = String(Math.floor(state.timeLeft / 60)).padStart(2, '0');
        var s = String(state.timeLeft % 60).padStart(2, '0');
        el.textContent = '⏱ ' + m + ':' + s;
        if (state.timeLeft < 300) el.classList.add('iv-timer-warn');
      }
      if (state.timeLeft <= 0) { clearInterval(state.timer); endInterview(); }
    }, 1000);
  }

  /* ================================================================
     UTILS
     ================================================================ */
  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function capFirst(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  function formatReport(text) {
    if (!text) return '';
    return '<pre style="white-space:pre-wrap;font-family:inherit;margin:0">' + escHtml(text) + '</pre>';
  }

  render();
})();
