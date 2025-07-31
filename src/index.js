import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;
    
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        console.log('PWA: Service Worker registered successfully:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                if (window.confirm('New version available! Reload to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('PWA: Service Worker registration failed:', error);
      });
  });

  // Handle service worker updates
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

// Add install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA: Install prompt triggered');
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show install button or banner
  showInstallPromotion();
});

// Function to show install promotion (can be called from your React components)
function showInstallPromotion() {
  // Create install button if it doesn't exist
  const existingButton = document.getElementById('pwa-install-btn');
  if (existingButton) return;
  
  const installButton = document.createElement('button');
  installButton.id = 'pwa-install-btn';
  installButton.textContent = '📱 Install Mirror Me';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #dc143c;
    color: white;
    border: none;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    z-index: 1000;
    transition: all 0.3s ease;
  `;
  
  installButton.onmouseover = () => {
    installButton.style.transform = 'scale(1.05)';
    installButton.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
  };
  
  installButton.onmouseout = () => {
    installButton.style.transform = 'scale(1)';
    installButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  };
  
  installButton.onclick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA: User ${outcome} the install prompt`);
      deferredPrompt = null;
      installButton.remove();
    }
  };
  
  document.body.appendChild(installButton);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (document.getElementById('pwa-install-btn')) {
      installButton.style.opacity = '0';
      setTimeout(() => installButton.remove(), 300);
    }
  }, 10000);
}

// Track PWA installation
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA: App was successfully installed');
  // Remove install button if it exists
  const installButton = document.getElementById('pwa-install-btn');
  if (installButton) {
    installButton.remove();
  }
});

// Make install function globally available
window.showInstallPromotion = showInstallPromotion;

