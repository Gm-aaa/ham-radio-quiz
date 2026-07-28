(function () {
  "use strict";

  let allQuestions = [];
  let currentSet = [];
  let currentIndex = 0;
  let mode = "practice";
  let category = "A";
  let section = "all";
  let answered = false;
  let selectedOptions = new Set();
  let correctCount = 0;
  let totalAnswered = 0;

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function getWrongIds() {
    try {
      return JSON.parse(localStorage.getItem("ham_wrong") || "[]");
    } catch { return []; }
  }

  function saveWrongId(id, isWrong) {
    let wrongs = getWrongIds();
    if (isWrong) {
      if (!wrongs.includes(id)) wrongs.push(id);
    } else {
      wrongs = wrongs.filter((w) => w !== id);
    }
    localStorage.setItem("ham_wrong", JSON.stringify(wrongs));
  }

  function filterQuestions() {
    let set = allQuestions.filter((q) => q.categories.includes(category));
    if (section !== "all") {
      set = set.filter((q) => q.section === section);
    }
    if (mode === "wrong") {
      const wrongIds = getWrongIds();
      set = set.filter((q) => wrongIds.includes(q.id));
    }
    if (mode === "exam") {
      set = shuffle(set).slice(0, 50);
    }
    return set;
  }

  function updateSectionSelect() {
    const sel = $("#section-select");
    const catQuestions = allQuestions.filter((q) => q.categories.includes(category));
    const sections = [...new Set(catQuestions.map((q) => q.section))].sort();
    sel.innerHTML = '<option value="all">全部章节</option>';
    sections.forEach((s) => {
      const count = catQuestions.filter((q) => q.section === s).length;
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = `${s} (${count}题)`;
      sel.appendChild(opt);
    });
  }

  function updateProgress() {
    const total = currentSet.length;
    const pct = total > 0 ? (currentIndex / total) * 100 : 0;
    $("#progress-fill").style.width = pct + "%";
    $("#progress-text").textContent = `${currentIndex}/${total}`;
  }

  function renderQuestion() {
    if (currentIndex >= currentSet.length) {
      if (mode === "exam") {
        showExamResult();
      } else {
        $("#question-card").innerHTML = '<p style="text-align:center;padding:40px;color:var(--muted)">本组题目已全部完成</p>';
      }
      return;
    }

    const q = currentSet[currentIndex];
    answered = false;
    selectedOptions = new Set();

    const isMulti = q.type !== "MC1";
    const optionEntries = shuffle(Object.entries(q.options));

    $("#q-meta").textContent = `#${q.id} | 旧题号:${q.oldId} | 章节:${q.section} | ${isMulti ? "多选" : "单选"} | 分类:${q.categories.join("/")}`;
    $("#q-text").textContent = q.question;

    const optionsDiv = $("#q-options");
    optionsDiv.innerHTML = "";

    optionEntries.forEach(([letter, text]) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.dataset.letter = letter;
      const letterSpan = document.createElement("span");
      letterSpan.className = "option-letter";
      letterSpan.textContent = letter;
      const textSpan = document.createElement("span");
      textSpan.className = "option-text";
      textSpan.textContent = text;
      btn.appendChild(letterSpan);
      btn.appendChild(textSpan);
      btn.addEventListener("click", () => onOptionClick(btn, letter, isMulti));
      optionsDiv.appendChild(btn);
    });

    $("#btn-confirm").classList.toggle("hidden", !isMulti);
    $("#btn-next").classList.add("hidden");
    $("#q-explanation").classList.add("hidden");
    $("#q-actions").classList.remove("hidden");

    updateProgress();
  }

  function onOptionClick(btn, letter, isMulti) {
    if (answered) return;

    if (isMulti) {
      if (selectedOptions.has(letter)) {
        selectedOptions.delete(letter);
        btn.classList.remove("selected");
      } else {
        selectedOptions.add(letter);
        btn.classList.add("selected");
      }
    } else {
      selectedOptions = new Set([letter]);
      $$(".option-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      judgeAnswer();
    }
  }

  function judgeAnswer() {
    if (answered) return;
    answered = true;

    const q = currentSet[currentIndex];
    const correctSet = new Set(q.answer.split(""));
    const isCorrect = selectedOptions.size === correctSet.size &&
      [...selectedOptions].every((l) => correctSet.has(l));

    $$(".option-btn").forEach((btn) => {
      btn.classList.add("disabled");
      const letter = btn.dataset.letter;
      if (correctSet.has(letter)) {
        btn.classList.add("correct");
      } else if (selectedOptions.has(letter)) {
        btn.classList.add("wrong");
      }
    });

    totalAnswered++;
    if (isCorrect) correctCount++;
    saveWrongId(q.id, !isCorrect);

    $("#btn-confirm").classList.add("hidden");
    $("#btn-next").classList.remove("hidden");

    if (q.explanation) {
      const expDiv = $("#q-explanation");
      expDiv.textContent = "";
      const title = document.createElement("div");
      title.className = "exp-title";
      title.textContent = "解析";
      const body = document.createElement("div");
      body.textContent = q.explanation;
      expDiv.appendChild(title);
      expDiv.appendChild(body);
      expDiv.classList.remove("hidden");
    }

    updateStats();
    updateProgress();
  }

  function updateStats() {
    const rate = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    $("#stats-text").textContent = `本次正确率: ${correctCount}/${totalAnswered} (${rate}%)`;
  }

  function showExamResult() {
    $("#question-card").classList.add("hidden");
    const resultDiv = $("#exam-result");
    resultDiv.classList.remove("hidden");
    $("#result-score").textContent = `${correctCount} / ${currentSet.length}`;
    const pass = correctCount >= 38;
    const passEl = $("#result-pass");
    passEl.textContent = pass ? "通过 (>=38题)" : "未通过 (需>=38题)";
    passEl.className = pass ? "pass" : "fail";
  }

  function startQuiz() {
    currentSet = filterQuestions();
    currentIndex = 0;
    correctCount = 0;
    totalAnswered = 0;
    $("#question-card").classList.remove("hidden");
    $("#exam-result").classList.add("hidden");
    updateStats();

    if (currentSet.length === 0) {
      $("#question-card").innerHTML = '<p style="text-align:center;padding:40px;color:var(--muted)">没有符合条件的题目</p>';
      updateProgress();
      return;
    }
    renderQuestion();
  }

  // Event listeners
  $$(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".mode-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mode = btn.dataset.mode;
      $("#section-filter").classList.toggle("hidden", mode === "exam");
      startQuiz();
    });
  });

  $$(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".cat-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      category = btn.dataset.cat;
      section = "all";
      updateSectionSelect();
      startQuiz();
    });
  });

  $("#section-select").addEventListener("change", (e) => {
    section = e.target.value;
    startQuiz();
  });

  $("#btn-confirm").addEventListener("click", () => {
    if (selectedOptions.size > 0) judgeAnswer();
  });

  $("#btn-next").addEventListener("click", () => {
    currentIndex++;
    renderQuestion();
  });

  $("#btn-restart").addEventListener("click", () => {
    startQuiz();
  });

  // Init
  fetch("data/questions.json")
    .then((r) => r.json())
    .then((data) => {
      allQuestions = data;
      updateSectionSelect();
      startQuiz();
    })
    .catch((err) => {
      const card = $("#question-card");
      card.textContent = "";
      const p = document.createElement("p");
      p.style.color = "var(--wrong)";
      p.textContent = `加载题库失败: ${err.message}`;
      card.appendChild(p);
    });
})();
