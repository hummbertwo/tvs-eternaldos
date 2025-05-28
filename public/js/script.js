const API_KEY = '865eee93fe9fc60142d6b7b1b21ea4ea';

const elements = {
  weatherIcon: document.getElementById("weatherIcon"),
  temperature: document.getElementById("temperature"),
  date: document.getElementById("date"),
  day: document.getElementById("day"),
  time: document.getElementById("time"),
  footer: document.getElementById("footer"),
  protected: document.getElementById("protected-content")
};

document.getElementById("loginBtn").addEventListener("click", () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass })
  }).then(res => {
    if (res.ok) {
      document.getElementById("login-screen").style.display = "none";
      elements.protected.style.display = "block";
      init();
    } else {
      document.getElementById("login-error").style.display = "block";
    }
  });
});

fetch('/api/session').then(res => res.json()).then(data => {
  if (data.loggedIn) {
    loadVideoFromBackend();
    document.getElementById("login-screen").style.display = "none";
    elements.protected.style.display = "block";
    init();
  }
});

function loadVideoFromBackend() {
  fetch('/api/video')
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        initYouTube(data.id);
      } else {
        console.error("No autorizado para ver el video");
      }
    });
}

function initYouTube(videoId) {
  player = new YT.Player('player', {
    videoId: videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      fs: 0,
      loop: 1,
      playlist: videoId,
      disablekb: 1,
    },
    events: {
      onReady: (event) => {
        const btn = document.getElementById("playButton");
        btn.addEventListener("click", () => {
          event.target.playVideo();
          btn.style.display = "none";
        });
      }
    }
  });
}


function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: '6OzLPSKrNMM',
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      fs: 0,
      loop: 1,
      playlist: '6OzLPSKrNMM',
      disablekb: 1,
    },
    events: {
      onReady: (event) => {
        const btn = document.getElementById("playButton");
        btn.addEventListener("click", () => {
          event.target.playVideo();
          btn.style.display = "none";
        });
      }
    }
  });
}

function toggleFooter() {
  elements.footer.classList.toggle("show");
}

async function getWeather() {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Monterrey,mx&appid=${API_KEY}&units=metric`);
    const data = await res.json();
    if (data.weather && data.weather[0]) {
      elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      elements.temperature.textContent = `${Math.round(data.main.temp)}°`;
    }
  } catch (err) {
    console.error("Clima error:", err);
  }
}

function updateDateTime() {
  const now = new Date();
  const opts = {
    timeZone: "America/Monterrey",
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  };

  const dateString = new Intl.DateTimeFormat("es-MX", opts).format(now).replace(/de |,/g, "").toUpperCase();
  const [weekday, day, month, year, time] = dateString.split(" ");
  elements.date.textContent = `${month} ${day}, ${year}`;
  elements.day.textContent = weekday;
  elements.time.textContent = time.toLowerCase();
}

function init() {
  getWeather();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  setInterval(getWeather, 600000);
  setTimeout(() => setInterval(toggleFooter, 20000), 5000);
}
