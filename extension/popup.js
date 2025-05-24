document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submitBtn');
  const questionInput = document.getElementById('questionInput');
  const answerOutput = document.getElementById('answerOutput');
  let controller = null;

  // Health check on startup
  checkBackendHealth();

  async function checkBackendHealth() {
    try {
      const response = await fetch('https://chat-bot-rdi5.onrender.com/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        answerOutput.textContent = 'Backend is unavailable. Try again later.';
        submitBtn.disabled = true;
      }
    } catch (error) {
      console.error('Health check failed:', error);
      answerOutput.textContent = 'Cannot connect to server. Check your internet.';
      submitBtn.disabled = true;
    }
  }

  submitBtn.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    
    if (!question) {
      answerOutput.textContent = 'Please enter a question';
      return;
    }

    // Clear any previous timeout and abort previous request
    if (controller) {
      controller.abort();
    }
    controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      answerOutput.innerHTML = `
        <strong>Error:</strong> Request timed out<br>
        <small>The server took too long to respond</small>
      `;
      submitBtn.disabled = false;
    }, 10000); // 10 second timeout

    answerOutput.textContent = 'Thinking...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://chat-bot-rdi5.onrender.com/answer-mcq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      answerOutput.innerHTML = data.answer 
        ? data.answer.replace(/\n/g, '<br>') 
        : 'No answer could be generated';
      
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error:', error);
      
      if (error.name === 'AbortError') {
        answerOutput.innerHTML = `
          <strong>Error:</strong> Request took too long<br>
          <small>Try a simpler question or try again later</small>
        `;
      } else {
        answerOutput.innerHTML = `
          <strong>Error:</strong> ${error.message || 'Failed to get answer'}<br>
          <small>${error.message.includes('500') ? 'Server issue' : 'Check console'}</small>
        `;
      }
    } finally {
      submitBtn.disabled = false;
      controller = null;
    }
  });

  // Add event listener for Enter key
  questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitBtn.click();
    }
  });
});