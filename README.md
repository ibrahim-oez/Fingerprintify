# 🛡️ Fingerprintify - Advanced Browser Fingerprint Protection

**Version 2.0** - *Professional-grade anti-fingerprinting with realistic spoofing*

Fingerprintify ist eine fortschrittliche Chrome-Extension, die dich vor Browser-Fingerprinting schützt, indem sie realistische aber einzigartige Hardware- und Browser-Informationen vortäuscht. Im Gegensatz zu anderen Tools verwendet Fingerprintify **realistische Werte**, die nicht als Fake erkannt werden.

## 🚀 Features

### 🔒 Core Protection Modules
- **Navigator Spoofing** - Fälscht Browser- und Hardware-Informationen
- **Screen Spoofing** - Ändert Bildschirmauflösung und Farbtiefe  
- **WebGL Spoofing** - Tarnt GPU-Informationen
- **Canvas Fingerprint Protection** - Verhindert Canvas-basiertes Tracking
- **Audio Context Spoofing** - Schützt vor Audio-Fingerprinting
- **WebRTC IP Blocking** - Verhindert WebRTC-basierte IP-Lecks

### ⚡ Advanced Protection (Neu in v2.0)
- **Battery API Blocking** - Blockiert Batteriestatus-Abfragen
- **Speech Synthesis Spoofing** - Täuscht TTS-Stimmen vor
- **Stealth Anti-Detection** - Macht gefälschte Funktionen unerkennbar
- **Fingerprint Tracking** - Überwacht Fingerprint-Änderungen

## 🎯 Warum Fingerprintify?

### ✅ Realistische Spoofing-Werte
Im Gegensatz zu anderen Tools, die offensichtlich falsche Werte wie "QuantumOS" oder "CyberGPU 9000X" verwenden, nutzt Fingerprintify **echte, realistische Daten**:

- **Browser**: Echte Chrome, Firefox, Safari, Edge User-Agents
- **Hardware**: Realistische CPU-Kerne (2,4,6,8,12,16,20,24,32)
- **GPU**: Authentische Vendor-Namen (Intel, NVIDIA, AMD, Apple)
- **Auflösungen**: Häufige Monitor-Auflösungen (1920x1080, 2560x1440, etc.)
- **Sprachen**: Echte Betriebssysteme (Windows, macOS, Linux)

### 🕵️ Unerkennbar für Anti-Bot-Systeme
- Übersteht moderne Fingerprint-Erkennungssysteme
- Mischt sich perfekt unter echte Nutzer
- Keine verdächtigen "Quantum"- oder "Cyber"-Namen
- Authentische Hardware-Kombinationen

### 🔧 Professionelle Implementierung
- **Modularer Aufbau** - Jeder Schutz als eigenständiges Modul
- **CSP-kompatibel** - Funktioniert auch auf sicherheitskritischen Seiten
- **Crypto-sichere Randomisierung** - Verwendet `crypto.getRandomValues()`
- **Anti-Detection Stealth-Modus** - Macht Spoofing-Funktionen unerkennbar

## 📦 Installation

### Aus dem Repository
1. Repository klonen oder ZIP herunterladen
2. `npm install` - Abhängigkeiten installieren
3. `npm run build` - Extension bauen
4. Chrome öffnen → `chrome://extensions/`
5. "Entwicklermodus" aktivieren
6. "Entpackte Erweiterung laden" → `dist/` Ordner auswählen

### Manuell
1. ZIP herunterladen und entpacken
2. Chrome → `chrome://extensions/`
3. "Entwicklermodus" aktivieren  
4. "Entpackte Erweiterung laden" → Projekt-Ordner auswählen

## 🎛️ Nutzung

### Extension aktivieren
1. Extension-Icon in der Chrome-Toolbar anklicken
2. Status-Tab zeigt aktuelle Schutzmaßnahmen
3. Settings-Tab für individuelle Konfiguration
4. Info-Tab für detaillierte Fingerprint-Informationen

