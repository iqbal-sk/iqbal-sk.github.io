import React from 'react';

const Footer = ({links}) => {
  const analyticsEnabled = typeof window !== 'undefined' && localStorage.getItem('analytics:enabled') !== 'false';
  const toggleAnalytics = () => {
    if (analyticsEnabled && window.disableAnalytics) window.disableAnalytics();
    else if (!analyticsEnabled && window.enableAnalytics) window.enableAnalytics();
    // force re-render by reloading; simplest for now
    setTimeout(() => location.reload(), 300);
  };
  return (
    <footer className="py-6 border-t border-gray-300 dark:border-gray-700">
      <div className="max-w-6xl my-4 mx-auto px-4 flex justify-between items-center">
        {/* Left side: Company name and links */}
        <div className="text-left">
          <h3 className="text-lg font-bold">Iqbal</h3>
          <button
            onClick={toggleAnalytics}
            className="mt-1 text-xs text-gray-600 underline hover:text-gray-800"
          >
            Privacy: {analyticsEnabled ? 'Analytics on (Plausible)' : 'Analytics off'}
          </button>
        </div>

        {/* Right side: Social media icons */}
        <div className="flex space-x-4">
          {links.map((link, index) => (
            <a key={index} href={link.href} className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <link.icon alt={`${link.href} icon`} className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
