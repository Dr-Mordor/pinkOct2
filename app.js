(function () {
  "use strict";

  var CFG = window.ETMENI_CONFIG || {};
  var CAMPAIGN_URL = CFG.campaignUrl || location.href.split("#")[0];
  var MAP_URL = CFG.safetyMapUrl || "#safety-map";

  /* ---------- Copy ---------- */
  var MESSAGE =
    "في امرأة بتحبيها… اطمنتي عليها؟\n" +
    "الفحص والكشف المبكر ممكن يصنعوا فرقاً كبيراً.\n" +
    "خدي دقيقة واطمني على صحتك.";

  var SOCIAL_POST =
    MESSAGE +
    "\nاسألي مختصة عن المتابعة المناسبة لكِ، وشاركي الرسالة مع امرأة غالية على قلبك.\n" +
    "#بصمة_حياة #اطمنتي_عليها\n" +
    CAMPAIGN_URL;

  var QUESTIONS = [
    {
      title: "لمن تقومين بهذا الاستبيان اليوم؟",
      description: "خطوتكِ الأولى تعكس اهتمامكِ بنفسكِ وبمن تحبين.",
      options: ["أريد الاطمئنان على نفسي", "أريد الاطمئنان على امرأة غالية على قلبي"]
    },
    {
      title: "هل لديكِ خطة للمتابعة مع مختصة؟",
      description: "لا نحتاج معلومات طبية. اختاري ما يصف خطوتكِ القادمة.",
      options: ["لديّ موعد أو خطة للمتابعة", "لم أحدّد خطوة بعد", "لست متأكدة من أين أبدأ"]
    },
    {
      title: "ما الذي يساعدكِ على البدء؟",
      description: "نقرّب لكِ الطريق، خطوة بسيطة في كل مرة.",
      options: ["أريد العثور على مركز فحص", "أريد مشاركة الرسالة مع من أحب", "أريد التعرف على خطوات المتابعة"]
    }
  ];

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(id, size) {
    return '<svg width="' + size + '" height="' + size + '" class="ico" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  /* ---------- Safety Map links ---------- */
  document.querySelectorAll("[data-map-link]").forEach(function (a) { a.href = MAP_URL; });

  /* ---------- Questionnaire ---------- */
  var card = $("#question-card");
  var step = 0;
  var answers = [-1, -1, -1];
  var done = false;

  function progress() {
    var items = QUESTIONS.map(function (_, i) {
      var active = done || i <= step ? "active" : "";
      var cur = !done && i === step ? ' aria-current="step"' : "";
      return '<li class="' + active + '"' + cur + '><span class="sr-only">الخطوة ' + (i + 1) + "</span></li>";
    }).join("");
    var label = done ? "اكتملت الخطوات" : "الخطوة " + (step + 1) + " من 3";
    return '<div class="question-progress"><span>' + label + '</span><ol aria-label="تقدّم الاستبيان">' + items + "</ol></div>";
  }

  function renderQuestion() {
    var q = QUESTIONS[step];
    var opts = q.options.map(function (o, i) {
      var sel = answers[step] === i;
      return '<label class="question-option ' + (sel ? "selected" : "") + '">' +
        '<input type="radio" name="question-' + step + '" value="' + i + '"' + (sel ? " checked" : "") + ">" +
        '<span class="radio-dot">' + (sel ? icon("i-check", 14) : "") + "</span>" +
        "<span>" + esc(o) + "</span></label>";
    }).join("");
    card.innerHTML =
      progress() +
      '<h3 tabindex="-1">' + esc(q.title) + "</h3>" +
      '<p class="muted question-description">' + esc(q.description) + "</p>" +
      '<fieldset><legend class="sr-only">' + esc(q.title) + "</legend>" + opts + "</fieldset>" +
      '<div class="question-actions">' +
        '<button class="button" type="button" data-q="next"' + (answers[step] < 0 ? " disabled" : "") + ">" +
          (step === 2 ? "اعرضي خطوتكِ القادمة" : "الخطوة التالية") + "</button>" +
        (step > 0 ? '<button class="text-link" type="button" data-q="back">السابق</button>' : "") +
      "</div>";
  }

  function renderResult() {
    var line1 = answers[1] === 0
      ? "تابعي خطتكِ مع المختصة، واسأليها عن الفحص المناسب لكِ."
      : "ابدئي بالتواصل مع مركز أو مختصة لتحديد المتابعة والفحص المناسبين لكِ.";
    var line2 = answers[0] === 1
      ? "يمكنكِ أن تكوني سندًا لها وتساعديها في اتخاذ الخطوة."
      : "خذي وقتًا لنفسكِ ولصحتكِ.";
    var share = answers[2] === 1;
    card.innerHTML =
      progress() +
      '<div class="question-result">' +
        '<div class="result-icon">' + icon("i-heart", 24) + "</div>" +
        '<h3 tabindex="-1">خطوتكِ تستحق الاهتمام.</h3>' +
        "<p>" + line1 + " " + line2 + "</p>" +
        '<a class="button" href="' + esc(MAP_URL) + '" target="_blank" rel="noopener noreferrer">' + icon("i-pin", 19) + " من هنا تبدأين: خريطة الأمان</a>" +
        '<a class="text-link" href="' + (share ? "#share" : "#awareness") + '">' +
          (share ? "شاركي رسالة الاطمئنان" : "تعرّفي على خطوات المتابعة") + "</a>" +
        '<button class="text-link restart" type="button" data-q="restart">ابدئي من جديد</button>' +
        '<p class="small muted">هذا الاستبيان للتوعية، ولا يشخّص حالة صحية أو يحدّد مستوى الخطر.</p>' +
      "</div>";
  }

  function render(focus) {
    done ? renderResult() : renderQuestion();
    if (focus) { var h = $("h3", card); if (h) h.focus({ preventScroll: false }); }
  }

  if (card) {
    card.addEventListener("change", function (e) {
      if (e.target.name === "question-" + step) {
        answers[step] = Number(e.target.value);
        renderQuestion();
        var checked = $('input[type=radio]:checked', card);
        if (checked) checked.focus();
      }
    });
    card.addEventListener("click", function (e) {
      var b = e.target.closest("[data-q]");
      if (!b) return;
      var act = b.getAttribute("data-q");
      if (act === "next" && answers[step] >= 0) { step < 2 ? step++ : (done = true); render(true); }
      else if (act === "back" && step > 0) { step--; render(true); }
      else if (act === "restart") { step = 0; answers = [-1, -1, -1]; done = false; render(true); }
    });
    render(false);
  }

  /* ---------- Share card ---------- */
  var msgEl = $("#campaign-message");
  if (msgEl) msgEl.textContent = MESSAGE;
  var shareStatus = $("#share-status");
  var manual = $("#manual-copy");

  function setShare(msg) { if (shareStatus) shareStatus.textContent = msg; }
  function copyWithFallback(text, okMsg) {
    manual.hidden = true;
    copyText(text).then(function () { setShare(okMsg); }, function () {
      manual.value = text; manual.hidden = false; manual.focus(); manual.select();
      setShare("تعذّر النسخ التلقائي. حدّدي النص أدناه وانسخيه من جهازكِ.");
    });
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-action]");
    if (!b) return;
    switch (b.getAttribute("data-action")) {
      case "whatsapp":
        window.open("https://wa.me/?text=" + encodeURIComponent(MESSAGE + "\n" + CAMPAIGN_URL), "_blank", "noopener,noreferrer");
        setShare("اختاري المرأة التي تحبينها وأكملي الإرسال في واتساب.");
        break;
      case "copy-message":
        copyWithFallback(MESSAGE + "\n" + CAMPAIGN_URL, "تم نسخ الرسالة.");
        break;
      case "copy-link":
        copyWithFallback(CAMPAIGN_URL, "تم نسخ رابط الحملة.");
        break;
      case "native-share":
        if (!navigator.share) { copyWithFallback(CAMPAIGN_URL, "تم نسخ رابط الحملة."); break; }
        navigator.share({ title: "في امرأة بتحبيها… اطمنتي عليها؟", text: MESSAGE, url: CAMPAIGN_URL })
          .then(function () { setShare("تمت المشاركة عبر جهازكِ."); })
          .catch(function (err) { if (!err || err.name !== "AbortError") setShare("تعذّرت المشاركة. جرّبي نسخ النص أو الرابط."); });
        break;
    }
  });

  /* ---------- Digital kit ---------- */
  var kitBtn = $("#kit-copy-btn");
  if (kitBtn) {
    $("#kit-copy").textContent = SOCIAL_POST;
    kitBtn.addEventListener("click", function () {
      copyText(SOCIAL_POST).then(
        function () { $("#kit-status").textContent = "تم نسخ المنشور."; },
        function () { $("#kit-status").textContent = "تعذّر النسخ التلقائي. حدّدي النص وانسخيه يدويًا."; }
      );
    });
  }

  /* ---------- Contact form → email (FormSubmit) ---------- */
  var form = $("#contact-form");
  if (form) {
    var status = $("#form-status");
    var submitBtn = $("button[type=submit]", form);
    var fallback = CFG.fallbackEmail || "bha.palestine@gmail.com";

    function setStatus(msg, kind) {
      status.textContent = msg;
      status.className = "form-status" + (kind ? " " + kind : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var name = f.name.value.trim();
      var phone = f.phone.value.trim();
      var email = f.email.value.trim();
      var message = f.message.value.trim();

      if (f.botcheck.checked) return; // bot
      if (!name) { setStatus("يُرجى كتابة الاسم.", "error"); f.name.focus(); return; }
      if (!phone && !email) { setStatus("يُرجى إضافة رقم هاتف أو بريد إلكتروني لنتمكن من الرد عليكِ.", "error"); f.phone.focus(); return; }
      if (email && !f.email.checkValidity()) { setStatus("يُرجى التأكد من صحة البريد الإلكتروني.", "error"); f.email.focus(); return; }
      if (!message) { setStatus("يُرجى كتابة رسالتكِ.", "error"); f.message.focus(); return; }
      if (!f.consent.checked) { setStatus("يُرجى الموافقة على استخدام البيانات للرد على رسالتكِ.", "error"); f.consent.focus(); return; }

      var to = (CFG.contactEmail || fallback).trim();

      var payload = {
        _subject: CFG.emailSubject || "رسالة جديدة من صفحة الحملة",
        _template: "table",
        _captcha: "false",
        _honey: "",
        "الاسم": name,
        "الهاتف": phone || "—",
        "البريد": email || "—",
        "الموضوع": f.topic.value,
        "الرسالة": message
      };
      if (email) payload._replyto = email;

      submitBtn.disabled = true;
      setStatus("جارٍ الإرسال…");

      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(to), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && String(j.success) === "true", j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.j && res.j.message);
          form.reset();
          setStatus("وصلت رسالتكِ. شكرًا لثقتكِ، سنتواصل معكِ قريبًا.", "ok");
        })
        .catch(function () {
          setStatus("تعذّر الإرسال الآن. حاولي مرة أخرى أو راسلينا على " + fallback, "error");
        })
        .then(function () { submitBtn.disabled = false; });
    });
  }
})();
