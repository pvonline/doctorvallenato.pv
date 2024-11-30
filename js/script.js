
/* ------ Inicio Reloj Digital ------*/

const $tiempo = document.querySelector('.tiempo'),
$fecha = document.querySelector('.fecha');

function digitalClock(){
    let f = new Date(),
    dia = f.getDate(),
    mes = f.getMonth() + 1,
    anio = f.getFullYear(),
    diaSemana = f.getDay();

    dia = ('0' + dia).slice(-2);
    mes = ('0' + mes).slice(-2)

    let timeString = f.toLocaleTimeString();
    $tiempo.innerHTML = timeString;

    let semana = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
    let showSemana = (semana[diaSemana]);
    $fecha.innerHTML = `${showSemana}  ${dia}-${mes}-${anio}`
}
setInterval(() => {
    digitalClock()
}, 1000);
/* ------ Final Reloj Digital -------*/


/*----- INICIO REPRODUCTOR webSim.AI - RAYAS ANCHAS 02-------*/

document.addEventListener('DOMContentLoaded', function() {
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = 'https://stream.zeno.fm/v5ecixm4fvduv';
      audio.autoplay = true; // Add autoplay attribute
      
      const playPauseBtn = document.querySelector('.play-pause-btn');
      const volumeSlider = document.querySelector('.volume-slider');
      const metadataDisplay = document.querySelector('.metadata');
  
      audio.volume = 0.7;
  
      let audioContext;
      let analyser;
      
      // Initialize audio context
      function initAudio() {
          if (!audioContext) {
              audioContext = new (window.AudioContext || window.webkitAudioContext)();
              analyser = audioContext.createAnalyser();
              const source = audioContext.createMediaElementSource(audio);
              source.connect(analyser);
              analyser.connect(audioContext.destination);
              
              analyser.fftSize = 256;
              const bufferLength = analyser.frequencyBinCount;
              const dataArray = new Uint8Array(bufferLength);
              
              function animate() {
                  requestAnimationFrame(animate);
                  analyser.getByteFrequencyData(dataArray);
                  
                  const bars = document.querySelectorAll('.bar');
                  for (let i = 0; i < bars.length; i++) {
                      const value = dataArray[i];
                      const scale = value / 128;
                      bars[i].style.transform = `scaleY(${scale})`;
                  }
              }
              
              animate();
          }
      }
  
      // Function to handle autoplay
      const startPlayback = async () => {
          try {
              await audioContext.resume();
              const playPromise = audio.play();
              
              if (playPromise !== undefined) {
                  playPromise.then(() => {
                      playPauseBtn.classList.add('playing');
                      console.log('Autoplay started successfully');
                  }).catch(error => {
                      console.log('Autoplay prevented:', error);
                      // Add visual indication that user needs to click
                      playPauseBtn.style.animation = "pulse 2s infinite";
                  });
              }
          } catch (error) {
              console.log("Autoplay error:", error);
          }
      };
  
      // Initialize audio and attempt autoplay
      const initializeAudioPlayback = async () => {
          initAudio();
          await startPlayback();
      };
  
      // Call initialization immediately
      initializeAudioPlayback();
  
      // Handle user interaction
      document.addEventListener('click', async () => {
          if (audioContext && audioContext.state === 'suspended') {
              await audioContext.resume();
          }
      });
  
      // Enhanced play/pause button functionality
      playPauseBtn.addEventListener('click', async () => {
          try {
              if (audio.paused) {
                  await audioContext.resume();
                  await audio.play();
                  playPauseBtn.classList.add('playing');
              } else {
                  audio.pause();
                  playPauseBtn.classList.remove('playing');
              }
          } catch (error) {
              console.error("Playback error:", error);
          }
      });
  
      // Volume control
      volumeSlider.addEventListener('input', (e) => {
          audio.volume = e.target.value / 100;
      });
  
      // Error handling
      audio.addEventListener('error', (e) => {
          console.error('Audio loading error:', e);
          audio.load();
          audio.play().catch(err => console.error('Replay attempt failed:', err));
      });
  
      // Handle stream end
      audio.addEventListener('ended', () => {
          audio.load();
          audio.play().catch(err => console.error('Stream restart failed:', err));
      });
  
      // Metadata updates
      function updateMetadata() {
          fetch('https://stream.zeno.fm/v5ecixm4fvduv/metadata')
              .then(response => response.text())
              .then(data => {
                  metadataDisplay.textContent = data;
              })
              .catch(error => {
                  console.error('Error fetching metadata:', error);
              });
      }
  
      setInterval(updateMetadata, 5000);
  });
