let player;
const toggleBtn = document.getElementById("mainToggleBtn");
const wrapper = document.getElementById("ytWrapper");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const timeDisplay = document.getElementById("timeDisplay");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const volumeSlider = document.getElementById("volumeSlider");
const volIcon = document.getElementById("volIcon");

// Load YouTube API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player("ytPlayer", {
    height: "100%",
    width: "100%",
    videoId: "182JTFErO_o",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  wrapper.classList.remove("loading");
  setInterval(updateProgress, 100);
  player.setVolume(volumeSlider.value);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    // Sets the Font Awesome Pause icon
    toggleBtn.innerHTML = '<i class="bi bi-pause"></i>';
  } else {
    // Sets the Font Awesome Play icon
    toggleBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
  }
}

function updateProgress() {
  if (player && player.getCurrentTime) {
    const current = player.getCurrentTime();
    const total = player.getDuration();
    if (total > 0) {
      const pct = (current / total) * 100;
      progressBar.style.width = pct + "%";
      const format = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? "0" : ""}${sec}`;
      };
      timeDisplay.textContent = `${format(current)} / ${format(total)}`;
    }
  }
}

// Play/Pause Toggle
toggleBtn.addEventListener("click", () => {
  const state = player.getPlayerState();
  state === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
});

function updateVolumeSliderFill(slider) {
  const min = Number(slider.min || 0);
  const max = Number(slider.max || 100);
  const val = Number(slider.value);
  const pct = ((val - min) / (max - min)) * 100;

  slider.style.background = `linear-gradient(
    to right,
    #ff0000 0%,
    #ff0000 ${pct}%,
    #ffffff ${pct}%,
    #ffffff 100%
  )`;
}

// Volume Control
volumeSlider.addEventListener("input", (e) => {
  const val = Number(e.target.value);
  player.setVolume(val);

  updateVolumeSliderFill(e.target);

  volIcon.className = `bi ${
    val === 0
      ? "bi-volume-mute-fill"
      : val < 50
      ? "bi-volume-down-fill"
      : "bi-volume-up-fill"
  }`;
});

// Seek Functionality
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  player.seekTo(pos * player.getDuration());
});

// Fullscreen Toggle Logic
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    wrapper.requestFullscreen().catch((err) => alert(err.message));
  } else {
    document.exitFullscreen();
  }
});

// Update Fullscreen Button Icon
const fullscreenIcon = document.getElementById("fullscreenIcon");

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    fullscreenIcon.className = "bi bi-fullscreen-exit";
    fullscreenBtn.title = "Exit Fullscreen";
  } else {
    fullscreenIcon.className = "bi bi-fullscreen";
    fullscreenBtn.title = "Enter Fullscreen";
  }
});

// play and pause when clicking directly on the video area
const ytFrameContainer = document.querySelector(".yt-frame-container");

ytFrameContainer.addEventListener("click", () => {
  if (player && player.getPlayerState) {
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }
});

// --- Translation Logic ---
const buttons = {
  English: document.getElementById("englishButton"),
  Hindi: document.getElementById("hindiButton"),
  Gujrati: document.getElementById("gujaratiButton"),
};

Object.keys(buttons).forEach((lang) => {
  buttons[lang].addEventListener("click", () => updateText(lang));
});

function updateText(language) {
  const h1 = document.querySelector("nav h1");
  // Fallback dictionary
  const fallbacks = {
    English: "Jal Pooja",
    Hindi: "जल पूजा",
    Gujrati: "જળ પૂજા",
  };

  fetch("new1/json/data.json")
    .then((res) => res.json())
    .then((data) => {
      if (data[language]) h1.textContent = data[language].title;
    })
    .catch(() => {
      h1.textContent = fallbacks[language];
    });
}
