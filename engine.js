// AI Lab — Game Engine
(function () {
  "use strict";

  // ─── State ──────────────────────────────────────────
  const state = {
    xp: 0,
    streak: 0,
    lastPlayDate: null,
    completed: {},
    nickname: null,
    currentMission: null,
    currentTask: 0,
    taskScore: 0,
    totalScore: 0,
    sound: true,
  };

  // ─── Audio ──────────────────────────────────────────
  let ctx = null;
  function tone(freq, dur, type = "sine", vol = 0.1) {
    if (!state.sound) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch (e) {}
  }
  function sfxCorrect() { tone(600, 0.08); setTimeout(() => tone(800, 0.12), 80); }
  function sfxWrong() { tone(200, 0.2, "sawtooth", 0.07); }
  function sfxComplete() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.15), i * 100)); }
  function sfxClick() { tone(500, 0.03, "sine", 0.06); }
  function sfxType() { tone(800 + Math.random() * 400, 0.02, "sine", 0.03); }

  // ─── Persistence ────────────────────────────────────
  function save() {
    localStorage.setItem("ai-lab-save", JSON.stringify({
      xp: state.xp, streak: state.streak, lastPlayDate: state.lastPlayDate,
      completed: state.completed, nickname: state.nickname, sound: state.sound,
    }));
  }
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem("ai-lab-save") || "{}");
      Object.assign(state, { xp: s.xp || 0, streak: s.streak || 0,
        lastPlayDate: s.lastPlayDate, completed: s.completed || {},
        nickname: s.nickname || null, sound: s.sound !== false });
    } catch (e) {}
  }

  // ─── DOM ────────────────────────────────────────────
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => (p || document).querySelectorAll(s);

  function show(id) {
    $$(".screen").forEach(s => s.classList.remove("active"));
    $(`#${id}`).classList.add("active");
  }

  function toast(text) {
    const t = $("#xp-toast");
    t.textContent = text;
    t.classList.remove("show");
    t.offsetHeight;
    t.classList.add("show");
  }

  function addXP(amount) {
    state.xp += amount;
    $("#header-xp").textContent = state.xp;
    toast(`+${amount} XP`);
    save();
  }

  // ─── Typing animation ──────────────────────────────
  function typeText(el, text, speed = 40) {
    return new Promise(resolve => {
      let i = 0;
      el.textContent = "";
      const iv = setInterval(() => {
        if (i < text.length) {
          el.textContent += text[i];
          sfxType();
          i++;
        } else {
          clearInterval(iv);
          resolve();
        }
      }, speed);
    });
  }

  // ─── Simulate AI output ─────────────────────────────
  function simulateAI(el, text, speed = 20) {
    return new Promise(resolve => {
      el.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
      setTimeout(() => {
        let i = 0;
        el.textContent = "";
        el.style.color = "var(--text)";
        const iv = setInterval(() => {
          if (i < text.length) {
            el.textContent += text[i];
            i++;
          } else {
            clearInterval(iv);
            resolve();
          }
        }, speed);
      }, 800);
    });
  }

  // ─── Story Screen ───────────────────────────────────
  function findCurrentChapter() {
    for (let i = 0; i < MISSIONS.length; i++) {
      if (!state.completed[MISSIONS[i].id]) return i;
    }
    return MISSIONS.length; // all done
  }

  function renderStory() {
    $("#header-xp").textContent = state.xp;
    $("#header-streak").textContent = state.streak;

    // Streak check
    const todayStr = new Date().toDateString();
    if (state.lastPlayDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      state.streak = (state.lastPlayDate === yesterday.toDateString()) ? state.streak + 1 : 1;
      state.lastPlayDate = todayStr;
      save();
      $("#header-streak").textContent = state.streak;
    }

    const chapterIdx = findCurrentChapter();
    const content = $("#story-content");

    // All chapters done
    if (chapterIdx >= MISSIONS.length) {
      content.innerHTML = `
        <div style="text-align:center;padding:60px 0">
          <div style="font-size:3rem;margin-bottom:16px">\u{1F3C6}</div>
          <h2 style="color:var(--text);font-size:1.5rem;margin-bottom:8px">Week Voltooid</h2>
          <p style="color:var(--text-dim);margin-bottom:24px">Je hebt je eerste week bij Nova overleefd. En je weet nu meer over AI dan 90% van je collega's.</p>
          <div style="font-family:var(--mono);font-size:0.8rem;color:var(--cyan)">${state.xp} XP verdiend</div>
        </div>
      `;
      return;
    }

    const chapter = MISSIONS[chapterIdx];

    // Show story intro then start button
    content.innerHTML = `
      <div class="story-chapter">
        <div class="chapter-header">
          <div class="chapter-tag" style="color:${chapter.tagColor};background:${chapter.colorDim}">${chapter.tag}</div>
          <div class="chapter-title">${chapter.name}</div>
        </div>
        <div class="story-text" id="story-intro-text"></div>
        <div class="story-progress-row">
          <div class="story-progress-dots" id="story-dots"></div>
        </div>
        <button class="action-btn story-start-btn" id="story-start">Beginnen</button>
      </div>
      ${chapterIdx > 0 ? `<div class="story-recap"><div style="font-family:var(--mono);font-size:0.65rem;color:var(--text-muted);letter-spacing:1px;margin-bottom:8px">EERDER BIJ NOVA</div>${renderRecap(chapterIdx)}</div>` : ""}
    `;

    // Type the story intro
    const introEl = content.querySelector("#story-intro-text");
    const introText = chapter.storyIntro || chapter.desc;
    typeStoryText(introEl, introText);

    // Progress dots
    const dotsEl = content.querySelector("#story-dots");
    MISSIONS.forEach((m, i) => {
      const dot = document.createElement("div");
      dot.className = "story-dot" + (i < chapterIdx ? " done" : i === chapterIdx ? " current" : "");
      dot.title = m.name;
      dotsEl.appendChild(dot);
    });

    content.querySelector("#story-start").addEventListener("click", () => {
      sfxClick();
      startMission(chapter);
    });
  }

  function renderRecap(upToIdx) {
    let html = "";
    for (let i = 0; i < upToIdx; i++) {
      const m = MISSIONS[i];
      html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:0.8rem">
        <span style="color:var(--green)">\u2713</span>
        <span style="color:var(--text-dim)">${m.tag}:</span>
        <span style="color:var(--text)">${m.name}</span>
      </div>`;
    }
    return html;
  }

  function typeStoryText(el, text) {
    const words = text.split(" ");
    let i = 0;
    el.textContent = "";
    const iv = setInterval(() => {
      if (i < words.length) {
        el.textContent += (i > 0 ? " " : "") + words[i];
        i++;
      } else {
        clearInterval(iv);
      }
    }, 60);
  }

  // ─── Mission Flow ───────────────────────────────────
  function startMission(mission) {
    state.currentMission = mission;
    state.currentTask = 0;
    state.totalScore = 0;
    show("story-screen");
    renderTask();
  }

  function renderTask() {
    const mission = state.currentMission;
    const task = mission.tasks[state.currentTask];
    const total = mission.tasks.length;

    const content = $("#story-content");
    content.innerHTML = `
      <div class="task-progress-bar">
        <div class="task-progress-fill" style="width:${(state.currentTask / total) * 100}%"></div>
      </div>
    `;

    // Task card
    const card = document.createElement("div");
    card.className = "task-card";
    card.innerHTML = `
      <div class="task-label">${task.label}</div>
      <div class="task-title">${task.title}</div>
      <div class="task-desc">${task.desc}</div>
      <div id="interaction-area"></div>
    `;
    content.appendChild(card);

    // Render interaction based on type
    const area = card.querySelector("#interaction-area");
    const type = task.interaction.type;

    const renderers = {
      "prompt-build": renderPromptBuild,
      "temperature-slider": renderTemperatureSlider,
      "prompt-fix": renderPromptFix,
      "scan-text": renderScanText,
      "bias-simulator": renderBiasSimulator,
      "build-checklist": renderBuildChecklist,
      "compare-scenarios": renderCompareScenarios,
      "agent-builder": renderAgentBuilder,
      "find-config-errors": renderFindConfigErrors,
      "chat-simulator": renderChatSimulator,
      "model-compare": renderModelCompare,
      "sort-safe-unsafe": renderSortSafeUnsafe,
      "transform-text": renderTransformText,
      "role-compare": renderRoleCompare,
    };
    const renderer = renderers[type];
    if (renderer) renderer(area, task);
  }

  function nextTask() {
    state.currentTask++;
    if (state.currentTask < state.currentMission.tasks.length) {
      renderTask();
    } else {
      finishMission();
    }
  }

  function finishMission() {
    const mission = state.currentMission;
    state.completed[mission.id] = true;
    addXP(mission.xp);
    sfxComplete();

    const pct = state.totalScore / mission.tasks.length;
    const grade = pct >= 0.9 ? "S" : pct >= 0.7 ? "A" : pct >= 0.5 ? "B" : "C";

    const nextChapter = MISSIONS[MISSIONS.indexOf(mission) + 1];
    const content = $("#story-content");
    content.innerHTML = `
      <div style="text-align:center;padding:40px 0">
        <div class="result-grade ${grade.toLowerCase()}">${grade}</div>
        <div class="result-title">${mission.tag} voltooid</div>
        <div class="result-sub">${mission.name}</div>
        <div class="result-stats">
          <div class="stat-card"><div class="stat-value">${mission.xp}</div><div class="stat-label">XP verdiend</div></div>
          <div class="stat-card"><div class="stat-value">${mission.tasks.length}</div><div class="stat-label">Opdrachten</div></div>
          <div class="stat-card"><div class="stat-value">${state.streak}</div><div class="stat-label">Dag streak</div></div>
        </div>
        <div class="result-insight">
          <div class="insight-label">Wat je vandaag hebt geleerd bij Nova</div>
          <div class="insight-text">${mission.tasks.map(t => t.insight).join("<br><br>")}</div>
        </div>
        <div class="btn-row" style="justify-content:center;margin-top:24px">
          <button class="action-btn" id="result-continue">${nextChapter ? "Volgende dag \u2192" : "Terug naar overzicht"}</button>
        </div>
      </div>
    `;
    content.querySelector("#result-continue").addEventListener("click", () => { sfxClick(); renderStory(); });
    save();
  }

  function showInsightAndNext(area, task) {
    area.innerHTML += `
      <div class="feedback info" style="margin-top:16px">
        <div class="feedback-title">Inzicht</div>
        ${task.insight}
      </div>
      <div class="btn-row"><button class="action-btn" id="next-task-btn">Volgende opdracht \u2192</button></div>
    `;
    $("#next-task-btn").addEventListener("click", () => { sfxClick(); nextTask(); });
  }

  // ─── INTERACTION: Prompt Builder ────────────────────
  function renderPromptBuild(area, task) {
    const d = task.interaction;
    area.innerHTML = `
      <div class="feedback warning" style="margin-bottom:16px">
        <div class="feedback-title">Opdracht</div>
        ${d.scenario}
      </div>
      <div style="margin-bottom:12px">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px">SLECHTE PROMPT:</div>
        <div class="prompt-output" style="border-color:var(--red);opacity:0.7">${d.badPrompt}</div>
      </div>
      <div style="margin-bottom:12px">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px">AI OUTPUT:</div>
        <div class="prompt-output" id="current-output">${d.badOutput.replace(/\n/g, "<br>")}</div>
      </div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin-bottom:8px">BOUW JE PROMPT — klik de elementen die je wilt toevoegen:</div>
      <div id="hint-buttons" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px"></div>
      <div class="prompt-builder">
        <div id="built-prompt" style="font-family:var(--mono);font-size:0.85rem;min-height:40px;color:var(--text-dim)">Klik hierboven om je prompt te bouwen...</div>
      </div>
      <button class="action-btn" id="send-prompt-btn" disabled>Verstuur naar AI \u2192</button>
    `;

    const addedHints = [];
    const hintArea = area.querySelector("#hint-buttons");
    d.hints.forEach((hint, i) => {
      const btn = document.createElement("button");
      btn.className = "drag-item";
      btn.textContent = `+ ${hint.label}`;
      btn.addEventListener("click", () => {
        sfxClick();
        addedHints.push(hint);
        btn.classList.add("placed");
        btn.disabled = true;
        updateBuiltPrompt();
      });
      hintArea.appendChild(btn);
    });

    function updateBuiltPrompt() {
      const parts = addedHints.map(h => h.value);
      const prompt = parts.length > 0
        ? `Schrijf een email aan ${parts.join(". ")}. ${parts.length >= 3 ? "Voeg een passende afsluiting toe." : ""}`
        : "Klik hierboven om je prompt te bouwen...";
      area.querySelector("#built-prompt").textContent = prompt;
      area.querySelector("#send-prompt-btn").disabled = addedHints.length < 2;
    }

    area.querySelector("#send-prompt-btn").addEventListener("click", () => {
      sfxClick();
      const outputEl = area.querySelector("#current-output");
      outputEl.style.borderColor = "var(--green)";
      simulateAI(outputEl, d.goodOutput, 15).then(() => {
        sfxCorrect();
        state.totalScore++;
        addXP(100);
        showInsightAndNext(area, task);
      });
    });
  }

  // ─── INTERACTION: Temperature Slider ────────────────
  function renderTemperatureSlider(area, task) {
    const d = task.interaction;
    const temps = Object.keys(d.outputs).map(Number).sort();
    area.innerHTML = `
      <div class="feedback info" style="margin-bottom:16px">
        <div class="feedback-title">Prompt</div>
        <span style="font-family:var(--mono)">"${d.prompt}"</span>
      </div>
      <div class="slider-container">
        <div style="font-family:var(--mono);font-size:0.75rem;color:var(--text-dim);margin-bottom:8px">
          TEMPERATURE: <span id="temp-value" style="color:var(--cyan)">0.0</span>
        </div>
        <input type="range" class="slider-input" id="temp-slider" min="0" max="100" value="0">
        <div class="slider-labels">
          <span>0.0 Precies</span>
          <span>0.5 Creatief</span>
          <span>1.0 Wild</span>
        </div>
      </div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px;margin-top:16px">AI OUTPUT:</div>
      <div class="prompt-output" id="temp-output">${d.outputs[0]}</div>
      <div class="btn-row" style="margin-top:16px">
        <button class="action-btn" id="temp-done">Begrepen! \u2192</button>
      </div>
    `;

    const slider = area.querySelector("#temp-slider");
    const valueEl = area.querySelector("#temp-value");
    const outputEl = area.querySelector("#temp-output");
    let lastKey = 0;

    slider.addEventListener("input", () => {
      const val = slider.value / 100;
      valueEl.textContent = val.toFixed(1);

      // Color shift from cyan to red
      const hue = 180 - val * 180;
      valueEl.style.color = `hsl(${hue}, 100%, 60%)`;
      outputEl.style.borderColor = `hsl(${hue}, 100%, 40%)`;

      // Find nearest output
      let nearest = temps[0];
      temps.forEach(t => { if (Math.abs(t - val) < Math.abs(nearest - val)) nearest = t; });
      if (nearest !== lastKey) {
        lastKey = nearest;
        outputEl.style.opacity = 0;
        setTimeout(() => {
          outputEl.textContent = d.outputs[nearest];
          outputEl.style.opacity = 1;
        }, 150);
        sfxClick();
      }
    });

    area.querySelector("#temp-done").addEventListener("click", () => {
      sfxCorrect();
      state.totalScore++;
      addXP(80);
      showInsightAndNext(area, task);
    });
  }

  // ─── INTERACTION: Prompt Fix ────────────────────────
  function renderPromptFix(area, task) {
    const d = task.interaction;
    area.innerHTML = `
      <div style="margin-bottom:16px">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--red);margin-bottom:4px">SLECHTE PROMPT:</div>
        <div class="prompt-output" style="border-color:var(--red)">${d.original}</div>
      </div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin-bottom:8px">VIND DE PROBLEMEN — klik alles wat er mis is:</div>
      <div id="problem-list" class="choice-grid"></div>
      <div id="fix-area" style="display:none;margin-top:16px">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--green);margin-bottom:4px">VERBETERDE PROMPT:</div>
        <div class="prompt-output" style="border-color:var(--green)" id="fixed-prompt">${d.fixedPrompt}</div>
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px;margin-top:16px">NIEUWE AI OUTPUT:</div>
        <div class="prompt-output" id="fixed-output"></div>
      </div>
    `;

    const list = area.querySelector("#problem-list");
    let found = 0;
    d.problems.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "choice-card";
      card.innerHTML = `<div class="choice-key">${i + 1}</div><div class="choice-text">${p.text}</div>`;
      card.addEventListener("click", () => {
        sfxCorrect();
        card.classList.add("correct-choice");
        card.style.pointerEvents = "none";
        found++;
        addXP(25);
        if (found >= d.problems.length) {
          area.querySelector("#fix-area").style.display = "block";
          simulateAI(area.querySelector("#fixed-output"), d.fixedOutput, 12).then(() => {
            state.totalScore++;
            showInsightAndNext(area, task);
          });
        }
      });
      list.appendChild(card);
    });
  }

  // ─── INTERACTION: Scan Text (Hallucination) ─────────
  function renderScanText(area, task) {
    const d = task.interaction;
    const totalSus = d.text.filter(t => t.suspicious).length;
    area.innerHTML = `
      <div class="feedback warning" style="margin-bottom:16px">
        <div class="feedback-title">Opdracht</div>
        ${d.instruction}
      </div>
      <div class="score-display">
        <div class="score-item"><span style="color:var(--green)">\u2705</span> Gevonden: <span id="scan-found">0</span>/${totalSus}</div>
        <div class="score-item"><span style="color:var(--red)">\u274C</span> Fouten: <span id="scan-mistakes">0</span></div>
      </div>
      <div class="scan-target" id="scan-target"></div>
      <div id="scan-feedback-area"></div>
    `;

    const target = area.querySelector("#scan-target");
    let foundCount = 0, mistakes = 0;

    d.text.forEach((segment, i) => {
      const el = document.createElement("button");
      el.className = "scan-highlight";
      el.textContent = segment.content;
      el.addEventListener("click", () => {
        if (el.classList.contains("found") || el.classList.contains("wrong-pick")) return;
        if (segment.suspicious) {
          sfxCorrect();
          el.classList.add("found");
          foundCount++;
          area.querySelector("#scan-found").textContent = foundCount;
          addXP(50);

          const fb = document.createElement("div");
          fb.className = "feedback success";
          fb.innerHTML = `<div class="feedback-title">Goed gezien!</div>${segment.reason}`;
          area.querySelector("#scan-feedback-area").prepend(fb);

          if (foundCount >= totalSus) {
            state.totalScore++;
            setTimeout(() => showInsightAndNext(area, task), 500);
          }
        } else {
          sfxWrong();
          el.classList.add("wrong-pick");
          setTimeout(() => el.classList.remove("wrong-pick"), 600);
          mistakes++;
          area.querySelector("#scan-mistakes").textContent = mistakes;
        }
      });
      target.appendChild(el);
    });
  }

  // ─── INTERACTION: Bias Simulator ────────────────────
  function renderBiasSimulator(area, task) {
    const d = task.interaction;
    area.innerHTML = `
      <div id="bias-chat" style="margin-bottom:16px"></div>
      <div id="bias-memory" style="display:none">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--purple);margin-bottom:4px;text-transform:uppercase;letter-spacing:1px">AI GEHEUGEN:</div>
        <div class="prompt-output" style="border-color:var(--purple)" id="memory-content"></div>
      </div>
      <div id="bias-problem" style="display:none"></div>
      <div id="bias-controls"></div>
    `;

    let round = 0;
    function showRound() {
      const r = d.rounds[round];
      const chat = area.querySelector("#bias-chat");

      // User message
      const userMsg = document.createElement("div");
      userMsg.style.cssText = "text-align:right;margin-bottom:12px";
      userMsg.innerHTML = `<div style="display:inline-block;background:var(--cyan-dim);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;max-width:80%;text-align:left;font-size:0.9rem">${r.userInput}</div>`;
      chat.appendChild(userMsg);

      // AI response
      const aiMsg = document.createElement("div");
      aiMsg.style.cssText = "margin-bottom:12px";
      aiMsg.innerHTML = `<div style="display:inline-block;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;max-width:80%;font-size:0.9rem" id="bias-ai-${round}"></div>`;
      chat.appendChild(aiMsg);

      simulateAI(aiMsg.querySelector(`#bias-ai-${round}`), r.aiResponse, 20).then(() => {
        // Show memory
        const memEl = area.querySelector("#bias-memory");
        memEl.style.display = "block";
        area.querySelector("#memory-content").textContent = r.aiMemory;

        // Show problem if exists
        if (r.problem) {
          const problemEl = area.querySelector("#bias-problem");
          problemEl.style.display = "block";
          problemEl.innerHTML = `<div class="feedback warning" style="margin-top:12px"><div class="feedback-title">Let op!</div>${r.problem}</div>`;
        }

        // Next button
        const controls = area.querySelector("#bias-controls");
        controls.innerHTML = `<div class="btn-row"><button class="action-btn" id="bias-next">${round < d.rounds.length - 1 ? "Volgende interactie \u2192" : "Conclusie bekijken"}</button></div>`;
        controls.querySelector("#bias-next").addEventListener("click", () => {
          sfxClick();
          round++;
          if (round < d.rounds.length) {
            area.querySelector("#bias-problem").style.display = "none";
            showRound();
          } else {
            area.querySelector("#bias-controls").innerHTML = "";
            area.innerHTML += `
              <div class="feedback error" style="margin-top:16px">
                <div class="feedback-title">Conclusie</div>
                ${d.conclusion}
              </div>
            `;
            state.totalScore++;
            addXP(100);
            showInsightAndNext(area, task);
          }
        });
      });
    }
    showRound();
  }

  // ─── INTERACTION: Build Checklist ───────────────────
  function renderBuildChecklist(area, task) {
    const d = task.interaction;
    const allItems = [...d.items, ...d.wrongItems].sort(() => Math.random() - 0.5);

    area.innerHTML = `
      <div class="feedback info" style="margin-bottom:16px">
        <div class="feedback-title">Opdracht</div>
        ${d.instruction}
      </div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:8px">BESCHIKBARE STAPPEN:</div>
      <div id="source-items" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px"></div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin-bottom:8px">JOUW VOLGORDE (klik om toe te voegen):</div>
      <div id="target-list" style="margin-bottom:16px"></div>
      <div class="btn-row">
        <button class="action-btn secondary" id="checklist-reset">Reset</button>
        <button class="action-btn" id="checklist-check" disabled>Controleer</button>
      </div>
    `;

    const placed = [];
    const sourceEl = area.querySelector("#source-items");
    const targetEl = area.querySelector("#target-list");

    function renderSource() {
      sourceEl.innerHTML = "";
      allItems.forEach(item => {
        if (placed.find(p => p.id === item.id)) return;
        const btn = document.createElement("button");
        btn.className = "drag-item";
        btn.textContent = item.text;
        btn.addEventListener("click", () => {
          sfxClick();
          placed.push(item);
          renderSource();
          renderTarget();
          area.querySelector("#checklist-check").disabled = placed.length < 4;
        });
        sourceEl.appendChild(btn);
      });
    }

    function renderTarget() {
      targetEl.innerHTML = "";
      placed.forEach((item, i) => {
        const el = document.createElement("div");
        el.style.cssText = "display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:6px;font-size:0.85rem";
        el.innerHTML = `<span style="font-family:var(--mono);color:var(--cyan);font-weight:700;min-width:20px">${i + 1}.</span>${item.text}<button style="margin-left:auto;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:1.1rem" data-idx="${i}">\u00D7</button>`;
        el.querySelector("button").addEventListener("click", () => {
          placed.splice(i, 1);
          renderSource();
          renderTarget();
        });
        targetEl.appendChild(el);
      });
    }

    renderSource();

    area.querySelector("#checklist-reset").addEventListener("click", () => {
      placed.length = 0;
      renderSource();
      renderTarget();
      area.querySelector("#checklist-check").disabled = true;
    });

    area.querySelector("#checklist-check").addEventListener("click", () => {
      // Check: no wrong items, correct items in order
      const hasWrong = placed.some(p => d.wrongItems.find(w => w.id === p.id));
      const correctOnly = placed.filter(p => d.items.find(c => c.id === p.id));
      const inOrder = correctOnly.every((p, i) => {
        if (i === 0) return true;
        const prevOrder = d.items.find(c => c.id === correctOnly[i-1].id).order;
        const curOrder = d.items.find(c => c.id === p.id).order;
        return curOrder > prevOrder;
      });

      if (hasWrong) {
        sfxWrong();
        area.querySelector("#target-list").innerHTML += `<div class="feedback error"><div class="feedback-title">Oeps!</div>Er zit een foute stap tussen. 'Vertrouw de output als het professioneel klinkt' en 'Vraag dezelfde AI of het klopt' zijn valkuilen — niet best practices!</div>`;
      } else if (!inOrder) {
        sfxWrong();
        area.querySelector("#target-list").innerHTML += `<div class="feedback warning"><div class="feedback-title">Bijna!</div>De stappen kloppen, maar de volgorde kan beter. Denk logisch: eerst lezen, dan markeren, dan checken.</div>`;
      } else {
        sfxCorrect();
        state.totalScore++;
        addXP(100);
        area.querySelector("#target-list").innerHTML += `<div class="feedback success"><div class="feedback-title">Perfect!</div>Dit is een solide factcheck-routine die je altijd kunt toepassen.</div>`;
        showInsightAndNext(area, task);
      }
    });
  }

  // ─── INTERACTION: Compare Scenarios ─────────────────
  function renderCompareScenarios(area, task) {
    const d = task.interaction;
    area.innerHTML = `
      <div class="compare-grid">
        <div class="compare-col">
          <div class="compare-label" style="color:var(--cyan)">${d.chatbot.label}</div>
          <div id="chatbot-conv"></div>
        </div>
        <div class="compare-col">
          <div class="compare-label" style="color:var(--purple)">${d.agent.label}</div>
          <div id="agent-conv"></div>
        </div>
      </div>
      <div id="compare-question" style="display:none;margin-top:16px">
        <div class="task-title" style="font-size:1rem">${d.question}</div>
        <div class="choice-grid" id="compare-choices"></div>
      </div>
    `;

    function renderConv(el, conv, color) {
      conv.forEach(msg => {
        const div = document.createElement("div");
        div.style.cssText = `margin-bottom:8px;font-size:0.8rem;padding:8px;border-radius:6px;${msg.role === "user" ? "background:var(--bg-card);text-align:right" : `background:${color === "cyan" ? "var(--cyan-dim)" : "var(--purple-dim)"}`};white-space:pre-wrap`;
        div.textContent = msg.text;
        el.appendChild(div);
      });
    }

    renderConv(area.querySelector("#chatbot-conv"), d.chatbot.conversation, "cyan");
    renderConv(area.querySelector("#agent-conv"), d.agent.conversation, "purple");

    setTimeout(() => {
      area.querySelector("#compare-question").style.display = "block";
      const choicesEl = area.querySelector("#compare-choices");
      d.choices.forEach((c, i) => {
        const card = document.createElement("div");
        card.className = "choice-card";
        card.innerHTML = `<div class="choice-key">${String.fromCharCode(65 + i)}</div><div class="choice-text">${c.text}</div>`;
        card.addEventListener("click", () => {
          choicesEl.querySelectorAll(".choice-card").forEach(cc => cc.style.pointerEvents = "none");
          if (c.correct) {
            sfxCorrect();
            card.classList.add("correct-choice");
            state.totalScore++;
            addXP(80);
          } else {
            sfxWrong();
            card.classList.add("wrong-choice");
            choicesEl.querySelectorAll(".choice-card").forEach(cc => {
              if (d.choices[Array.from(choicesEl.children).indexOf(cc)]?.correct) cc.classList.add("correct-choice");
            });
          }
          area.innerHTML += `<div class="feedback info" style="margin-top:12px"><div class="feedback-title">Takeaway</div>${d.takeaway}</div>`;
          showInsightAndNext(area, task);
        });
        choicesEl.appendChild(card);
      });
    }, 1000);
  }

  // ─── INTERACTION: Agent Builder ─────────────────────
  function renderAgentBuilder(area, task) {
    const d = task.interaction;
    area.innerHTML = `
      <div class="feedback warning" style="margin-bottom:16px">
        <div class="feedback-title">Scenario</div>
        ${d.scenario}
      </div>
      <div id="agent-fields"></div>
      <button class="action-btn" id="agent-test" style="margin-top:16px" disabled>Test je agent \u2192</button>
      <div id="agent-test-area" style="display:none;margin-top:16px"></div>
    `;

    const fieldsEl = area.querySelector("#agent-fields");
    const inputs = {};

    d.fields.forEach(f => {
      const div = document.createElement("div");
      div.style.cssText = "margin-bottom:14px";
      div.innerHTML = `
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">${f.label}</div>
        <div class="prompt-builder">
          <textarea class="prompt-input" placeholder="${f.placeholder}" rows="2" data-field="${f.id}"></textarea>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">${f.hint}</div>
      `;
      fieldsEl.appendChild(div);
      const textarea = div.querySelector("textarea");
      inputs[f.id] = textarea;
      textarea.addEventListener("input", checkFields);
    });

    function checkFields() {
      const filled = Object.values(inputs).filter(i => i.value.trim().length > 10).length;
      area.querySelector("#agent-test").disabled = filled < 3;
    }

    area.querySelector("#agent-test").addEventListener("click", () => {
      sfxClick();
      const testArea = area.querySelector("#agent-test-area");
      testArea.style.display = "block";
      testArea.innerHTML = `<div style="font-family:var(--mono);font-size:0.7rem;color:var(--purple);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">AGENT SIMULATIE</div>`;

      let testIdx = 0;
      function showTest() {
        if (testIdx >= d.testConversations.length) {
          state.totalScore++;
          addXP(150);
          sfxComplete();
          showInsightAndNext(area, task);
          return;
        }

        const test = d.testConversations[testIdx];
        const hasField = inputs[test.needsField]?.value.trim().length > 10;

        const div = document.createElement("div");
        div.style.cssText = "margin-bottom:16px;padding:14px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-sm)";
        div.innerHTML = `
          <div style="color:var(--text-dim);font-size:0.8rem;margin-bottom:8px"><strong>Klant:</strong> "${test.question}"</div>
          <div style="font-size:0.8rem;margin-bottom:8px"><strong>Agent:</strong> <span id="test-response-${testIdx}"></span></div>
        `;
        testArea.appendChild(div);

        const responseEl = div.querySelector(`#test-response-${testIdx}`);
        const response = hasField ? test.goodResponse : test.badResponse;
        simulateAI(responseEl, response, 15).then(() => {
          const fb = document.createElement("div");
          fb.className = hasField ? "feedback success" : "feedback error";
          fb.innerHTML = hasField
            ? `<div class="feedback-title">Goed geconfigureerd!</div>Je agent handelt dit correct af dankzij je "${d.fields.find(f => f.id === test.needsField).label}" configuratie.`
            : `<div class="feedback-title">Fout!</div>Je agent mist configuratie voor "${d.fields.find(f => f.id === test.needsField).label}". Daardoor reageert hij verkeerd.`;
          div.appendChild(fb);

          testIdx++;
          setTimeout(showTest, 1000);
        });
      }
      showTest();
    });
  }

  // ─── INTERACTION: Find Config Errors ────────────────
  function renderFindConfigErrors(area, task) {
    const d = task.interaction;
    area.innerHTML = `
      <div style="margin-bottom:16px">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--red);margin-bottom:4px">AGENT CONFIGURATIE:</div>
        <div class="prompt-output" style="border-color:var(--red)">${d.agentConfig}</div>
      </div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:8px">GESPREK MET KLANT:</div>
      <div id="config-conv" style="margin-bottom:16px"></div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin-bottom:8px">VIND DE CONFIGURATIEFOUTEN:</div>
      <div id="config-problems" class="choice-grid"></div>
    `;

    const convEl = area.querySelector("#config-conv");
    d.conversation.forEach(msg => {
      const div = document.createElement("div");
      if (msg.role === "system") {
        div.className = "feedback warning";
        div.style.margin = "8px 0";
        div.innerHTML = `<div class="feedback-title">Probleem</div>${msg.text}`;
      } else {
        div.style.cssText = `margin-bottom:8px;font-size:0.85rem;padding:10px 14px;border-radius:var(--radius-sm);${msg.role === "user" ? "background:var(--bg-card);text-align:right" : "background:var(--red-dim);border:1px solid rgba(255,51,102,0.2)"}`;
        div.innerHTML = `<strong style="color:${msg.role === "user" ? "var(--text-dim)" : "var(--red)"}">${msg.role === "user" ? "Klant" : "Agent"}:</strong> ${msg.text}`;
      }
      convEl.appendChild(div);
    });

    const problemsEl = area.querySelector("#config-problems");
    let found = 0;
    d.problems.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "choice-card";
      card.innerHTML = `<div class="choice-key">${i + 1}</div><div><div class="choice-text">${p.text}</div><div style="color:var(--green);font-size:0.8rem;margin-top:4px;display:none" class="fix-text"><strong>Fix:</strong> ${p.fix}</div></div>`;
      card.addEventListener("click", () => {
        sfxCorrect();
        card.classList.add("correct-choice");
        card.style.pointerEvents = "none";
        card.querySelector(".fix-text").style.display = "block";
        found++;
        addXP(40);
        if (found >= d.problems.length) {
          state.totalScore++;
          showInsightAndNext(area, task);
        }
      });
      problemsEl.appendChild(card);
    });
  }

  // ─── AI Window HTML builders ────────────────────────
  function buildFullBrowser(tool) {
    if (tool === "chatgpt") return `
      <div class="gpt-browser">
        <div class="gpt-sidebar">
          <div class="gpt-sidebar-top">
            <button class="gpt-new-chat">\u270E Nieuwe chat</button>
          </div>
          <div class="gpt-sidebar-label">Vandaag</div>
          <div class="gpt-sidebar-list">
            <div class="gpt-sidebar-item active">Email schrijven klant</div>
            <div class="gpt-sidebar-item">Samenvatting vergadering</div>
            <div class="gpt-sidebar-item">Python script debuggen</div>
          </div>
          <div class="gpt-sidebar-label">Gisteren</div>
          <div class="gpt-sidebar-list">
            <div class="gpt-sidebar-item">Marketing plan Q2</div>
            <div class="gpt-sidebar-item">Vertaling rapport EN-NL</div>
          </div>
          <div class="gpt-sidebar-bottom">
            <div class="gpt-user-avatar">M</div>
            <div class="gpt-user-name">${state.nickname || "Gebruiker"}</div>
          </div>
        </div>
        <div class="gpt-main">
          <div class="gpt-topbar">
            <div class="gpt-topbar-logo">G</div>
            <div class="gpt-model-select">ChatGPT <span style="font-size:0.6rem">\u25BC</span></div>
            <div class="gpt-topbar-model">4o</div>
            <div class="gpt-topbar-share">\u2197 Delen</div>
          </div>
          <div class="gpt-chat" id="sim-chat"></div>
          <div class="gpt-input-area">
            <div class="gpt-inputbar">
              <input class="gpt-input" placeholder="Stuur een bericht..." readonly>
              <button class="gpt-send" disabled>\u2191</button>
            </div>
            <div class="gpt-disclaimer">ChatGPT kan fouten maken. Controleer belangrijke informatie.</div>
          </div>
        </div>
      </div>`;
    if (tool === "claude") return `
      <div class="claude-browser">
        <div class="claude-sidebar">
          <div class="claude-sidebar-top">
            <button class="claude-new-chat">\u270E Nieuw gesprek</button>
          </div>
          <div class="claude-sidebar-label">Vandaag</div>
          <div class="claude-sidebar-list">
            <div class="claude-sidebar-item active">Rapport nakijken</div>
            <div class="claude-sidebar-item">Sollicitatiebrief review</div>
            <div class="claude-sidebar-item">Brainstorm productlancering</div>
          </div>
          <div class="claude-sidebar-label">Vorige week</div>
          <div class="claude-sidebar-list">
            <div class="claude-sidebar-item">Analyse jaarverslag</div>
            <div class="claude-sidebar-item">Presentatie feedback</div>
          </div>
          <div class="claude-sidebar-bottom">
            <div class="claude-user-avatar">M</div>
            <div class="claude-user-name">${state.nickname || "Gebruiker"}</div>
          </div>
        </div>
        <div class="claude-main">
          <div class="claude-topbar">
            <div class="claude-topbar-logo">C</div>
            <div class="claude-model-select">Claude <span style="font-size:0.6rem">\u25BC</span></div>
            <div class="claude-topbar-model">Sonnet 4</div>
          </div>
          <div class="claude-chat" id="sim-chat"></div>
          <div class="claude-input-area">
            <div class="claude-inputbar">
              <input class="claude-input" placeholder="Praat met Claude..." readonly>
              <button class="claude-send" disabled>\u2191</button>
            </div>
            <div class="claude-disclaimer">Claude kan fouten maken. Verifieer belangrijke informatie.</div>
          </div>
        </div>
      </div>`;
    return `
      <div class="gemini-browser">
        <div class="gemini-sidebar">
          <div class="gemini-sidebar-top">
            <button class="gemini-new-chat">\u2728 Nieuw gesprek</button>
          </div>
          <div class="gemini-sidebar-label">Recent</div>
          <div class="gemini-sidebar-list">
            <div class="gemini-sidebar-item active">Blockchain uitleg</div>
            <div class="gemini-sidebar-item">Reisplanning Londen</div>
            <div class="gemini-sidebar-item">Code review Python</div>
          </div>
          <div class="gemini-sidebar-label">Vorige week</div>
          <div class="gemini-sidebar-list">
            <div class="gemini-sidebar-item">Recepten meal prep</div>
          </div>
          <div class="gemini-sidebar-bottom">
            <div class="gemini-user-avatar">M</div>
          </div>
        </div>
        <div class="gemini-main">
          <div class="gemini-topbar">
            <div class="gemini-topbar-logo">G</div>
            <div class="gemini-model-select">Gemini <span style="font-size:0.6rem">\u25BC</span></div>
            <div class="gemini-topbar-model">2.5 Pro</div>
          </div>
          <div class="gemini-chat" id="sim-chat"></div>
          <div class="gemini-input-area">
            <div class="gemini-inputbar">
              <input class="gemini-input" placeholder="Vraag Gemini iets..." readonly>
              <button class="gemini-send" disabled>\u2191</button>
            </div>
            <div class="gemini-disclaimer">Gemini kan foutieve informatie weergeven, ook over personen. Controleer de antwoorden.</div>
          </div>
        </div>
      </div>`;
  }

  function buildToolWindow(tool) {
    if (tool === "chatgpt") return {
      cls: "gpt", window: "gpt-window", chat: "gpt-chat",
      topbar: `<div class="gpt-topbar"><div class="gpt-topbar-logo">G</div><div class="gpt-topbar-title">ChatGPT</div><div class="gpt-topbar-model">GPT-4o</div></div>`,
      inputbar: `<div class="gpt-inputbar"><input class="gpt-input" placeholder="Stuur een bericht..." readonly><button class="gpt-send" disabled>\u2191</button></div>`,
      aiAvatar: `<div class="gpt-avatar ai">G</div>`,
      userAvatar: `<div class="gpt-avatar user">M</div>`,
    };
    if (tool === "claude") return {
      cls: "claude", window: "claude-window", chat: "claude-chat",
      topbar: `<div class="claude-topbar"><div class="claude-topbar-logo">C</div><div class="claude-topbar-title">Claude</div><div class="claude-topbar-model">Sonnet 4</div></div>`,
      inputbar: `<div class="claude-inputbar"><input class="claude-input" placeholder="Praat met Claude..." readonly><button class="claude-send" disabled>\u2191</button></div>`,
      aiAvatar: `<div class="claude-avatar ai">C</div>`,
      userAvatar: `<div class="claude-avatar user">M</div>`,
    };
    return {
      cls: "gemini", window: "gemini-window", chat: "gemini-chat",
      topbar: `<div class="gemini-topbar"><div class="gemini-topbar-logo">G</div><div class="gemini-topbar-title">Gemini</div><div class="gemini-topbar-model">2.5 Pro</div></div>`,
      inputbar: `<div class="gemini-inputbar"><input class="gemini-input" placeholder="Vraag Gemini iets..." readonly><button class="gemini-send" disabled>\u2191</button></div>`,
      aiAvatar: `<div class="gemini-avatar ai">G</div>`,
      userAvatar: `<div class="gemini-avatar user">M</div>`,
    };
  }

  function addChatMsg(chatEl, ui, role, text, animate) {
    const msg = document.createElement("div");
    msg.className = `${ui.cls}-msg ${role}`;
    const avatar = role === "user" ? ui.userAvatar : ui.aiAvatar;
    const bubbleId = "bubble-" + Math.random().toString(36).slice(2, 8);
    msg.innerHTML = `${avatar}<div class="${ui.cls}-bubble" id="${bubbleId}"></div>`;
    chatEl.appendChild(msg);
    chatEl.scrollTop = chatEl.scrollHeight;

    const bubbleEl = msg.querySelector(`#${bubbleId}`);
    if (animate && role === "ai") {
      return simulateAI(bubbleEl, text, 15);
    }
    bubbleEl.innerHTML = text.replace(/\n/g, "<br>");
    return Promise.resolve();
  }

  // ─── INTERACTION: Chat Simulator ────────────────────
  function renderChatSimulator(area, task) {
    const d = task.interaction;
    const ui = buildToolWindow(d.tool || "chatgpt");
    let stepIdx = 0;

    function renderStep() {
      const step = d.steps[stepIdx];
      if (!step) { state.totalScore++; showInsightAndNext(area, task); return; }

      if (step.type === "prompt-enhance") {
        renderPromptEnhance(area, task, step);
        return;
      }

      area.innerHTML = `
        <div class="feedback info" style="margin-bottom:12px">
          <div class="feedback-title">Opdracht</div>${step.instruction}
        </div>
        ${buildFullBrowser(d.tool || "chatgpt")}
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin:12px 0 8px">KIES WAT JE TYPT:</div>
        <div id="chat-options" class="choice-grid"></div>
      `;

      const chatEl = area.querySelector("#sim-chat");
      const optionsEl = area.querySelector("#chat-options");

      step.prefilledOptions.forEach(opt => {
        const card = document.createElement("div");
        card.className = "choice-card";
        card.innerHTML = `<div class="choice-text" style="font-family:var(--mono);font-size:0.85rem">${opt.text}</div>`;
        card.addEventListener("click", () => {
          sfxClick();
          optionsEl.querySelectorAll(".choice-card").forEach(c => c.style.pointerEvents = "none");
          card.classList.add("selected");

          // Show user message in chat window
          addChatMsg(chatEl, ui, "user", opt.text, false);

          const resp = step.responses[opt.quality];
          // Show AI typing then response
          addChatMsg(chatEl, ui, "ai", resp.output, true).then(() => {
            const fb = document.createElement("div");
            fb.className = `feedback ${resp.feedback.type}`;
            fb.innerHTML = `<div class="feedback-title">${resp.feedback.title}</div>${resp.feedback.text}`;
            area.appendChild(fb);

            if (opt.quality === "good") addXP(100);

            const btn = document.createElement("button");
            btn.className = "action-btn";
            btn.textContent = "Volgende \u2192";
            btn.style.marginTop = "12px";
            btn.addEventListener("click", () => { sfxClick(); stepIdx++; renderStep(); });
            area.appendChild(btn);
          });
        });
        optionsEl.appendChild(card);
      });
    }
    renderStep();
  }

  function renderPromptEnhance(area, task, step) {
    const d = step;
    area.innerHTML = `
      <div class="feedback info" style="margin-bottom:16px">
        <div class="feedback-title">Opdracht</div>${d.instruction}
      </div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px">BASIS PROMPT:</div>
      <div class="prompt-output" id="evolving-prompt" style="margin-bottom:16px">${d.basePrompt}</div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin-bottom:8px">VOEG TOE:</div>
      <div id="enhancer-btns" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px"></div>
      <div id="impact-log"></div>
    `;

    const added = [];
    const btnsEl = area.querySelector("#enhancer-btns");
    const promptEl = area.querySelector("#evolving-prompt");
    const logEl = area.querySelector("#impact-log");

    d.enhancers.forEach(e => {
      const btn = document.createElement("button");
      btn.className = "drag-item";
      btn.innerHTML = `+ ${e.label}`;
      btn.addEventListener("click", () => {
        sfxCorrect();
        added.push(e);
        btn.classList.add("placed");
        btn.disabled = true;

        promptEl.textContent = d.basePrompt + " " + added.map(a => a.value).join(", ");
        promptEl.style.borderColor = `hsl(${120 * (added.length / d.enhancers.length)}, 80%, 50%)`;

        const impact = document.createElement("div");
        impact.className = "feedback success";
        impact.style.marginBottom = "8px";
        impact.innerHTML = `<strong>+${e.label}:</strong> ${e.impact}`;
        logEl.prepend(impact);
        addXP(30);

        if (added.length >= d.enhancers.length) {
          const outputDiv = document.createElement("div");
          outputDiv.style.marginTop = "16px";
          outputDiv.innerHTML = `
            <div style="font-family:var(--mono);font-size:0.7rem;color:var(--green);margin-bottom:4px">RESULTAAT:</div>
            <div class="prompt-output" style="border-color:var(--green)" id="enhanced-output"></div>
          `;
          area.appendChild(outputDiv);
          simulateAI(outputDiv.querySelector("#enhanced-output"), d.finalOutput, 15).then(() => {
            state.totalScore++;
            showInsightAndNext(area, task);
          });
        }
      });
      btnsEl.appendChild(btn);
    });
  }

  // ─── INTERACTION: Model Compare ─────────────────────
  function renderModelCompare(area, task) {
    const d = task.interaction;
    area.innerHTML = `
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px">PROMPT:</div>
      <div class="prompt-output" style="margin-bottom:20px;font-style:italic">"${d.prompt}"</div>
      <div id="model-outputs" style="margin-bottom:20px"></div>
      <div id="compare-question" style="display:none"></div>
    `;

    const outputsEl = area.querySelector("#model-outputs");
    let loadedCount = 0;

    const toolMap = { "ChatGPT": "chatgpt", "Claude": "claude", "Gemini": "gemini" };

    d.models.forEach((model, i) => {
      const toolKey = toolMap[model.name] || "chatgpt";
      const ui = buildToolWindow(toolKey);

      const wrapper = document.createElement("div");
      wrapper.style.cssText = "margin-bottom:16px";
      wrapper.innerHTML = `
        <div class="${ui.window}">
          ${ui.topbar}
          <div class="${ui.chat}" id="model-chat-${i}" style="min-height:60px"></div>
        </div>
        <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
          ${model.strengths.map(s => `<span style="font-size:0.7rem;padding:2px 8px;background:var(--green-dim);color:var(--green);border-radius:4px">\u2713 ${s}</span>`).join("")}
          ${model.weaknesses.map(w => `<span style="font-size:0.7rem;padding:2px 8px;background:var(--orange-dim);color:var(--orange);border-radius:4px">\u26A0 ${w}</span>`).join("")}
        </div>
      `;
      outputsEl.appendChild(wrapper);

      setTimeout(() => {
        const chatEl = wrapper.querySelector(`#model-chat-${i}`);
        addChatMsg(chatEl, ui, "user", d.prompt, false);
        addChatMsg(chatEl, ui, "ai", model.output, true).then(() => {
          loadedCount++;
          if (loadedCount >= d.models.length) showCompareQuestion();
        });
      }, i * 1000);
    });

    function showCompareQuestion() {
      const qEl = area.querySelector("#compare-question");
      qEl.style.display = "block";
      qEl.innerHTML = `
        <div class="task-title" style="font-size:1rem">${d.question}</div>
        <div class="choice-grid" id="model-choices"></div>
      `;
      const choicesEl = qEl.querySelector("#model-choices");
      d.models.forEach(model => {
        const card = document.createElement("div");
        card.className = "choice-card";
        card.innerHTML = `<div style="font-size:1.1rem">${model.icon}</div><div class="choice-text">${model.name}</div>`;
        card.addEventListener("click", () => {
          choicesEl.querySelectorAll(".choice-card").forEach(c => c.style.pointerEvents = "none");
          if (model.name === d.correctModel) {
            sfxCorrect();
            card.classList.add("correct-choice");
            addXP(100);
            state.totalScore++;
          } else {
            sfxWrong();
            card.classList.add("wrong-choice");
            choicesEl.querySelectorAll(".choice-card").forEach(c => {
              if (d.models[Array.from(choicesEl.children).indexOf(c)]?.name === d.correctModel) c.classList.add("correct-choice");
            });
          }
          area.innerHTML += `<div class="feedback info" style="margin-top:12px"><div class="feedback-title">Analyse</div>${d.explanation}</div>`;
          showInsightAndNext(area, task);
        });
        choicesEl.appendChild(card);
      });
    }
  }

  // ─── INTERACTION: Sort Safe/Unsafe ──────────────────
  function renderSortSafeUnsafe(area, task) {
    const d = task.interaction;
    const shuffled = [...d.items].sort(() => Math.random() - 0.5);
    let current = 0;
    let correct = 0;

    area.innerHTML = `
      <div class="feedback info" style="margin-bottom:16px">
        <div class="feedback-title">Opdracht</div>${d.instruction}
      </div>
      <div class="score-display">
        <div class="score-item"><span style="color:var(--green)">\u2705</span> <span id="sort-correct">0</span>/${d.items.length}</div>
        <div class="score-item"><span style="color:var(--red)">\u274C</span> <span id="sort-wrong">0</span></div>
      </div>
      <div id="sort-card-area"></div>
      <div id="sort-feedback-area"></div>
    `;

    let wrongCount = 0;

    function showItem() {
      if (current >= shuffled.length) {
        state.totalScore++;
        addXP(50);
        showInsightAndNext(area, task);
        return;
      }
      const item = shuffled[current];
      const cardArea = area.querySelector("#sort-card-area");
      cardArea.innerHTML = `
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:16px;text-align:center">
          <div style="font-size:0.95rem;font-weight:600;margin-bottom:16px">"${item.text}"</div>
          <div class="btn-row" style="justify-content:center">
            <button class="action-btn success" id="sort-safe">\u2705 Veilig</button>
            <button class="action-btn danger" id="sort-unsafe">\u274C Niet doen</button>
          </div>
        </div>
      `;
      cardArea.querySelector("#sort-safe").addEventListener("click", () => handleSort(true, item));
      cardArea.querySelector("#sort-unsafe").addEventListener("click", () => handleSort(false, item));
    }

    function handleSort(userSaysSafe, item) {
      const isCorrect = userSaysSafe === item.safe;
      const fbArea = area.querySelector("#sort-feedback-area");

      if (isCorrect) {
        sfxCorrect();
        correct++;
        area.querySelector("#sort-correct").textContent = correct;
      } else {
        sfxWrong();
        wrongCount++;
        area.querySelector("#sort-wrong").textContent = wrongCount;
      }

      const fb = document.createElement("div");
      fb.className = `feedback ${isCorrect ? "success" : "error"}`;
      fb.style.marginBottom = "8px";
      fb.innerHTML = `<strong>${isCorrect ? "Goed!" : "Fout!"}</strong> ${item.reason}`;
      fbArea.prepend(fb);

      current++;
      setTimeout(showItem, 800);
    }

    showItem();
  }

  // ─── INTERACTION: Transform Text ────────────────────
  function renderTransformText(area, task) {
    const d = task.interaction;
    const t = d.tasks[0];
    area.innerHTML = `
      <div style="margin-bottom:16px">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px">${d.inputLabel}:</div>
        <div class="prompt-output" style="white-space:pre-wrap;font-size:0.85rem">${d.input}</div>
      </div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin-bottom:4px">PROMPT:</div>
      <div class="prompt-output" style="border-color:var(--cyan);margin-bottom:16px;font-style:italic">"${t.prompt}"</div>
      <button class="action-btn" id="transform-btn">Verstuur naar AI \u2192</button>
      <div id="transform-output-area" style="display:none;margin-top:16px">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--green);margin-bottom:4px">${d.outputLabel}:</div>
        <div class="prompt-output" style="border-color:var(--green);white-space:pre-wrap" id="transform-output"></div>
        <div id="checkpoint-area" style="margin-top:16px"></div>
      </div>
    `;

    area.querySelector("#transform-btn").addEventListener("click", () => {
      sfxClick();
      area.querySelector("#transform-btn").style.display = "none";
      const outArea = area.querySelector("#transform-output-area");
      outArea.style.display = "block";

      simulateAI(area.querySelector("#transform-output"), t.output, 12).then(() => {
        const cpArea = area.querySelector("#checkpoint-area");
        cpArea.innerHTML = `<div style="font-family:var(--mono);font-size:0.7rem;color:var(--purple);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px">CONTROLEER DE OUTPUT:</div>`;

        t.checkpoints.forEach(cp => {
          const div = document.createElement("div");
          div.className = `feedback ${cp.present ? (cp.warning ? "warning" : "success") : "error"}`;
          div.style.marginBottom = "8px";
          div.innerHTML = `<strong>${cp.label}</strong>${cp.warning ? `<br>${cp.warning}` : cp.present ? " \u2714" : " \u2718"}`;
          cpArea.appendChild(div);
        });

        state.totalScore++;
        addXP(100);
        showInsightAndNext(area, task);
      });
    });
  }

  // ─── INTERACTION: Role Compare ──────────────────────
  function renderRoleCompare(area, task) {
    const d = task.interaction;
    area.innerHTML = `
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px">BUSINESS PLAN:</div>
      <div class="prompt-output" style="margin-bottom:16px;font-style:italic">"${d.basePrompt}"</div>
      <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);margin-bottom:8px">KIES EEN ROL VOOR DE AI:</div>
      <div id="role-buttons" style="margin-bottom:16px"></div>
      <div id="role-output-area" style="display:none">
        <div style="font-family:var(--mono);font-size:0.7rem;color:var(--text-muted);margin-bottom:4px">ROL: <span id="role-name" style="color:var(--purple)"></span></div>
        <div class="prompt-output" style="white-space:pre-wrap" id="role-output"></div>
        <div id="role-analysis" style="margin-top:8px"></div>
        <div class="btn-row" style="margin-top:12px">
          <button class="action-btn secondary" id="try-another">Probeer andere rol</button>
        </div>
      </div>
    `;

    const btnsEl = area.querySelector("#role-buttons");
    let tried = 0;

    d.roles.forEach((r, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-card";
      btn.style.cursor = "pointer";
      btn.innerHTML = `<div class="choice-text" style="font-family:var(--mono);font-size:0.85rem">${r.role}</div>`;
      btn.addEventListener("click", () => {
        sfxClick();
        tried++;
        btnsEl.style.display = "none";
        const outArea = area.querySelector("#role-output-area");
        outArea.style.display = "block";
        area.querySelector("#role-name").textContent = r.role;

        simulateAI(area.querySelector("#role-output"), r.output, 12).then(() => {
          area.querySelector("#role-analysis").innerHTML = `<div class="feedback info"><div class="feedback-title">Analyse</div>${r.analysis}</div>`;

          if (tried >= 2) {
            addXP(100);
            state.totalScore++;
            showInsightAndNext(area, task);
          }
        });
      });
      btnsEl.appendChild(btn);
    });

    area.addEventListener("click", (e) => {
      if (e.target.id === "try-another" || e.target.closest("#try-another")) {
        btnsEl.style.display = "block";
        area.querySelector("#role-output-area").style.display = "none";
      }
    });
  }

  // ─── Init ───────────────────────────────────────────
  function init() {
    load();
    renderStory();
    show("story-screen");

    // no more mission-back button needed - story flows forward

    const soundBtn = $("#sound-btn");
    soundBtn.classList.toggle("muted", !state.sound);
    soundBtn.textContent = state.sound ? "\u{1F50A}" : "\u{1F507}";
    soundBtn.addEventListener("click", () => {
      state.sound = !state.sound;
      soundBtn.classList.toggle("muted", !state.sound);
      soundBtn.textContent = state.sound ? "\u{1F50A}" : "\u{1F507}";
      save();
    });
  }

  // ─── Nickname prompt ────────────────────────────────
  function askNickname() {
    return new Promise(resolve => {
      load();
      if (state.nickname) { resolve(state.nickname); return; }

      const overlay = document.createElement("div");
      overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px";
      overlay.innerHTML = `
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:32px;max-width:360px;width:100%;text-align:center">
          <div style="font-family:var(--mono);font-size:0.7rem;color:var(--cyan);letter-spacing:2px;margin-bottom:16px">IDENTIFICATIE VEREIST</div>
          <div style="font-size:1.1rem;font-weight:700;margin-bottom:8px;color:var(--text)">Hoe mogen we je noemen?</div>
          <div style="font-size:0.8rem;color:var(--text-dim);margin-bottom:20px">Je voortgang wordt opgeslagen onder deze naam.</div>
          <input type="text" id="nick-input" placeholder="Jouw naam..." style="width:100%;padding:12px 16px;background:var(--bg-input);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:var(--mono);font-size:1rem;outline:none;text-align:center;margin-bottom:16px">
          <button class="action-btn" id="nick-btn" style="width:100%" disabled>Toegang verkrijgen</button>
        </div>
      `;
      document.body.appendChild(overlay);

      const input = overlay.querySelector("#nick-input");
      const btn = overlay.querySelector("#nick-btn");
      input.focus();
      input.addEventListener("input", () => { btn.disabled = input.value.trim().length < 2; });
      input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !btn.disabled) btn.click(); });
      btn.addEventListener("click", () => {
        state.nickname = input.value.trim();
        save();
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.3s";
        setTimeout(() => { overlay.remove(); resolve(state.nickname); }, 300);
      });
    });
  }

  // ─── Boot Sequence ──────────────────────────────────
  function runBootSequence() {
    const bootScreen = document.getElementById("boot-screen");
    const app = document.getElementById("app");

    askNickname().then(nickname => {
      // Skip boot if already seen this session
      if (sessionStorage.getItem("ai-lab-booted")) {
        bootScreen.classList.add("hidden");
        app.style.display = "";
        init();
        return;
      }

      const lines = [
        "NEURAL INTERFACE v2.0.4",
        "Verbinding maken met AI-netwerk...",
        "Taalmodellen laden: GPT-4o, Claude Sonnet, Gemini Pro",
        "Beveiligingsprotocol activeren...",
        "Kennisbank synchroniseren... 847.291 bronnen",
        "Agent-sandbox initialiseren...",
        `Gebruiker identificeren... ${nickname}`,
        "Toegangsniveau: EXPLORER",
        "",
        "WAARSCHUWING: AI-systemen kunnen hallucineren.",
        "Controleer altijd de output.",
        "",
        `Systeem gereed. Welkom bij AI Lab, ${nickname}.`
      ];

    const bootText = document.getElementById("boot-text");
    const progressFill = document.getElementById("boot-progress-fill");
    const bootStatus = document.getElementById("boot-status");

    let lineIdx = 0;
    let charIdx = 0;
    let currentHTML = "";

    function typeBoot() {
      if (lineIdx >= lines.length) {
        progressFill.style.width = "100%";
        bootStatus.textContent = "GEREED";
        bootStatus.style.color = "#00d4ff";
        setTimeout(() => {
          bootScreen.classList.add("fade-out");
          app.style.display = "";
          sessionStorage.setItem("ai-lab-booted", "1");
          setTimeout(() => {
            bootScreen.classList.add("hidden");
            init();
          }, 800);
        }, 600);
        return;
      }

      const line = lines[lineIdx];
      if (charIdx === 0 && line === "") {
        currentHTML += "<br>";
        bootText.innerHTML = currentHTML;
        lineIdx++;
        setTimeout(typeBoot, 100);
        return;
      }

      if (charIdx < line.length) {
        charIdx++;
        const partial = line.slice(0, charIdx);
        bootText.innerHTML = currentHTML + partial + '<span class="cursor" style="color:#00d4ff">|</span>';
        progressFill.style.width = ((lineIdx / lines.length) * 100) + "%";
        setTimeout(typeBoot, 15 + Math.random() * 25);
      } else {
        currentHTML += line + "<br>";
        bootText.innerHTML = currentHTML;
        lineIdx++;
        charIdx = 0;
        const delay = line.includes("...") ? 400 + Math.random() * 300 : 100;
        setTimeout(typeBoot, delay);
      }
    }

    setTimeout(typeBoot, 500);
    }); // end askNickname.then
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", runBootSequence)
    : runBootSequence();
})();
