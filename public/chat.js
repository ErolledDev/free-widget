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
  
  // Apply configuration
  const widgetHtml = `
    <div style="
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      width: 300px;
      font-family: system-ui, -apple-system, sans-serif;
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
        <div>
          <div style="font-weight: 600;">${config.businessName || 'Business Chat'}</div>
        </div>
      </div>
      <div style="padding: 16px;">
        <p style="margin: 0 0 16px;">${config.welcomeMessage || 'Welcome! How can we help you today?'}</p>
        ${config.socialLinks ? `
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
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
              ">
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
})();