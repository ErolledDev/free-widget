// Chat Widget Implementation
(function() {
  const config = window.businessChatConfig || {};
  
  // Create widget container
  const widget = document.createElement('div');
  widget.id = 'business-chat-widget';
  widget.style.position = 'fixed';
  widget.style.bottom = '20px';
  widget.style.right = '20px';
  widget.style.zIndex = '9999';
  
  // Create ping animation keyframes
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }
    @keyframes bounce {
      0%, 100% {
        transform: translateY(-25%);
        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
      }
      50% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
      }
    }
  `;
  document.head.appendChild(styleSheet);
  
  // Apply configuration
  const widgetHtml = `
    <div style="
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      width: 300px;
      font-family: system-ui, -apple-system, sans-serif;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease-out;
    ">
      <div style="
        background: ${config.colorScheme || '#4f46e5'};
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
      ">
        ${config.image ? 
          `<img src="${config.image}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` :
          `<div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-center;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
           </div>`
        }
        <div style="flex-grow: 1;">
          <div style="font-weight: 600;">${config.businessName || 'Business Chat'}</div>
        </div>
      </div>
      <div style="
        padding: 16px;
        display: flex;
        gap: 16px;
        align-items: flex-start;
        justify-content: space-between;
      ">
        <div style="flex: 1; position: relative;">
          <div style="
            position: absolute;
            top: 0;
            left: -6px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #ef4444;
          "></div>
          <div style="
            position: absolute;
            top: 0;
            left: -6px;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #ef4444;
            animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <p style="
            margin: 0;
            padding-left: 8px;
            color: #374151;
            font-size: 14px;
          ">${config.welcomeMessage || 'Welcome! How can we help you today?'}</p>
        </div>
        ${config.socialLinks && config.socialLinks.length > 0 ? `
          <div style="
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 120px;
          ">
            ${config.socialLinks.map(platform => `
              <a href="${platform.url}" target="_blank" style="
                padding: 8px 12px;
                background: ${config.colorScheme || '#4f46e5'};
                color: white;
                text-decoration: none;
                border-radius: 6px;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: transform 0.2s ease;
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'">
                <span>${platform.name}</span>
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  widget.innerHTML = widgetHtml;
  document.body.appendChild(widget);

  // Animate widget entrance
  setTimeout(() => {
    const widgetElement = widget.firstElementChild;
    if (widgetElement) {
      widgetElement.style.opacity = '1';
      widgetElement.style.transform = 'translateY(0)';
    }
  }, 100);

  // Update widget when config changes
  const updateWidget = () => {
    const newConfig = window.businessChatConfig || {};
    const widgetElement = document.getElementById('business-chat-widget');
    if (widgetElement) {
      widgetElement.innerHTML = widgetHtml;
    }
  };

  // Watch for configuration changes
  let lastConfig = JSON.stringify(config);
  setInterval(() => {
    const currentConfig = JSON.stringify(window.businessChatConfig);
    if (currentConfig !== lastConfig) {
      lastConfig = currentConfig;
      updateWidget();
    }
  }, 100);
})();