
$(document).ready(function() {
  setTimeout(function() {
    $('#container').addClass('loaded');
    // Once the container has finished, the scroll appears
    if ($('#container').hasClass('loaded')) {
      // It is so that once the container is gone, the entire preloader section is deleted
      $('#preloader').delay(1000).queue(function() {
        $(this).remove();
      });}
  }, 3000);});

  // JavaScript
/**
 * Network Status Indicator
 * Provides accurate real-time network connectivity status
 */
class NetworkStatusManager {
  constructor() {
      this.statusElement = document.getElementById('network-status');
      this.checkInProgress = false;
      this.stableDelay = 1500;
      this.initializeEventListeners();
  }

  setStatus(status, message) {
      // Remove all existing status classes
      this.statusElement.classList.remove('connecting', 'online', 'offline');
      // Add new status class
      this.statusElement.classList.add(status);
      // Update message with fade transition
      this.statusElement.style.opacity = '0';
      setTimeout(() => {
          this.statusElement.textContent = message;
          this.statusElement.style.opacity = '1';
      }, 200);
  }

  async checkConnection() {
      try {
          // Try to fetch a small resource to verify actual connection
          const response = await Promise.race([
              fetch('https://www.google.com/favicon.ico', {
                  mode: 'no-cors'  // This prevents CORS issues
              }),
              new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Timeout')), 5000)
              )
          ]);
          return true; // If we get here, we're definitely online
      } catch (error) {
          console.log('Connection check failed:', error);
          return false;
      }
  }

  async simulateStableConnection() {
      if (this.checkInProgress) return;
      this.checkInProgress = true;

      try {
          this.setStatus('connecting', 'Connecting...');
          
          // First check navigator.onLine
          if (!navigator.onLine) {
              this.setStatus('offline', 'Offline');
              return;
          }

          // Wait for stable delay
          await new Promise(resolve => setTimeout(resolve, this.stableDelay));
          
          // Perform actual connection check
          const isConnected = await this.checkConnection();
          
          // Update status based on actual connectivity
          if (isConnected) {
              this.setStatus('online', 'Online');
          } else {
              this.setStatus('offline', 'Offline');
          }
      } catch (error) {
          console.error('Connection check failed:', error);
          this.setStatus('offline', 'Offline');
      } finally {
          this.checkInProgress = false;
      }
  }

  async handleOnline() {
      // Double check we're actually online
      const isConnected = await this.checkConnection();
      if (isConnected) {
          this.setStatus('online', 'Online');
      } else {
          this.setStatus('offline', 'Offline');
      }
  }

  handleOffline() {
      this.setStatus('offline', 'Offline');
  }

  initializeEventListeners() {
      // Initial status check on load
      window.addEventListener('load', () => {
          this.simulateStableConnection();
      });

      // Online event listener with verification
      window.addEventListener('online', () => {
          this.setStatus('connecting', 'Connecting...');
          setTimeout(() => {
              this.handleOnline();
          }, 1000);
      });

      // Offline event listener
      window.addEventListener('offline', () => {
          this.handleOffline();
      });

      // Periodic connection check
      setInterval(() => {
          if (navigator.onLine) {
              this.simulateStableConnection();
          }
      }, 30000);
  }
}

// Initialize the network status manager
const networkStatus = new NetworkStatusManager();



document.head.appendChild(style);