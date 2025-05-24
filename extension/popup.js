document.getElementById('getAnswer').addEventListener('click', async () => {
  const question = document.getElementById('question').value;
  const optionA = document.getElementById('optionA').value;
  const optionB = document.getElementById('optionB').value;
  const optionC = document.getElementById('optionC').value;
  const optionD = document.getElementById('optionD').value;
  
  if (!question || !optionA || !optionB) {
    alert('Please provide at least a question and two options');
    return;
  }
  
  const options = [optionA, optionB];
  if (optionC) options.push(optionC);
  if (optionD) options.push(optionD);
  
  try {
    const response = await fetch('YOUR_RENDER_BACKEND_URL/answer-mcq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, options }),
    });
    
    const data = await response.json();
    document.getElementById('answer').innerHTML = `<strong>Answer:</strong> ${data.answer}`;
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('answer').textContent = 'Failed to get answer. Please try again.';
  }
});