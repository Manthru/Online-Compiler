// public/worker-javascript.js

self.addEventListener('message', (event) => {
    const code = event.data;
  
    try {
      const result = eval(code);  // Be cautious with eval in a production environment
      self.postMessage(result);
    } catch (error) {
      self.postMessage({ error: error.message });
    }
  });
  