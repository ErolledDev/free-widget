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
  
  // Create animations and styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .chat-widget-container {
      animation: slideIn 0.3s ease forwards;
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
    }
    
    .chat-bubble:hover {
      transform: scale(1.05);
    }
    
    .chat-window {
      width: 360px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }
    
    .chat-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .chat-content {
      padding: 16px;
    }
    
    .social-links {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .social-link {
      padding: 8px 16px;
      border-radius: 8px;
      color: white;
      text-decoration: none;
      font-size: 14px;
      transition: opacity 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .social-link:hover {
      opacity: 0.9;
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
  `;
  document.head.appendChild(styleSheet);

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

  function renderExpandedChat(config = {}) {
    const color = config.colorScheme || '#4f46e5';
    return `
      <div class="chat-widget-container">
        <div class="chat-window">
          <div class="chat-header" style="background: ${color}; color: white;">
            <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0;">
              ${config.image ? 
                `<img src="${config.image}" alt="${config.businessName || 'Chat'}" style="width: 100%; height: 100%; object-fit: cover;">` :
                `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
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
          <div class="chat-content">
            <div style="display: flex; gap: 16px; align-items: flex-start;">
              <div style="flex: 1;">
                <p style="margin: 0; color: #1f2937; line-height: 1.5;">
                  ${config.welcomeMessage || 'Welcome! How can we help you today?'}
                </p>
              </div>
              ${config.socialLinks && config.socialLinks.length > 0 ? `
                <div class="social-links">
                  ${config.socialLinks.map(platform => `
                    <a 
                      href="${platform.url}" 
                      target="_blank"
                      rel="noopener noreferrer" 
                      class="social-link"
                      style="background: ${color}"
                    >
                      ${platform.name}
                    </a>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
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
      widget.innerHTML = renderExpandedChat(window.businessChatConfig || {});
    }
    isExpanded = true;
  });

  widget.addEventListener('toggleChat', () => {
    widget.innerHTML = renderBubble(window.businessChatConfig || {});
    isExpanded = false;
  });

  // Watch for configuration changes
  let lastConfig = JSON.stringify(window.businessChatConfig || {});
  const updateInterval = setInterval(() => {
    const currentConfig = window.businessChatConfig || {};
    const currentConfigString = JSON.stringify(currentConfig);
    
    if (currentConfigString !== lastConfig) {
      lastConfig = currentConfigString;
      widget.innerHTML = isExpanded ? 
        renderExpandedChat(currentConfig) : 
        renderBubble(currentConfig);
    }
  }, 100);

  // Cleanup
  window.addEventListener('unload', () => {
    clearInterval(updateInterval);
  });
})();