document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submitBtn');
  const questionInput = document.getElementById('questionInput');
  const answerOutput = document.getElementById('answerOutput');

  submitBtn.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    
    if (!question) {
      answerOutput.textContent = 'Please enter a question';
      return;
    }

    answerOutput.textContent = 'Thinking...';
    
    try {
      const response = await fetch('https://chat-bot-rdi5.onrender.com/answer-mcq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: question,
          options: [] // Empty array since we're not using options
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      answerOutput.innerHTML = data.answer || 'No answer could be generated';
      
    } catch (error) {
      console.error('Error:', error);
      answerOutput.innerHTML = `Error: ${error.message}<br>Please try again later.`;
    }
  });
});