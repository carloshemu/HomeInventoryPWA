// PWA 安装相关功能
export class PWAService {
  static deferredPrompt = null;
  static installPromptShown = false;

  // 初始化PWA
  static init() {
    // 注册Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // 监听安装提示
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    // 监听应用安装完成
    window.addEventListener('appinstalled', () => {
      this.installPromptShown = true;
      this.hideInstallPrompt();
      console.log('PWA was installed');
    });
  }

  // 显示安装提示
  static showInstallPrompt() {
    if (this.installPromptShown || !this.deferredPrompt) {
      return;
    }

    const promptElement = document.createElement('div');
    promptElement.className = 'install-prompt';
    promptElement.innerHTML = `
      <div class="flex items-center justify-between">
        <span>📱 添加到主屏幕以获得更好的体验</span>
        <div class="flex gap-2 ml-4">
          <button id="install-btn" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
            安装
          </button>
          <button id="dismiss-btn" class="text-white opacity-70 px-3 py-1 rounded text-sm">
            稍后
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(promptElement);

    // 绑定事件
    document.getElementById('install-btn').addEventListener('click', () => {
      this.installApp();
    });

    document.getElementById('dismiss-btn').addEventListener('click', () => {
      this.hideInstallPrompt();
    });

    // 5秒后自动隐藏
    setTimeout(() => {
      this.hideInstallPrompt();
    }, 5000);
  }

  // 隐藏安装提示
  static hideInstallPrompt() {
    const promptElement = document.querySelector('.install-prompt');
    if (promptElement) {
      promptElement.remove();
    }
  }

  // 安装应用
  static async installApp() {
    if (!this.deferredPrompt) {
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    this.deferredPrompt = null;
    this.hideInstallPrompt();
  }

  // 检查是否已安装
  static isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  // 检查是否支持PWA
  static isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }
}

export default PWAService; 