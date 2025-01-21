$(document).ready(function() {
    setTimeout(function() {
      $('#container').addClass('loaded');
      if ($('#container').hasClass('loaded')) {
        $('#preloader').delay(1000).queue(function() {
          $(this).remove();
        });
      }
    }, 3000);
  });
  
  class NetworkStatusManager {
    constructor() {
      this.statusElement = document.getElementById('network-status');
      this.checkInProgress = false;
      this.stableDelay = 1500;
      this.initializeEventListeners();
    }
  
    setStatus(status, message) {
      this.statusElement.classList.remove('connecting', 'online', 'offline');
      this.statusElement.classList.add(status);
      this.statusElement.style.opacity = '0';
      setTimeout(() => {
        this.statusElement.textContent = message;
        this.statusElement.style.opacity = '1';
      }, 200);
    }
  
    async checkConnection() {
      try {
        await Promise.race([
          fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000)),
        ]);
        return true;
      } catch (error) {
        console.error('Connection check failed:', error);
        return false;
      }
    }
  
    async simulateStableConnection() {
      if (this.checkInProgress) return;
      this.checkInProgress = true;
  
      try {
        this.setStatus('connecting', 'Connecting...');
        if (!navigator.onLine) {
          this.setStatus('offline', 'Offline');
          return;
        }
  
        await new Promise(resolve => setTimeout(resolve, this.stableDelay));
        const isConnected = await this.checkConnection();
        this.setStatus(isConnected ? 'online' : 'offline', isConnected ? 'Online' : 'Offline');
      } catch (error) {
        console.error('Connection check failed:', error);
        this.setStatus('offline', 'Offline');
      } finally {
        this.checkInProgress = false;
      }
    }
  
    async handleOnline() {
      const isConnected = await this.checkConnection();
      this.setStatus(isConnected ? 'online' : 'offline', isConnected ? 'Online' : 'Offline');
    }
  
    handleOffline() {
      this.setStatus('offline', 'Offline');
    }
  
    initializeEventListeners() {
      window.addEventListener('load', () => this.simulateStableConnection());
      window.addEventListener('online', () => {
        this.setStatus('connecting', 'Connecting...');
        setTimeout(() => this.handleOnline(), 1000);
      });
      window.addEventListener('offline', () => this.handleOffline());
      setInterval(() => {
        if (navigator.onLine) {
          this.simulateStableConnection();
        }
      }, 30000);
    }
  }
  
  const networkStatus = new NetworkStatusManager();
  