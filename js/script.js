// Плавный скролл для кнопки "Наверх"
(function () {
  var links = document.querySelectorAll(".to-top-link");
  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var rect = target.getBoundingClientRect();
      var offset = window.pageYOffset + rect.top - 70;
      window.scrollTo({ top: offset, behavior: "smooth" });
    });
  });
})();

// Минималистичные плееры с таймлайном
(function () {
  var lines = document.querySelectorAll(".audio-line");
  var current = null;

  function formatTime(sec) {
    sec = Math.floor(sec || 0);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ":" + (s < 10 ? "0" + s : s);
  }

  lines.forEach(function (line) {
    var audio = line.querySelector("audio");
    var btn = line.querySelector(".audio-line-btn");
    var timeLabel = line.querySelector(".audio-line-time");
    var progress = line.querySelector(".audio-progress");
    var fill = line.querySelector(".audio-progress-fill");
    if (!audio || !btn || !timeLabel || !progress || !fill) return;

    // Метаданные
    audio.addEventListener("loadedmetadata", function () {
      timeLabel.textContent = formatTime(0);
      fill.style.width = "0%";
    });

    // Обновление таймлайна и времени
    audio.addEventListener("timeupdate", function () {
      if (isFinite(audio.duration) && audio.duration > 0) {
        var percent = (audio.currentTime / audio.duration) * 100;
        fill.style.width = percent + "%";
      }
      timeLabel.textContent = formatTime(audio.currentTime);
    });

    // Клик по таймлайну — перемотка
    progress.addEventListener("click", function (e) {
      if (!isFinite(audio.duration) || audio.duration <= 0) return;
      var rect = progress.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var ratio = Math.min(Math.max(x / rect.width, 0), 1);
      audio.currentTime = ratio * audio.duration;
    });

    // Play / Pause
    btn.addEventListener("click", function () {
      // Останавливаем предыдущий трек
      if (current && current !== audio) {
        current.pause();
        if (current._btn) current._btn.classList.remove("is-playing");
      }

      if (audio.paused) {
        audio.play();
        btn.classList.add("is-playing");
        current = audio;
        audio._btn = btn;
      } else {
        audio.pause();
        btn.classList.remove("is-playing");
        if (current === audio) current = null;
      }
    });

    // Когда трек закончился
    audio.addEventListener("ended", function () {
      btn.classList.remove("is-playing");
      if (isFinite(audio.duration) && audio.duration > 0) {
        fill.style.width = "100%";
        timeLabel.textContent = formatTime(audio.duration);
      }
      if (current === audio) current = null;
    });
  });
})();