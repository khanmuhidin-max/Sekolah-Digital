/**
 * ============================================================================
 * FILE 3: style.css
 * Desain Glassmorphism, Asymmetric Bento Grid, & Mobile Bottom Sheet
 * ============================================================================
 */

:root {
  --primary: #4f46e5;
  --emerald: #10b981;
  --rose: #f43f5e;
  --amber: #f59e0b;
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Indikator Sinkronisasi Cloud */
.cloud-badge {
  position: fixed;
  bottom: 14px;
  right: 14px;
  z-index: 99999;
  background: rgba(15, 23, 42, 0.88);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.cloud-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
  box-shadow: 0 0 8px #10b981;
}

/* Efek Glassmorphism */
.glass-panel {
  background: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.dark .glass-panel {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.glass-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.95);
}

.dark .glass-card {
  background: rgba(30, 41, 59, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.dark .glass-card:hover {
  background: rgba(30, 41, 59, 0.96);
}

/* Scrollbar Halus */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animasi Transisi Halus */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes slideUpSheet {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-sheet-up {
  animation: slideUpSheet 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}