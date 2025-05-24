(async () => {
  if (document.getElementById('gemini-chat-container')) return;

  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('chat.html');
  iframe.id = 'gemini-chat-container';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.width = '300px';
  iframe.style.height = '400px';
  iframe.style.zIndex = '99999';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '12px';
  iframe.style.boxShadow = '0 0 12px rgba(0,0,0,0.2)';
  document.body.appendChild(iframe);
})();
