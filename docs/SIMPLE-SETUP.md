# Simple Standards Creator

Een eenvoudige, gebruiksvriendelijke wizard om `standards.md` te maken zonder technische kennis.

## Wat doet het?

De Simple Standards Creator begeleidt je stap voor stap bij het maken van een `standards.md` configuratiebestand. Je hoeft alleen maar simpele vragen te beantwoorden over je project en de wizard doet de rest.

## Wanneer gebruiken?

Gebruik deze wizard als:
- Je voor het eerst met de toolkit werkt
- Je snel een project wilt opzetten zonder alle details te kennen
- Je niet precies weet welke modules en agents je nodig hebt
- Je een eenvoudige, begeleide ervaring wilt

## Gebruik

```bash
# Vanuit je project directory
bun ai-toolkit-shared/scripts/create-standards.js

# Of via npm script (als toolkit geïnstalleerd is)
bun run create
```text

## Wat wordt er gevraagd?

De wizard stelt eenvoudige vragen in begrijpelijke taal:

### 1. Project Informatie
- **Project naam**: Hoe heet je project?
- **Beschrijving**: Wat doet je project? (één zin is genoeg)
- **Project type**: Kies uit voorgedefinieerde types:
  - Landing Page
  - Blog
  - Portfolio
  - Web Application
  - E-commerce
  - Documentation
  - Custom (zelf configureren)

### 2. Technologieën

Afhankelijk van je project type krijg je aanbevelingen, of je kunt zelf kiezen:

- **Styling**: TailwindCSS, daisyUI, of custom CSS
- **Interactiviteit**: Alpine.js, TypeScript, HTMX, of geen
- **Formulieren**: Heb je geavanceerde formulieren nodig?
- **Gebruikers**: Heb je user accounts nodig?
- **Zoeken**: Heb je zoekfunctionaliteit nodig?
- **Comments**: Heb je comments nodig?
- **AI Framework**: Wil je het AAPF framework gebruiken?

### 3. Bevestiging

Je krijgt een overzicht van je keuzes en kunt bevestigen voordat het bestand wordt aangemaakt.

## Voorbeeld Sessie

```text
✨ CouchCMS AI Toolkit - Simple Standards Creator

This wizard will help you create a standards.md file
by asking simple questions about your project.

📝 Tell me about your project

Just answer a few simple questions...

What is your project called? my-blog

Great! Now describe what your project does.
(Keep it short - one sentence is fine)

Project description: A personal blog about web development

🎯 What type of project are you building?

  1. Landing Page - Simple website with a few pages
  2. 📝 Blog - Blog with articles and comments
  3. 📝 Portfolio - Showcase your work
  4. 📝 Web Application - Full app with user accounts
  5. 📝 E-commerce - Online store
  6. 📝 Documentation - Documentation site
  7. ⚙️ Other - I'll configure it myself

Choice [1-7]: 2

🛠️  Which technologies do you want to use?

Based on your project type (Blog), I recommend:

  Modules: couchcms-core, tailwindcss, alpinejs, comments, search, pagination
  Agents: couchcms, tailwindcss, alpinejs, comments, search

Use these recommended settings? (Y/n): Y

📋 Summary:

  Project: my-blog
  Description: A personal blog about web development
  Type: blog
  Modules: couchcms-core, tailwindcss, alpinejs, comments, search, pagination
  Agents: couchcms, tailwindcss, alpinejs, comments, search
  Framework: Disabled
  Config: .project/standards.md

Create standards.md with these settings? (Y/n): Y

✅ Generated .project/standards.md
✅ Created context directory: .project/context
✅ Sync completed successfully

💡 Next steps:

  1. Review .project/standards.md
  2. 📝 Add project-specific rules at the bottom
  3. 🚀 Run "bun ai-toolkit-shared/scripts/sync.js" to update configs
```

## Verschil met `init.js`

| Feature | `create-standards.js` | `init.js` |
|---------|----------------------|-----------|
| **Doelgroep** | Beginners, snelle setup | Gevorderde gebruikers |
| **Vragen** | Simpel, in begrijpelijke taal | Technisch, meer opties |
| **Aanbevelingen** | Automatisch op basis van project type | Detectie + handmatige keuze |
| **Configuratie** | Altijd `.project/standards.md` | Keuze tussen verschillende locaties |
| **Modules selectie** | Gebaseerd op simpele vragen | Volledige lijst met checkboxes |
| **Agents selectie** | Automatisch op basis van modules | Handmatige selectie |
| **Framework** | Simpele ja/nee vraag | Gedetailleerde configuratie |

## Voordelen

✅ **Eenvoudig**: Geen technische kennis vereist
✅ **Snel**: Binnen 2 minuten klaar
✅ **Slim**: Aanbevelingen op basis van project type
✅ **Veilig**: Vraagt bevestiging voor overschrijven
✅ **Compleet**: Genereert direct werkende configuratie

## Na het aanmaken

Na het aanmaken van `standards.md`:

1. **Review het bestand**: Open `.project/standards.md` en controleer de instellingen
2. 📝 **Voeg project-specifieke regels toe**: Onderaan het bestand kun je eigen regels toevoegen
3. 🚀 **Sync opnieuw**: Run `bun ai-toolkit-shared/scripts/sync.js` als je wijzigingen maakt
4. 🚀 **Start met ontwikkelen**: Je AI assistenten zijn nu geconfigureerd!

## Tips

- **Niet zeker?** Kies een project type dat het meest lijkt op wat je wilt bouwen
- **Te veel modules?** Je kunt later modules verwijderen in `standards.md`
- **Te weinig modules?** Je kunt later modules toevoegen in `standards.md`
- **Wil je meer controle?** Gebruik dan `bun ai-toolkit-shared/scripts/init.js`

## Troubleshooting

### "Config already exists"

Als er al een `standards.md` bestaat, vraagt de wizard of je deze wilt overschrijven. Kies 'No' als je de bestaande configuratie wilt behouden.

### "Module not found"

Als een module niet gevonden wordt, controleer dan of de toolkit correct geïnstalleerd is:

```bash
bun install
```text

### "Sync failed"

Als de sync faalt, probeer dan:

```bash
# Check toolkit status and updates
bun ai-toolkit-shared/scripts/health.js
```

Dit controleert of alles correct is geconfigureerd.

## Zie ook

- [QUICK-START.md](QUICK-START.md) - Snelstart gids
- [CONFIG-FILES.md](CONFIG-FILES.md) - Configuratie uitleg
- [MODULES.md](MODULES.md) - Beschikbare modules
- [AGENTS.md](AGENTS.md) - Beschikbare agents
