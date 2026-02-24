import React, { useState, useRef, useEffect } from 'react';

// Reusable social sharing component for any content type
const SocialShare = ({ 
  title, 
  url, 
  contentType = 'content', // 'course', 'blog', 'career', etc.
  className = '',
  iconSize = 20
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const menuRef = useRef(null);
  
  // If URL is not provided, use current page URL
  const shareUrl = url || window.location.href;
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Function to get deep link for platforms that don't have direct web sharing
  const getDeepLink = (platform) => {
    switch(platform) {
      case 'Instagram':
        // Instagram deep link (opens the app if installed)
        return `instagram://share?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
      case 'Threads':
        // Threads deep link (opens the app if installed)
        return `https://www.threads.net/intent/post?text=${encodeURIComponent(title + ': ' + shareUrl)}`;
      default:
        return null;
    }
  };

  // Social media platforms with their sharing URLs
  const platforms = [
    {
      name: 'Facebook',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
      color: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
      ),
      color: '#000000',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ),
      color: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z"></path>
        </svg>
      ),
      color: '#25D366',
      url: `https://wa.me/?text=${encodeURIComponent(title + ': ' + shareUrl)}`
    },
    {
      name: 'Telegram',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"></path>
        </svg>
      ),
      color: '#0088cc',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`
    },
    {
      name: 'Instagram',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      color: '#E4405F',
      // Using deep link to open Instagram app if installed
      url: `instagram://share?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      deepLink: true
    },
    {
      name: 'Threads',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 16.6C17.5 18.2 16.2 19.5 14.6 19.5C13 19.5 11.7 18.2 11.7 16.6C11.7 15 13 13.7 14.6 13.7C16.2 13.7 17.5 15 17.5 16.6ZM9.5 7.4C9.5 6.3 8.6 5.4 7.5 5.4C6.4 5.4 5.5 6.3 5.5 7.4C5.5 8.5 6.4 9.4 7.5 9.4C8.6 9.4 9.5 8.5 9.5 7.4ZM17.5 7.4C17.5 6.3 16.6 5.4 15.5 5.4C14.4 5.4 13.5 6.3 13.5 7.4C13.5 8.5 14.4 9.4 15.5 9.4C16.6 9.4 17.5 8.5 17.5 7.4ZM9.5 16.6C9.5 15 8.2 13.7 6.6 13.7C5 13.7 3.7 15 3.7 16.6C3.7 18.2 5 19.5 6.6 19.5C8.2 19.5 9.5 18.2 9.5 16.6ZM23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1C18.1 1 23 5.9 23 12ZM10.8 12C10.8 12.6 10.8 13.3 10.8 13.9C10.8 15.5 10.3 17.1 9.2 18.3C8.7 18.8 8.1 19.2 7.5 19.5C6.7 19.9 5.7 20.1 4.8 19.9C3.7 19.6 2.7 18.7 2.3 17.7C1.9 16.7 1.9 15.6 2.2 14.5C2.5 13.3 3.4 12.3 4.6 11.8C5.7 11.3 7.1 11.3 8.2 11.7C8.4 11.8 8.4 11.8 8.4 11.6C8.4 9.9 8.4 9.9 7.2 8.7C6.5 8 6.1 7.1 6.1 6.1C6.1 5.2 6.5 4.3 7.1 3.7C8.9 1.9 12.1 1.9 13.9 3.7C14.6 4.4 15 5.3 15 6.3C15 7.3 14.6 8.2 13.9 8.8C13.8 8.9 13.7 9 13.6 9.1C13.6 9.1 13.5 9.2 13.5 9.2C13.5 9.3 13.6 9.3 13.6 9.3C14.7 9 15.9 9 17 9.5C18.2 10 19 11 19.4 12.3C19.7 13.4 19.7 14.5 19.3 15.6C18.9 16.7 18 17.5 16.9 17.8C15.9 18.1 14.9 17.9 14 17.4C13.1 17 12.4 16.1 12.1 15.1C11.7 13.9 11.9 12.5 12.7 11.4C12.8 11.3 12.9 11.1 13 11C13.1 10.9 13 10.8 12.9 10.7C12.6 10.6 12.3 10.6 12 10.7C10.9 11.1 10.9 11.2 10.8 12.1L10.8 12Z"></path>
        </svg>
      ),
      color: '#000000',
      // Using deep link format that might work for Threads app
      url: `https://www.threads.net/intent/post?text=${encodeURIComponent(title + ': ' + shareUrl)}`,
      deepLink: true
    },
    {
      name: 'Snapchat',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 13c-1.3 0-2.4-.9-2.6-2.1-.2 0-.4 0-.9.1 0 0-1 .4-2 .4-1 0-2-.4-2-.4-.5-.1-.7-.1-.9-.1-.2 1.2-1.3 2.1-2.6 2.1-1.4 0-2.5-1.1-2.5-2.5 0-.9.5-1.7 1.2-2.1-.1-.5-.2-1.1-.2-1.7 0-3.9 3.2-7.1 7.1-7.1s7.1 3.2 7.1 7.1c0 .6-.1 1.2-.2 1.7 .8.4 1.3 1.2 1.3 2.1 0 1.3-1.1 2.4-2.5 2.4z"/>
        </svg>
      ),
      color: '#FFFC00',
      url: `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareUrl)}`
    }
  ];

  const handleShare = (platform) => {
    // For platforms with deep links or special handling
    if (platform.deepLink) {
      // Try to open deep link first
      window.location.href = platform.url;
      
      // Set a fallback timer to copy link if deep link fails
      setTimeout(() => {
        copyToClipboard();
        alert(`If ${platform.name} didn't open, we've copied the link to your clipboard. You can now paste it in ${platform.name} manually.`);
      }, 2000);
      
      setIsOpen(false);
      return;
    }
    
    // Regular web sharing for other platforms
    if (platform.url) {
      window.open(platform.url, '_blank', 'width=600,height=400');
    }
    
    setIsOpen(false);
  };

  const getTruncatedUrl = (url) => {
    if (url.length > 30) {
      return url.substring(0, 27) + '...';
    }
    return url;
  };

  return (
    <div className={`relative`} ref={menuRef}>
      {/* Share button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 `}
        aria-label="Share this content"
        title="Share"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        <span className="font-medium">Share</span>
      </button>
      
      {/* Share menu */}
      {isOpen && (
        <div className={` mt-2 w-72 left-[-180px] bottom-2 bg-white rounded-lg shadow-lg border border-gray-200 z-[1000] ${className} absolute `}>
          <div className="p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-800">Share this {contentType}</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Social platforms grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {platforms.map((platform, index) => (
                <button
                  key={index}
                  onClick={() => handleShare(platform)}
                  className="flex flex-col items-center justify-center p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  aria-label={`Share on ${platform.name}`}
                  title={platform.name}
                >
                  <div 
                    className="w-8 h-8 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: platform.color, color: 'white' }}
                  >
                    {platform.icon}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">{platform.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
            
            {/* URL display and copy link option */}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1">Share URL:</p>
                <a 
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline truncate block"
                  title={shareUrl}
                >
                  {getTruncatedUrl(shareUrl)}
                </a>
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Copy link</span>
                </div>
                <span className="text-xs text-green-600">
                  {copySuccess && "Copied!"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;