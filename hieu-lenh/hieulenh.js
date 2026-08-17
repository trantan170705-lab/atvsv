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
      actionHint: "Bấm PHÍM CÁCH để phát nhạc dọn sân khấu (tăng dần âm lượng 0,5 giây -> 55%)",
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
      actionHint: "Bấm PHÍM CÁCH để phát tiếng chó sủa (72% trong 2,45 giây, tự dừng)",
      volume: 0.72,
      fadeIn: 0.03,
      duration: 2.45,
      fadeOut: 0.15,
      autoStop: true
    },
    {
      id: "03",
      name: "RẮN XUẤT HIỆN",
      icon: "🐍",
      file: "./audio/03_RAN_GIAT_MINH.mp3",
      sign: "Vừa mở nắp đồng hồ thì con rắn chạy ra",
      actionHint: "Bấm PHÍM CÁCH đúng lúc rắn xuất hiện (âm lượng 80% -> 70%, tự dừng ở 1,05 giây)",
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
      actionHint: "Giai đoạn 1: Cán bộ An toàn bước ra ➔ PHÍM CÁCH (nhạc nền 28%)",
      stage1: {
        name: "NHẠC NỀN",
        sign: "Cán bộ An toàn bước ra giữa sân khấu",
        actionHint: "Bấm PHÍM CÁCH để phát nhạc nền 28%",
        fadeIn: 0.8,
        volume: 0.28
      },
      stage2: {
        name: "TĂNG CAO TRÀO",
        sign: "Dứt chữ: “...chúng tôi mang đến thông điệp:”",
        actionHint: "Bấm PHÍM CÁCH để tăng nhạc 28% ➔ 48% (trong 1,2 giây)",
        from: 0.28,
        to: 0.48,
        duration: 1.2
      },
      stage3: {
        name: "ĐỈNH KẾT",
        sign: "Dứt chữ hô khẩu hiệu: “...NÂNG TẦM PHỤC VỤ!”",
        actionHint: "Bấm PHÍM CÁCH để bung nhạc kết 72% -> giữ 1,8 giây -> giảm dần 2,8 giây -> dừng",
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
  const BACKUP_CUE = DEFAULT_CUES[0];
  let cues = loadSavedCues().filter((cue) => cue.id !== '00');
  const savedMasterVolume = parseFloat(localStorage.getItem('cue_master_vol'));
  let masterVolume = Number.isFinite(savedMasterVolume) ? savedMasterVolume : 0.65;
  let currentCueIndex = 0;
  let stage4Current = 1; // 1, 2, hoặc 3 cho Cue 04
  let isAudioUnlocked = false;
  let isPerformingMode = true; // true: Biểu diễn, false: Tập luyện
  let isPlaying = false;
  let isBackupPlaying = false;
  let audioCtx = null;
  let masterGainNode = null;
  let currentSourceNode = null;
  let currentGainNode = null;
  let audioBuffers = {}; // id -> AudioBuffer
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
  const elBtnStopNow = document.getElementById('btn-stop-now');
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
  const elBtnBackupMusic = document.getElementById('btn-backup-music');
  const elBtnRefreshAudio = document.getElementById('btn-refresh-audio');
  const elBtnFullscreen = document.getElementById('btn-fullscreen');

  const elModalSettings = document.getElementById('modal-settings');
  const elBtnCloseSettings = document.getElementById('btn-close-settings');
  const elBtnSaveSettings = document.getElementById('btn-save-settings');
  const elBtnRestoreDefault = document.getElementById('btn-restore-default');
  const elSettingsTableBody = document.getElementById('settings-table-body');
  const elLogBox = document.getElementById('log-box');

  // 3. Khởi tạo Web Audio Context
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

  function setMasterVolume(value, persist = false) {
    masterVolume = Math.max(0, Math.min(1, value));
    elMasterVolSlider.value = masterVolume;
    elMasterVolText.textContent = `${Math.round(masterVolume * 100)}%`;
    if (masterGainNode && audioCtx) {
      masterGainNode.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
    }
    if (persist) localStorage.setItem('cue_master_vol', masterVolume);
  }

  function getPresetVolume(cue) {
    if (cue.id === '04') {
      if (stage4Current === 2) return cue.stage2?.to ?? 0.48;
      if (stage4Current === 3) return cue.stage3?.to ?? 0.72;
      return cue.stage1?.volume ?? 0.28;
    }
    return cue.volume ?? cue.automation?.[0]?.gain ?? 0.55;
  }

  function syncMasterVolumeToCue(cue = cues[currentCueIndex]) {
    if (cue) setMasterVolume(getPresetVolume(cue));
  }

  // 4. Preload & Decode Audio
  async function preloadAllAudio() {
    initAudioContext();
    let loadedCount = 0;
    renderCheckListUI();

    const allCues = [BACKUP_CUE, ...cues];
    for (let cue of allCues) {
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

    if (loadedCount === allCues.length) {
      elStartStatusText.textContent = `${loadedCount}/${allCues.length} ÂM THANH ĐÃ NẠP – SẴN SÀNG`;
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
    elCheckList.innerHTML = [BACKUP_CUE, ...cues].map(c => `
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

  // 5. Core Audio Trigger Logic
  function triggerCue(index) {
    if (index < 0 || index >= cues.length) return;
    const cue = cues[index];

    // Xử lý riêng cho Lệnh 04 theo 3 Giai đoạn
    if (cue.id === "04") {
      handleCue04Sequence();
      return;
    }

    const buffer = audioBuffers[cue.id];
    if (!buffer) {
      alert(`Chưa nạp âm thanh cho Lệnh ${cue.id}!`);
      return;
    }

    stopCurrentAudio(); // Dừng lệnh trước nếu có

    initAudioContext();
    const now = audioCtx.currentTime;

    currentSourceNode = audioCtx.createBufferSource();
    currentSourceNode.buffer = buffer;

    currentGainNode = audioCtx.createGain();

    // Áp dụng GainNode Automation theo timeline quy định
    if (cue.automation && Array.isArray(cue.automation) && cue.automation.length > 0) {
      // Đặt điểm bắt đầu
      currentGainNode.gain.setValueAtTime(cue.automation[0].gain, now);
      // Đặt các mốc ramp tiếp theo
      for (let i = 1; i < cue.automation.length; i++) {
        const item = cue.automation[i];
        currentGainNode.gain.linearRampToValueAtTime(item.gain, now + item.time);
      }
    } else {
      // Fade in cơ bản hoặc giữ nguyên volume
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

    // Xử lý Stop / Fade tự động theo Cấu hình Lệnh 00
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
    // Xử lý Stop tự động cho Cue 01 và 03
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

  function playBackupMusic() {
    const buffer = audioBuffers[BACKUP_CUE.id];
    if (!buffer) {
      alert('Chưa nạp nhạc dự phòng sân khấu.');
      return;
    }

    if (isPlaying && !confirm('Dừng âm thanh hiện tại để mở nhạc dự phòng sân khấu?')) return;

    stopCurrentAudio();
    initAudioContext();
    const now = audioCtx.currentTime;

    currentSourceNode = audioCtx.createBufferSource();
    currentSourceNode.buffer = buffer;
    currentSourceNode.loop = true;
    currentGainNode = audioCtx.createGain();
    currentGainNode.gain.setValueAtTime(0, now);
    currentGainNode.gain.linearRampToValueAtTime(BACKUP_CUE.volume, now + BACKUP_CUE.fadeIn);
    currentSourceNode.connect(currentGainNode);
    currentGainNode.connect(masterGainNode);
    currentSourceNode.start(0);

    isPlaying = true;
    isBackupPlaying = true;
    setMasterVolume(BACKUP_CUE.volume);
    playbackStartTime = Date.now();
    startTimer();
    log(`[${nowStr()}] ♪ ĐÃ MỞ NHẠC DỰ PHÒNG SÂN KHẤU.`);
    updateUI();
  }

  // 6. Xử lý riêng Chuỗi 3 Giai Đoạn Lệnh 04 (Nhạc Kết / Thông Điệp)
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

    // GIAI ĐOẠN 1: Bấm SPACE lần 1 ➔ Nhạc Nền 28%
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
      syncMasterVolumeToCue(cue);

      log(`[${nowStr()}] ▶ Lệnh 04 (Giai đoạn 1/3): NHẠC NỀN 28% STARTED`);
      startTimer();
      updateUI();
    }
    // GIAI ĐOẠN 2: Bấm SPACE lần 2 ➔ Tăng Cao Trào 28% -> 48%
    else if (stage4Current === 1 && isPlaying) {
      const fromVol = cue.stage2 ? cue.stage2.from : 0.28;
      const toVol = cue.stage2 ? cue.stage2.to : 0.48;
      const durationSec = cue.stage2 ? cue.stage2.duration : 1.2;

      currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, now);
      currentGainNode.gain.linearRampToValueAtTime(toVol, now + durationSec);

      stage4Current = 2;
      syncMasterVolumeToCue(cue);
      log(`[${nowStr()}] 🔥 Lệnh 04 (Giai đoạn 2/3): TĂNG CAO TRÀO 48% (Ramp ${durationSec}s)`);
      updateUI();
    }
    // GIAI ĐOẠN 3: Bấm SPACE lần 3 ➔ Bung Đỉnh Kết 72% -> Hold 1.8s -> Fade 2.8s -> Stop
    else if (stage4Current === 2 && isPlaying) {
      const stage3 = cue.stage3 || { from: 0.48, to: 0.72, riseDuration: 0.4, holdDuration: 1.8, fadeOutDuration: 2.8 };
      
      // Ramp từ 48% -> 72% trong 0.4s
      currentGainNode.gain.setValueAtTime(currentGainNode.gain.value, now);
      currentGainNode.gain.linearRampToValueAtTime(stage3.to, now + stage3.riseDuration);

      stage4Current = 3;
      syncMasterVolumeToCue(cue);
      log(`[${nowStr()}] 🎆 Lệnh 04 (Giai đoạn 3/3): BUNG ĐỈNH KẾT 72% -> HOLD ${stage3.holdDuration}s -> FADE ${stage3.fadeOutDuration}s`);
      updateUI();

      // Sau khi Bung 72% + Hold 1.8s ➔ Tự động Fade về 0 trong 2.8s
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

  // Advance Cue sau khi hoàn tất
  function advanceToNextCue() {
    clearActiveCueTimeouts();
    if (currentCueIndex < cues.length - 1) {
      currentCueIndex++;
      if (cues[currentCueIndex]?.id === '04') stage4Current = 1;
      syncMasterVolumeToCue();
      log(`[${nowStr()}] -> Chuyển sang Lệnh tiếp theo: ${cues[currentCueIndex].id}`);
    } else {
      log(`[${nowStr()}] ✅ ĐÃ HOÀN THÀNH TIỂU PHẨM`);
    }
    isPlaying = false;
    isBackupPlaying = false;
    stopTimer();
    updateUI();
  }

  // Dừng âm thanh lập tức
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

  // Fade out & Stop thủ công (hoặc phím F)
  function fadeAndStop(durationSeconds = 2.0, callback = null) {
    if (!currentGainNode || !audioCtx || !isPlaying) {
      if (callback) callback();
      return;
    }
    const now = audioCtx.currentTime;
    const currentVol = currentGainNode.gain.value;
    currentGainNode.gain.setValueAtTime(currentVol, now);
    currentGainNode.gain.linearRampToValueAtTime(0, now + durationSeconds);

    const label = isBackupPlaying ? 'nhạc dự phòng sân khấu' : `Lệnh ${cues[currentCueIndex].id}`;
    log(`[${nowStr()}] 📉 Giảm dần (${durationSeconds}s) ${label}`);

    setTimeout(() => {
      stopCurrentAudio();
      if (callback) callback();
      else updateUI();
    }, durationSeconds * 1000);
  }

  // 7. Navigation & UI Updates
  function updateUI() {
    const cue = cues[currentCueIndex];
    const nextCue = cues[currentCueIndex + 1];

    if (cue.id === '03') {
      elCurrentCueCard.classList.add('cue-snake-active');
    } else {
      elCurrentCueCard.classList.remove('cue-snake-active');
    }

    // Giao diện khi đang phát nhạc dự phòng sân khấu
    if (isBackupPlaying) {
      elCueBadge.textContent = 'NHẠC DỰ PHÒNG';
      elCueTitle.textContent = `${BACKUP_CUE.icon} ${BACKUP_CUE.name}`;
      elCueSignText.textContent = 'Đang phát lặp để xử lý sự cố hoặc chờ sân khấu sẵn sàng.';
      elGoLabel.textContent = 'ĐANG PHÁT NHẠC DỰ PHÒNG...';
      elBtnGo.disabled = true;
    }
    // Giao diện cho Lệnh 04 theo từng giai đoạn
    else if (cue.id === "04") {
      if (stage4Current === 1 && !isPlaying) {
        elBtnGo.disabled = false;
        elCueBadge.textContent = `LỆNH 04 (SẴN SÀNG)`;
        elCueTitle.textContent = `${cue.icon} ${cue.name}`;
        elCueSignText.textContent = `Dấu hiệu: ${cue.stage1.sign}`;
        elGoLabel.textContent = `▶ KÍCH HOẠT (PHÍM CÁCH) = NHẠC NỀN 28%`;
      } else if (stage4Current === 1 && isPlaying) {
        elBtnGo.disabled = false;
        elCueBadge.textContent = `LỆNH 04 (GIAI ĐOẠN 1/3)`;
        elCueTitle.textContent = `${cue.icon} NHẠC NỀN (28%)`;
        elCueSignText.textContent = `Dấu hiệu bấm tiếp: ${cue.stage2.sign}`;
        elGoLabel.textContent = `▶ PHÍM CÁCH = TĂNG CAO TRÀO 48%`;
      } else if (stage4Current === 2 && isPlaying) {
        elBtnGo.disabled = false;
        elCueBadge.textContent = `LỆNH 04 (GIAI ĐOẠN 2/3)`;
        elCueTitle.textContent = `${cue.icon} CAO TRÀO THÔNG ĐIỆP (48%)`;
        elCueSignText.textContent = `Dấu hiệu bấm tiếp: ${cue.stage3.sign}`;
        elGoLabel.textContent = `▶ PHÍM CÁCH = BUNG ĐỈNH KẾT 72%`;
      } else if (stage4Current === 3 && isPlaying) {
        elBtnGo.disabled = true;
        elCueBadge.textContent = `LỆNH 04 (GIAI ĐOẠN 3/3)`;
        elCueTitle.textContent = `${cue.icon} 🎆 ĐỈNH KẾT KỊCH BẢN (72%)`;
        elCueSignText.textContent = `Tự động giữ 72% ➔ Fade out 2.8s ➔ Tự động dừng`;
        elGoLabel.textContent = `ĐANG TỰ ĐỘNG HOÀN THÀNH KẾT THÚC...`;
      }
    } else {
      elCueBadge.textContent = `LỆNH ${cue.id}`;
      elCueTitle.textContent = `${cue.icon} ${cue.name}`;
      elCueSignText.textContent = `Dấu hiệu bấm: ${cue.sign}`;

      if (isPlaying) {
        elBtnGo.disabled = true;
        elGoLabel.textContent = `ĐANG PHÁT LỆNH ${cue.id}...`;
      } else {
        elBtnGo.disabled = false;
        elGoLabel.textContent = `▶ KÍCH HOẠT (PHÍM CÁCH)`;
      }
    }

    if (nextCue) {
      elCueNextText.textContent = `Tiếp theo: ${nextCue.id} – ${nextCue.name}`;
    } else {
      elCueNextText.textContent = `Đây là lệnh âm thanh cuối cùng của tiểu phẩm`;
    }

    // Sub Actions Render (Fade Stop)
    elSubActions.style.display = 'none';
    elBtnFadeStop.style.display = 'none';
    elBtnStopNow.style.display = 'none';
    elBtnClimax.style.display = 'none';

    if (isPlaying) {
      elSubActions.style.display = 'grid';
      elBtnStopNow.style.display = 'flex';
      if (isBackupPlaying) {
        elBtnFadeStop.style.display = 'flex';
        elBtnFadeStop.innerHTML = `↓ GIẢM DẦN VÀ KẾT THÚC (F)`;
      } else if (cue.id === '04' && stage4Current < 3) {
        elBtnFadeStop.style.display = 'flex';
        elBtnFadeStop.innerHTML = `↓ FADE & KẾT THÚC (F)`;
      }
    }

    // Sidebar list
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
              <div class="cue-time-mini">Âm lượng: ${Math.round(getPresetVolume(c) * 100)}%</div>
            </div>
          </div>
          ${!isPerformingMode ? `<button class="btn-header test-cue-btn" data-index="${i}">Phát thử</button>` : ''}
        </div>
      `;
    }).join('');

    document.querySelectorAll('.cue-item-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('test-cue-btn')) return;
        const idx = parseInt(card.getAttribute('data-index'));
        const selectedCue = cues[idx];
        const needsConfirmation = isPlaying || idx !== currentCueIndex;
        if (needsConfirmation && !confirm(`Chuyển sang Lệnh ${selectedCue.id} – ${selectedCue.name}?`)) return;

        stopCurrentAudio();
        currentCueIndex = idx;
        stage4Current = 1;
        syncMasterVolumeToCue();
        updateUI();
      });
    });

    if (!isPerformingMode) {
      document.querySelectorAll('.test-cue-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute('data-index'));
          stopCurrentAudio();
          currentCueIndex = idx;
          stage4Current = 1;
          syncMasterVolumeToCue();
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
    elBtnRefreshAudio.addEventListener('click', async () => {
      if (!confirm('Xóa bản âm thanh đã lưu trên thiết bị và tải lại âm thanh mới?')) return;

      stopCurrentAudio();
      elBtnRefreshAudio.disabled = true;
      elBtnRefreshAudio.textContent = 'ĐANG LÀM MỚI...';

      try {
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames
              .filter((name) => name.startsWith('hieulenh-audio-'))
              .map((name) => caches.delete(name))
          );
        }

        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) await registration.update();
        }

        location.reload();
      } catch (err) {
        console.error('Không thể làm mới âm thanh:', err);
        alert('Không thể làm mới cache. Hãy kiểm tra kết nối mạng rồi thử lại.');
        elBtnRefreshAudio.disabled = false;
        elBtnRefreshAudio.textContent = '↻ LÀM MỚI ÂM THANH';
      }
    });

    elBtnBackupMusic.addEventListener('click', () => {
      playBackupMusic();
    });

    elBtnStartAudio.addEventListener('click', () => {
      initAudioContext();
      isAudioUnlocked = true;
      elStartScreen.style.display = 'none';
      elMainLayout.style.display = 'grid';
      elBtnBackupMusic.classList.add('mobile-ready');
      const elSidebar = document.getElementById('sidebar-panel');
      if (elSidebar) elSidebar.style.display = 'flex';
      requestWakeLock();
      syncMasterVolumeToCue();
      updateUI();
      log(`[${nowStr()}] 🔊 Đã mở khóa AudioContext. Bắt đầu phiên điều khiển.`);
    });

    elBtnGo.addEventListener('click', () => {
      if (isBackupPlaying) return;
      if (cues[currentCueIndex]?.id === '04' && stage4Current === 3) return;
      triggerCue(currentCueIndex);
    });

    elBtnFadeStop.addEventListener('click', () => {
      const cue = cues[currentCueIndex];
      const wasBackupPlaying = isBackupPlaying;
      const fadeDuration = isBackupPlaying
        ? BACKUP_CUE.manualFadeOut
        : (cue.id === '04' ? (cue.stage3 ? cue.stage3.fadeOutDuration : 2.8) : (cue.manualFadeOut || 2.0));
      fadeAndStop(fadeDuration, () => {
        if (wasBackupPlaying) updateUI();
        else advanceToNextCue();
      });
    });

    elBtnStopNow.addEventListener('click', () => {
      const label = isBackupPlaying ? 'NHẠC DỰ PHÒNG SÂN KHẤU' : `LỆNH ${cues[currentCueIndex].id}`;
      stopCurrentAudio();
      log(`[${nowStr()}] ⛔ ĐÃ DỪNG NGAY ${label}.`);
      updateUI();
    });

    elMasterVolSlider.addEventListener('input', (e) => {
      setMasterVolume(parseFloat(e.target.value), true);
    });

    elBtnPrevCue.addEventListener('click', () => {
      if (currentCueIndex > 0) {
        if (confirm(`Bạn có chắc muốn quay lại Lệnh ${cues[currentCueIndex - 1].id}?`)) {
          stopCurrentAudio();
          currentCueIndex--;
          stage4Current = 1;
          syncMasterVolumeToCue();
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
          syncMasterVolumeToCue();
          updateUI();
        }
      }
    });

    elBtnReset.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn đưa chương trình về Lệnh 01?')) {
        stopCurrentAudio();
        currentCueIndex = 0;
        stage4Current = 1;
        syncMasterVolumeToCue();
        updateUI();
        log(`[${nowStr()}] ↻ Đã đưa chương trình về Lệnh 01.`);
      }
    });

    elBtnStopAll.addEventListener('click', () => {
      stopCurrentAudio();
      alert('⛔ ÂM THANH ĐÃ DỪNG KHẨN CẤP!');
      log(`[${nowStr()}] ⛔ ĐÃ DỪNG KHẨN CẤP TOÀN BỘ ÂM THANH.`);
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
        cues = JSON.parse(JSON.stringify(DEFAULT_CUES)).filter((cue) => cue.id !== '00');
        localStorage.removeItem('cue_configs_v2');
        renderSettingsModal();
        syncMasterVolumeToCue();
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
        if (isBackupPlaying) return;
        triggerCue(currentCueIndex);
      } else if (e.code === 'Escape') {
        e.preventDefault();
        stopCurrentAudio();
        log(`[${nowStr()}] ⛔ ESC: ĐÃ DỪNG KHẨN CẤP TOÀN BỘ ÂM THANH.`);
        updateUI();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        if (isPlaying) {
          const cue = cues[currentCueIndex];
          const wasBackupPlaying = isBackupPlaying;
          const fadeDuration = isBackupPlaying
            ? BACKUP_CUE.manualFadeOut
            : (cue.id === '04' ? (cue.stage3 ? cue.stage3.fadeOutDuration : 2.8) : (cue.manualFadeOut || 2.0));
          fadeAndStop(fadeDuration, () => {
            if (wasBackupPlaying) updateUI();
            else advanceToNextCue();
          });
        }
      } else if (e.code === 'ArrowLeft') {
        if (!isPlaying && currentCueIndex > 0) {
          currentCueIndex--;
          stage4Current = 1;
          syncMasterVolumeToCue();
          updateUI();
        }
      } else if (e.code === 'ArrowRight') {
        if (!isPlaying && currentCueIndex < cues.length - 1) {
          currentCueIndex++;
          stage4Current = 1;
          syncMasterVolumeToCue();
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
      try {
        return JSON.parse(saved).filter((cue) => cue.id !== '00' && cue.id !== '02');
      } catch (e) {}
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
