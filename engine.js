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
      "intranet-then-prompt": renderIntranetThenPrompt,
      "free-prompt": renderFreePrompt,
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

  // ─── INTERACTION: Intranet then Prompt ───────────────
  function renderIntranetThenPrompt(area, task) {
    const d = task.interaction;
    const wiki = d.wiki;
    let currentPage = "home";
    let taskShown = false;
    let openApps = new Set();

    // Hide the normal UI, show desktop
    document.getElementById("header").style.display = "none";
    area.closest(".screen").style.padding = "0";

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0");

    area.innerHTML = `<div class="desktop" id="macos-desktop">
      <div class="mac-notch"><div class="mac-notch-cam"></div></div>
      <div class="menubar">
        <span class="menubar-apple"><svg viewBox="0 0 17 20" width="12" height="14" fill="white"><path d="M12.15 0c.08.68-.2 1.36-.54 1.86-.38.53-.99.94-1.6.88-.09-.65.24-1.34.56-1.77.38-.5 1.04-.9 1.58-.97zM14.96 7.2c-.04.02-1.6.92-1.58 2.76.02 2.2 1.93 2.93 1.96 2.94-.01.06-.3 1.06-.1 2.22-.56.46-1.1.92-1.97.92-.42 0-.7-.14-1-.28-.32-.15-.66-.3-1.17-.3-.54 0-.9.16-1.24.31-.28.13-.55.25-.92.27-.83.03-1.46-.98-2.03-1.94-.58-.98-1.06-2.5-.44-3.59.3-.54.84-.88 1.44-.89.47-.01.9.17 1.24.32.28.12.5.22.76.22.24 0 .44-.09.72-.22.38-.17.86-.38 1.48-.33.85.03 1.5.46 1.86 1.13-.75.46-1.26 1.23-1.2 2.15.06.98.65 1.82 1.49 2.18-.18.53-.4 1.04-.7 1.51z"/></svg></span>
        <span class="menubar-app">Finder</span>
        <span class="menubar-item">Archief</span>
        <span class="menubar-item">Wijzig</span>
        <span class="menubar-item">Weergave</span>
        <div class="menubar-right">
          <svg viewBox="0 0 16 12" width="14" height="10"><path d="M8 9.6a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm-4.2-3a.6.6 0 01.42.18l.85.84A4.78 4.78 0 018 6.4c1.1 0 2.15.37 3 1.05l.82-.82a.6.6 0 01.85.85l-.83.83A4.78 4.78 0 018 9.6a4.78 4.78 0 01-3.78-1.27l-.84-.84a.6.6 0 01.42-1.02zM1.2 3.6a.6.6 0 01.42.18l1.5 1.5A7.96 7.96 0 018 3.6c1.84 0 3.56.6 4.95 1.72l1.47-1.47a.6.6 0 01.85.85L13.8 6.17A7.96 7.96 0 018 8a7.96 7.96 0 01-5.73-1.8L.77 4.63a.6.6 0 01.42-1.02z" fill="white" opacity="0.9"/></svg>
          <svg viewBox="0 0 20 10" width="18" height="9"><rect x="0" y="1" width="16" height="8" rx="1.5" fill="none" stroke="white" stroke-width="1" opacity="0.8"/><rect x="17" y="3.5" width="1.5" height="3" rx="0.5" fill="white" opacity="0.5"/><rect x="1.5" y="2.5" width="12" height="5" rx="0.5" fill="#28c840"/></svg>
          <span>${timeStr}</span>
        </div>
      </div>

      <div class="app-window open" id="window-intranet" style="display:none;top:40px;left:20px;right:20px;bottom:80px">
        <div class="app-titlebar">
          <div class="app-titlebar-dots">
            <div class="app-titlebar-dot red" data-action="close" data-window="intranet"></div>
            <div class="app-titlebar-dot yellow" data-action="minimize" data-window="intranet"></div>
            <div class="app-titlebar-dot green" data-action="maximize" data-window="intranet"></div>
          </div>
          <div class="app-titlebar-title">MayoWiki \u2014 Kennisbank</div>
          <div class="app-titlebar-controls">
            <div class="app-titlebar-ctrl" data-action="minimize" data-window="intranet">\u2014</div>
            <div class="app-titlebar-ctrl" data-action="maximize" data-window="intranet">\u25A1</div>
            <div class="app-titlebar-ctrl close" data-action="close" data-window="intranet">\u2715</div>
          </div>
        </div>
        <div class="app-body">
          <div class="intranet" id="intranet-container">
            <div class="wiki-topbar">
              <div class="wiki-topbar-logo">
                <svg viewBox="0 0 24 24" fill="white"><path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h12V4H6zm2 3h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>
                MayoWiki
              </div>
              <div class="wiki-topbar-nav">
                <a>Shelves</a>
                <a>Books</a>
                <a>Favorieten</a>
              </div>
              <div class="wiki-topbar-search">
                <input type="text" placeholder="Zoeken in wiki..." id="wiki-search-input">
              </div>
            </div>
            <div class="wiki-body">
              <div class="intranet-sidebar" id="intranet-nav"></div>
              <div class="intranet-main" id="intranet-page"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="app-window open focused" id="window-wiwa" style="top:40px;left:40px;width:700px;height:500px">
        <div class="app-titlebar">
          <div class="app-titlebar-dots">
            <div class="app-titlebar-dot red" data-action="close" data-window="wiwa"></div>
            <div class="app-titlebar-dot yellow" data-action="minimize" data-window="wiwa"></div>
            <div class="app-titlebar-dot green" data-action="maximize" data-window="wiwa"></div>
          </div>
          <div class="app-titlebar-title">WiWa \u2014 Wie is Waarvan</div>
          <div class="app-titlebar-controls">
            <div class="app-titlebar-ctrl" data-action="minimize" data-window="wiwa">\u2014</div>
            <div class="app-titlebar-ctrl" data-action="maximize" data-window="wiwa">\u25A1</div>
            <div class="app-titlebar-ctrl close" data-action="close" data-window="wiwa">\u2715</div>
          </div>
        </div>
        <div class="app-body" id="wiwa-body"></div>
      </div>

      <div class="app-window open" id="window-chatgpt" style="display:none;top:40px;left:30px;right:30px;bottom:80px">
        <div class="app-titlebar">
          <div class="app-titlebar-dots">
            <div class="app-titlebar-dot red" data-action="close" data-window="chatgpt"></div>
            <div class="app-titlebar-dot yellow"></div>
            <div class="app-titlebar-dot green" data-action="maximize" data-window="chatgpt"></div>
          </div>
          <div class="app-titlebar-title">ChatGPT - Chrome</div>
          <div class="app-titlebar-controls">
            <div class="app-titlebar-ctrl" data-action="minimize" data-window="chatgpt">\u2014</div>
            <div class="app-titlebar-ctrl" data-action="maximize" data-window="chatgpt">\u25A1</div>
            <div class="app-titlebar-ctrl close" data-action="close" data-window="chatgpt">\u2715</div>
          </div>
        </div>
        <div class="app-body" id="chatgpt-app-body"></div>
      </div>

      <div class="dock" id="dock">
        <div class="dock-icon" data-app="finder">
          <div class="dock-tooltip">Finder</div><div class="dock-label">Finder</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4FC3F7"/><stop offset="100%" stop-color="#1565C0"/></linearGradient></defs><rect width="120" height="120" rx="26" fill="url(#fg)"/><path d="M35 30h50v60H35z" fill="none" stroke="white" stroke-width="3"/><circle cx="60" cy="52" r="4" fill="white"/><path d="M44 75c0-8 7-15 16-15s16 7 16 15" fill="none" stroke="white" stroke-width="3"/></svg>
        </div>
        <div class="dock-icon" data-app="board">
          <div class="dock-tooltip">MayoBoard</div><div class="dock-label">MayoBoard</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#0052cc"/><rect x="20" y="30" width="22" height="60" rx="3" fill="rgba(255,255,255,0.3)"/><rect x="49" y="30" width="22" height="45" rx="3" fill="rgba(255,255,255,0.3)"/><rect x="78" y="30" width="22" height="35" rx="3" fill="rgba(255,255,255,0.3)"/><rect x="23" y="34" width="16" height="10" rx="2" fill="white"/><rect x="23" y="48" width="16" height="10" rx="2" fill="white"/><rect x="52" y="34" width="16" height="10" rx="2" fill="white"/><rect x="81" y="34" width="16" height="10" rx="2" fill="white"/></svg>
        </div>
        <div class="dock-icon active" data-app="wiwa">
          <div class="dock-tooltip">WiWa - Wie is Wa</div><div class="dock-label">WiWa</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#6366f1"/><circle cx="42" cy="45" r="12" fill="none" stroke="white" stroke-width="2.5"/><circle cx="78" cy="45" r="12" fill="none" stroke="white" stroke-width="2.5"/><path d="M22 82c0-12 9-18 20-18s20 6 20 18" fill="none" stroke="white" stroke-width="2.5"/><path d="M58 82c0-12 9-18 20-18s20 6 20 18" fill="none" stroke="white" stroke-width="2.5"/><circle cx="60" cy="72" r="5" fill="#fbbf24"/><path d="M57 72h6" stroke="#6366f1" stroke-width="1.5"/><path d="M60 69v6" stroke="#6366f1" stroke-width="1.5"/></svg>
        </div>
        <div class="dock-icon" data-app="intranet">
          <div class="dock-tooltip">MayoWiki</div><div class="dock-label">MayoWiki</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#1a1a2e"/><path d="M30 85V50l30-20 30 20v35" fill="none" stroke="#7dd3fc" stroke-width="3"/><rect x="48" y="60" width="24" height="25" rx="2" fill="none" stroke="#7dd3fc" stroke-width="2.5"/><line x1="60" y1="60" x2="60" y2="85" stroke="#7dd3fc" stroke-width="2"/><line x1="48" y1="72" x2="72" y2="72" stroke="#7dd3fc" stroke-width="2"/><path d="M55 35h10v10l-5 5-5-5z" fill="#7dd3fc"/></svg>
        </div>
        <div class="dock-icon" data-app="chatgpt">
          <div class="dock-tooltip">ChatGPT</div><div class="dock-label">ChatGPT</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#10a37f"/><circle cx="60" cy="55" r="22" fill="none" stroke="white" stroke-width="4"/><path d="M60 77v12" stroke="white" stroke-width="4"/><circle cx="60" cy="55" r="8" fill="white"/></svg>
        </div>
        <div class="dock-icon" data-app="claude">
          <div class="dock-tooltip">Claude</div><div class="dock-label">Claude</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#d97706"/><circle cx="60" cy="55" r="20" fill="none" stroke="white" stroke-width="4"/><circle cx="52" cy="50" r="3" fill="white"/><circle cx="68" cy="50" r="3" fill="white"/><path d="M50 62c4 6 16 6 20 0" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>
        </div>
        <div class="dock-icon" data-app="gemini">
          <div class="dock-tooltip">Gemini</div><div class="dock-label">Gemini</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#1e1f20"/><circle cx="60" cy="60" r="24" fill="none" stroke="url(#gg)" stroke-width="4"/><defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4285f4"/><stop offset="33%" stop-color="#ea4335"/><stop offset="66%" stop-color="#fbbc05"/><stop offset="100%" stop-color="#34a853"/></linearGradient></defs><circle cx="60" cy="60" r="10" fill="url(#gg)"/></svg>
        </div>
        <div class="dock-icon" data-app="notebooklm">
          <div class="dock-tooltip">NotebookLM</div><div class="dock-label">NotebookLM</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#EA8B47"/><rect x="32" y="30" width="56" height="60" rx="4" fill="none" stroke="white" stroke-width="3"/><line x1="42" y1="45" x2="78" y2="45" stroke="white" stroke-width="2.5" opacity="0.7"/><line x1="42" y1="55" x2="72" y2="55" stroke="white" stroke-width="2.5" opacity="0.5"/><line x1="42" y1="65" x2="68" y2="65" stroke="white" stroke-width="2.5" opacity="0.4"/><circle cx="82" cy="78" r="14" fill="#EA8B47" stroke="white" stroke-width="3"/><path d="M78 78h8M82 74v8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div class="dock-icon" data-app="mail">
          <div class="dock-tooltip">MayoMail</div><div class="dock-label">MayoMail</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#1e40af"/><rect x="30" y="38" width="60" height="44" rx="4" fill="none" stroke="white" stroke-width="3"/><path d="M30 42l30 20 30-20" fill="none" stroke="white" stroke-width="3"/></svg>
        </div>
        <div class="dock-icon" data-app="chat">
          <div class="dock-tooltip">MayoChat</div><div class="dock-label">MayoChat</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#2563eb"/><path d="M30 45c0-6 5-10 10-10h40c5 0 10 4 10 10v25c0 6-5 10-10 10H55l-15 12V80H40c-5 0-10-4-10-10z" fill="none" stroke="white" stroke-width="3"/><circle cx="50" cy="57" r="3" fill="white"/><circle cx="60" cy="57" r="3" fill="white"/><circle cx="70" cy="57" r="3" fill="white"/></svg>
        </div>
        <div class="dock-icon" data-app="zaaksysteem">
          <div class="dock-tooltip">Zaaksysteem</div><div class="dock-label">Zaaksysteem</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#0f766e"/><rect x="28" y="28" width="64" height="64" rx="6" fill="none" stroke="white" stroke-width="3"/><path d="M40 50h40M40 62h40M40 74h25" stroke="white" stroke-width="2.5" opacity="0.7"/><circle cx="82" cy="38" r="12" fill="#fbbf24"/><path d="M78 38h8M82 34v8" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div class="dock-icon" data-app="vergunning">
          <div class="dock-tooltip">Vergunningtool</div><div class="dock-label">Vergunning</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#7c3aed"/><rect x="30" y="25" width="50" height="65" rx="4" fill="none" stroke="white" stroke-width="3"/><path d="M42 40h26M42 50h20M42 60h24" stroke="white" stroke-width="2" opacity="0.6"/><circle cx="80" cy="75" r="16" fill="#7c3aed" stroke="white" stroke-width="3"/><path d="M74 75l4 4 8-8" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
        </div>
        <div class="dock-icon" data-app="kcc">
          <div class="dock-tooltip">KCC-software</div><div class="dock-label">KCC</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#0369a1"/><path d="M35 75c0-12 10-20 25-20s25 8 25 20" fill="none" stroke="white" stroke-width="3"/><circle cx="60" cy="42" r="14" fill="none" stroke="white" stroke-width="3"/><path d="M82 55l12 12" stroke="white" stroke-width="3" stroke-linecap="round"/><circle cx="90" cy="40" r="8" fill="none" stroke="white" stroke-width="2" opacity="0.5"/></svg>
        </div>
        <div class="dock-icon" data-app="sociaal">
          <div class="dock-tooltip">Sociaal Domein Hub</div><div class="dock-label">Sociaal</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><rect width="120" height="120" rx="26" fill="#be185d"/><circle cx="45" cy="45" r="10" fill="none" stroke="white" stroke-width="2.5"/><circle cx="75" cy="45" r="10" fill="none" stroke="white" stroke-width="2.5"/><circle cx="60" cy="72" r="10" fill="none" stroke="white" stroke-width="2.5"/><line x1="52" y1="52" x2="55" y2="65" stroke="white" stroke-width="2"/><line x1="68" y1="52" x2="65" y2="65" stroke="white" stroke-width="2"/><line x1="55" y1="42" x2="65" y2="42" stroke="white" stroke-width="2"/></svg>
        </div>
        <div class="dock-icon" data-app="settings">
          <div class="dock-tooltip">Instellingen</div><div class="dock-label">Instellingen</div>
          <svg viewBox="0 0 120 120" width="42" height="42"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#636366"/><stop offset="100%" stop-color="#48484A"/></linearGradient></defs><rect width="120" height="120" rx="26" fill="url(#sg)"/><circle cx="60" cy="60" r="18" fill="none" stroke="white" stroke-width="3"/><circle cx="60" cy="60" r="7" fill="white"/><line x1="60" y1="30" x2="60" y2="38" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="60" y1="82" x2="60" y2="90" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="30" y1="60" x2="38" y2="60" stroke="white" stroke-width="4" stroke-linecap="round"/><line x1="82" y1="60" x2="90" y2="60" stroke="white" stroke-width="4" stroke-linecap="round"/></svg>
        </div>
      </div>

      <div class="app-window open" id="window-board" style="display:none;top:35px;left:30px;right:30px;bottom:74px">
        <div class="app-titlebar">
          <div class="app-titlebar-dots">
            <div class="app-titlebar-dot red" data-action="close" data-window="board"></div>
            <div class="app-titlebar-dot yellow" data-action="minimize" data-window="board"></div>
            <div class="app-titlebar-dot green" data-action="maximize" data-window="board"></div>
          </div>
          <div class="app-titlebar-title">MayoBoard \u2014 Takenbord</div>
          <div class="app-titlebar-controls">
            <div class="app-titlebar-ctrl" data-action="minimize" data-window="board">\u2014</div>
            <div class="app-titlebar-ctrl" data-action="maximize" data-window="board">\u25A1</div>
            <div class="app-titlebar-ctrl close" data-action="close" data-window="board">\u2715</div>
          </div>
        </div>
        <div class="app-body" id="board-body"></div>
      </div>

      <div class="desktop-icons" id="desktop-icons">
        ${[
          {app:"board",label:"MayoBoard",svg:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#0052cc"/><rect x="20" y="30" width="22" height="60" rx="3" fill="rgba(255,255,255,0.3)"/><rect x="49" y="30" width="22" height="45" rx="3" fill="rgba(255,255,255,0.3)"/><rect x="78" y="30" width="22" height="35" rx="3" fill="rgba(255,255,255,0.3)"/><rect x="23" y="34" width="16" height="10" rx="2" fill="white"/><rect x="23" y="48" width="16" height="10" rx="2" fill="white"/><rect x="52" y="34" width="16" height="10" rx="2" fill="white"/><rect x="81" y="34" width="16" height="10" rx="2" fill="white"/></svg>'},
          {app:"vergunning",label:"Vergunningen",svg:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#7c3aed"/><rect x="30" y="25" width="50" height="65" rx="4" fill="none" stroke="white" stroke-width="3"/><path d="M42 40h26M42 50h20M42 60h24" stroke="white" stroke-width="2" opacity="0.6"/><circle cx="80" cy="75" r="16" fill="#7c3aed" stroke="white" stroke-width="3"/><path d="M74 75l4 4 8-8" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>'},
          {app:"zaaksysteem",label:"Zaaksysteem",svg:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#0f766e"/><rect x="28" y="28" width="64" height="64" rx="6" fill="none" stroke="white" stroke-width="3"/><path d="M40 50h40M40 62h40M40 74h25" stroke="white" stroke-width="2.5" opacity="0.7"/></svg>'},
          {app:"chatgpt",label:"ChatGPT",svg:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#10a37f"/><circle cx="60" cy="55" r="22" fill="none" stroke="white" stroke-width="4"/><path d="M60 77v12" stroke="white" stroke-width="4"/><circle cx="60" cy="55" r="8" fill="white"/></svg>'},
          {app:"intranet",label:"MayoWiki",svg:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#1e6fba"/><rect x="28" y="24" width="64" height="72" rx="4" fill="none" stroke="white" stroke-width="3"/><path d="M40 40h40M40 52h35M40 64h28M40 76h32" stroke="white" stroke-width="2" opacity="0.6"/></svg>'},
          {app:"wiwa",label:"WiWa",svg:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#6366f1"/><circle cx="42" cy="45" r="12" fill="none" stroke="white" stroke-width="2.5"/><circle cx="78" cy="45" r="12" fill="none" stroke="white" stroke-width="2.5"/><path d="M22 82c0-12 9-18 20-18s20 6 20 18" fill="none" stroke="white" stroke-width="2.5"/><path d="M58 82c0-12 9-18 20-18s20 6 20 18" fill="none" stroke="white" stroke-width="2.5"/></svg>'},
          {app:"mail",label:"MayoMail",svg:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#1e40af"/><rect x="30" y="38" width="60" height="44" rx="4" fill="none" stroke="white" stroke-width="3"/><path d="M30 42l30 20 30-20" fill="none" stroke="white" stroke-width="3"/></svg>'},
          {app:"chat",label:"MayoChat",svg:'<svg viewBox="0 0 120 120"><rect width="120" height="120" rx="26" fill="#2563eb"/><path d="M30 45c0-6 5-10 10-10h40c5 0 10 4 10 10v25c0 6-5 10-10 10H55l-15 12V80H40c-5 0-10-4-10-10z" fill="none" stroke="white" stroke-width="3"/><circle cx="50" cy="57" r="3" fill="white"/><circle cx="60" cy="57" r="3" fill="white"/><circle cx="70" cy="57" r="3" fill="white"/></svg>'},
        ].map(a => `<div class="desktop-icon-item" data-desk-app="${a.app}">${a.svg}<div class="desktop-icon-label">${a.label}</div></div>`).join("")}
      </div>

      <div class="desktop-widgets" id="desktop-widgets">
        <div class="desktop-widget" style="cursor:pointer" id="widget-tasks-click">
          <div class="widget-title">Taken vandaag</div>
          <div class="widget-task">
            <div class="widget-task-dot normal"></div>
            <div>
              <div class="widget-task-text">MayoWiki doorlezen</div>
              <div class="widget-task-meta">Onboarding \u2022 Kennismaken met organisatie</div>
            </div>
          </div>
          <div class="widget-task">
            <div class="widget-task-dot normal"></div>
            <div>
              <div class="widget-task-text">WiWa bekijken</div>
              <div class="widget-task-meta">Onboarding \u2022 Collega's leren kennen</div>
            </div>
          </div>
          <div style="font-size:0.65rem;color:rgba(255,255,255,0.4);margin-top:6px;text-align:center">Klik om MayoBoard te openen</div>
        </div>
        <div class="desktop-widget">
          <div class="widget-title">Welkom, ${state.nickname || "collega"}!</div>
          <div style="font-size:0.8rem;color:rgba(255,255,255,0.7);line-height:1.5">
            Afdeling VTH \u2022 Gemeente Mayostad<br>Je doet mee aan de AI-pilot. Verken je werkplek en wacht op je eerste opdracht van Marco.
          </div>
        </div>
      </div>

      <div id="notification-area"></div>
    </div>`;

    // Populate WiWa
    renderWiWa(area.querySelector("#wiwa-body"));

    // Tasks widget click -> open board
    area.querySelector("#widget-tasks-click")?.addEventListener("click", () => {
      sfxClick();
      area.querySelector('[data-app="board"]')?.click();
    });

    // Desktop icon double-click = same as dock click
    area.querySelectorAll("[data-desk-app]").forEach(icon => {
      icon.addEventListener("dblclick", () => {
        const app = icon.dataset.deskApp;
        const dockIcon = area.querySelector(`.dock-icon[data-app="${app}"]`);
        if (dockIcon) dockIcon.click();
      });
    });

    // Dock click handlers
    const appMessages = {
      finder: "Finder is beschikbaar, maar je hebt geen bestanden nodig voor deze opdracht.",
      claude: "Claude is beschikbaar voor langere documenten. Vandaag gebruik je ChatGPT.",
      gemini: "Gemini is beschikbaar voor onderzoek en vergelijking. Probeer het later!",
      settings: "Instellingen zijn vergrendeld door IT. Neem contact op met de helpdesk.",
    };

    area.querySelectorAll(".dock-icon[data-app]").forEach(icon => {
      icon.addEventListener("click", () => {
        sfxClick();
        const app = icon.dataset.app;
        if (app === "board") {
          const w = document.getElementById("window-board");
          w.style.display = "flex";
          area.querySelectorAll(".app-window").forEach(ww => ww.classList.remove("focused"));
          w.classList.add("focused", "maximized");
        } else if (app === "wiwa") {
          const w = document.getElementById("window-wiwa");
          w.style.display = "flex";
          area.querySelectorAll(".app-window").forEach(ww => ww.classList.remove("focused"));
          w.classList.add("focused");
        } else if (app === "intranet") {
          const w = document.getElementById("window-intranet");
          w.style.display = "flex";
          w.classList.add("maximized");
          area.querySelectorAll(".app-window").forEach(ww => ww.classList.remove("focused"));
          w.classList.add("focused");
        } else if (app === "chatgpt") {
          if (!taskShown) {
            showDesktopNotification("ChatGPT is beschikbaar zodra je een taak hebt. Verken eerst het intranet!");
            return;
          }
          document.getElementById("window-chatgpt").style.display = "flex";
          document.getElementById("window-chatgpt").classList.add("maximized", "focused");
          document.getElementById("window-intranet")?.classList.remove("focused");
        } else if (typeof APP_RENDERERS !== "undefined" && APP_RENDERERS[app]) {
          // Open app in a new window or reuse existing
          let win = document.getElementById("window-app-" + app);
          if (!win) {
            const titles = {zaaksysteem:"Zaaksysteem",vergunning:"Vergunningtool",kcc:"KCC Dashboard",sociaal:"Sociaal Domein Hub",chat:"MayoChat",mail:"MayoMail",notebooklm:"NotebookLM",gemini:"Gemini",claude:"Claude"};
            win = document.createElement("div");
            win.className = "app-window open";
            win.id = "window-app-" + app;
            win.style.cssText = "top:35px;left:20px;right:20px;bottom:74px";
            win.innerHTML = `<div class="app-titlebar"><div class="app-titlebar-dots"><div class="app-titlebar-dot red" data-action="close" data-window="app-${app}"></div><div class="app-titlebar-dot yellow" data-action="minimize" data-window="app-${app}"></div><div class="app-titlebar-dot green" data-action="maximize" data-window="app-${app}"></div></div><div class="app-titlebar-title">${titles[app] || app}</div><div class="app-titlebar-controls"><div class="app-titlebar-ctrl" data-action="minimize" data-window="app-${app}">\u2014</div><div class="app-titlebar-ctrl" data-action="maximize" data-window="app-${app}">\u25A1</div><div class="app-titlebar-ctrl close" data-action="close" data-window="app-${app}">\u2715</div></div></div><div class="app-body" id="app-body-${app}"></div>`;
            document.getElementById("macos-desktop").insertBefore(win, document.getElementById("dock"));
            // Wire controls
            win.querySelectorAll("[data-action]").forEach(ctrl => {
              ctrl.addEventListener("click", (e) => {
                e.stopPropagation();
                if (ctrl.dataset.action === "close") { win.style.display = "none"; win.classList.remove("focused"); }
                else if (ctrl.dataset.action === "minimize") { win.style.display = "none"; }
                else if (ctrl.dataset.action === "maximize") { win.classList.toggle("maximized"); }
              });
            });
            // Wire drag
            const tb = win.querySelector(".app-titlebar");
            let dragging = false, sx, sy, sl, st;
            tb.addEventListener("mousedown", (e) => {
              if (win.classList.contains("maximized") || e.target.closest("[data-action]")) return;
              dragging = true;
              const r = win.getBoundingClientRect();
              sx = e.clientX; sy = e.clientY; sl = r.left; st = r.top;
              win.style.right = "auto"; win.style.bottom = "auto";
              win.style.left = sl + "px"; win.style.top = st + "px";
              win.style.width = r.width + "px"; win.style.height = r.height + "px";
              e.preventDefault();
            });
            document.addEventListener("mousemove", (e) => { if (!dragging) return; win.style.left = (sl + e.clientX - sx) + "px"; win.style.top = Math.max(26, st + e.clientY - sy) + "px"; });
            document.addEventListener("mouseup", () => { dragging = false; });
            // Render content
            APP_RENDERERS[app](win.querySelector("#app-body-" + app));
          }
          win.style.display = "flex";
          win.classList.add("maximized", "focused");
          area.querySelectorAll(".app-window").forEach(w => { if (w !== win) w.classList.remove("focused"); });
          icon.classList.add("active");
        } else if (appMessages[app]) {
          showDesktopNotification(appMessages[app]);
        }
      });
    });

    // Window control handlers
    area.querySelectorAll("[data-action]").forEach(ctrl => {
      ctrl.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = ctrl.dataset.action;
        const win = document.getElementById("window-" + ctrl.dataset.window);
        if (!win) return;
        if (action === "close") { win.style.display = "none"; win.classList.remove("focused"); }
        else if (action === "minimize") { win.style.display = "none"; }
        else if (action === "maximize") {
          if (win.classList.contains("maximized")) {
            win.classList.remove("maximized");
            win.style.top = "50px"; win.style.left = "60px";
            win.style.right = "60px"; win.style.bottom = "100px";
          } else {
            win.classList.add("maximized");
          }
        }
      });
    });

    // Drag windows by titlebar
    area.querySelectorAll(".app-titlebar").forEach(titlebar => {
      let dragging = false, startX, startY, startLeft, startTop;
      titlebar.addEventListener("mousedown", (e) => {
        const win = titlebar.closest(".app-window");
        if (win.classList.contains("maximized")) return;
        if (e.target.closest("[data-action]")) return;
        dragging = true;
        // Focus this window
        area.querySelectorAll(".app-window").forEach(w => w.classList.remove("focused"));
        win.classList.add("focused");
        const rect = win.getBoundingClientRect();
        startX = e.clientX; startY = e.clientY;
        startLeft = rect.left; startTop = rect.top;
        win.style.position = "absolute";
        win.style.right = "auto"; win.style.bottom = "auto";
        win.style.left = startLeft + "px"; win.style.top = startTop + "px";
        win.style.width = rect.width + "px"; win.style.height = rect.height + "px";
        e.preventDefault();
      });
      document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const win = titlebar.closest(".app-window");
        const dx = e.clientX - startX, dy = e.clientY - startY;
        win.style.left = (startLeft + dx) + "px";
        win.style.top = Math.max(26, startTop + dy) + "px";
      });
      document.addEventListener("mouseup", () => { dragging = false; });
    });

    const navEl = area.querySelector("#intranet-nav");
    const pageEl = area.querySelector("#intranet-page");

    function renderNav() {
      navEl.innerHTML = `<div class="intranet-sidebar-title">Nova Intranet</div>`;
      Object.entries(wiki.pages).forEach(([key, page]) => {
        const item = document.createElement("div");
        item.className = "intranet-nav-item" + (key === currentPage ? " active" : "");
        item.innerHTML = `<span>${page.icon}</span> ${page.title}`;
        item.addEventListener("click", () => { sfxClick(); currentPage = key; renderNav(); renderPage(); });
        navEl.appendChild(item);
      });
    }

    function renderPage() {
      const page = wiki.pages[currentPage];
      if (!page) return;
      let html = currentPage !== "home"
        ? `<div class="wiki-breadcrumbs"><span data-link="home">MayoWiki</span><span class="sep">/</span><span>${page.title}</span></div>`
        : "";
      html += `<div class="intranet-page-title">${page.title}</div>`;

      page.content.forEach(block => {
        if (block.type === "banner") html += `<div class="intranet-banner">${block.text}</div>`;
        else if (block.type === "cards") {
          html += `<div class="intranet-cards">`;
          block.items.forEach(c => {
            html += `<div class="intranet-card" data-link="${c.link}"><div class="intranet-card-icon">${c.icon}</div><div class="intranet-card-title">${c.title}</div></div>`;
          });
          html += `</div>`;
        }
        else if (block.type === "text") html += `<div class="intranet-text">${block.text}</div>`;
        else if (block.type === "heading") html += `<div class="intranet-heading">${block.text}</div>`;
        else if (block.type === "info") html += `<div class="intranet-info-row"><div class="intranet-info-label">${block.label}</div><div class="intranet-info-value">${block.value}</div></div>`;
        else if (block.type === "do-dont") {
          html += `<div class="intranet-dodont">
            <div class="intranet-do"><div class="intranet-do-title">WEL DOEN</div><ul>${block.dos.map(d => `<li>${d}</li>`).join("")}</ul></div>
            <div class="intranet-dont"><div class="intranet-dont-title">NIET DOEN</div><ul>${block.donts.map(d => `<li>${d}</li>`).join("")}</ul></div>
          </div>`;
        }
        else if (block.type === "client") {
          html += `<div class="intranet-client">
            <div class="intranet-client-name">${block.name}</div>
            <div class="intranet-client-row">Contact: ${block.contact} | Klant sinds: ${block.since} | Status: ${block.status}</div>
            ${block.note ? `<div class="intranet-client-note">${block.note}</div>` : ""}
          </div>`;
        }
        else if (block.type === "tool") {
          html += `<div class="intranet-tool">
            <div><div class="intranet-tool-name">${block.name}</div><div class="intranet-tool-desc">${block.desc}</div></div>
            <div class="intranet-tool-status ${block.status === 'Verplicht' ? 'required' : 'optional'}">${block.status}</div>
          </div>`;
        }
        else if (block.type === "person") {
          const initials = block.name.split(" ").map(w => w[0]).join("").slice(0, 2);
          html += `<div class="intranet-person">
            <div class="intranet-person-avatar">${initials}</div>
            <div><div class="intranet-person-name">${block.name}</div><div class="intranet-person-role">${block.role}</div><div class="intranet-person-note">${block.note}</div></div>
          </div>`;
        }
        else if (block.type === "rule") {
          html += `<div class="intranet-rule"><div class="intranet-rule-num">${block.num}</div><div class="intranet-rule-text">${block.text}</div></div>`;
        }
      });

      pageEl.innerHTML = html;

      // Wire card links
      pageEl.querySelectorAll("[data-link]").forEach(card => {
        card.addEventListener("click", () => {
          sfxClick();
          currentPage = card.dataset.link;
          renderNav();
          renderPage();
        });
      });
    }

    renderNav();
    renderPage();

    // Show task on board after delay
    renderBoard(area.querySelector("#board-body"), d, task, taskShown);
    setTimeout(() => {
      if (taskShown) return;
      taskShown = true;
      renderBoard(area.querySelector("#board-body"), d, task, true);
      showDesktopNotification("Nieuwe taak op MayoBoard! Lisa heeft een opdracht voor je.");
    }, d.taskPopupDelay || 12000);
  }

  function showDesktopNotification(message) {
    const notifArea = document.getElementById("notification-area");
    const notif = document.createElement("div");
    notif.className = "macos-notification";
    notif.innerHTML = `
      <div class="macos-notif-header">
        <div class="macos-notif-icon">N</div>
        <div class="macos-notif-app">Nova</div>
        <div class="macos-notif-time">nu</div>
      </div>
      <div class="macos-notif-body">
        <div class="macos-notif-text">${message}</div>
      </div>
    `;
    notifArea.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
  }

  function showChatNotification(area, d, task) {
    const tp = d.taskPopup;
    const notifArea = document.getElementById("notification-area");
    const notif = document.createElement("div");
    notif.className = "macos-notification";
    notif.style.cursor = "pointer";
    notif.innerHTML = `
      <div class="macos-notif-header">
        <div class="macos-notif-icon" style="background:#2563eb">M</div>
        <div class="macos-notif-app">MayoChat</div>
        <div class="macos-notif-time">nu</div>
      </div>
      <div class="macos-notif-body">
        <div class="macos-notif-title">${tp.from}</div>
        <div class="macos-notif-text">${tp.message}</div>
      </div>
    `;
    notifArea.appendChild(notif);
    sfxClick();

    // Clicking the notification opens ChatGPT
    notif.addEventListener("click", () => {
      sfxClick();
      notif.remove();
      openChatGPTWindow(area, d, task);
    });

    // Auto-dismiss after 30s, then show again
    setTimeout(() => {
      if (notif.parentElement) {
        notif.remove();
        // Remind again
        setTimeout(() => {
          if (!document.getElementById("window-chatgpt")?.classList.contains("open-active")) {
            showChatNotification(area, d, task);
          }
        }, 15000);
      }
    }, 30000);
  }

  function openChatGPTWindow(area, d, task) {
    const chatgptWindow = document.getElementById("window-chatgpt");
    const chatgptBody = document.getElementById("chatgpt-app-body");
    chatgptWindow.style.display = "flex";
    chatgptWindow.classList.add("maximized", "focused", "open-active");
    document.getElementById("window-intranet").classList.remove("focused");

    // Highlight ChatGPT in dock
    area.querySelector('[data-app="chatgpt"]')?.classList.add("active");

    // Render ChatGPT interface inside the window with task bar on top
    const tp = d.taskPopup;
    const ui = buildToolWindow(d.tool || "chatgpt");
    chatgptBody.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;background:#212121">
        <div id="task-reminder" style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#1e293b;border-bottom:1px solid #334155;font-size:0.8rem;cursor:pointer;flex-shrink:0" onclick="this.querySelector('#task-detail').style.display=this.querySelector('#task-detail').style.display==='none'?'block':'none'">
          <div style="background:#2563eb;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0">${tp.avatar}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px">
              <span style="font-weight:600;color:#e2e8f0">${tp.from}</span>
              <span style="font-size:0.65rem;color:#64748b">${tp.fromRole}</span>
              <span style="margin-left:auto;font-size:0.6rem;background:#dc2626;color:white;padding:2px 6px;border-radius:4px;font-weight:700">${tp.urgency}</span>
            </div>
            <div id="task-detail" style="color:#94a3b8;line-height:1.5;margin-top:6px">${tp.message}</div>
          </div>
        </div>
        <div class="gpt-topbar">
          <div class="gpt-topbar-logo">G</div>
          <div class="gpt-model-select" id="gpt-model-btn">ChatGPT <span style="font-size:0.6rem">\u25BC</span></div>
          <div class="gpt-topbar-model" id="gpt-model-label">4o</div>
        </div>
        <div class="gpt-chat" id="sim-chat" style="flex:1"></div>
        <div class="gpt-input-area">
          <div class="gpt-inputbar">
            <input class="gpt-input" id="gpt-free-input" placeholder="Schrijf hier je prompt voor de klant-email...">
            <button class="gpt-send" id="gpt-free-send">\u2191</button>
          </div>
          <div class="gpt-disclaimer">ChatGPT kan fouten maken. Controleer belangrijke informatie.</div>
        </div>
      </div>
    `;

    const chatEl = chatgptBody.querySelector("#sim-chat");
    const inputEl = chatgptBody.querySelector("#gpt-free-input");
    const sendBtn = chatgptBody.querySelector("#gpt-free-send");
    let sent = false;

    inputEl.focus();
    inputEl.addEventListener("input", () => {
      sendBtn.style.opacity = inputEl.value.trim().length > 10 ? "1" : "0.3";
    });

    function handleSend() {
      if (sent || inputEl.value.trim().length < 5) return;
      sent = true;
      sfxClick();

      const promptText = inputEl.value.trim();
      inputEl.setAttribute("readonly", "");
      sendBtn.disabled = true;

      addChatMsg(chatEl, ui, "user", promptText, false);

      // Validate
      const text = promptText.toLowerCase();
      let score = 0, found = 0, missing = [];
      d.checks.forEach(c => {
        if (c.keywords.some(kw => text.includes(kw.toLowerCase()))) {
          score += c.points;
          found++;
        } else {
          missing.push(c);
        }
      });

      let responseKey = score >= 90 ? "perfect" : score >= 60 ? "good" : score >= 30 ? "mediocre" : "bad";
      addChatMsg(chatEl, ui, "ai", d.responses[responseKey], true).then(() => {
        const fb = document.createElement("div");
        fb.style.cssText = "padding:16px;border-top:1px solid #333";

        if (score >= 90) {
          sfxCorrect(); addXP(200); state.totalScore++;
          fb.innerHTML = `<div class="feedback success"><div class="feedback-title">${found}/${d.checks.length} elementen - Uitstekend!</div>Je prompt bevatte alle cruciale informatie. Lisa zou trots zijn.</div>`;
        } else {
          if (score >= 60) { sfxCorrect(); addXP(100); state.totalScore++; } else { sfxWrong(); addXP(30); }
          fb.innerHTML = `<div class="feedback ${score >= 60 ? "warning" : "error"}">
            <div class="feedback-title">${found}/${d.checks.length} elementen - ${score >= 60 ? "Goed begin" : "De AI miste context"}</div>
            ${missing.map(m => `<div style="display:flex;gap:8px;margin-top:6px;font-size:0.85rem"><span style="color:var(--red)">\u2718</span><strong>${m.label}:</strong> ${m.hint}</div>`).join("")}
            <div style="margin-top:10px;font-size:0.8rem;color:var(--text-dim)">Tip: alle informatie stond op het Nova intranet. Klik op het intranet-icoon in de dock om terug te kijken.</div>
          </div>`;
          fb.innerHTML += `<button class="action-btn secondary" id="retry-btn" style="margin-top:10px">Probeer opnieuw</button>`;
        }

        fb.innerHTML += `<div class="feedback info" style="margin-top:12px"><div class="feedback-title">Inzicht</div>${task.insight}</div>`;
        fb.innerHTML += `<button class="action-btn" id="next-from-desktop" style="margin-top:12px">Volgende \u2192</button>`;
        chatgptBody.querySelector(".gpt-input-area").before(fb);

        fb.querySelector("#next-from-desktop")?.addEventListener("click", () => {
          // Clean up desktop, restore normal UI
          document.getElementById("macos-desktop")?.remove();
          document.getElementById("header").style.display = "";
          area.closest(".screen").style.padding = "";
          sfxClick();
          nextTask();
        });

        fb.querySelector("#retry-btn")?.addEventListener("click", () => {
          sent = false;
          inputEl.removeAttribute("readonly");
          sendBtn.disabled = false;
          chatEl.innerHTML = "";
          inputEl.value = "";
          inputEl.focus();
          fb.remove();
        });
      });
    }

    sendBtn.addEventListener("click", handleSend);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
  }

  // ─── INTERACTION: Free Prompt ────────────────────────
  function renderFreePrompt(area, task) {
    const d = task.interaction;

    area.innerHTML = `${buildFullBrowser(d.tool || "chatgpt")}`;

    // Make the GPT input actually work
    const chatEl = area.querySelector("#sim-chat");
    const inputEl = area.querySelector(".gpt-input");
    const sendBtn = area.querySelector(".gpt-send");
    inputEl.removeAttribute("readonly");
    inputEl.placeholder = "Schrijf hier je prompt...";
    sendBtn.disabled = false;

    const ui = buildToolWindow(d.tool || "chatgpt");

    inputEl.addEventListener("input", () => {
      sendBtn.style.opacity = inputEl.value.trim().length > 10 ? "1" : "0.3";
    });

    // Send prompt
    let sent = false;
    function handleSend() {
      if (sent || inputEl.value.trim().length < 5) return;
      sent = true;
      sfxClick();

      const promptText = inputEl.value.trim();
      inputEl.setAttribute("readonly", "");
      sendBtn.disabled = true;

      // Show user message
      addChatMsg(chatEl, ui, "user", promptText, false);

      // Calculate score
      const text = promptText.toLowerCase();
      let score = 0;
      let found = 0;
      let missing = [];
      d.checks.forEach(c => {
        if (c.keywords.some(kw => text.includes(kw.toLowerCase()))) {
          score += c.points;
          found++;
        } else {
          missing.push(c);
        }
      });

      // Pick response based on score
      let responseKey = "bad";
      if (score >= 90) responseKey = "perfect";
      else if (score >= 60) responseKey = "good";
      else if (score >= 30) responseKey = "mediocre";

      const response = d.responses[responseKey];

      // Show AI response
      addChatMsg(chatEl, ui, "ai", response, true).then(() => {
        // Show feedback
        const fbArea = document.createElement("div");
        fbArea.style.marginTop = "16px";

        if (score >= 90) {
          sfxCorrect();
          addXP(200);
          state.totalScore++;
          fbArea.innerHTML = `
            <div class="feedback success">
              <div class="feedback-title">${found}/${d.checks.length} elementen gevonden — Uitstekend!</div>
              Je prompt bevatte alle cruciale informatie. De AI kon een email produceren die je vrijwel direct kunt versturen.
            </div>
          `;
        } else {
          if (score >= 60) { sfxCorrect(); addXP(100); state.totalScore++; }
          else { sfxWrong(); addXP(30); }

          const missingHTML = missing.map(m =>
            `<div style="display:flex;align-items:center;gap:8px;margin-top:6px;font-size:0.85rem">
              <span style="color:var(--red)">\u2718</span>
              <span><strong>${m.label}:</strong> ${m.hint}</span>
            </div>`
          ).join("");

          fbArea.innerHTML = `
            <div class="feedback ${score >= 60 ? "warning" : "error"}">
              <div class="feedback-title">${found}/${d.checks.length} elementen — ${score >= 60 ? "Goed begin, maar er mist nog wat" : "De AI miste veel context"}</div>
              ${score < 60 ? "Kijk naar wat er ontbrak. Hoe meer details je geeft, hoe beter het resultaat." : "Bijna! Met deze extra details was de email nog beter geweest:"}
              ${missingHTML}
            </div>
            <button class="action-btn secondary" id="retry-prompt" style="margin-top:12px">Probeer opnieuw</button>
          `;
        }

        area.appendChild(fbArea);
        showInsightAndNext(area, task);

        // Retry handler
        const retryBtn = area.querySelector("#retry-prompt");
        if (retryBtn) {
          retryBtn.addEventListener("click", () => {
            sent = false;
            inputEl.removeAttribute("readonly");
            sendBtn.disabled = false;
            chatEl.innerHTML = "";
            inputEl.value = "";
            inputEl.focus();
            fbArea.remove();
            // Remove insight/next button
            const insightEls = area.querySelectorAll(".feedback.info, #next-task-btn");
            insightEls.forEach(el => el.parentElement?.contains(el) && el.remove());
          });
        }
      });
    }

    sendBtn.addEventListener("click", handleSend);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    // Wire sidebar and model selector
    wireSidebarAndModel(area, chatEl, d.tool || "chatgpt", ui);
  }

  function wireSidebarAndModel(area, chatEl, tool, ui) {
    // Sidebar chats
    area.querySelectorAll("[data-chat]").forEach(item => {
      item.addEventListener("click", () => {
        const chatName = item.dataset.chat;
        if (chatName === "current") return;
        const history = GPT_SIDEBAR_CHATS[chatName];
        if (!history) return;
        sfxClick();
        area.querySelectorAll("[data-chat]").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        const savedHTML = chatEl.innerHTML;
        chatEl.innerHTML = "";
        history.forEach(msg => addChatMsg(chatEl, ui, msg.role, msg.text, false));

        if (!area.querySelector("#sidebar-back-btn")) {
          const backBtn = document.createElement("button");
          backBtn.className = "action-btn secondary";
          backBtn.id = "sidebar-back-btn";
          backBtn.textContent = "\u2190 Terug naar je opdracht";
          backBtn.style.margin = "12px 0";
          backBtn.addEventListener("click", () => {
            sfxClick();
            area.querySelectorAll("[data-chat]").forEach(i => i.classList.remove("active"));
            area.querySelector('[data-chat="current"]')?.classList.add("active");
            chatEl.innerHTML = savedHTML;
            backBtn.remove();
          });
          chatEl.parentElement.appendChild(backBtn);
        }
      });
    });

    // Model selector
    const modelBtn = area.querySelector("#gpt-model-btn");
    const modelDropdown = area.querySelector("#gpt-model-dropdown");
    const modelLabel = area.querySelector("#gpt-model-label");
    if (modelBtn && modelDropdown) {
      modelBtn.addEventListener("click", () => {
        sfxClick();
        modelDropdown.style.display = modelDropdown.style.display === "none" ? "block" : "none";
      });
      modelDropdown.querySelectorAll(".gpt-model-option").forEach(opt => {
        opt.addEventListener("click", () => {
          sfxClick();
          modelLabel.textContent = opt.dataset.model;
          modelDropdown.style.display = "none";
          modelDropdown.querySelectorAll(".gpt-model-option").forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");
        });
      });
      area.addEventListener("click", (e) => {
        if (!modelBtn.contains(e.target) && !modelDropdown.contains(e.target)) modelDropdown.style.display = "none";
      });
    }
  }

  // ─── WiWa - Wie is Wa ───────────────────────────────
  // Photo URLs - using randomuser.me and robohash for AI
  const PHOTOS = {
    "Lisa de Vries": "https://randomuser.me/api/portraits/women/44.jpg",
    "Remco van Dam": "https://randomuser.me/api/portraits/men/32.jpg",
    "Priya Sharma": "https://randomuser.me/api/portraits/women/68.jpg",
    "Henk Visser": "https://randomuser.me/api/portraits/men/62.jpg",
    "Fatima El-Amrani": "https://randomuser.me/api/portraits/women/90.jpg",
    "Sandra Mulder": "https://randomuser.me/api/portraits/women/52.jpg",
    "Bas van den Berg": "https://randomuser.me/api/portraits/men/46.jpg",
    "Noor de Jong": "https://randomuser.me/api/portraits/women/33.jpg",
    "Marco Pieterse": "https://randomuser.me/api/portraits/men/55.jpg",
    "Anouk Willems": "https://randomuser.me/api/portraits/women/26.jpg",
    "Dennis Krul": "https://randomuser.me/api/portraits/men/76.jpg",
    "Youssef Amrani": "https://randomuser.me/api/portraits/men/83.jpg",
    "Sarah Chen": "https://randomuser.me/api/portraits/women/75.jpg",
    "Tom Bakker": "https://randomuser.me/api/portraits/men/22.jpg",
    "Ahmed Hassan": "https://randomuser.me/api/portraits/men/91.jpg",
    "KCC-Bot": "https://robohash.org/kcc-bot?set=set3&size=200x200",
    "BZ-Vertaler": "https://robohash.org/bz-vertaler?set=set3&size=200x200",
    "WMO-Schrijver": "https://robohash.org/wmo-schrijver?set=set3&size=200x200",
    "BOA-Rapporteur": "https://robohash.org/boa-rapporteur?set=set3&size=200x200",
    "Content-AI": "https://robohash.org/content-ai?set=set3&size=200x200",
  };

  // ─── MayoBoard - Kanban ──────────────────────────────
  function renderBoard(container, d, task, showNewTask) {
    const tp = d?.taskPopup;
    container.innerHTML = `
      <div class="kanban">
        <div class="kanban-topbar">
          <div class="kanban-topbar-title">MayoBoard \u2014 Mijn taken</div>
          <div class="kanban-avatars">
            <img class="kanban-filter-avatar" src="https://randomuser.me/api/portraits/men/55.jpg" title="Marco">
            <img class="kanban-filter-avatar" src="https://randomuser.me/api/portraits/women/26.jpg" title="Anouk">
          </div>
        </div>
        <div class="kanban-board">
          <div class="kanban-column">
            <div class="kanban-col-header">Te doen <span class="kanban-col-count">${showNewTask ? 1 : 0}</span></div>
            <div id="kanban-todo">
              ${showNewTask && tp ? `
              <div class="kanban-card clickable priority-high" id="main-task-card" style="animation:screenIn 0.4s ease">
                <div class="kanban-card-title">Brief terrasvergunning Bakkerij Van Dijk</div>
                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:8px">Inwoner informeren over vertraging door bezwaar</div>
                <div class="kanban-card-footer">
                  <div class="kanban-card-id">VTH-042</div>
                  <div class="kanban-card-meta">
                    <span class="kanban-card-priority high">Urgent</span>
                    <img class="kanban-card-avatar" src="https://randomuser.me/api/portraits/men/55.jpg">
                  </div>
                </div>
              </div>` : `<div style="padding:20px;text-align:center;color:#9ca3af;font-size:0.8rem">Geen taken</div>`}
            </div>
          </div>
          <div class="kanban-column">
            <div class="kanban-col-header">In uitvoering <span class="kanban-col-count">2</span></div>
            <div>
              <div class="kanban-card priority-low">
                <div class="kanban-card-title">MayoWiki doorlezen</div>
                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:6px">Schrijfwijzer, AI-regels, organisatie</div>
                <div class="kanban-card-footer">
                  <div class="kanban-card-id">VTH-040</div>
                  <div class="kanban-card-meta"><span class="kanban-card-priority low">Onboarding</span></div>
                </div>
              </div>
              <div class="kanban-card priority-low">
                <div class="kanban-card-title">WiWa bekijken</div>
                <div style="font-size:0.75rem;color:#6b7280;margin-bottom:6px">Collega's en AI-assistenten leren kennen</div>
                <div class="kanban-card-footer">
                  <div class="kanban-card-id">VTH-041</div>
                  <div class="kanban-card-meta"><span class="kanban-card-priority low">Onboarding</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="kanban-column">
            <div class="kanban-col-header">Review <span class="kanban-col-count">0</span></div>
            <div><div style="padding:20px;text-align:center;color:#9ca3af;font-size:0.8rem">Geen reviews</div></div>
          </div>
          <div class="kanban-column">
            <div class="kanban-col-header">Afgerond <span class="kanban-col-count">0</span></div>
            <div><div style="padding:20px;text-align:center;color:#9ca3af;font-size:0.8rem">Nog niets afgerond</div></div>
          </div>
        </div>
      </div>
    `;
    const mainCard = container.querySelector("#main-task-card");
    if (mainCard) {
      mainCard.addEventListener("click", () => {
        sfxClick();
        openChatGPTWindow(container.closest("#macos-desktop")?.parentElement || container.closest(".screen") || document.querySelector("#story-content"), d, task);
      });
    }
  }

  // ─── WiWa ───────────────────────────────────────────
  const WIWA_DATA = [
    { dept: "KCC", people: [
      { name: "Lisa de Vries", role: "Teamleider", skills: ["Klantcontact", "Teamaansturing", "AI-pilot sponsor"], status: "online", bot: false },
      { name: "Remco van Dam", role: "Medewerker KCC", skills: ["Telefonie", "Klachtafhandeling"], status: "online", bot: false },
      { name: "Priya Sharma", role: "Medewerker KCC", skills: ["Klachtafhandeling", "Escalaties"], status: "bezet", bot: false },
      { name: "KCC-Bot", role: "AI Assistent", skills: ["Standaard-antwoorden", "Wachttijd info", "Doorverbinden"], status: "online", bot: true, model: "GPT-4o", desc: "Beantwoordt eenvoudige vragen van inwoners via de website. Escaleert naar mens bij complexe vragen." },
    ]},
    { dept: "Burgerzaken", people: [
      { name: "Henk Visser", role: "Teamleider", skills: ["Paspoorten", "Rijbewijzen", "Geboorteaangifte"], status: "online", bot: false },
      { name: "Fatima El-Amrani", role: "Medewerker", skills: ["Tweetalig NL/AR", "Nieuwkomers", "Inburgering"], status: "online", bot: false },
      { name: "BZ-Vertaler", role: "AI Assistent", skills: ["Vertaling NL\u2194AR", "Vertaling NL\u2194TR", "Eenvoudige taal"], status: "online", bot: true, model: "Claude", desc: "Vertaalt gemeentelijke brieven naar andere talen en vereenvoudigt teksten naar B1-niveau." },
    ]},
    { dept: "Sociaal Domein", people: [
      { name: "Sandra Mulder", role: "Teamleider", skills: ["WMO", "Jeugdhulp", "Schuldhulp"], status: "online", bot: false },
      { name: "Bas van den Berg", role: "WMO Consulent", skills: ["Beschikkingen", "Indicatiestelling"], status: "bezet", bot: false },
      { name: "Noor de Jong", role: "Jeugdconsulent", skills: ["Kwetsbare gezinnen", "Privacy"], status: "afwezig", bot: false },
      { name: "WMO-Schrijver", role: "AI Assistent", skills: ["Beschikkingen opstellen", "Bezwaar-templates", "B1-taal"], status: "online", bot: true, model: "GPT-4o", desc: "Stelt concept-beschikkingen op. Output MOET altijd juridisch gecontroleerd worden door Bas of Ahmed." },
    ]},
    { dept: "VTH", people: [
      { name: "Marco Pieterse", role: "Teamleider", skills: ["Vergunningen", "Toezicht", "Handhaving"], status: "online", bot: false },
      { name: "Anouk Willems", role: "Vergunningverlener", skills: ["Omgevingsvergunning", "Horeca", "Evenementen"], status: "online", bot: false },
    ]},
    { dept: "BOA", people: [
      { name: "Dennis Krul", role: "Co\u00F6rdinator", skills: ["Aansturing BOA's", "Rapportages", "PV's"], status: "online", bot: false },
      { name: "Youssef Amrani", role: "BOA", skills: ["Controles", "Handhaving", "Overlast"], status: "buiten", bot: false },
      { name: "BOA-Rapporteur", role: "AI Assistent", skills: ["Controlerapporten", "PV-concepten", "Fotoanalyse"], status: "standby", bot: true, model: "GPT-4o + Vision", desc: "Helpt BOA's bij het opstellen van rapporten na controles. Kan foto's analyseren. NIET voor juridische conclusies." },
    ]},
    { dept: "Communicatie", people: [
      { name: "Sarah Chen", role: "Communicatieadviseur", skills: ["Schrijfwijzer", "Social media", "Persberichten"], status: "online", bot: false },
      { name: "Content-AI", role: "AI Assistent", skills: ["Social media posts", "Nieuwsbrieven", "Websiteteksten"], status: "online", bot: true, model: "Claude", desc: "Schrijft conceptteksten voor externe communicatie. Sarah controleert altijd voor publicatie." },
    ]},
    { dept: "ICT & Digitalisering", people: [
      { name: "Tom Bakker", role: "Projectleider AI-pilot", skills: ["AI-strategie", "Implementatie", "Training"], status: "online", bot: false },
      { name: "Ahmed Hassan", role: "CISO", skills: ["Informatiebeveiliging", "AVG", "Security"], status: "online", bot: false },
    ]},
  ];

  // Avatar colors per person (consistent)
  const AVATAR_COLORS = [
    ["#f472b6","#ec4899"], ["#a78bfa","#7c3aed"], ["#60a5fa","#2563eb"],
    ["#34d399","#059669"], ["#fbbf24","#d97706"], ["#fb923c","#ea580c"],
    ["#f87171","#dc2626"], ["#38bdf8","#0284c7"], ["#a3e635","#65a30d"],
    ["#e879f9","#c026d3"], ["#2dd4bf","#0d9488"], ["#818cf8","#4f46e5"],
  ];
  function avatarGradient(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const idx = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
  }

  function renderWiWa(container) {
    const allPeople = WIWA_DATA.flatMap(d => d.people.map(p => ({ ...p, dept: d.dept })));
    let selectedPerson = allPeople[0];
    let searchQuery = "";

    function render() {
      const filtered = searchQuery
        ? allPeople.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.role.toLowerCase().includes(searchQuery) ||
            p.dept.toLowerCase().includes(searchQuery) ||
            p.skills.some(s => s.toLowerCase().includes(searchQuery)))
        : allPeople;

      const statusColors = { online: "#34d399", bezet: "#f87171", afwezig: "#6b7280", buiten: "#fbbf24", standby: "#38bdf8" };
      const statusLabels = { online: "Online", bezet: "Bezet", afwezig: "Afwezig", buiten: "Op pad", standby: "Stand-by" };

      const sel = selectedPerson;
      const selColors = sel ? (sel.bot ? ["#6366f1","#a855f7"] : avatarGradient(sel.name)) : ["#333","#555"];
      const selInitials = sel ? (sel.bot ? "\u{1F916}" : sel.name.split(" ").map(w => w[0]).join("").slice(0,2)) : "";

      container.innerHTML = `
        <div style="display:flex;flex:1;overflow:hidden;background:#f5f5f7;font-family:-apple-system,'Inter',sans-serif">
          <div style="width:240px;background:#ffffff;border-right:1px solid #e5e5ea;display:flex;flex-direction:column;flex-shrink:0">
            <div style="padding:10px 12px;border-bottom:1px solid #e5e5ea">
              <input type="text" id="wiwa-search" placeholder="\u{1F50D} Zoeken..." value="${searchQuery}" style="width:100%;padding:8px 12px;background:#f0f0f5;border:none;border-radius:8px;color:#1d1d1f;font-family:inherit;font-size:0.82rem;outline:none">
            </div>
            <div style="flex:1;overflow-y:auto" id="wiwa-list">
              ${WIWA_DATA.map(d => `
                <div style="padding:6px 14px 2px;font-size:0.65rem;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px">${d.dept}</div>
                ${d.people.filter(p => !searchQuery || filtered.includes(allPeople.find(ap => ap.name === p.name && ap.dept === d.dept))).map(p => {
                  const isSelected = sel && sel.name === p.name && sel.dept === d.dept;
                  const colors = p.bot ? ["#6366f1","#a855f7"] : avatarGradient(p.name);
                  const initials = p.bot ? "\u{1F916}" : p.name.split(" ").map(w => w[0]).join("").slice(0,2);
                  const photo = PHOTOS[p.name];
                  return `<div class="wiwa-person-row" data-name="${p.name}" data-dept="${d.dept}" style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-radius:8px;margin:1px 6px;background:${isSelected ? "#007aff" : "transparent"}">
                    <div style="position:relative;flex-shrink:0">
                      ${photo
                        ? `<img src="${photo}" style="width:36px;height:36px;border-radius:50%;object-fit:cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${colors[0]},${colors[1]});display:none;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:white">${initials}</div>`
                        : `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,${colors[0]},${colors[1]});display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:white">${initials}</div>`
                      }
                      <div style="position:absolute;bottom:-1px;right:-1px;width:10px;height:10px;border-radius:50%;background:${statusColors[p.status]};border:2px solid ${isSelected ? "#007aff" : "#fff"}"></div>
                    </div>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:0.82rem;font-weight:500;color:${isSelected ? "white" : "#1d1d1f"};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
                      <div style="font-size:0.7rem;color:${isSelected ? "rgba(255,255,255,0.7)" : "#86868b"}">${p.role}</div>
                    </div>
                    ${p.bot ? `<div style="font-size:0.5rem;background:${isSelected ? "rgba(255,255,255,0.3)" : "#6366f1"};color:white;padding:2px 5px;border-radius:3px;font-weight:700">AI</div>` : ""}
                  </div>`;
                }).join("")}
              `).join("")}
            </div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px;overflow-y:auto" id="wiwa-detail">
            ${sel ? `
              <div style="width:100%;max-width:360px">
                <div style="background:linear-gradient(135deg,${selColors[0]},${selColors[1]});border-radius:20px;padding:30px;text-align:center;margin-bottom:20px;position:relative;overflow:hidden">
                  <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,0.15),transparent 60%)"></div>
                  ${PHOTOS[sel.name]
                    ? `<img src="${PHOTOS[sel.name]}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block;border:3px solid rgba(255,255,255,0.3);box-shadow:0 4px 20px rgba(0,0,0,0.2)" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.2);display:none;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800;color:white;margin:0 auto 12px;border:3px solid rgba(255,255,255,0.3)">${selInitials}</div>`
                    : `<div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:${sel.bot ? "2.5rem" : "1.8rem"};font-weight:800;color:white;margin:0 auto 12px;backdrop-filter:blur(10px);border:3px solid rgba(255,255,255,0.3)">${selInitials}</div>`
                  }
                  <div style="font-size:1.2rem;font-weight:700;color:white;margin-bottom:4px">${sel.name}</div>
                  <div style="font-size:0.82rem;color:rgba(255,255,255,0.8)">${sel.role} \u2022 ${sel.dept}</div>
                  ${sel.model ? `<div style="margin-top:8px;display:inline-block;background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:10px;font-size:0.7rem;color:white;font-weight:600">${sel.model}</div>` : ""}
                  <div style="margin-top:10px;display:flex;align-items:center;justify-content:center;gap:6px">
                    <div style="width:8px;height:8px;border-radius:50%;background:${statusColors[sel.status]}"></div>
                    <span style="font-size:0.75rem;color:rgba(255,255,255,0.8)">${statusLabels[sel.status] || sel.status}</span>
                  </div>
                </div>
                ${sel.desc ? `<div style="background:white;border-radius:12px;padding:14px 16px;margin-bottom:12px;border:1px solid #e5e5ea">
                  <div style="font-size:0.65rem;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Omschrijving</div>
                  <div style="font-size:0.85rem;color:#1d1d1f;line-height:1.5">${sel.desc}</div>
                </div>` : ""}
                <div style="background:white;border-radius:12px;padding:14px 16px;margin-bottom:12px;border:1px solid #e5e5ea">
                  <div style="font-size:0.65rem;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Skills & verantwoordelijkheden</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px">
                    ${sel.skills.map(s => `<span style="font-size:0.75rem;padding:4px 10px;background:#f0f0f5;border-radius:8px;color:#1d1d1f;font-weight:500">${s}</span>`).join("")}
                  </div>
                </div>
              </div>
            ` : '<div style="color:#86868b;font-size:0.9rem">Selecteer een collega</div>'}
          </div>
        </div>
      `;

      // Person click handlers
      container.querySelectorAll(".wiwa-person-row").forEach(row => {
        row.addEventListener("click", () => {
          sfxClick();
          const name = row.dataset.name;
          const dept = row.dataset.dept;
          selectedPerson = allPeople.find(p => p.name === name && p.dept === dept) || null;
          render();
        });
      });

      // Search handler
      const searchEl = container.querySelector("#wiwa-search");
      if (searchEl) {
        searchEl.addEventListener("input", (e) => {
          searchQuery = e.target.value.toLowerCase();
          const cursorPos = e.target.selectionStart;
          render();
          // Restore focus after re-render
          const newSearch = container.querySelector("#wiwa-search");
          if (newSearch) { newSearch.focus(); newSearch.setSelectionRange(cursorPos, cursorPos); }
        });
        // Auto-focus if searching
        if (searchQuery) { searchEl.focus(); searchEl.setSelectionRange(searchQuery.length, searchQuery.length); }
      }
    }
    render();
  }

  // ─── Fake sidebar chat histories ─────────────────────
  const GPT_SIDEBAR_CHATS = {
    "Samenvatting vergadering": [
      { role: "user", text: "Kun je deze vergadernotities samenvatten?" },
      { role: "ai", text: "Hier is een samenvatting van de vergadering:\n\n**Besproken punten:**\n1. Projectvoortgang Q2 - op schema\n2. Nieuw CRM-systeem - besluit uitgesteld\n3. Teamuitje gepland voor 15 mei\n\n**Actiepunten:**\n- Jan: offerte CRM opvragen\n- Lisa: planning teamuitje delen" }
    ],
    "Python script debuggen": [
      { role: "user", text: "Mijn Python script geeft een KeyError op regel 42. Kun je helpen?" },
      { role: "ai", text: "Een KeyError betekent dat je een dictionary-key probeert te gebruiken die niet bestaat. Check of de key 'user_id' daadwerkelijk in je data zit:\n\n```python\nif 'user_id' in data:\n    result = data['user_id']\nelse:\n    result = None\n```\n\nOf gebruik `.get()` met een default waarde:\n```python\nresult = data.get('user_id', None)\n```" }
    ],
    "Marketing plan Q2": [
      { role: "user", text: "Help me een marketingplan schrijven voor Q2. We zijn een kleine webshop in duurzame producten." },
      { role: "ai", text: "**Q2 Marketingplan - Duurzame Webshop**\n\n**Doelen:**\n- 20% meer websiteverkeer\n- 15% stijging conversie\n\n**Kanalen:**\n1. Instagram Reels (2x per week)\n2. Email nieuwsbrief (maandelijks)\n3. Google Shopping Ads\n\n**Thema's:** Aarde Dag (april), Moederdag (mei), Zomercollectie (juni)\n\n**Budget:** Totaal ca. 2.500 per maand" }
    ],
    "Vertaling rapport EN-NL": [
      { role: "user", text: "Vertaal dit: 'The quarterly results exceeded expectations with a 12% increase in revenue.'" },
      { role: "ai", text: "De kwartaalresultaten overtroffen de verwachtingen met een omzetstijging van 12%." }
    ]
  };

  // ─── AI Window HTML builders ────────────────────────
  function buildFullBrowser(tool) {
    const initial = (state.nickname || "G")[0].toUpperCase();
    if (tool === "chatgpt") return `
      <div class="gpt-browser">
        <div class="gpt-sidebar">
          <div class="gpt-sidebar-top">
            <button class="gpt-new-chat">\u270E Nieuwe chat</button>
          </div>
          <div class="gpt-sidebar-label">Vandaag</div>
          <div class="gpt-sidebar-list">
            <div class="gpt-sidebar-item active" data-chat="current">Email schrijven klant</div>
            <div class="gpt-sidebar-item" data-chat="Samenvatting vergadering">Samenvatting vergadering</div>
            <div class="gpt-sidebar-item" data-chat="Python script debuggen">Python script debuggen</div>
          </div>
          <div class="gpt-sidebar-label">Gisteren</div>
          <div class="gpt-sidebar-list">
            <div class="gpt-sidebar-item" data-chat="Marketing plan Q2">Marketing plan Q2</div>
            <div class="gpt-sidebar-item" data-chat="Vertaling rapport EN-NL">Vertaling rapport EN-NL</div>
          </div>
          <div class="gpt-sidebar-bottom">
            <div class="gpt-user-avatar">${initial}</div>
            <div class="gpt-user-name">${state.nickname || "Gebruiker"}</div>
          </div>
        </div>
        <div class="gpt-main">
          <div class="gpt-topbar">
            <div class="gpt-topbar-logo">G</div>
            <div class="gpt-model-select" id="gpt-model-btn">ChatGPT <span style="font-size:0.6rem">\u25BC</span></div>
            <div class="gpt-topbar-model" id="gpt-model-label">4o</div>
            <div class="gpt-topbar-share">\u2197 Delen</div>
          </div>
          <div class="gpt-model-dropdown" id="gpt-model-dropdown" style="display:none">
            <div class="gpt-model-option" data-model="4o"><strong>GPT-4o</strong><span style="color:#888;font-size:0.7rem">Snelst en slimst</span></div>
            <div class="gpt-model-option" data-model="4o-mini"><strong>GPT-4o mini</strong><span style="color:#888;font-size:0.7rem">Snel en goedkoop</span></div>
            <div class="gpt-model-option" data-model="o3"><strong>o3</strong><span style="color:#888;font-size:0.7rem">Redeneren</span></div>
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

      // Wire up sidebar chats
      area.querySelectorAll("[data-chat]").forEach(item => {
        item.addEventListener("click", () => {
          const chatName = item.dataset.chat;
          if (chatName === "current") return;
          const history = GPT_SIDEBAR_CHATS[chatName];
          if (!history) return;
          sfxClick();
          // Mark active
          area.querySelectorAll("[data-chat]").forEach(i => i.classList.remove("active"));
          item.classList.add("active");
          // Show old conversation
          chatEl.innerHTML = "";
          const ui = buildToolWindow(d.tool || "chatgpt");
          history.forEach(msg => addChatMsg(chatEl, ui, msg.role, msg.text, false));
          // Hide options while viewing old chat
          optionsEl.style.display = "none";
          // Add "terug" button
          const backBtn = document.createElement("button");
          backBtn.className = "action-btn secondary";
          backBtn.textContent = "\u2190 Terug naar je opdracht";
          backBtn.style.marginTop = "12px";
          backBtn.addEventListener("click", () => {
            sfxClick();
            area.querySelectorAll("[data-chat]").forEach(i => i.classList.remove("active"));
            area.querySelector('[data-chat="current"]')?.classList.add("active");
            chatEl.innerHTML = "";
            optionsEl.style.display = "";
            backBtn.remove();
          });
          area.appendChild(backBtn);
        });
      });

      // Wire up model selector
      const modelBtn = area.querySelector("#gpt-model-btn");
      const modelDropdown = area.querySelector("#gpt-model-dropdown");
      const modelLabel = area.querySelector("#gpt-model-label");
      if (modelBtn && modelDropdown) {
        modelBtn.addEventListener("click", () => {
          sfxClick();
          modelDropdown.style.display = modelDropdown.style.display === "none" ? "block" : "none";
        });
        modelDropdown.querySelectorAll(".gpt-model-option").forEach(opt => {
          opt.addEventListener("click", () => {
            sfxClick();
            const model = opt.dataset.model;
            modelLabel.textContent = model;
            modelBtn.innerHTML = `ChatGPT <span style="font-size:0.6rem">\u25BC</span>`;
            modelDropdown.style.display = "none";
            // Visual feedback
            modelDropdown.querySelectorAll(".gpt-model-option").forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
          });
        });
        // Close dropdown on outside click
        area.addEventListener("click", (e) => {
          if (!modelBtn.contains(e.target) && !modelDropdown.contains(e.target)) {
            modelDropdown.style.display = "none";
          }
        });
      }

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
        document.getElementById("login-screen").classList.add("hidden");
        app.style.display = "";
        init();
        return;
      }

      // Show login screen first
      bootScreen.classList.add("hidden");
      const loginScreen = document.getElementById("login-screen");
      loginScreen.classList.remove("hidden");

      // Set time and date
      const now = new Date();
      const days = ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"];
      const months = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
      document.getElementById("login-time").textContent = now.getHours().toString().padStart(2,"0") + ":" + now.getMinutes().toString().padStart(2,"0");
      document.getElementById("login-date").textContent = days[now.getDay()] + " " + now.getDate() + " " + months[now.getMonth()];
      document.getElementById("login-avatar").textContent = nickname[0].toUpperCase();
      document.getElementById("login-name-display").textContent = nickname;

      const pwInput = document.getElementById("login-password");
      const loginGo = document.getElementById("login-go");
      pwInput.focus();

      function doLogin() {
        // Try fullscreen
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }

        loginScreen.style.transition = "opacity 0.6s";
        loginScreen.style.opacity = "0";
        setTimeout(() => {
          loginScreen.classList.add("hidden");
          const bootScreen2 = document.getElementById("boot-screen");
          bootScreen2.classList.remove("hidden");
          bootScreen2.style.opacity = "1";
          runBootLines(nickname);
        }, 600);
      }
      loginGo.addEventListener("click", doLogin);
      pwInput.addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });

      return; // Don't run boot lines yet
    });
  }

  function runBootLines(nickname) {
    const bootScreen = document.getElementById("boot-screen");
    const app = document.getElementById("app");

    const lines = [
        "GEMEENTE MAYOSTAD \u2014 AI WERKPLEK v2.0",
        `Gebruiker: ${nickname}`,
        "Afdeling: VTH \u2014 Vergunningen, Toezicht & Handhaving",
        "Verbinding maken met gemeentelijk netwerk...",
        "Vergunningtool laden...",
        "Zaaksysteem synchroniseren...",
        "ChatGPT Team koppelen...",
        "MayoBoard laden...",
        "Beveiligingsprotocol AVG activeren...",
        "WiWa adresboek synchroniseren...",
        "",
        "WAARSCHUWING: AI-output altijd controleren.",
        "Jij bent verantwoordelijk, niet de AI.",
        "",
        `Systeem gereed. Welkom, ${nickname}.`
      ];

    const bootText = document.getElementById("boot-text");
    const progressFill = document.getElementById("boot-progress-fill");
    const bootStatus = document.getElementById("boot-status");
    bootText.innerHTML = "";
    progressFill.style.width = "0%";
    bootStatus.textContent = "INITIALISEREN...";

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
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", runBootSequence)
    : runBootSequence();
})();
