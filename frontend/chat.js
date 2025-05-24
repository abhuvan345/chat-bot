async function sendMessage() {
  const input = document.getElementById('userInput');
  const msgBox = document.getElementById('messages');
  const userMsg = input.value.trim();
  if (!userMsg) return;

  msgBox.innerHTML += `<div><b>You:</b> ${userMsg}</div>`;
  input.value = "";

  const response = await fetch("https://your-backend.onrender.com/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userMsg })
  });

  const data = await response.json();
  msgBox.innerHTML += `<div><b>Gemini:</b> ${data.reply}</div>`;
}