/*----- FINAL REPRODUCTOR webSim.AI - RAYAS ANCHAS 02 -------*/



/*----- INICIO Reproductor webSim.AI - NEGRO 01-------*
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audio = new Audio();
audio.crossOrigin = "anonymous";
audio.src = 'https://stream.zeno.fm/v5ecixm4fvduv';

const playButton = document.getElementById('playButton');
const volumeSlider = document.getElementById('volumeSlider');

// Set initial volume
audio.volume = volumeSlider.value / 100;

// Volume slider event listener
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
});

// Explicitly set autoplay and preload
audio.autoplay = true;
audio.preload = "auto";

// Enhanced play attempt function with more robust error handling
const attemptPlay = async () => {
    try {
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        // Force unmute
        audio.muted = false;
        
        // Set volume before playing
        audio.volume = volumeSlider.value / 100;
        
        const playPromise = await audio.play();
        playButton.innerHTML = '<span class="pause-icon"></span>';
        console.log('Playback started successfully');
        
        return playPromise;
    } catch (error) {
        console.error('Playback failed:', error);
        playButton.innerHTML = '<span class="play-icon"></span>';
        // Retry after a short delay
        setTimeout(attemptPlay, 1000);
    }
};

// Immediate autoplay attempt when page loads
window.addEventListener('load', () => {
    console.log('Page loaded, attempting autoplay...');
    attemptPlay();
});

// Play/Pause button functionality
playButton.addEventListener('click', () => {
    if (audio.paused) {
        attemptPlay();
    } else {
        audio.pause();
        playButton.innerHTML = '<span class="play-icon"></span>';
    }
});

// Add multiple event listeners to handle autoplay
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, attempting autoplay...');
    attemptPlay();
});

// Try to play on any user interaction
const tryPlayOnInteraction = async () => {
    if (audio.paused) {
        await attemptPlay();
        // Only remove listeners after successful playback
        if (!audio.paused) {
            document.removeEventListener('click', tryPlayOnInteraction);
            document.removeEventListener('touchstart', tryPlayOnInteraction);
        }
    }
};

document.addEventListener('click', tryPlayOnInteraction);
document.addEventListener('touchstart', tryPlayOnInteraction);

// Add visibility change handler
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audio.paused) {
        attemptPlay();
    }
});

// Add connection recovery
window.addEventListener('online', () => {
    if (audio.paused) {
        attemptPlay();
    }
});

// Enhanced error recovery
audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    setTimeout(() => {
        audio.src = 'https://stream.zeno.fm/v5ecixm4fvduv';
        audio.load();
        attemptPlay();
    }, 1000);
});

audio.addEventListener('stalled', () => {
    console.log('Stream stalled, attempting recovery...');
    audio.load();
    attemptPlay();
});

audio.addEventListener('waiting', () => {
    console.log('Stream buffering...');
});

// More frequent periodic check to ensure playback
setInterval(() => {
    if (audio.paused && audioContext.state !== 'suspended') {
        console.log('Periodic check: Attempting to resume playback');
        attemptPlay();
    }
}, 3000);

// Additional handler for mobile devices
document.addEventListener('touchend', () => {
    if (audio.paused) {
        attemptPlay();
    }
}, { once: true });

// Force play attempt after a short delay
setTimeout(attemptPlay, 500);
/*----- FINAL Reproductor webSim.AI - NEGRO 01-------*/



