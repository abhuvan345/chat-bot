document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
});

async function sendMessage() {
  const input = document.getElementById('userInput');
  const msgBox = document.getElementById('messages');
  const userMsg = input.value.trim();
  if (!userMsg) return;

  msgBox.innerHTML += `<div><b>You:</b> ${userMsg}</div>`;
  input.value = "";

  try {
    const response = await fetch("https://chat-bot-rdi5.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMsg })
    });

    const data = await response.json();
    if (data.reply) {
      msgBox.innerHTML += `<div><b>Gemini:</b> ${data.reply}</div>`;
    } else {
      msgBox.innerHTML += `<div><b>Gemini:</b> (No response)</div>`;
      console.error("Unexpected backend response:", data);
    }
  } catch (err) {
    msgBox.innerHTML += `<div><b>Error:</b> ${err.message}</div>`;
  }
}
