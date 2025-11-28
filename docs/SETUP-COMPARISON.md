# Setup Methode Vergelijking

Kies de setup methode die het beste bij jou past.

## 🎯 Welke Methode Kies Ik?

### Kies Simple Creator als:
- ✅ Je voor het eerst met de toolkit werkt
- ✅ Je snel wilt starten zonder technische details
- ✅ Je niet precies weet welke modules je nodig hebt
- ✅ Je een begeleide ervaring wilt met duidelijke uitleg
- ✅ Je vragen wilt in begrijpelijke taal (geen jargon)

### Kies Advanced Init als:
- ✅ Je ervaring hebt met development tools
- ✅ Je volledige controle wilt over alle opties
- ✅ Je precies weet welke modules en agents je nodig hebt
- ✅ Je verschillende configuratie locaties wilt kunnen kiezen
- ✅ Je het AAPF framework in detail wilt configureren

## 📊 Gedetailleerde Vergelijking

| Aspect | Simple Creator | Advanced Init |
|--------|---------------|---------------|
| **Commando** | `bun run create` | `bun run init` |
| **Tijd** | 2 minuten | 5 minuten |
| **Moeilijkheid** | ⭐ Makkelijk | ⭐⭐⭐ Gevorderd |
| **Vragen** | 5-8 simpele vragen | 10-15 technische vragen |
| **Taal** | Begrijpelijk Nederlands/Engels | Technisch Engels |
| **Project detectie** | Via project type keuze | Automatische detectie |
| **Module selectie** | Via simpele vragen | Volledige lijst met checkboxes |
| **Agent selectie** | Automatisch op basis van modules | Handmatige selectie |
| **Config locatie** | Altijd `.project/standards.md` | Keuze uit meerdere locaties |
| **Framework config** | Simpele ja/nee vraag | Gedetailleerde configuratie |
| **Aanbevelingen** | Op basis van project type | Op basis van detectie |
| **Presets** | Geïntegreerd in vragen | Apart preset menu |

## 🎨 Voorbeeld Vragen

### Simple Creator Vragen

```
📝 Tell me about your project

What is your project called?
> my-blog

Project description:
> A personal blog about web development

🎯 What type of project are you building?
  1. Landing Page
  2. Blog
  3. Portfolio
  4. Web Application
  5. E-commerce
  6. Documentation
  7. Other

Choice [1-7]: 2

💅 Styling Framework:
  1. TailwindCSS only
  2. TailwindCSS + daisyUI (recommended)
  3. None - I'll use custom CSS

Choice [1-3]: 2

⚡ Interactivity:
  1. Alpine.js (recommended)
  2. Alpine.js + TypeScript
  3. HTMX
  4. None - Static site

Choice [1-4]: 1

📋 Forms:
Do you need advanced forms (DataBound Forms)? (y/N): n

👥 User Management:
Do you need user accounts? (y/N): n

🔍 Search:
Do you need search functionality? (Y/n): y

💬 Comments:
Do you need comments? (Y/n): y
```

### Advanced Init Vragen

```
🔍 Detecting project...
   Type: couchcms-webapp
   Frameworks: tailwindcss, alpinejs
   Languages: php, typescript, css, html

🎯 Setup mode:
  1. Auto (recommended) - Use detected settings
  2. Preset - Choose from common project types
  3. Simple - Quick setup with defaults
  4. Custom - Full control over all options

Choice [1-4]: 4

📝 Project name: my-blog
Project description: A personal blog

📦 Toolkit location: ./ai-toolkit-shared
Use different location? (y/N): n

📚 Select modules (space to toggle, enter to confirm):
  [x] couchcms-core (always included)
  [x] tailwindcss
  [x] alpinejs
  [ ] typescript
  [x] daisyui
  [ ] htmx
  [ ] databound-forms
  [ ] users
  [x] comments
  [x] search
  [x] pagination
  [ ] relations
  [ ] repeatable-regions

🤖 Select agents:
  [x] couchcms
  [x] tailwindcss
  [x] alpinejs
  [ ] databound-forms
  [ ] users
  [x] comments
  [x] search

🔧 Framework configuration:
Enable AAPF framework? (y/N): n

📁 Context directory:
Create context directory? (Y/n): y
Context path: .project/context
```

## 🎯 Setup Modes (Advanced Init)

Advanced Init heeft 4 verschillende modes:

### 1. Auto Mode
- Detecteert automatisch project type en frameworks
- Stelt modules en agents voor
- Minimale vragen (0-2)
- Snelste optie binnen Advanced Init

### 2. Preset Mode
- Kies uit 8 voorgedefinieerde project types
- Automatische module en agent selectie
- Optie om aanbevelingen te accepteren of zelf te kiezen

### 3. Simple Mode
- Standaard configuratie (`.project/standards.md`)
- Basis modules (core + tailwindcss + alpinejs)
- Framework uitgeschakeld
- Snelle setup met defaults

### 4. Custom Mode
- Volledige controle over alle opties
- Handmatige module en agent selectie
- Keuze configuratie locatie
- Gedetailleerde framework configuratie

## 💡 Aanbevelingen

### Voor Beginners
```bash
bun run create
```
Start met Simple Creator. Je kunt later altijd overstappen naar Advanced Init als je meer controle wilt.

### Voor Teams
```bash
bun run init
# Kies: Auto mode
```
Gebruik Advanced Init in Auto mode voor consistente setup binnen teams.

### Voor Experts
```bash
bun run init
# Kies: Custom mode
```
Gebruik Advanced Init in Custom mode voor volledige controle.

### Voor Snelle Prototypes
```bash
bun run create
# Kies: Landing Page of Blog
```
Simple Creator met een basis project type is het snelst.

## 🔄 Overstappen

Je kunt altijd overstappen tussen methodes:

### Van Simple naar Advanced
```bash
# Simple Creator maakt .project/standards.md
bun run create

# Later: meer controle nodig?
bun run init
# Kies: Overwrite existing config
```

### Van Advanced naar Simple
```bash
# Advanced Init maakt config
bun run init

# Later: opnieuw beginnen met simpele setup?
bun run create
# Kies: Overwrite existing config
```

## 📝 Resultaat

Beide methodes genereren:
- ✅ `standards.md` configuratie bestand
- ✅ `.cursorrules` voor Cursor IDE
- ✅ `.claude/` voor Claude Code
- ✅ `.github/copilot-instructions.md` voor GitHub Copilot
- ✅ `.windsurf/` voor Windsurf
- ✅ `.kiro/` voor Kiro
- ✅ Context directory voor project documentatie

Het enige verschil is **hoe** je daar komt - via simpele vragen of gedetailleerde configuratie.

## 🆘 Hulp Nodig?

- **Simple Creator**: [SIMPLE-SETUP.md](SIMPLE-SETUP.md)
- **Advanced Init**: [GETTING-STARTED.md](GETTING-STARTED.md)
- **Problemen**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Configuratie**: [CONFIG-FILES.md](CONFIG-FILES.md)
