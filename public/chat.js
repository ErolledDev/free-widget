// Business Chat Widget Implementation
(function() {
  // Ensure the script only runs once
  if (window._businessChatInitialized) return;
  window._businessChatInitialized = true;

  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'business-chat-widget';
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.right = '20px';
  widget.style.zIndex = '999999';
  widget.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  
  let isExpanded = false;
  let messages = [];
  let isProcessingQuestion = false;
  let currentConfig = null;
  let usedQuestions = new Set(); // Track used questions
  let hasShownClosingMessage = false; // Track if closing message was shown
  
  // Create animations and styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes typingAnimation {
      0% { opacity: 0.3; }
      50% { opacity: 1; }
      100% { opacity: 0.3; }
    }
    
    .chat-widget-container {
      animation: slideIn 0.3s ease forwards;
      transform: translateZ(0);
      backface-visibility: hidden;
      -webkit-font-smoothing: antialiased;
      will-change: transform;
    }
    
    .chat-bubble {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s ease;
      will-change: transform;
    }
    
    .chat-bubble:hover {
      transform: scale(1.05);
    }
    
    .chat-window {
      width: 360px;
      height: 520px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      will-change: transform;
    }
    
    .chat-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      scroll-behavior: smooth;
    }

    .message-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 80%;
      animation: fadeIn 0.3s ease;
      transform: translateZ(0);
    }

    .message-container.user {
      align-self: flex-end;
    }

    .message-container.bot {
      align-self: flex-start;
    }

    .message {
      padding: 12px 16px;
      border-radius: 16px;
      position: relative;
      word-wrap: break-word;
    }

    .message.user {
      background: var(--theme-color);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message.bot {
      background: #f3f4f6;
      color: #1f2937;
      border-bottom-left-radius: 4px;
    }

    .message-time {
      font-size: 12px;
      color: #9ca3af;
      margin: 0 4px;
    }

    .message-time.user {
      text-align: right;
    }

    .message-time.bot {
      text-align: left;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: #f3f4f6;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      width: fit-content;
      margin-top: 8px;
    }

    .typing-dot {
      width: 6px;
      height: 6px;
      background: #9ca3af;
      border-radius: 50%;
    }

    .typing-dot:nth-child(1) { animation: typingAnimation 1s infinite 0s; }
    .typing-dot:nth-child(2) { animation: typingAnimation 1s infinite 0.2s; }
    .typing-dot:nth-child(3) { animation: typingAnimation 1s infinite 0.4s; }

    .quick-questions {
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }

    .quick-question-btn {
      padding: 8px 16px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      text-align: left;
      transition: all 0.2s ease;
      color: #374151;
      display: inline-block;
      max-width: 100%;
      width: auto;
      white-space: normal;
      word-wrap: break-word;
      position: relative;
      overflow: hidden;
    }

    .quick-question-btn:not(:disabled):hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }

    .quick-question-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    .close-button {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }
    
    .close-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .closing-message {
      padding: 16px;
      background: #f3f4f6;
      border-radius: 12px;
      margin: 16px;
      text-align: center;
      animation: fadeIn 0.5s ease;
    }

    .closing-action-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
      padding: 8px 16px;
      background: var(--theme-color);
      color: white;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.2s ease;
    }

    .closing-action-button:hover {
      opacity: 0.9;
    }
  `;
  document.head.appendChild(styleSheet);

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function showTypingIndicator() {
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) return;

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingIndicator;
  }

  function showClosingMessage() {
    if (hasShownClosingMessage) return;
    
    const config = window.businessChatConfig || {};
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) return;

    const closingMessage = document.createElement('div');
    closingMessage.className = 'closing-message';
    closingMessage.innerHTML = `
      <p>${config.messageClosing || 'To continue chatting please reach us via the link below:'}</p>
      <a href="${config.messageClosingActionUrl || '#'}" target="_blank" class="closing-action-button">
        ${config.messageClosingActionButton || 'Contact Us'}
      </a>
    `;
    messagesContainer.appendChild(closingMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    hasShownClosingMessage = true;
  }

  function autoReply(question) {
    if (isProcessingQuestion) return;
    isProcessingQuestion = true;

    const config = window.businessChatConfig || {};
    const matchingQuestion = config.quickQuestions?.find(q => q.question === question);
    
    if (matchingQuestion) {
      const buttons = document.querySelectorAll('.quick-question-btn');
      buttons.forEach(btn => btn.disabled = true);

      const time = formatTime(new Date());
      
      messages.push({
        content: question,
        type: 'user',
        time: time
      });

      const messagesContainer = document.querySelector('.chat-messages');
      if (messagesContainer) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-container user';
        messageElement.innerHTML = `
          <div class="message user">${question}</div>
          <div class="message-time user">${time}</div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      const typingIndicator = showTypingIndicator();

      // Add the question to used questions set
      usedQuestions.add(question);

      setTimeout(() => {
        if (typingIndicator) {
          typingIndicator.remove();
        }

        const botResponseTime = formatTime(new Date());
        messages.push({
          content: matchingQuestion.answer,
          type: 'bot',
          time: botResponseTime
        });

        if (messagesContainer) {
          const botMessageElement = document.createElement('div');
          botMessageElement.className = 'message-container bot';
          botMessageElement.innerHTML = `
            <div class="message bot">${matchingQuestion.answer}</div>
            <div class="message-time bot">${botResponseTime}</div>
          `;
          messagesContainer.appendChild(botMessageElement);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        buttons.forEach(btn => btn.disabled = false);
        isProcessingQuestion = false;

        // Update quick questions section after the bot response
        const quickQuestionsContainer = document.querySelector('.quick-questions');
        if (quickQuestionsContainer) {
          const remainingQuestions = config.quickQuestions?.filter(q => !usedQuestions.has(q.question)) || [];
          quickQuestionsContainer.innerHTML = remainingQuestions.map(q => `
            <button class="quick-question-btn" onclick="document.getElementById('business-chat-widget').dispatchEvent(new CustomEvent('quickQuestion', {detail: '${q.question.replace(/'/g, "\\'")}'}))">
              ${q.question}
            </button>
          `).join('');

          // Show closing message only if no questions remain
          if (remainingQuestions.length === 0) {
            quickQuestionsContainer.style.display = 'none';
            setTimeout(() => {
              showClosingMessage();
            }, 1000);
          }
        }
      }, 1500);
    }
  }

  function renderBubble(config = {}) {
    const color = config.colorScheme || '#4f46e5';
    return `
      <div class="chat-widget-container">
        <div class="chat-bubble" style="background: ${color}">
          ${config.image ? 
            `<img src="${config.image}" alt="${config.businessName || 'Chat'}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` :
            `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>`
          }
        </div>
      </div>
    `;
  }

  function renderChat() {
    const config = window.businessChatConfig || {};
    const color = config.colorScheme || '#4f46e5';
    document.documentElement.style.setProperty('--theme-color', color);

    const messagesHtml = messages.map(msg => `
      <div class="message-container ${msg.type}">
        <div class="message ${msg.type}">
          ${msg.content}
        </div>
        <div class="message-time ${msg.type}">${msg.time}</div>
      </div>
    `).join('');

    const remainingQuestions = config.quickQuestions?.filter(q => !usedQuestions.has(q.question)) || [];
    const quickQuestionsHtml = remainingQuestions.length > 0 ? `
      <div class="quick-questions">
        ${remainingQuestions.map(q => `
          <button class="quick-question-btn" onclick="document.getElementById('business-chat-widget').dispatchEvent(new CustomEvent('quickQuestion', {detail: '${q.question.replace(/'/g, "\\'")}'}))">
            ${q.question}
          </button>
        `).join('')}
      </div>
    ` : '';

    return `
      <div class="chat-widget-container">
        <div class="chat-window">
          <div class="chat-header" style="background: ${color}; color: white; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0;">
              ${config.image ? 
                `<img src="${config.image}" alt="${config.businessName || 'Chat'}" style="width: 100%; height: 100%; object-fit: cover;">` :
                `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-center;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>`
              }
            </div>
            <div style="flex-grow: 1;">
              <div style="font-weight: 600; font-size: 16px;">${config.businessName || 'Chat'}</div>
              <div style="font-size: 14px; opacity: 0.9;">Online</div>
            </div>
            <button class="close-button" onclick="event.stopPropagation(); document.getElementById('business-chat-widget').dispatchEvent(new CustomEvent('toggleChat'));">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="chat-messages">
            ${messagesHtml}
            ${hasShownClosingMessage ? `
              <div class="closing-message">
                <p>${config.messageClosing || 'To continue chatting please reach us via the link below:'}</p>
                <a href="${config.messageClosingActionUrl || '#'}" target="_blank" class="closing-action-button">
                  ${config.messageClosingActionButton || 'Contact Us'}
                </a>
              </div>
            ` : ''}
          </div>
          ${remainingQuestions.length > 0 ? quickQuestionsHtml : ''}
        </div>
      </div>
    `;
  }

  // Initial render
  widget.innerHTML = renderBubble(window.businessChatConfig || {});
  document.body.appendChild(widget);

  // Handle toggling
  widget.addEventListener('click', () => {
    if (!isExpanded) {
      if (messages.length === 0) {
        const time = formatTime(new Date());
        messages.push({
          content: window.businessChatConfig?.welcomeMessage || 'Welcome! How can I help you today?',
          type: 'bot',
          time: time
        });
      }
      widget.innerHTML = renderChat();
    }
    isExpanded = true;
  });

  widget.addEventListener('toggleChat', () => {
    widget.innerHTML = renderBubble(window.businessChatConfig || {});
    isExpanded = false;
  });

  widget.addEventListener('quickQuestion', (e) => {
    if (!isProcessingQuestion) {
      autoReply(e.detail);
    }
  });

  // Watch for configuration changes
  let configUpdateTimeout;
  const updateInterval = setInterval(() => {
    const newConfig = window.businessChatConfig || {};
    const newConfigString = JSON.stringify(newConfig);
    
    if (JSON.stringify(currentConfig) !== newConfigString) {
      currentConfig = JSON.parse(newConfigString);
      
      // Debounce updates
      clearTimeout(configUpdateTimeout);
      configUpdateTimeout = setTimeout(() => {
        if (isExpanded) {
          const messagesContainer = document.querySelector('.chat-messages');
          const scrollPosition = messagesContainer ? messagesContainer.scrollTop : 0;
          
          widget.innerHTML = renderChat();
          
          if (messagesContainer) {
            messagesContainer.scrollTop = scrollPosition;
          }
        } else {
          widget.innerHTML = renderBubble(currentConfig);
        }
      }, 100);
    }
  }, 100);

  // Cleanup
  window.addEventListener('unload', () => {
    clearInterval(updateInterval);
    clearTimeout(configUpdateTimeout);
  });

  // Reset chat state when the page visibility changes (refresh or tab close)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      messages = [];
      usedQuestions = new Set();
      hasShownClosingMessage = false;
      isExpanded = false;
    }
  });
})();