### Status-Übersicht
- **🟢 ON** - Schutz aktiv und funktional
- **🔴 OFF** - Schutz deaktiviert
- **⚠️** - Nicht verfügbar (z.B. chrome:// Seiten)

### Erweiterte Einstellungen
Alle Schutzmodule können einzeln aktiviert/deaktiviert werden:
- Navigator, Screen, WebGL, Canvas, Audio, WebRTC
- Battery API, Speech Synthesis, Stealth Mode, Tracking

## 🔧 Build-System

### Verfügbare Scripts
```bash
npm run build          # Production Build (minifiziert + obfuskiert)
npm run build:dev       # Development Build  
npm run clean          # Build-Ordner leeren
npm run copy-files     # Dateien nach dist/ kopieren
```

### Build-Konfiguration
- **Terser** - JavaScript-Minifizierung
- **JavaScript Obfuscator** - Code-Verschleierung für Schutz
- **Automatische Datei-Kopierung** - Manifest, Icons, HTML, CSS

## 🛠️ Technische Details

### Architektur
```
Fingerprintify/
├── manifest.json          # Extension-Manifest
├── background/            # Background Script
├── content/               # Content Scripts
│   ├── content-script.js  # Main Content Script
│   ├── inject-modular.js  # Module Loader
│   └── modules/           # Protection Modules
│       ├── navigator.js   # Browser Info Spoofing
│       ├── screen.js      # Screen Spoofing
│       ├── webgl.js       # WebGL Spoofing
│       ├── canvas.js      # Canvas Protection
│       ├── audio.js       # Audio Spoofing
│       ├── webrtc.js      # WebRTC Blocking
│       ├── battery.js     # Battery API Blocking
│       ├── speech.js      # Speech Synthesis Spoofing
│       ├── stealth.js     # Anti-Detection
│       └── tracker.js     # Fingerprint Monitoring
├── popup/                 # Extension Popup
└── icons/                # Extension Icons
```

### Kommunikation
- **MAIN World** ↔ **ISOLATED World** via CustomEvents
- **Content Script** ↔ **Popup** via chrome.runtime.sendMessage
- **Background** ↔ **Content** via chrome.tabs.sendMessage

### Spoofing-Strategien

#### Navigator Module
```javascript
// Realistische Browser User-Agents
const realisticUserAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) Firefox/120.0'
];

// Authentische Hardware-Werte
const realisticCores = [2, 4, 6, 8, 12, 16, 20, 24, 32];
const realisticRAM = [2, 4, 8, 16, 32]; // GB
```

#### WebGL Module
```javascript
// Echte GPU-Hersteller
const authenticVendors = [
  'Intel Inc.',
  'NVIDIA Corporation', 
  'ATI Technologies Inc.',
  'AMD',
  'Apple Inc.'
];
```

#### Screen Module
```javascript
// Häufige Monitor-Auflösungen
const commonResolutions = [
  { width: 1920, height: 1080 },  // Full HD
  { width: 2560, height: 1440 },  // QHD
  { width: 3440, height: 1440 },  // Ultrawide
  { width: 1366, height: 768 }    // Laptop Standard
];
```

## 🔒 Sicherheit & Datenschutz

### Keine Datensammlung
- Sammelt keine persönlichen Daten
- Keine Telemetrie oder Analytics
- Alle Daten bleiben lokal im Browser

### Open Source
- Vollständiger Quellcode verfügbar
- Auditierbar und transparent
- Community-driven Development

### CSP-Konformität
- Funktioniert mit Content Security Policy
- Keine `unsafe-eval` oder `unsafe-inline` erforderlich
- DOM-basierte Kommunikation statt Code-Injection

## 🧪 Test-Websites

Teste Fingerprintify auf diesen Fingerprinting-Test-Seiten:

### Empfohlene Test-Sites
- **[AmIUnique.org](https://amiunique.org/)** - Umfassender Fingerprint-Test
- **[BrowserLeaks.com](https://browserleaks.com/)** - Detaillierte Browser-Tests
- **[Panopticlick](https://panopticlick.eff.org/)** - EFF Fingerprint-Test
- **[WebRTC Leak Test](https://browserleaks.com/webrtc)** - WebRTC IP-Leak Test
- **[Canvas Fingerprinting Test](https://browserleaks.com/canvas)** - Canvas-Test

### Erwartete Ergebnisse
- ✅ **Eindeutiger aber realistischer Fingerprint**
- ✅ **Keine erkennbaren Fake-Werte**
- ✅ **WebRTC-IPs blockiert**
- ✅ **Canvas-Fingerprint verfälscht**
- ✅ **Audio-Context unterschiedlich**

## 🆚 Vergleich mit anderen Tools

| Feature | Fingerprintify v2.0 | Andere Tools | Vorteil |
|---------|-------------------|-------------|---------|
| **Realistische Werte** | ✅ Echte Hardware/Browser | ❌ Offensichtlich fake | Unerkennbar |
| **Anti-Detection** | ✅ Stealth-Modus | ❌ Leicht erkennbar | Übersteht Checks |
| **Modularer Aufbau** | ✅ 10 Module | ❌ Monolithisch | Flexibel |
| **CSP-Kompatibel** | ✅ DOM-Events | ❌ Code-Injection | Funktioniert überall |
| **Build-System** | ✅ Obfuskiert/Minifiziert | ❌ Klartext | Schwer zu analysieren |
| **WebRTC-Schutz** | ✅ Vollständig blockiert | ⚠️ Teilweise | Keine IP-Lecks |

## 🔧 Erweiterte Konfiguration

### Eigene Spoofing-Werte
Du kannst eigene realistische Werte in den Modulen definieren:

```javascript
// content/modules/navigator.js
const customUserAgents = [
  'Dein eigener realistischer User-Agent hier'
];

// content/modules/screen.js  
const customResolutions = [
  { width: 1234, height: 567 }  // Deine gewünschte Auflösung
];
```

### Settings Export/Import
- Einstellungen als JSON exportieren
- Backup und Wiederherstellung
- Konfiguration zwischen Geräten teilen

## 🐛 Troubleshooting

### Extension funktioniert nicht
1. Chrome-Version überprüfen (min. v88)
2. Extension neu laden: `chrome://extensions/`
3. Browser-Cache leeren
4. Extension deaktivieren/aktivieren

### Popup zeigt "OFF" obwohl aktiviert
1. Seite neu laden (F5)
2. Popup schließen und neu öffnen
3. Bei chrome:// Seiten normal (nicht unterstützt)

### Build-Fehler
```bash
# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install

# Clean Build
npm run clean
npm run build
```

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details.

## 🤝 Contributing

Beiträge willkommen! Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Guidelines.

### Development Setup
```bash
git clone https://github.com/dein-username/fingerprintify.git
cd fingerprintify
npm install
npm run build:dev
```

## 📞 Support

- **Issues**: GitHub Issues für Bug-Reports
- **Discussions**: GitHub Discussions für Fragen
- **Security**: security@fingerprintify.com für Sicherheitslücken

## 🗺️ Roadmap

### v2.1 (Geplant)
- [ ] Font-Fingerprinting-Schutz
- [ ] Timezone-Spoofing
- [ ] Plugin-Liste-Randomisierung
- [ ] Erweiterte WebRTC-Konfiguration

### v2.2 (Zukunft)
- [ ] Mobile Browser-Support
- [ ] Proxy-Integration
- [ ] Machine Learning-basierte Spoofing-Werte
- [ ] Cloud-Sync für Einstellungen

---

**⚠️ Hinweis**: Fingerprintify ist ein Datenschutz-Tool. Nutze es verantwortungsvoll und beachte die Nutzungsbedingungen der Websites, die du besuchst.

**🛡️ Developed with ❤️ for Privacy**
