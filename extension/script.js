document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("userInput");
  const msgBox = document.getElementById("messages");

  const apiKey = "AIzaSyCp-jn8jawHuLXqtkMf69lXpTwnM_o2tHw"; // Replace with your actual API key
  const model = "models/gemini-2.0-flash"; // Correct model

  sendBtn.addEventListener("click", async () => {
    const userMsg = input.value.trim();
    if (!userMsg) return;

    msgBox.innerHTML += `<div><b>You:</b> ${userMsg}</div>`;
    input.value = "";

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${userMsg}\nOnly give the correct option (like "C. Python") in a single line with no explanation.`
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.error.message}`);
      }

      const data = await response.json();
      let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Clean and condense to one line, remove Markdown characters
      reply = reply
        .replace(/\n/g, " ")     // Remove line breaks
        .replace(/\*+/g, "")     // Remove asterisks
        .replace(/\s\s+/g, " ")  // Collapse multiple spaces
        .trim();                 // Trim surrounding whitespace

      if (reply) {
        msgBox.innerHTML += `<div><b>Gemini:</b> ${reply}</div>`;
      } else {
        msgBox.innerHTML += `<div><b>Gemini:</b> (No response)</div>`;
        console.log("Full response:", data);
      }
    } catch (err) {
      msgBox.innerHTML += `<div><b>Error:</b> ${err.message}</div>`;
      console.error(err);
    }
  });
});
