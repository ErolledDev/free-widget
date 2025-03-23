import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Settings2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  MessageCircle,
  Send,
  Phone,
  MessageSquare,
  Mail,
  Globe,
  MessagesSquare
} from 'lucide-react';
import { SocialPlatform, WidgetConfig } from './types';

function App() {
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<WidgetConfig>({
    businessName: '',
    colorScheme: '#4f46e5',
    image: '',
    welcomeMessage: '',
    socialLinks: []
  });

  const [selectedSocials, setSelectedSocials] = useState<SocialPlatform[]>([]);

  const socialPlatforms: SocialPlatform[] = [
    { name: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/' },
    { name: 'Messenger', icon: MessageCircle, placeholder: 'https://m.me/' },
    { name: 'WhatsApp', icon: Phone, placeholder: 'https://wa.me/' },
    { name: 'Telegram', icon: Send, placeholder: 'https://t.me/' },
    { name: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/' },
    { name: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/' },
    { name: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/' },
    { name: 'GitHub', icon: Github, placeholder: 'https://github.com/' },
    { name: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/' },
    { name: 'Viber', icon: MessageSquare, placeholder: 'viber://chat?number=' },
    { name: 'Line', icon: MessagesSquare, placeholder: 'https://line.me/ti/p/' },
    { name: 'Email', icon: Mail, placeholder: 'mailto:' },
    { name: 'Website', icon: Globe, placeholder: 'https://' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialToggle = (platform: SocialPlatform) => {
    const isSelected = selectedSocials.some(s => s.name === platform.name);
    if (isSelected) {
      setSelectedSocials(selectedSocials.filter(s => s.name !== platform.name));
    } else {
      setSelectedSocials([...selectedSocials, { ...platform, url: platform.placeholder }]);
    }
  };

  const updateSocialUrl = (platformName: string, url: string) => {
    setSelectedSocials(prev => 
      prev.map(social => 
        social.name === platformName 
          ? { ...social, url } 
          : social
      )
    );
  };

  const generateCode = () => {
    const configForScript = {
      ...config,
      socialLinks: selectedSocials.map(({ name, url }) => ({ name, url }))
    };
    return `<!-- Business Widget Installation Code -->
<script src="https://free-widget.netlify.app/chat.js"></script>
<script>
  window.businessChatConfig = ${JSON.stringify(configForScript, null, 2)};
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Settings2 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Business Widget Configurator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Widget Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={config.businessName}
                    onChange={(e) => setConfig(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Color Scheme</label>
                  <input
                    type="color"
                    className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={config.colorScheme}
                    onChange={(e) => setConfig(prev => ({ ...prev, colorScheme: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Icon</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Welcome Message</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    placeholder="Enter a welcome message for your visitors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
              <div className="space-y-6">
                {socialPlatforms.map((platform) => {
                  const isSelected = selectedSocials.some(s => s.name === platform.name);
                  const currentUrl = selectedSocials.find(s => s.name === platform.name)?.url || platform.placeholder;
                  
                  return (
                    <div key={platform.name} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={platform.name}
                          checked={isSelected}
                          onChange={() => handleSocialToggle(platform)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={platform.name} className="flex items-center space-x-2">
                          <platform.icon className="h-5 w-5" />
                          <span>{platform.name}</span>
                        </label>
                      </div>
                      {isSelected && (
                        <input
                          type="text"
                          value={currentUrl}
                          onChange={(e) => updateSocialUrl(platform.name, e.target.value)}
                          placeholder={`Enter your ${platform.name} URL`}
                          className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Widget Preview</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {config.image ? (
                      <img src={config.image} alt="Business Icon" className="w-16 h-16 rounded-full" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <Settings2 className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">{config.businessName || 'Your Business Name'}</h3>
                  <p className="text-gray-500 mt-2">{config.welcomeMessage || 'Welcome to our business!'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Installation Code</h2>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-50 rounded-md p-4 overflow-x-auto">
                <code className="text-sm text-gray-800">{generateCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;