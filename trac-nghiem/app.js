// Ngân hàng 120 câu hỏi trắc nghiệm An toàn Vệ sinh viên 2026
const bankData = [
["Yêu cầu nào đối với các thiết bị có yêu cầu nghiêm ngặt về an toàn lao động như bình chịu áp lực, thiết bị nâng... trước khi đưa vào sử dụng?","Công nhân vận hành thiết bị phải có chứng chỉ về chuyên môn, nắm được nguyên tắc an toàn khi sử dụng và có thẻ an toàn lao động.","Ban hành và niêm yết nội quy an toàn, quy trình vận hành, quy trình xử lý sự cố tại nơi để thiết bị ở vị trí dễ thấy, dễ đọc.","Phải được kiểm định kỹ thuật an toàn với cơ quan có thẩm quyền theo quy định.","Cả a, b và c đều đúng.",3],
["Điều kiện cần thiết cho sự cháy xảy ra khi có đủ các yếu tố?","Chất cháy, O-xy trong không khí","Nguồn nhiệt.","Chất cháy và nguồn nhiệt.","Cả a và b đều đúng.",3],
["Khi chữa cháy đám cháy xăng dầu ta không được sử dụng loại gì?","Cát","Bình bọt AB","Bình bọt MFZ","Cả 3 câu trả lời trên đều sai",3],
["An toàn lao động là gì?","An toàn lao động là giải pháp phòng, chống tác động của các yếu tố nguy hiểm nhằm bảo đảm không xảy ra thương tật, tử vong đối với con người trong quá trình lao động.","An toàn lao động là không xảy ra tai nạn lao động và bệnh nghề nghiệp.","An toàn lao động là giải pháp phòng, chống tác động của yếu tố có hại gây bệnh tật, làm suy giảm sức khỏe cho con người trong quá trình lao động.","Cả a,b,c đều sai.",0],
["Chính phủ quy định thời gian tự kiểm tra định kỳ về ATVSLĐ đối với những đơn vị hoạt động trong lĩnh vực có nguy cơ cao về tai nạn lao động, bệnh nghề nghiệp như thế nào?","Ít nhất 01 lần trong 03 tháng ở cấp cơ sở sản xuất, kinh doanh và 01 lần trong 01 tháng ở cấp phân xưởng, tổ, đội sản xuất hoặc tương đương.","Ít nhất 01 lần trong 1 năm ở cấp cơ sở sản xuất, kinh doanh và 01 lần trong 06 tháng ở cấp phân xưởng, tổ, đội sản xuất hoặc tương đương.","Ít nhất 01 lần trong 06 tháng ở cấp cơ sở sản xuất, kinh doanh và 01 lần trong 03 tháng ở cấp phân xưởng, tổ, đội sản xuất hoặc tương đương.","Doanh nghiệp tự quyết định số lần kiểm tra hoặc có kiểm tra hay không.",1],
["Vệ sinh lao động là gì?","Vệ sinh lao động là giải pháp phòng, chống tác động của các yếu tố nguy hiểm nhằm bảo đảm không xảy ra thương tật, tử vong đối với con người trong quá trình lao động.","Vệ sinh lao động là giải pháp an toàn nhất trong quá trình lao động.","Vệ sinh lao động là giải pháp phòng, chống tác động của yếu tố có hại gây bệnh tật, làm suy giảm sức khỏe cho con người trong quá trình lao động.","Cả a,b,c đều sai.",2],
["Biện pháp che chắn vùng nguy hiểm nhằm mục đích chính là?","Ngăn ngừa sự cố của thiết bị","Không cho yếu tố nguy hiểm tác động lên người lao động","Báo trước cho người lao động sự cố có thể xảy ra","Cả a và c",1],
["Chính phủ quy định nội dung tự kiểm tra định kỳ về ATVSLĐ ở cơ sở lao động như thế nào?","Kiểm tra chặt chẽ toàn bộ hệ thống phòng cháy.","Kiểm tra tất cả máy, thiết bị, môi trường làm việc, việc sử dụng, bảo quản trang bị phương tiện bảo vệ cá nhân.","Kiểm tra các yếu tố môi trường làm việc, tác phong làm việc, ý thức chấp hành kỷ luật của người lao động, tình trạng an toàn của máy thiết bị, hệ thống phòng cháy chữa cháy, ...","Kiểm tra hệ thống điện, môi trường xung quanh khu vực làm việc.",2],
["Theo quy định về cơ cấu tổ chức, An toàn vệ sinh viên phải là?","Người có kiến thức đầy đủ về an toàn vệ sinh lao động, được chủ doanh nghiệp tin nhiệm.","Người có thâm niên công tác từ 10 năm trở lên và phải có kiến thức, kinh nghiệm, nhiệt tình với công việc","Phải là người có trình độ chuyên môn cao, nhiệt tình, gương mẫu và có kiến thức đầy đủ về an toàn vệ sinh lao động.","Là người lao động động trực tiếp sản xuất, am hiểu chuyên môn, kỹ thuật an toàn vệ sinh lao động, tự nguyện và gương mẫu.",3],
["Yếu tố nguy hiểm là gì?","Yếu tố nguy hiểm là yếu tố gây mất an toàn, làm tổn thương hoặc gây tử vong cho con người trong quá trình lao động.","Yếu tố nguy hiểm là yếu tố có thể gây ra tai nạn lao động và bệnh nghề nghiệp","Yếu tố nguy hiểm là yếu tố gây ra cháy, nổ, mất an toàn lao động","Yếu tố nguy hiểm là yếu tố có hại.",0],
["Yếu tố có hại là gì?","Yếu tố có hại là yếu tố gây mất an toàn, làm tổn thương hoặc gây tử vong cho con người trong quá trình lao động","Yếu tố có hại là yếu tố gây bệnh tật, làm suy giảm sức khỏe con người trong quá trình lao động.","Yếu tố có hại là yếu tố tác động làm người lao động bị bệnh nghề nghiệp sau quá trình lao động.","Cả a, b, c đều đúng",1],
["Theo quy định của Luật An toàn vệ sinh lao động, người sử dụng lao động có quyền như thế nào đối với công tác ATVSLĐ ?","Yêu cầu người lao động phải chấp hành các nội quy, quy trình, biện pháp bảo đảm an toàn, vệ sinh lao động tại nơi làm việc; Khen thưởng người lao động chấp hành tốt và kỷ luật người lao động vi phạm trong việc thực hiện an toàn, vệ sinh lao động;","Khiếu nại, tố cáo hoặc khởi kiện theo quy định của pháp luật;","Huy động người lao động tham gia ứng cứu khẩn cấp, khắc phục sự cố, tai nạn lao động.","Cả a, b, c, đều đúng.",3],
["Bình bọt AB không được dùng để chữa đám cháy loại gì?","Cháy xăng dầu","Cháy cồn, rượu","Cháy cao su","Cả 3 câu trả lời trên đều sai",2],
["Tác hại của tiếng ồn đối với người lao động trong sản xuất là?","Làm giảm sự tập trung, chú ý khi làm việc; làm cho cơ thể nhanh mệt mỏi, giảm năng suất lao động, dễ gây tai nạn lao động, ...","Tăng nguy cơ mắc các bệnh mãn tính như về xương khớp, hô hấp và tiêu hoá.","Gây nhiễm độc, làm giảm khả năng miễn dịch, gây ung thư và một số bệnh mãn tính khác.","Tất cả các tác hại trên.",0],
["Người lao động phải được trang bị phương tiện bảo vệ cá nhân khi nào?","Tiếp xúc với yếu tố vật lý xấu: Nhiệt độ, áp suất, tiếng ồn, ánh sáng, bức xạ, phóng xạ,... không đảm bảo tiêu chuẩn vệ sinh cho phép; tiếp xúc với hơi khí độc, bụi độc, các sản phẩm có chì, thủy ngân, mang gan, bazơ, axit, xăng, dầu mỡ hoặc hóa chất …;","Tiếp xúc với yếu tố sinh học độc hại, môi trường lao động xấu: Virut, vi khuẩn độc hại, côn trùng có hại; phân, nước, rác, các yếu tố sinh học độc hại khác.","Làm việc với máy thiết bị, công cụ lao động, làm việc ở vị trí mà tư thế lao động nguy hiểm; làm việc trên cao; làm việc trong hầm lò, nơi thiếu dưỡng khí; làm việc trên sông nước, …","Cả a, b và c",3],
["Người sử dụng lao động khi thực hiện trang cấp phương tiện bảo vệ cá nhân phải bảo đảm nguyên tắc nào sau đây?","Đúng đối tượng, đúng chủng loại","Tiết kiệm tối đa chi phí cho doanh nghiệp","Đủ số lượng và Bảo đảm chất lượng","Câu a và c đều đúng.",3],
["Việc bồi dưỡng bằng hiện vật phải theo nguyên tắc nào sau đây?","Trong ca làm việc, bảo đảm thuận tiện, an toàn, vệ sinh thực phẩm.","Giúp tăng cường sức đề kháng và thải độc của cơ thể.","Tùy điều kiện của từng doanh nghiệp","Câu a, b đều đúng",3],
["Đoàn điều tra tai nạn lao động cấp cơ sở phải đảm bảo thành phần nào sau đây?","Người sử dụng lao động và Ban chấp hành công đoàn cơ sở","Người sử dụng lao động, Người làm công tác an toàn lao động, và người làm công tác y tế","Ban chấp hành công đoàn cơ sở, Người làm công tác an toàn lao động, và người làm công tác y tế","Người sử dụng lao động, đại diện Ban chấp hành công đoàn cơ sở, Người làm công tác an toàn lao động và người làm công tác y tế.",3],
["Trong các nguyên tắc bảo đảm An toàn, vệ sinh lao động có nguyên tắc?","Bảo đảm quyền của NLĐ được làm việc trong điều kiện an toàn, vệ sinh lao động","Tuân thủ đầy đủ các biện pháp an toàn, an toàn, vệ sinh lao động trong quá trình lao động","Câu a, b đều đúng","Câu a, b đều sai",2],
["Trong công tác an toàn vệ sinh lao động, tổ chức công đoàn có quyền và trách nhiệm như thế nào?","Phối hợp với cơ quan quản lý nhà nước tổ chức phong trào quần chúng làm công tác an toàn, vệ sinh lao động.","Tổ chức và hướng dẫn hoạt động của mạng lưới an toàn, vệ sinh viên.","Câu a và b đều đúng.","Xây dựng và ban hành nội quy, quy trình làm việc an toàn cho người lao động.",2],
["An toàn, vệ sinh viên hoạt động dưới sự quản lý và hướng dẫn của ai?","Người sử dụng lao động","Ban chấp hành công đoàn cơ sở","Cán bộ ATVSLĐ tại đơn vị","Cả a,b,c đều sai.",1],
["Theo quy định, việc quan trắc môi trường lao động để đánh giá yếu tố có hại đối với sức khỏe người lao động phải được thực hiện như thế nào?","Khi có yêu cầu của cơ quan chức năng.","Khi Công đoàn cơ sở có kiến nghị.","Ít nhất một lần trong một năm.","Cả a, b, c đều đúng.",2],
["Để phòng chống tiếng ồn tại nơi làm việc ta phải?","Thay đổi thiết bị công nghệ và sử dụng các biện pháp kỹ thuật giảm ồn","Dùng phương tiện bảo vệ cá nhân chống ồn","Dùng biện pháp hành chính và y tế","Cả ba biện pháp trên",3],
["Quyết định thành lập và Quy chế hoạt động của mạng lưới An toàn, vệ sinh lao động do ai ban hành?","Ban chấp hành công đoàn cơ sở:","Ban chấp hành công đoàn cơ sở thống nhất với NSDLĐ;","Người sử dụng lao động thống nhất ý kiến với Ban chấp hành CĐCS","Người sử dụng lao động thống nhất ý kiến với Ban chấp hành CĐCS nếu cơ sở SXKD đã thành lập Ban chấp hành CĐCS",3],
["Khi cấp cứu người bị say nắng, say nóng; biện pháp đầu tiên cần phải thực hiện là?","Chườm băng nước mát để nhiệt độ giảm từ từ","Đưa nạn nhân vào chỗ râm mát hoặc ra khỏi môi trường nóng.","Nới lỏng quần áo hoặc cởi hết quần áo ngoài.","Quạt cho thoáng mát",1]
];

