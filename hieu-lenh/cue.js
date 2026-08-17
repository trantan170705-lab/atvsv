/**
 * WEB HIỆU LỆNH ÂM THANH SÂN KHẤU - HIỂM HỌA CHỰC CHỜ
 * Full Web Audio API Engine with Automation & 3-Stage Finale Sequence
 */

(function () {
  'use strict';

  // 1. Cấu hình mặc định chuẩn hóa theo kịch bản tiểu phẩm
  const DEFAULT_CUES = [
    {
      id: "00",
      name: "NHẠC MỞ – DỌN SÂN KHẤU",
      icon: "🎵",
      file: "./audio/00_NHAC_MO_DON_SAN_KHAU.mp3",
      sign: "MC vừa đọc dứt câu: “Sau đây là tiểu phẩm Hiểm họa chực chờ!”",
      actionHint: "Bấm SPACE để phát nhạc dọn sân khấu (Fade in 0.5s -> 55%)",
      volume: 0.55,
      fadeIn: 0.5,
      manualFadeOut: 2.0,
      autoFadeStart: 28.0,
      autoFadeDuration: 2.0,
      autoStopAt: 30.0
    },
    {
      id: "01",
      name: "CHÓ SỦA",
      icon: "🐕",
      file: "./audio/01_CHO_SUA.mp3",
      sign: "Phượng vừa chạy vào, ngay trước câu: “Ủa kìa, chị Phượng tới kìa!”",
      actionHint: "Bấm SPACE để phát tiếng chó sủa (72% trong 2.45s tự tắt)",
      volume: 0.72,
      fadeIn: 0.03,
      duration: 2.45,
      fadeOut: 0.15,
      autoStop: true
    },
    {
      id: "03",
      name: "RẮN GIẬT MÌNH",
      icon: "🐍",
      file: "./audio/03_RAN_GIAT_MINH.mp3",
      sign: "ĐÚNG KHOẢNH KHẤU nắp hộp đồng hồ vừa mở và con rắn bắt đầu xuất hiện",
      actionHint: "Bấm SPACE lập tức! (Gain 80% -> 70% tự dừng ở 1.05s, latency = 0ms)",
      automation: [
        { time: 0.00, gain: 0.80 },
        { time: 0.12, gain: 0.72 },
        { time: 0.75, gain: 0.70 },
        { time: 1.00, gain: 0.00 }
      ],
      stopAt: 1.05
    },
    {
      id: "04",
      name: "NHẠC KẾT – THÔNG ĐIỆP",
      icon: "🎆",
      file: "./audio/04_NHAC_KET.mp3",
      sign: "Phân đoạn 3 bước kết thúc: Nhạc nền -> Tăng cao trào -> Đỉnh nhạc kết",
      actionHint: "Giai đoạn 1: Cán bộ An toàn bước ra ➔ SPACE (Nhạc nền 28%)",
      stage1: {
        name: "NHẠC NỀN",
        sign: "Cán bộ An toàn bước ra giữa sân khấu",
        actionHint: "Bấm SPACE để phát nhạc nền 28%",
        fadeIn: 0.8,
        volume: 0.28
      },
      stage2: {
        name: "TĂNG CAO TRÀO",
        sign: "Dứt chữ: “...chúng tôi mang đến thông điệp:”",
        actionHint: "Bấm SPACE để tăng nhạc 28% ➔ 48% (trong 1.2s)",
        from: 0.28,
        to: 0.48,
        duration: 1.2
      },
      stage3: {
        name: "ĐỈNH KẾT",
        sign: "Dứt chữ hô khẩu hiệu: “...NÂNG TẦM PHỤC VỤ!”",
        actionHint: "Bấm SPACE để bung nhạc kết 72% -> Hold 1.8s -> Fade 2.8s -> Stop",
        from: 0.48,
        to: 0.72,
        riseDuration: 0.4,
        holdDuration: 1.8,
        fadeOutDuration: 2.8,
        autoStop: true
      }
    }
  ];

  // 2. State quản lý ứng dụng
  let cues = loadSavedCues();
  let masterVolume = parseFloat(localStorage.getItem('cue_master_vol')) || 0.65;
  let currentCueIndex = 0;
  let stage4Current = 1;
  let isAudioUnlocked = false;
  let isPerformingMode = true;
  let isPlaying = false;
  let audioCtx = null;
  let masterGainNode = null;
  let currentSourceNode = null;
  let currentGainNode = null;
  let audioBuffers = {};
  let activeCueTimeouts = [];
  let cueTimerInterval = null;
  let playbackStartTime = 0;
  let wakeLock = null;

  // DOM Elements
  const elStartScreen = document.getElementById('start-screen');
  const elMainLayout = document.getElementById('main-layout');
  const elBtnStartAudio = document.getElementById('btn-start-audio');
  const elCheckList = document.getElementById('audio-check-list');
  const elStartStatusText = document.getElementById('start-status-text');

  const elCurrentCueCard = document.getElementById('current-cue-card');
  const elCueBadge = document.getElementById('cue-badge');
  const elCueTitle = document.getElementById('cue-title');
  const elCueSignText = document.getElementById('cue-sign-text');
  const elCueNextText = document.getElementById('cue-next-text');
  const elCueTimer = document.getElementById('cue-timer');

  const elBtnGo = document.getElementById('btn-go');
  const elGoLabel = document.getElementById('go-label');
  const elSubActions = document.getElementById('sub-actions');
  const elBtnFadeStop = document.getElementById('btn-fade-stop');
  const elBtnClimax = document.getElementById('btn-climax');

  const elSidebarCueList = document.getElementById('sidebar-cue-list');
  const elMasterVolSlider = document.getElementById('master-vol-slider');
  const elMasterVolText = document.getElementById('master-vol-text');
  const elWakeLockTag = document.getElementById('wakelock-tag');
  const elFocusAlert = document.getElementById('focus-alert');

  const elBtnPrevCue = document.getElementById('btn-prev-cue');
  const elBtnNextCue = document.getElementById('btn-next-cue');
  const elBtnReset = document.getElementById('btn-reset');
  const elBtnStopAll = document.getElementById('btn-stop-all');
  const elBtnModeToggle = document.getElementById('btn-mode-toggle');
  const elBtnSettings = document.getElementById('btn-settings');
  const elBtnFullscreen = document.getElementById('btn-fullscreen');

  const elModalSettings = document.getElementById('modal-settings');
  const elBtnCloseSettings = document.getElementById('btn-close-settings');
  const elBtnSaveSettings = document.getElementById('btn-save-settings');
  const elBtnRestoreDefault = document.getElementById('btn-restore-default');
  const elSettingsTableBody = document.getElementById('settings-table-body');
  const elLogBox = document.getElementById('log-box');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();
      masterGainNode = audioCtx.createGain();
      masterGainNode.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
      masterGainNode.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  async function preloadAllAudio() {
    initAudioContext();
    let loadedCount = 0;
    renderCheckListUI();

    for (let cue of cues) {
      updateCheckStatusUI(cue.id, 'Đang tải...', 'loading');
      try {
        const response = await fetch(cue.file);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioBuffers[cue.id] = decodedBuffer;
        updateCheckStatusUI(cue.id, '✅ ĐÃ SẴN SÀNG', 'ok');
        loadedCount++;
      } catch (err) {
        log(`Lỗi tải file ${cue.file}: ${err.message}. Đang tạo audio tổng hợp...`);
        const synthBuffer = createSyntheticBuffer(cue.id);
        audioBuffers[cue.id] = synthBuffer;
        updateCheckStatusUI(cue.id, '✅ ĐÃ SẴN SÀNG (Mẫu)', 'ok');
        loadedCount++;
      }
    }

    if (loadedCount === cues.length) {
      elStartStatusText.textContent = `${loadedCount}/${cues.length} ÂM THANH ĐÃ NẠP – SẴN SÀNG`;
      elBtnStartAudio.disabled = false;
      elBtnStartAudio.classList.remove('disabled');
    }
  }

  function createSyntheticBuffer(cueId) {
    const sampleRate = audioCtx.sampleRate || 44100;
    let duration = 2.5;
    if (cueId === '00') duration = 30;
    if (cueId === '04') duration = 40;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(2, numSamples, sampleRate);
    const channel0 = buffer.getChannelData(0);
    const channel1 = buffer.getChannelData(1);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let freq = 440;
      if (cueId === '01') freq = 200 + Math.sin(t * 40) * 100;
      if (cueId === '03') freq = 800 + Math.random() * 1500;
      if (cueId === '04') freq = 330 + Math.sin(t * 0.8) * 50;

      const val = Math.sin(2 * Math.PI * freq * t) * 0.4;
      channel0[i] = val;
      channel1[i] = val;
    }
    return buffer;
  }

  function renderCheckListUI() {
    elCheckList.innerHTML = cues.map(c => `
      <div class="audio-check-item">
        <span>${c.id} ${c.name}</span>
        <span class="check-status loading" id="status-${c.id}">Đang chuẩn bị...</span>
      </div>
    `).join('');
  }

  function updateCheckStatusUI(cueId, text, type) {
    const el = document.getElementById(`status-${cueId}`);
    if (el) {
      el.textContent = text;
      el.className = `check-status ${type}`;
    }
  }

  function clearActiveCueTimeouts() {
    activeCueTimeouts.forEach(t => clearTimeout(t));
    activeCueTimeouts = [];
  }

  function triggerCue(index) {
    if (index < 0 || index >= cues.length) return;
    const cue = cues[index];

    if (cue.id === "04") {
      handleCue04Sequence();
      return;
    }

    const buffer = audioBuffers[cue.id];
    if (!buffer) {
      alert(`Chưa nạp âm thanh cho Lệnh ${cue.id}!`);
      return;
    }

    stopCurrentAudio();

    initAudioContext();
    const now = audioCtx.currentTime;

    currentSourceNode = audioCtx.createBufferSource();
    currentSourceNode.buffer = buffer;

    currentGainNode = audioCtx.createGain();

    if (cue.automation && Array.isArray(cue.automation) && cue.automation.length > 0) {
      currentGainNode.gain.setValueAtTime(cue.automation[0].gain, now);
      for (let i = 1; i < cue.automation.length; i++) {
        const item = cue.automation[i];
        currentGainNode.gain.linearRampToValueAtTime(item.gain, now + item.time);
      }
    } else {
      const initialVol = cue.fadeIn ? 0.0 : cue.volume;
      currentGainNode.gain.setValueAtTime(initialVol, now);
      if (cue.fadeIn && cue.fadeIn > 0) {
        currentGainNode.gain.linearRampToValueAtTime(cue.volume, now + cue.fadeIn);
      }
    }

    currentSourceNode.connect(currentGainNode);
    currentGainNode.connect(masterGainNode);

    const startTime = cue.startTime || 0;
    currentSourceNode.start(0, startTime);

    isPlaying = true;
    playbackStartTime = Date.now();

    log(`[${nowStr()}] ▶ Lệnh ${cue.id} – ${cue.name} ĐÃ BẮT ĐẦU PHÁT`);
    startTimer();
    updateUI();

    if (cue.id === "00" && cue.autoFadeStart) {
      log(`[${nowStr()}] ⏱ Lệnh 00: Tự động fade từ mốc ${cue.autoFadeStart}s trong ${cue.autoFadeDuration || 2.0}s`);
      const fadeT = setTimeout(() => {
        if (isPlaying && currentCueIndex === index) {
          log(`[${nowStr()}] ⏰ Đến 28s ➔ Tự động giảm âm lượng Lệnh 00...`);
          fadeAndStop(cue.autoFadeDuration || 2.0, () => {
            advanceToNextCue();
          });
        }
      }, cue.autoFadeStart * 1000);
      activeCueTimeouts.push(fadeT);
    }
    else if (cue.stopAt || (cue.autoStop && cue.duration)) {
      const stopDurationSec = cue.stopAt || cue.duration;
      const fadeOutDuration = cue.fadeOut || 0.05;
      const tOut = setTimeout(() => {
        if (isPlaying && currentCueIndex === index) {
          fadeAndStop(fadeOutDuration, () => {
            advanceToNextCue();
          });
        }
      }, (stopDurationSec - fadeOutDuration) * 1000);
      activeCueTimeouts.push(tOut);
    }

    currentSourceNode.onended = () => {
      if (isPlaying && currentCueIndex === index && !cue.autoStop && !cue.autoFadeStart && !cue.stopAt) {
        isPlaying = false;
        stopTimer();
        updateUI();
      }
    };
  }

  function handleCue04Sequence() {
    const cue = cues.find((item) => item.id === '04');
    if (!cue) return;
    const buffer = audioBuffers[cue.id];
    if (!buffer) {
      alert("Chưa nạp âm thanh cho Lệnh 04!");
      return;
    }

    initAudioContext();
    const now = audioCtx.currentTime;

    if (stage4Current === 1 && !isPlaying) {
      stopCurrentAudio();

      currentSourceNode = audioCtx.createBufferSource();
      currentSourceNode.buffer = buffer;

      currentGainNode = audioCtx.createGain();
      const stage1Vol = cue.stage1 ? cue.stage1.volume : 0.28;
      const fadeInDuration = cue.stage1 ? cue.stage1.fadeIn : 0.8;

      currentGainNode.gain.setValueAtTime(0.0, now);
      currentGainNode.gain.linearRampToValueAtTime(stage1Vol, now + fadeInDuration);

      currentSourceNode.connect(currentGainNode);
      currentGainNode.connect(masterGainNode);

      currentSourceNode.start(0, 0);

      isPlaying = true;
      playbackStartTime = Date.now();
      stage4Current = 1;

      log(`[${nowStr()}] ▶ Lệnh 04 (Giai đoạn 1/3): NHẠC NỀN 28% STARTED`);
      startTimer();
      updateUI();
    }
    else if (stage4Current === 1 && isPlaying) {
      const fromVol = cue.stage2 ? cue.stage2.from : 0.28;
      const toVol = cue.stage2 ? cue.stage2.to : 0.48;
      const durationSec = cue.stage2 ? cue.stage2.duration : 1.2;

      currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, now);
      currentGainNode.gain.linearRampToValueAtTime(toVol, now + durationSec);

      stage4Current = 2;
      log(`[${nowStr()}] 🔥 Lệnh 04 (Giai đoạn 2/3): TĂNG CAO TRÀO 48% (Ramp ${durationSec}s)`);
      updateUI();
    }
    else if (stage4Current === 2 && isPlaying) {
      const stage3 = cue.stage3 || { from: 0.48, to: 0.72, riseDuration: 0.4, holdDuration: 1.8, fadeOutDuration: 2.8 };
      
      currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, now);
      currentGainNode.gain.linearRampToValueAtTime(stage3.to, now + stage3.riseDuration);

      stage4Current = 3;
      log(`[${nowStr()}] 🎆 Lệnh 04 (Giai đoạn 3/3): BUNG ĐỈNH KẾT 72% -> HOLD ${stage3.holdDuration}s -> FADE ${stage3.fadeOutDuration}s`);
      updateUI();

      const totalHoldMs = (stage3.riseDuration + stage3.holdDuration) * 1000;
      const finaleTimeout = setTimeout(() => {
        if (isPlaying && cues[currentCueIndex]?.id === '04') {
          log(`[${nowStr()}] 📉 Đã xong phần giữ 72% ➔ Đang fade về 0 trong ${stage3.fadeOutDuration}s...`);
          fadeAndStop(stage3.fadeOutDuration, () => {
            log(`[${nowStr()}] ✅ HOÀN THÀNH TOÀN BỘ TIỂU PHẨM`);
            stage4Current = 1;
            isPlaying = false;
            stopTimer();
            updateUI();
          });
        }
      }, totalHoldMs);

      activeCueTimeouts.push(finaleTimeout);
    }
  }

  function advanceToNextCue() {
    clearActiveCueTimeouts();
    if (currentCueIndex < cues.length - 1) {
      currentCueIndex++;
      if (cues[currentCueIndex]?.id === '04') stage4Current = 1;
      log(`[${nowStr()}] -> Chuyển sang Lệnh tiếp theo: ${cues[currentCueIndex].id}`);
    } else {
      log(`[${nowStr()}] ✅ ĐÃ HOÀN THÀNH TIỂU PHẨM`);
    }
    isPlaying = false;
    stopTimer();
    updateUI();
  }

  function stopCurrentAudio() {
    clearActiveCueTimeouts();
    if (currentSourceNode) {
      try {
        currentSourceNode.stop();
        currentSourceNode.disconnect();
      } catch (e) {}
      currentSourceNode = null;
    }
    if (currentGainNode) {
      currentGainNode.disconnect();
      currentGainNode = null;
    }
    isPlaying = false;
    stopTimer();
  }

  function fadeAndStop(durationSeconds = 2.0, callback = null) {
    if (!currentGainNode || !audioCtx || !isPlaying) {
      if (callback) callback();
      return;
    }
    const now = audioCtx.currentTime;
    const currentVol = currentGainNode.gain.value;
    currentGainNode.gain.setValueAtTime(currentVol, now);
    currentGainNode.gain.linearRampToValueAtTime(0, now + durationSeconds);

    log(`[${nowStr()}] 📉 Fade out (${durationSeconds}s) Lệnh ${cues[currentCueIndex].id}`);

    setTimeout(() => {
      stopCurrentAudio();
      if (callback) callback();
      else updateUI();
    }, durationSeconds * 1000);
  }

  function updateUI() {
    const cue = cues[currentCueIndex];
    const nextCue = cues[currentCueIndex + 1];

    if (cue.id === '03') {
      elCurrentCueCard.classList.add('cue-snake-active');
    } else {
      elCurrentCueCard.classList.remove('cue-snake-active');
    }

    if (cue.id === "04") {
      if (stage4Current === 1 && !isPlaying) {
        elCueBadge.textContent = `LỆNH 04 (SẴN SÀNG)`;
        elCueTitle.textContent = `${cue.icon} ${cue.name}`;
        if (elCueSignText) elCueSignText.textContent = `Dấu hiệu: ${cue.stage1.sign}`;
        elGoLabel.textContent = `▶ GO (SPACE) = NHẠC NỀN 28%`;
      } else if (stage4Current === 1 && isPlaying) {
        elCueBadge.textContent = `LỆNH 04 (GIAI ĐOẠN 1/3)`;
        elCueTitle.textContent = `${cue.icon} NHẠC NỀN (28%)`;
        if (elCueSignText) elCueSignText.textContent = `Dấu hiệu bấm tiếp: ${cue.stage2.sign}`;
        elGoLabel.textContent = `▶ SPACE = TĂNG CAO TRÀO 48%`;
      } else if (stage4Current === 2 && isPlaying) {
        elCueBadge.textContent = `LỆNH 04 (GIAI ĐOẠN 2/3)`;
        elCueTitle.textContent = `${cue.icon} CAO TRÀO THÔNG ĐIỆP (48%)`;
        if (elCueSignText) elCueSignText.textContent = `Dấu hiệu bấm tiếp: ${cue.stage3.sign}`;
        elGoLabel.textContent = `▶ SPACE = BUNG ĐỈNH KẾT 72%`;
      } else if (stage4Current === 3 && isPlaying) {
        elCueBadge.textContent = `LỆNH 04 (GIAI ĐOẠN 3/3)`;
        elCueTitle.textContent = `${cue.icon} 🎆 ĐỈNH KẾT KỊCH BẢN (72%)`;
        if (elCueSignText) elCueSignText.textContent = `Tự động giữ 72% ➔ Fade out 2.8s ➔ Tự động dừng`;
        elGoLabel.textContent = `ĐANG TỰ ĐỘNG HOÀN THÀNH KẾT THÚC...`;
      }
    } else {
      elCueBadge.textContent = `LỆNH ${cue.id}`;
      elCueTitle.textContent = `${cue.icon} ${cue.name}`;
      if (elCueSignText) elCueSignText.textContent = `Dấu hiệu bấm: ${cue.sign}`;

      if (isPlaying) {
        elBtnGo.disabled = true;
        elGoLabel.textContent = `ĐANG PHÁT LỆNH ${cue.id}...`;
      } else {
        elBtnGo.disabled = false;
        elGoLabel.textContent = `▶ GO (Phím SPACE)`;
      }
    }

    if (nextCue) {
      elCueNextText.textContent = `Tiếp theo: ${nextCue.id} – ${nextCue.name}`;
    } else {
      elCueNextText.textContent = `Đây là lệnh âm thanh cuối cùng của tiểu phẩm`;
    }

    elSubActions.style.display = 'none';
    elBtnFadeStop.style.display = 'none';
    elBtnClimax.style.display = 'none';

    if (isPlaying) {
      elSubActions.style.display = 'grid';
      if (cue.id === '00') {
        elBtnFadeStop.style.display = 'flex';
        elBtnFadeStop.innerHTML = `↓ FADE SỚM (F)`;
      } else if (cue.id === '04' && stage4Current < 3) {
        elBtnFadeStop.style.display = 'flex';
        elBtnFadeStop.innerHTML = `↓ FADE & KẾT THÚC (F)`;
      }
    }

    elSidebarCueList.innerHTML = cues.map((c, i) => {
      let iconStatus = '○';
      let classStatus = '';
      if (i < currentCueIndex) {
        iconStatus = '✅';
        classStatus = 'done';
      } else if (i === currentCueIndex) {
        iconStatus = '▶';
        classStatus = 'active';
      }
      return `
        <div class="cue-item-card ${classStatus}" data-index="${i}">
          <div class="cue-item-left">
            <span class="cue-icon">${iconStatus}</span>
            <div>
              <div class="cue-name">${c.id} - ${c.name}</div>
              <div class="cue-time-mini">Vol: ${Math.round((c.volume || c.stage1?.volume || 0.55) * 100)}%</div>
            </div>
          </div>
          ${!isPerformingMode ? `<button class="btn-header test-cue-btn" data-index="${i}">Phát thử</button>` : ''}
        </div>
      `;
    }).join('');

    if (!isPerformingMode) {
      document.querySelectorAll('.cue-item-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.classList.contains('test-cue-btn')) return;
          const idx = parseInt(card.getAttribute('data-index'));
          if (confirm(`Chuyển sang Lệnh ${cues[idx].id} – ${cues[idx].name}?`)) {
            stopCurrentAudio();
            currentCueIndex = idx;
            stage4Current = 1;
            updateUI();
          }
        });
      });

      document.querySelectorAll('.test-cue-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          stopCurrentAudio();
          triggerCue(idx);
        });
      });
    }

    elBtnPrevCue.disabled = currentCueIndex === 0;
    elBtnNextCue.disabled = currentCueIndex === cues.length - 1;
  }

  function startTimer() {
    stopTimer();
    cueTimerInterval = setInterval(() => {
      const elapsedMs = Date.now() - playbackStartTime;
      const totalSec = elapsedMs / 1000;
      const min = Math.floor(totalSec / 60);
      const sec = (totalSec % 60).toFixed(1);
      const minStr = String(min).padStart(2, '0');
      const secStr = String(sec).padStart(4, '0');
      elCueTimer.textContent = `${minStr}:${secStr}`;
    }, 100);
  }

  function stopTimer() {
    if (cueTimerInterval) {
      clearInterval(cueTimerInterval);
      cueTimerInterval = null;
    }
  }

  function initEvents() {
    elBtnStartAudio.addEventListener('click', () => {
      initAudioContext();
      isAudioUnlocked = true;
      elStartScreen.style.display = 'none';
      elMainLayout.style.display = 'grid';
      const elSidebar = document.getElementById('sidebar-panel');
      if (elSidebar) elSidebar.style.display = 'flex';
      requestWakeLock();
      updateUI();
      log(`[${nowStr()}] 🔊 Đã mở khóa AudioContext. Bắt đầu phiên điều khiển.`);
    });

    elBtnGo.addEventListener('click', () => {
      if (cues[currentCueIndex]?.id === '04' && stage4Current === 3) return;
      triggerCue(currentCueIndex);
    });

    elBtnFadeStop.addEventListener('click', () => {
      const cue = cues[currentCueIndex];
      const fadeDuration = cue.id === '04' ? (cue.stage3 ? cue.stage3.fadeOutDuration : 2.8) : (cue.manualFadeOut || 2.0);
      fadeAndStop(fadeDuration, () => {
        advanceToNextCue();
      });
    });

    elMasterVolSlider.addEventListener('input', (e) => {
      masterVolume = parseFloat(e.target.value);
      elMasterVolText.textContent = `${Math.round(masterVolume * 100)}%`;
      if (masterGainNode && audioCtx) {
        masterGainNode.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
      }
      localStorage.setItem('cue_master_vol', masterVolume);
    });

    elBtnPrevCue.addEventListener('click', () => {
      if (currentCueIndex > 0) {
        if (confirm(`Bạn có chắc muốn quay lại Lệnh ${cues[currentCueIndex - 1].id}?`)) {
          stopCurrentAudio();
          currentCueIndex--;
          stage4Current = 1;
          updateUI();
        }
      }
    });

    elBtnNextCue.addEventListener('click', () => {
      if (currentCueIndex < cues.length - 1) {
        if (confirm(`Bỏ qua Lệnh hiện tại và nhảy tới Lệnh ${cues[currentCueIndex + 1].id}?`)) {
          stopCurrentAudio();
          currentCueIndex++;
          stage4Current = 1;
          updateUI();
        }
      }
    });

    elBtnReset.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn RESET chương trình về Lệnh 00?')) {
        stopCurrentAudio();
        currentCueIndex = 0;
        stage4Current = 1;
        updateUI();
        log(`[${nowStr()}] ↻ Reset chương trình về Lệnh 00.`);
      }
    });

    elBtnStopAll.addEventListener('click', () => {
      stopCurrentAudio();
      alert('⛔ ÂM THANH ĐÃ DỪNG KHẨN CẤP!');
      log(`[${nowStr()}] ⛔ STOP ALL KHẨN CẤP DA NHAU!`);
      updateUI();
    });

    elBtnModeToggle.addEventListener('click', () => {
      isPerformingMode = !isPerformingMode;
      elBtnModeToggle.textContent = isPerformingMode ? '🎭 CHẾ ĐỘ BIỂU DIỄN' : '🧪 CHẾ ĐỘ TẬP LUYỆN';
      updateUI();
    });

    elBtnSettings.addEventListener('click', () => {
      renderSettingsModal();
      elModalSettings.style.display = 'flex';
    });

    elBtnCloseSettings.addEventListener('click', () => {
      elModalSettings.style.display = 'none';
    });

    elBtnSaveSettings.addEventListener('click', () => {
      saveSettingsFromInputs();
      elModalSettings.style.display = 'none';
      updateUI();
      alert('Đã lưu cấu hình Lệnh Âm Thanh!');
    });

    elBtnRestoreDefault.addEventListener('click', () => {
      if (confirm('Khôi phục toàn bộ cài đặt thông số về mặc định ban đầu của kịch bản?')) {
        cues = JSON.parse(JSON.stringify(DEFAULT_CUES));
        localStorage.removeItem('cue_configs_v2');
        renderSettingsModal();
        updateUI();
      }
    });

    elBtnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => alert(err.message));
      } else {
        document.exitFullscreen();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.repeat) return; // Chống giữ phím Space

      if (e.code === 'Space') {
        e.preventDefault();
        triggerCue(currentCueIndex);
      } else if (e.code === 'Escape') {
        e.preventDefault();
        stopCurrentAudio();
        log(`[${nowStr()}] ⛔ ESC: STOP ALL KHẨN CẤP`);
        updateUI();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        if (isPlaying) {
          const cue = cues[currentCueIndex];
          const fadeDuration = cue.id === '04' ? (cue.stage3 ? cue.stage3.fadeOutDuration : 2.8) : (cue.manualFadeOut || 2.0);
          fadeAndStop(fadeDuration, () => {
            advanceToNextCue();
          });
        }
      } else if (e.code === 'ArrowLeft') {
        if (!isPlaying && currentCueIndex > 0) {
          currentCueIndex--;
          stage4Current = 1;
          updateUI();
        }
      } else if (e.code === 'ArrowRight') {
        if (!isPlaying && currentCueIndex < cues.length - 1) {
          currentCueIndex++;
          stage4Current = 1;
          updateUI();
        }
      } else if (e.code === 'KeyR') {
        if (!isPerformingMode && !isPlaying) {
          triggerCue(currentCueIndex);
        }
      }
    });

    window.addEventListener('blur', () => {
      if (isPerformingMode) {
        elFocusAlert.style.display = 'block';
      }
    });

    window.addEventListener('focus', () => {
      setTimeout(() => {
        elFocusAlert.style.display = 'none';
      }, 3000);
    });
  }

  async function requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen');
        elWakeLockTag.textContent = '🟢 Màn hình đang giữ hoạt động';
        elWakeLockTag.className = 'status-tag';
      }
    } catch (err) {
      elWakeLockTag.textContent = '⚪ Wake Lock không hỗ trợ';
      elWakeLockTag.className = 'status-tag off';
    }
  }

  function renderSettingsModal() {
    elSettingsTableBody.innerHTML = cues.map((c, i) => `
      <tr>
        <td><strong>${c.id} - ${c.name}</strong></td>
        <td><input type="number" step="5" min="0" max="100" value="${Math.round((c.volume || c.stage1?.volume || 0.55) * 100)}" id="set-vol-${i}">%</td>
        <td><input type="number" step="1" min="0" value="${c.autoFadeStart || 0}" id="set-autofade-${i}">s</td>
        <td><input type="number" step="0.5" min="0" value="${c.fadeOut || c.manualFadeOut || 0}" id="set-fade-${i}">s</td>
        <td><input type="number" step="0.5" min="0" value="${c.duration || c.stopAt || 0}" id="set-dur-${i}">s</td>
      </tr>
    `).join('');
  }

  function saveSettingsFromInputs() {
    cues.forEach((c, i) => {
      const volInput = document.getElementById(`set-vol-${i}`);
      const autoFadeInput = document.getElementById(`set-autofade-${i}`);
      const fadeInput = document.getElementById(`set-fade-${i}`);
      const durInput = document.getElementById(`set-dur-${i}`);
      if (volInput) {
        const val = parseFloat(volInput.value) / 100;
        c.volume = val;
        if (c.stage1) c.stage1.volume = val;
      }
      if (autoFadeInput) c.autoFadeStart = parseFloat(autoFadeInput.value);
      if (fadeInput) {
        c.fadeOut = parseFloat(fadeInput.value);
        c.manualFadeOut = parseFloat(fadeInput.value);
      }
      if (durInput) c.duration = parseFloat(durInput.value);
    });
    localStorage.setItem('cue_configs_v2', JSON.stringify(cues));
    log(`[${nowStr()}] 💾 Đã lưu thông số Lệnh Âm Thanh vào LocalStorage.`);
  }

  function loadSavedCues() {
    const saved = localStorage.getItem('cue_configs_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return JSON.parse(JSON.stringify(DEFAULT_CUES));
  }

  function log(msg) {
    console.log(msg);
    if (elLogBox) {
      elLogBox.innerHTML += `<div>${msg}</div>`;
      elLogBox.scrollTop = elLogBox.scrollHeight;
    }
  }

  function nowStr() {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(() => {
      console.log('[PWA] Service Worker Registered Successfully.');
    }).catch(err => console.log('[PWA] Service Worker Error:', err));
  }

  window.addEventListener('DOMContentLoaded', () => {
    preloadAllAudio();
    initEvents();
  });

})();
