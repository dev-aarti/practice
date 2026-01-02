let player;
const toggleBtn = document.getElementById("mainToggleBtn");
const wrapper = document.getElementById("ytWrapper");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const timeDisplay = document.getElementById("timeDisplay");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const volumeSlider = document.getElementById("volumeSlider");
const volIcon = document.getElementById("volIcon");

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
      autoplay: 1, // Start automatically since thumbnail is gone
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
  // Automatically sync the button icon
  if (event.data === YT.PlayerState.PLAYING) {
    toggleBtn.textContent = "⏸";
  } else {
    toggleBtn.textContent = "▶";
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

toggleBtn.addEventListener("click", () => {
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

volumeSlider.addEventListener("input", (e) => {
  const val = e.target.value;
  player.setVolume(val);
  volIcon.textContent = val == 0 ? "🔇" : val < 50 ? "🔉" : "🔊";
});

progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  progressBar.style.transition = "none";
  player.seekTo(pos * player.getDuration());
  setTimeout(() => {
    progressBar.style.transition = "width 0.1s linear";
  }, 50);
});

fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    wrapper.requestFullscreen().catch((err) => alert(err.message));
  } else {
    document.exitFullscreen();
  }
});
const englishButton = document.getElementById("englishButton");
const hindiButton = document.getElementById("hindiButton");
const gujaratiButton = document.getElementById("gujaratiButton");

// 1. Set Initial Language
updateText("English");

// 2. Add Event Listeners
englishButton.addEventListener("click", () => updateText("English"));
hindiButton.addEventListener("click", () => updateText("Hindi"));
gujaratiButton.addEventListener("click", () => updateText("Gujrati"));

function updateText(language) {
  // Use the correct path to your JSON file
  fetch("new1/json/data.json")
    .then((response) => {
      if (!response.ok) throw new Error("JSON file not found");
      return response.json();
    })
    .then((data) => {
      const langData = data[language];

      if (langData) {
        // Update Title (exists in your HTML)
        const h1 = document.querySelector("nav h1");
        if (h1) h1.textContent = langData.title;

        // Update Problems/Solutions ONLY if they exist in your JSON and HTML
        // This prevents errors if the card elements are missing
        const problemEl = document.querySelector(".card h2");
        if (problemEl && langData.problem) {
          problemEl.textContent = langData.problem;
        }

        const solutionEl = document.querySelector(".card .card2 h2");
        if (solutionEl && langData.solution) {
          solutionEl.textContent = langData.solution;
        }
      }
    })
    .catch((error) => {
      console.error("Translation Error:", error);
      // Fallback if fetch fails (useful for local testing)
      if (language === "Hindi")
        document.querySelector("nav h1").textContent = "जल पूजा";
      if (language === "Gujrati")
        document.querySelector("nav h1").textContent = "જળ પૂજા";
      if (language === "English")
        document.querySelector("nav h1").textContent = "Water Worship";
    });
}
