window.placeGuideQuestions = function (root) {
  var items = [
    ["يضعك هذا الواجب في دور مستشار", "أكتب هذا التقرير بصفتي مستشاراً لدى ZeroLock، ومهمتي تقييم منصة PayWave."],
    ["ابدأ النشاط الأول بكتابة مقدمة", "أنا مستشار ZeroLock، وأعد هذا التقرير لـ PayWave لأن الدفع يُطلب من الإنترنت ومن شبكة المكاتب، وهذا سطح الهجوم."],
    ["بعد كتابة المقدمة التمهيدية", "الفدية تقع لأن ملفاً خبيثاً يشفّر قاعدة الدفع، فيتوقف البيع وتخسر الشركة المال."],
    ["الأمثلة والتهديدات الواردة في الجدول أدناه", "صف التصيد: رسالة تشبه الإدارة تطلب بيانات الدخول، فيُستخدم حساب صحيح، والأثر خسارة سمعة."],
    ["صنّف خطرين من بيئة PayWave", "شائع: التصيد، لأنه يتكرر في منصات الدفع. غير شائع: تسريب تصميم طريقة الدفع غير المنشور، لأنه لا يُفترض من اسم شركة دفع وحدها."],
    ["اختم بفقرة: التهديدات تتغير", "تقرير Verizon DBIR يوثّق تكرار التصيد في القطاع، وهذا يدعم ما كتبته عن PayWave ولا يحل محله."],
    ["اكتب فقرة التصنيف", "التصنيف: برمجيات (Software)، لأن الخلل في فحص مدخلات النموذج لا في الكابل ولا في الباب. الناقل: الإنترنت. الموضع: نموذج البطاقة في PayWave، فما يُكتب في الحقل يصل إلى قاعدة البيانات من غير فحص."],
    ["الدفاع متعدد الطبقات لأصول PayWave", "لا يكفي قفل غرفة الخوادم وحده. الدفاع متعدد الطبقات ثلاث طبقات على أصل PayWave نفسه. الطبقة المادية تمنع فتح الباب أو لمس محطة الدفع بغير إذن. طبقة البرمجيات تبقي قاعدة البطاقات مشفّرة وتحدّ صلاحية لوحة الدفع. طبقة العتاد تصفّي الحركة على جدار الحماية قبل أن تبلغ الخادم. إن فُتح الباب تبقى القاعدة مشفّرة، وإن سُرقت كلمة المرور يبقى جدار العتاد حاجزاً أمام الاتصال القادم من خارج المبنى."],
    ["شرح تأمين البنية التحتية لشبكات PayWave", "شبكة مكاتب PayWave سلكية، فلا يدخلها إلا من له حساب. شبكة الضيوف لاسلكية ومشفّرة ولا ترى خادم الدفع. التخزين السحابي لا يُفتح إلا لحساب محدد، وواجهة الدفع لا تقبل طلباً بلا تحقق."],
    ["التقييم النقدي للمخاطر السيبرانية", "أشد تهديد هو الفدية لأن الدفع يتوقف. رفضت الاكتفاء بجدار ناري واحد لأن الحساب الداخلي يمر من خلفه."],
    ["ابدأ هنا صفحة جديدة", "هذا تقرير جديد لإدارة Clearwater. أنا مستشار ZeroLock، والهدف تأمين المبنى ونقاط البيع."],
    ["تقييم الثغرات الميدانية وحساب شدة المخاطر", "باب الخزانة غير المقفل في أوقات الازدحام: الاحتمال محتمل جداً، والأثر كبير، فالشدة متطرفة، والأولوية تتبع هذه الشدة."],
    ["اكتب فقرة الخطة", "الخطة تعالج المتوسطة والمرتفعة والمتطرفة. المنخفضة تُقبل أو تُراقب. اخترت قفل الخزانة ورفضت حارساً دائماً لأن الميزانية لا تحمله."],
    ["التقييم الشامل للسياسات الداخلية", "قفل خزانة الشبكة يقلل العبث، لكنه يبطئ الفني في الذروة. كلفته ضمن ميزانية الصيانة، ولا يوقف طابور الحجوزات لأن القفل على الغرفة لا على نقطة البيع."],
    ["التحليل المنهجي، الأدلة الجنائية الرقمية", "الساعة 02:14 والذاكرة ما زالت في الجهاز: تُلتقط الذاكرة قبل القرص، وتُحسب MD5 وSHA-256 للصورة من غير اختراع القيم."],
    ["علّم المربع بعد تجهيز الملفين", "كل ملف يبدأ بغلاف فيه اسمك ورقم تسجيلك الخاص لدى بيرسون/المركز، ثم الفهرس، ثم المتن، ثم مراجع الصفحة الأخيرة مما رجعت إليه فعلاً."]
  ];

  var nodes = Array.prototype.filter.call(root.querySelectorAll(".lede, .mission p, .report, .cover-break > p, .write-path p, .body > p, .stack p, .brief p, .axis p, .model p, #rules"), function (el) {
    if (el.closest(".think, #gate, #soc, #seal, #lightbox")) return false;
    return !el.classList.contains("file") && !el.classList.contains("footer") && !el.classList.contains("formula");
  });

  var missed = [];
  items.forEach(function (item) {
    var node = null;
    var anchor = item[0].replace(/\s+/g, "");
    for (var i = 0; i < nodes.length; i += 1) {
      if (nodes[i].dataset.qset) continue;
      if (nodes[i].textContent.replace(/\s+/g, "").indexOf(anchor) !== -1) {
        node = nodes[i];
        break;
      }
    }
    if (!node) {
      missed.push(item[0]);
      return;
    }
    node.dataset.qset = "1";
    var box = document.createElement("aside");
    box.className = "think";
    box.setAttribute("role", "note");
    var paragraph = document.createElement("p");
    var label = document.createElement("b");
    label.className = "think-label";
    label.textContent = "مثال:";
    paragraph.appendChild(label);
    paragraph.appendChild(document.createTextNode(" " + item[1]));
    box.appendChild(paragraph);
    var brief = node.closest(".brief");
    var step = node.closest(".write-path li > div, .write-path li > span");
    if (brief) brief.appendChild(box);
    else if (step) step.appendChild(box);
    else if (node.parentElement && (node.parentElement.classList.contains("body") || node.parentElement.classList.contains("cover-break"))) node.insertAdjacentElement("afterend", box);
    else {
      var section = node.closest("section");
      var body = section && section.querySelector(".body, .cover-break");
      var slot = body && (body.querySelector(".write-path li > div, .write-path li > span") || body);
      if (slot) slot.appendChild(box);
      else node.insertAdjacentElement("afterend", box);
    }
  });

  if (missed.length) window.__thinkMissed = missed;
};
