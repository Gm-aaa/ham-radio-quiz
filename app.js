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
  let currentMapping = [];
  let dataLoaded = false;

  const sectionTitles = {
    "1.1.1": "无线电管理法规概述",
    "1.1.2": "频率划分与无线电业务",
    "1.2.1": "设台申请材料",
    "1.2.2": "执照有效期与变更",
    "1.2.3": "国家级许可范围",
    "1.2.4": "业余中继台与信标台",
    "1.3.1": "验证组织机构",
    "1.3.2": "操作能力类别与验证",
    "1.4.1": "呼号的使用与核发",
    "1.4.2": "国内呼号分区号",
    "1.4.3": "国际呼号前缀",
    "1.5.1": "设台使用法定程序",
    "1.5.2": "禁止行为与法律责任",
    "1.5.3": "应急通信与非业余通信",
    "1.6.1": "监督检查",
    "1.6.2": "违法行为处罚",
    "1.6.3": "网络安全与国家安全法",
    "1.7.1": "业余频率使用规则",
    "1.7.2": "频率范围计算",
    "2.1.1": "ITU无线电区域划分",
    "2.1.2": "业余频段划分",
    "2.1.3": "CQ分区",
    "2.1.4": "ITU分区",
    "2.1.5": "ITU语音字母拼读",
    "2.1.6": "另类字母解释法",
    "2.2.1": "CQ呼叫",
    "2.2.2": "加入与插入联络",
    "2.2.3": "电台日志",
    "2.2.4": "中继台通联",
    "2.2.5": "业余卫星轨道",
    "2.3.1": "话音呼叫程序",
    "2.3.2": "CW操作程序",
    "2.4.1": "QRP与功率Q简语",
    "2.4.2": "常用Q简语与缩语",
    "2.5.1": "发射类别符号",
    "2.5.2": "调幅AM与边带",
    "2.6.1": "发射类别符号(续)",
    "2.6.2": "RTTY与频移电报",
    "2.6.3": "数字语音系统",
    "2.6.4": "数字业余电视DATV",
    "2.6.5": "平均功率计算",
    "2.7.1": "DX操作",
    "2.7.2": "大圆距离与天线指向",
    "2.7.3": "竞赛操作",
    "2.7.4": "梅登海德网格定位",
    "2.7.5": "时区",
    "2.7.6": "竞赛日志",
    "3.1.1": "收发信机构成",
    "3.1.2": "中继台双工器",
    "3.1.3": "接收机附件与功能",
    "3.2.1": "收发信机面板控制",
    "3.2.2": "SDR接收机",
    "3.2.3": "线性功放连接",
    "3.3.1": "天线的作用",
    "3.3.2": "驻波比SWR",
    "3.3.3": "同轴电缆特性",
    "3.3.4": "天线类型与极化",
    "3.3.5": "多径衰落",
    "3.3.6": "视距传播",
    "3.4.1": "偶极天线设计",
    "3.4.2": "八木天线",
    "3.4.3": "行波天线",
    "3.4.4": "NVIS近垂直入射通信",
    "3.4.5": "天线调谐器",
    "3.4.6": "等效辐射功率EIRP",
    "3.5.1": "传输线类型",
    "3.5.2": "电磁波的产生",
    "3.5.3": "波阻抗与场强",
    "3.5.4": "无线电波传播方式",
    "3.5.5": "电离层传播预测",
    "3.5.6": "微波频段传播",
    "3.6.1": "发信机组成与自制设备",
    "3.6.2": "必要带宽",
    "3.6.3": "接收机性能指标",
    "3.6.4": "SDR技术",
    "3.7.1": "无线电测向ARDF",
    "3.7.2": "测向天线",
    "3.7.3": "数字模式信号识别",
    "3.8.1": "业余卫星",
    "4.1.1": "导体",
    "4.1.2": "静电",
    "4.1.3": "电动势与电压单位",
    "4.1.4": "电源",
    "4.1.5": "万用表测量",
    "4.2.1": "欧姆定律与功率",
    "4.2.2": "交流电有效值",
    "4.2.3": "电容与电感",
    "4.2.4": "相位差",
    "4.2.5": "LC谐振",
    "4.3.1": "电路元件符号",
    "4.3.2": "电阻",
    "4.3.3": "趋肤效应",
    "4.3.4": "有源器件",
    "4.4.1": "基本电路识图",
    "4.4.2": "场效应晶体管",
    "4.4.3": "非线性失真与谐波",
    "4.4.4": "相位失真",
    "4.4.5": "整流电路",
    "4.4.6": "噪声",
    "4.5.1": "逻辑门电路",
    "4.5.2": "模数转换ADC",
    "4.5.3": "I/Q信号",
    "4.5.4": "SDR算法",
    "4.6.1": "万用表测波形",
    "4.6.2": "示波器与图表",
    "4.6.3": "场强表",
    "4.6.4": "分贝dB计算",
    "5.1.1": "设备技术标准",
    "5.1.2": "电磁辐射曝露限值",
    "5.1.3": "防雷与接地",
    "5.1.4": "电气安全电压",
    "5.1.5": "蓄电池安全",
  };

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
    sel.textContent = "";
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "全部章节";
    sel.appendChild(allOpt);
    sections.forEach((s) => {
      const count = catQuestions.filter((q) => q.section === s).length;
      const opt = document.createElement("option");
      opt.value = s;
      const title = sectionTitles[s] || "";
      opt.textContent = `${s} ${title} (${count}题)`.trim();
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
        showCardMessage("本组题目已全部完成");
      }
      return;
    }

    const q = currentSet[currentIndex];
    answered = false;
    selectedOptions = new Set();

    const isMulti = q.type !== "MC1";

    // Shuffle option CONTENT but keep display letters A,B,C,D fixed top-to-bottom.
    // currentMapping[i] = { display, orig, content }
    const origLetters = Object.keys(q.options);
    const displayLetters = ["A", "B", "C", "D"].slice(0, origLetters.length);
    const shuffledOrig = shuffle(origLetters);
    currentMapping = shuffledOrig.map((orig, i) => ({
      display: displayLetters[i],
      orig: orig,
      content: q.options[orig],
    }));

    $("#q-meta").textContent = `#${q.id} | 旧题号:${q.oldId} | 章节:${q.section} | ${isMulti ? "多选" : "单选"} | 分类:${q.categories.join("/")}`;
    $("#q-text").textContent = q.question;

    const optionsDiv = $("#q-options");
    optionsDiv.textContent = "";

    currentMapping.forEach((m) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.dataset.display = m.display;
      const letterSpan = document.createElement("span");
      letterSpan.className = "option-letter";
      letterSpan.textContent = m.display;
      const textSpan = document.createElement("span");
      textSpan.className = "option-text";
      textSpan.textContent = m.content;
      btn.appendChild(letterSpan);
      btn.appendChild(textSpan);
      btn.addEventListener("click", () => onOptionClick(btn, m.display, isMulti));
      optionsDiv.appendChild(btn);
    });

    $("#btn-confirm").classList.toggle("hidden", !isMulti);
    $("#btn-next").classList.add("hidden");
    $("#btn-prev").disabled = currentIndex === 0;
    $("#q-answer-text").classList.add("hidden");
    $("#q-explanation").classList.add("hidden");
    $("#q-actions").classList.remove("hidden");

    updateProgress();
  }

  function onOptionClick(btn, displayLetter, isMulti) {
    if (answered) return;

    if (isMulti) {
      if (selectedOptions.has(displayLetter)) {
        selectedOptions.delete(displayLetter);
        btn.classList.remove("selected");
      } else {
        selectedOptions.add(displayLetter);
        btn.classList.add("selected");
      }
    } else {
      selectedOptions = new Set([displayLetter]);
      $$(".option-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      judgeAnswer();
    }
  }

  function judgeAnswer() {
    if (answered) return;
    answered = true;

    const q = currentSet[currentIndex];
    // Correct display letters = positions whose original letter is in q.answer
    const correctDisplays = new Set(
      currentMapping.filter((m) => q.answer.includes(m.orig)).map((m) => m.display)
    );
    const isCorrect = selectedOptions.size === correctDisplays.size &&
      [...selectedOptions].every((l) => correctDisplays.has(l));

    $$(".option-btn").forEach((btn) => {
      btn.classList.add("disabled");
      const d = btn.dataset.display;
      if (correctDisplays.has(d)) {
        btn.classList.add("correct");
      } else if (selectedOptions.has(d)) {
        btn.classList.add("wrong");
      }
    });

    totalAnswered++;
    if (isCorrect) correctCount++;
    saveWrongId(q.id, !isCorrect);

    // Show correct answer as text
    const answerText = $("#q-answer-text");
    answerText.textContent = (isCorrect ? "回答正确！" : "回答错误。") +
      " 正确答案：" + [...correctDisplays].sort().join("、");
    answerText.className = isCorrect ? "correct-text" : "wrong-text";
    answerText.classList.remove("hidden");

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
    if (!dataLoaded) {
      showCardMessage("题库加载中，请稍候…");
      return;
    }
    currentSet = filterQuestions();
    currentIndex = 0;
    correctCount = 0;
    totalAnswered = 0;
    $("#question-card").classList.remove("hidden");
    $("#exam-result").classList.add("hidden");
    updateStats();

    if (currentSet.length === 0) {
      const msg = mode === "wrong"
        ? "错题本为空。答错的题目会自动收录到这里。"
        : "没有符合条件的题目";
      showCardMessage(msg);
      updateProgress();
      return;
    }
    renderQuestion();
  }

  function showCardMessage(text) {
    const card = $("#question-card");
    card.textContent = "";
    const p = document.createElement("p");
    p.className = "empty-msg";
    p.textContent = text;
    card.appendChild(p);
  }

  // Theme
  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    $("#btn-theme").textContent = dark ? "☀️" : "🌙";
    localStorage.setItem("ham_theme", dark ? "dark" : "light");
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
      $("#section-select").value = "all";
      startQuiz();
    });
  });

  $("#section-select").addEventListener("change", (e) => {
    section = e.target.value || "all";
    startQuiz();
  });

  $("#btn-confirm").addEventListener("click", () => {
    if (selectedOptions.size > 0) judgeAnswer();
  });

  $("#btn-prev").addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });

  $("#btn-next").addEventListener("click", () => {
    currentIndex++;
    renderQuestion();
  });

  $("#btn-restart").addEventListener("click", () => {
    startQuiz();
  });

  $("#btn-theme").addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    applyTheme(!isDark);
  });

  $("#btn-about").addEventListener("click", () => {
    $("#about-modal").classList.remove("hidden");
  });

  $("#btn-close-about").addEventListener("click", () => {
    $("#about-modal").classList.add("hidden");
  });

  $("#about-modal").addEventListener("click", (e) => {
    if (e.target.id === "about-modal") {
      $("#about-modal").classList.add("hidden");
    }
  });

  // Init theme
  applyTheme(localStorage.getItem("ham_theme") === "dark");

  // Init
  fetch("data/questions.json")
    .then((r) => r.json())
    .then((data) => {
      allQuestions = data;
      dataLoaded = true;
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
