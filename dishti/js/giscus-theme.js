(function () {
  function postToGiscus(theme) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe || !iframe.contentWindow) return false;

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: { theme }
        }
      },
      'https://giscus.app'
    );
    return true;
  }

  let retryTimer;
  let currentTheme;

  function updateGiscusTheme(theme) {
    currentTheme = theme === 'light' ? 'light' : 'dark_dimmed';

    if (retryTimer) clearInterval(retryTimer);

    if (postToGiscus(currentTheme)) return;

    let attempts = 0;
    retryTimer = setInterval(() => {
      attempts++;
      if (postToGiscus(currentTheme) || attempts > 48) {
        clearInterval(retryTimer);
      }
    }, 250);
  }

  function applyTheme(theme) {
    const t = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;

    const toggle = document.getElementById('theme-switch');
    if (toggle) toggle.checked = t === 'light';

    updateGiscusTheme(t);
  }

  const toggle = document.getElementById('theme-switch');
  if (toggle) {
    toggle.addEventListener('change', () => {
      applyTheme(toggle.checked ? 'light' : 'dark');
    });
  }

  window.updateGiscusTheme = updateGiscusTheme;

  const initTheme =
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateGiscusTheme(initTheme);
    });
  } else {
    updateGiscusTheme(initTheme);
  }
})();