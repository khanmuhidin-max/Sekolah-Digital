/**
 * ============================================================================
 * FILE 4: cloud-sync.js
 * Mesin Sinkronisasi Otomatis Aplikasi <-> Google Spreadsheet & Google Drive
 * ============================================================================
 */

(function () {
  // 1. MASUKKAN URL WEB APP GOOGLE APPS SCRIPT ANDA DI BAWAH INI:
  const DEFAULT_GAS_URL = 'MASUKKAN_URL_WEB_APP_GOOGLE_APPS_SCRIPT_ANDA_DI_SINI';

  function getGasUrl() {
    return localStorage.getItem('sd_custom_gas_url') || DEFAULT_GAS_URL;
  }

  const SYNC_INTERVAL_MS = 15000;
  let isFetchingFromCloud = false;
  const syncQueue = new Map();
  let debounceTimer = null;

  function updateIndicator(statusText, color) {
    const el = document.getElementById('cloud-sync-indicator');
    const dot = document.getElementById('cloud-sync-dot');
    const txt = document.getElementById('cloud-sync-text');
    if (!el || !dot || !txt) return;

    const url = getGasUrl();
    if (!url || url.includes('MASUKKAN_URL')) {
      el.style.display = 'flex';
      dot.style.background = '#f59e0b';
      dot.style.boxShadow = '0 0 8px #f59e0b';
      txt.textContent = 'Mode Lokal (URL Spreadsheet Belum Diisi)';
      return;
    }

    el.style.display = 'flex';
    dot.style.background = color;
    dot.style.boxShadow = `0 0 8px ${color}`;
    txt.textContent = statusText;
  }

  // Cegat setiap perubahan localStorage & kirim otomatis ke Spreadsheet & Drive
  const nativeSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key, value) {
    nativeSetItem.apply(this, [key, value]);
    window.dispatchEvent(new Event('localStorageUpdate'));

    if (!isFetchingFromCloud && (key.startsWith('sd_') || key.startsWith('unseen_')) && key !== 'sd_custom_gas_url') {
      queueCloudSync(key, value);
    }
  };

  function queueCloudSync(key, value) {
    const url = getGasUrl();
    if (!url || url.includes('MASUKKAN_URL')) return;

    syncQueue.set(key, value);
    updateIndicator('Menyimpan ke Spreadsheet & Drive...', '#f59e0b');

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      flushSyncQueue();
    }, 700);
  }

  async function flushSyncQueue() {
    if (syncQueue.size === 0) return;
    const url = getGasUrl();
    if (!url || url.includes('MASUKKAN_URL')) return;

    const entries = Array.from(syncQueue.entries());
    syncQueue.clear();

    for (const [key, value] of entries) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'syncItem',
            key: key,
            value: value
          })
        });
      } catch (err) {
        console.warn('Gagal sinkronisasi ke Spreadsheet:', key, err);
      }
    }

    updateIndicator('Tersinkron ke Spreadsheet & Drive', '#10b981');
  }

  async function pullAllFromSpreadsheet() {
    const url = getGasUrl();
    if (!url || url.includes('MASUKKAN_URL')) {
      updateIndicator('Mode Lokal (URL Spreadsheet Belum Diisi)', '#f59e0b');
      return;
    }
    if (syncQueue.size > 0) return;

    try {
      updateIndicator('Memuat data dari Spreadsheet...', '#3b82f6');
      const response = await fetch(`${url}?action=getAll&t=${Date.now()}`, {
        method: 'GET',
        redirect: 'follow'
      });

      const result = await response.json();
      if (result && result.status === 'success' && result.data) {
        isFetchingFromCloud = true;
        let hasChanges = false;

        Object.keys(result.data).forEach((key) => {
          const cloudVal = typeof result.data[key] === 'string'
            ? result.data[key]
            : JSON.stringify(result.data[key]);
          const localVal = localStorage.getItem(key);

          if (localVal !== cloudVal) {
            nativeSetItem.apply(localStorage, [key, cloudVal]);
            hasChanges = true;
          }
        });

        isFetchingFromCloud = false;

        if (hasChanges) {
          window.dispatchEvent(new Event('localStorageUpdate'));
        }
        updateIndicator('Tersinkron ke Spreadsheet & Drive', '#10b981');
      }
    } catch (err) {
      isFetchingFromCloud = false;
      updateIndicator('Mode Offline (Tersimpan di Perangkat)', '#ef4444');
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    pullAllFromSpreadsheet();
    setInterval(pullAllFromSpreadsheet, SYNC_INTERVAL_MS);
  });

  window.SekolahDigitalCloud = {
    pullNow: pullAllFromSpreadsheet,
    getGasUrl: getGasUrl,
    setGasUrl: function (newUrl) {
      nativeSetItem.apply(localStorage, ['sd_custom_gas_url', newUrl.trim()]);
      pullAllFromSpreadsheet();
    }
  };
})();