// Load full json dataset if available
let bank = bankData.map((q, i) => ({
  id: i + 1,
  text: q[0],
  options: q.slice(1, 5),
  answer: q[5]
}));

fetch('./trac-nghiem/ngan_hang_120_cau_trac_nghiem.json')
  .then(res => res.json())
  .then(data => {
    if (data && data.length >= 100) {
      bank = data.map((q, i) => ({
        id: i + 1,
        text: q.question,
        options: q.options.map(o => o.text),
        answer: q.answer
      }));
    }
  })
  .catch(() => {});

let current = [];
const letters = ['A', 'B', 'C', 'D'];

function seeded(n) {
  let x = n >>> 0;
  return () => ((x = (x * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function shuffle(a, r = Math.random) {
  const res = [...a];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

function makeExam(seed, label, count = 25, section = null) {
  const r = seed === null ? Math.random : seeded(seed);
  const code = seed === null ? null : Math.round(seed / 2026);
  
  let sourcePool = bank;
  if (section === 1) sourcePool = bank.slice(0, 30);
  else if (section === 2) sourcePool = bank.slice(30, 70);
  else if (section === 3) sourcePool = bank.slice(70);

  let pool;
  if (section === null && code && code >= 1 && code <= 4) {
    pool = bank.slice((code - 1) * 25, code * 25);
  } else if (section === null && code === 5) {
    const remaining = bank.slice(100);
    const extraNeeded = 25 - remaining.length;
    const extra = extraNeeded > 0 ? shuffle(bank.slice(0, 100), r).slice(0, extraNeeded) : [];
    pool = [...remaining, ...extra];
  } else {
    pool = shuffle(sourcePool, r).slice(0, Math.min(count, sourcePool.length));
  }

  // Trộn câu hỏi, GIỮ NGUYÊN thứ tự phương án A, B, C, D của từng câu
  current = shuffle(pool, r).map(q => {
    return {
      ...q,
      opts: q.options.map((text, index) => ({ text, index })),
      correct: q.answer
    };
  });

  const startEl = document.querySelector('#start');
  const resultEl = document.querySelector('#result');
  const quizEl = document.querySelector('#quiz');

  if (startEl) startEl.hidden = true;
  if (resultEl) resultEl.hidden = true;
  if (quizEl) quizEl.hidden = false;
  
  document.querySelector('#label').textContent = label;
  render();

  // Scroll smooth to top of quiz / Question 1
  setTimeout(() => {
    if (quizEl && quizEl.scrollIntoView) {
      quizEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 40);
}

function render() {
  const root = document.querySelector('#questions');
  root.innerHTML = current.map((q, i) => `
    <article class="question-card">
      <h3>Câu ${i + 1}. ${q.text}</h3>
      <div class="options-group">
        ${q.opts.map((o, j) => `
          <label class="option-item">
            <input type="radio" name="q${i}" value="${j}">
            <span class="option-label-text"><b>${letters[j]}.</b> ${o.text}</span>
          </label>
        `).join('')}
      </div>
    </article>
  `).join('');

  const total = current.length;
  updateProgress(0, total);

  root.onchange = (e) => {
    const target = e.target;
    if (target && target.type === 'radio') {
      const parentCard = target.closest('.question-card');
      if (parentCard) {
        parentCard.querySelectorAll('.option-item').forEach(opt => opt.classList.remove('selected'));
        target.closest('.option-item').classList.add('selected');
      }
    }

    const checkedCount = new Set([...root.querySelectorAll(':checked')].map(x => x.name)).size;
    updateProgress(checkedCount, total);
  };
}

function updateProgress(count, total) {
  const textEl = document.querySelector('#progress');
  const fillEl = document.querySelector('#progress-fill');
  if (textEl) textEl.textContent = `${count} / ${total} đã chọn`;
  if (fillEl && fillEl.style) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    fillEl.style.width = `${pct}%`;
  }
}

function grade() {
  const total = current.length;
  const selected = [...document.querySelectorAll('#questions input:checked')];
  if (selected.length < total && !confirm(`Bạn mới trả lời ${selected.length}/${total} câu. Vẫn nộp bài và chấm điểm?`)) {
    return;
  }

  const answers = Object.fromEntries(selected.map(x => [x.name, +x.value]));
  const score = current.filter((q, i) => answers['q' + i] === q.correct).length;
  const pct = Math.round((score / total) * 100);
  const mark = ((score / total) * 10).toFixed(1);

  const details = current.map((q, i) => {
    const mine = answers['q' + i];
    const ok = mine === q.correct;
    const stateText = ok ? 'Đúng ✓' : mine === undefined ? 'Chưa chọn ✖' : 'Chưa đúng ✖';
    
    const optionsHtml = q.opts.map((option, index) => {
      const isRight = index === q.correct;
      const isMine = index === mine;
      let statusClass = '';
      if (isRight) statusClass = 'right-answer';
      else if (isMine && !ok) statusClass = 'wrong-answer';

      return `<div class="review-opt ${statusClass}"><b>${letters[index]}.</b> ${option.text}</div>`;
    }).join('');

    return `
      <article class="review-item ${ok ? 'correct' : 'wrong'}">
        <div class="review-status-title">Câu ${i + 1}: ${stateText}</div>
        <p class="review-question-text">${q.text}</p>
        <div class="review-options-list">${optionsHtml}</div>
      </article>
    `;
  }).join('');

  document.querySelector('#quiz').hidden = true;
  const out = document.querySelector('#result');
  out.hidden = false;
  out.innerHTML = `
    <div class="result-card">
      <div class="result-summary-header">
        <div class="score-display">${score}/${total}</div>
        <div class="result-meta">
          <h2>${score >= Math.round(total * 0.8) ? 'Kết quả xuất sắc! 🎉' : 'Đã hoàn thành bài thi'}</h2>
          <p>${mark}/10 điểm · Chính xác ${pct}% số câu</p>
          <button class="btn-again" id="again-top">↻ Làm đề thi khác</button>
        </div>
      </div>
      <h3 style="margin: 0 0 16px; font-size: 18px;">Đáp án chi tiết</h3>
      <div class="review-list">${details}</div>
      <div style="margin-top: 24px; text-align: center;">
        <button class="btn-again" id="again">↻ Làm đề thi khác</button>
      </div>
    </div>
  `;

  document.querySelectorAll('#again, #again-top').forEach(b => b.onclick = home);
  
  setTimeout(() => {
    if (out && out.scrollIntoView) {
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 40);
}

function home() {
  document.querySelector('#start').hidden = false;
  document.querySelector('#quiz').hidden = true;
  document.querySelector('#result').hidden = true;
  
  const startEl = document.querySelector('#start');
  if (startEl && startEl.scrollIntoView) {
    startEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Event bindings
document.addEventListener('DOMContentLoaded', () => {
  const codesEl = document.querySelector('#codes');
  if (codesEl) {
    codesEl.innerHTML = [1, 2, 3, 4, 5].map(n => 
      `<button data-n="${n}">Mã đề ${String(n).padStart(2, '0')}</button>`
    ).join('');
    
    codesEl.onclick = e => {
      const btn = e.target.closest('button');
      if (btn && btn.dataset.n) {
        makeExam(+btn.dataset.n * 2026, 'Mã đề ' + String(btn.dataset.n).padStart(2, '0'));
      }
    };
  }

  const randomBtn = document.querySelector('#random');
  if (randomBtn) {
    randomBtn.onclick = () => makeExam(null, 'Đề ngẫu nhiên 25 câu');
  }

  const randAllBtn = document.querySelector('#random-all');
  if (randAllBtn) {
    randAllBtn.onclick = () => makeExam(null, 'Luyện tập toàn bộ 121 câu', 121);
  }

  const sec1Btn = document.querySelector('#sec-1');
  if (sec1Btn) {
    sec1Btn.onclick = () => makeExam(null, 'Phần I: ATVSLĐ - PCCN (30 câu)', 30, 1);
  }

  const sec2Btn = document.querySelector('#sec-2');
  if (sec2Btn) {
    sec2Btn.onclick = () => makeExam(null, 'Phần II: An toàn điện (40 câu)', 40, 2);
  }

  const sec3Btn = document.querySelector('#sec-3');
  if (sec3Btn) {
    sec3Btn.onclick = () => makeExam(null, 'Phần III: An toàn nước (51 câu)', 51, 3);
  }

  const submitBtn = document.querySelector('#submit');
  if (submitBtn) submitBtn.onclick = grade;

  const backBtn = document.querySelector('#back');
  if (backBtn) backBtn.onclick = home;
});
