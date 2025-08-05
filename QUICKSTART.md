# 🚀 Fingerprintify - Quick Start Guide

## ⚡ Installation in 3 Schritten

1. **Repository klonen**
   ```bash
   git clone [dein-repo-url]
   cd fingerprintify
   ```

2. **Dependencies installieren & bauen**
   ```bash
   npm install
   npm run build
   ```

3. **In Chrome laden**
   - Chrome öffnen → `chrome://extensions/`
   - "Entwicklermodus" an → "Entpackte Erweiterung laden"
   - `dist/` Ordner auswählen

## 🎯 Sofort loslegen

### ✅ Extension testen
1. Extension-Icon klicken → Status sollte "ON Protection Active" zeigen
2. Zu [browserleaks.com](https://browserleaks.com) → WebRTC sollte blockiert sein
3. Zu [amiunique.org](https://amiunique.org) → Fingerprint sollte einzigartig aber realistisch sein

### 🛠️ Einstellungen anpassen
- **Settings-Tab** → Module ein/aus schalten
- **Info-Tab** → Aktuelle Spoofing-Werte ansehen
- **Regenerate Button** → Neue Werte generieren

## 🔧 Build-Commands

```bash
npm run build        # Production (minifiziert + obfuskiert)
npm run build:dev    # Development (unminifiziert)
npm run clean        # Build-Ordner leeren
```

## 🎯 Was ist neu in v2.0?

### ✨ Neue Features
- **Realistische Spoofing-Werte** (keine Fake-Namen mehr!)
- **4 neue Schutz-Module**: Battery, Speech, Stealth, Tracking
- **Verbessertes Popup** mit korrekter Status-Anzeige
- **Build-System** mit Obfuskierung

### 🛡️ Besserer Schutz
- Übersteht moderne Anti-Bot-Checks
- Unerkennbar für Fingerprint-Erkennungssysteme
- Realistische Hardware-Kombinationen
- Authentische Browser-Daten

---
**Mehr Details in der [vollständigen README](README.md)**
