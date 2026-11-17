const textInput = document.getElementById("textInput");
const voiceSelect = document.getElementById("voice");
const speed = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");

const status = document.getElementById("status");

let audio = null;
let audioURL = null;

speed.addEventListener("input", () => {
    speedValue.textContent = speed.value + "x";

    if (audio) {
        audio.playbackRate = parseFloat(speed.value);
    }
});

playBtn.addEventListener("click", async () => {

    const text = textInput.value.trim();

    if (!text) {
        alert("দয়া করে আগে কিছু Text লিখুন।");
        return;
    }

    playBtn.disabled = true;
    downloadBtn.disabled = true;

    status.textContent = "⏳ AI Voice তৈরি হচ্ছে...";

    try {

        const response = await fetch(
            "http://localhost:3000/generate-voice",
            {
                method: "POST",

               headers: {
"Content-Type": "application/json",
"x-api-key": "45162fc0a3034f33a28acf9da36905cd"
},
                body: JSON.stringify({
                    text: text,
                    voice: voiceSelect.value
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();

            throw new Error(
                errorData.details ||
                errorData.error ||
                "Voice generation failed"
            );
        }

        const audioBlob = await response.blob();

        if (audioURL) {
            URL.revokeObjectURL(audioURL);
        }

        audioURL = URL.createObjectURL(audioBlob);

        audio = new Audio(audioURL);

        audio.playbackRate = parseFloat(speed.value);

        audio.onplay = () => {
            status.textContent = "🔊 Voice playing...";
            playBtn.textContent = "🔊 Playing...";
        };

        audio.onended = () => {
            status.textContent = "✅ Voice completed";
            playBtn.textContent = "▶️ Generate & Play";
            playBtn.disabled = false;
        };

        await audio.play();

        downloadBtn.disabled = false;

    } catch (error) {

        console.error(error);

        status.textContent = "❌ Error: " + error.message;

        playBtn.disabled = false;
    }
});

stopBtn.addEventListener("click", () => {

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    status.textContent = "⏹️ Voice stopped";

    playBtn.textContent = "▶️ Generate & Play";

    playBtn.disabled = false;
});

downloadBtn.addEventListener("click", () => {

    if (!audioURL) {
        alert("আগে Voice Generate করুন।");
        return;
    }

    const link = document.createElement("a");

    link.href = audioURL;

  link.download = "MyVoiceAI.wav";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
});

status.textContent = "Ready — আপনার Text লিখুন";
