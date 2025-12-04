# Templating Advies: HTML Templates & Template Inheritance voor Browser Setup

## Huidige Situatie

**Huidige implementatie:**
- Hono framework met `html` helper (tagged template literals)
- Handmatige HTML strings in JavaScript
- Geen template inheritance
- Geen scheiding tussen layout en content

**Problemen:**
- Code duplicatie (layout wordt herhaald)
- Moeilijk onderhoudbaar bij grotere wijzigingen
- Geen echte template inheritance zoals CouchCMS (`<cms:extends>`)
- HTML strings zijn moeilijk te lezen bij complexe templates

---

## Optie 1: Hono met JSX (Huidige Stack)

### Wat Hono biedt:
- ✅ `html` helper voor template literals
- ✅ JSX support (met `hono/jsx`)
- ✅ Component-based approach
- ✅ TypeScript support
- ✅ Zeer snel (geen runtime overhead)

### Wat Hono NIET biedt:
- ❌ Geen echte template inheritance (`extends`/`block` systeem)
- ❌ Geen standalone HTML template files
- ❌ Templates blijven in JavaScript/TypeScript code

### Voorbeeld met JSX:
```tsx
// layout.tsx
const Layout = (props: { title: string; children: any }) => html`
<!DOCTYPE html>
<html>
<head><title>${props.title}</title></head>
<body>${props.children}</body>
</html>`

// page.tsx
const Page = () => (
  <Layout title="Setup">
    <h1>Content</h1>
  </Layout>
)
```

**Voordelen:**
- ✅ Geen extra dependencies
- ✅ Type-safe met TypeScript
- ✅ Zeer snel (compile-time)
- ✅ Component reusability
- ✅ Goede IDE support

**Nadelen:**
- ❌ Geen echte template inheritance (moet props doorgeven)
- ❌ Templates blijven in code (geen standalone HTML files)
- ❌ Minder geschikt voor designers/non-developers
- ❌ Geen `super()` functionaliteit voor parent content

**Geschikt voor:** Kleine tot middelgrote applicaties, developers die JSX gewend zijn

---

## Optie 2: Nunjucks (Aanbevolen voor Template Inheritance)

### Wat Nunjucks biedt:
- ✅ **Echte template inheritance** (`{% extends %}` / `{% block %}`)
- ✅ Standalone HTML template files
- ✅ Jinja2-achtige syntax (bekend voor Python developers)
- ✅ Filters en macros
- ✅ `super()` voor parent content
- ✅ Werkt perfect met Bun

### Template Inheritance Voorbeeld:
```nunjucks
{# base.html #}
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}Default Title{% endblock %}</title>
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>

{# page.html #}
{% extends "base.html" %}

{% block title %}Setup Wizard{% endblock %}

{% block content %}
<h1>Welcome</h1>
{% endblock %}
```

**Voordelen:**
- ✅ **Echte template inheritance** (zoals CouchCMS)
- ✅ Standalone HTML files (designer-vriendelijk)
- ✅ `super()` functionaliteit
- ✅ Filters en macros voor complexe logica
- ✅ Goede documentatie
- ✅ Werkt met Bun (geen Node.js vereist)
- ✅ Kan gecombineerd worden met Hono

**Nadelen:**
- ❌ Extra dependency (`nunjucks`)
- ❌ Runtime template compilation (iets langzamer dan JSX)
- ❌ Nieuwe syntax leren (maar vergelijkbaar met CouchCMS)
- ❌ TypeScript support beperkt (geen type-checking in templates)

**Geschikt voor:** Applicaties die template inheritance nodig hebben, designers die templates moeten bewerken

---

## Optie 3: EJS (Embedded JavaScript Templates)

### Wat EJS biedt:
- ✅ Standalone HTML template files
- ✅ JavaScript syntax in templates
- ✅ `include()` voor partials
- ✅ Werkt met Bun

### Voorbeeld:
```ejs
<!-- layout.ejs -->
<!DOCTYPE html>
<html>
<head><title><%= title %></title></head>
<body><%- body %></body>
</html>

<!-- page.ejs -->
<%- include('layout', { title: 'Setup', body: '<h1>Welcome</h1>' }) %>
```

**Voordelen:**
- ✅ Standalone HTML files
- ✅ JavaScript syntax (geen nieuwe taal leren)
- ✅ Eenvoudig te begrijpen
- ✅ Werkt met Bun

**Nadelen:**
- ❌ **Geen echte template inheritance** (alleen includes)
- ❌ Geen `block` systeem
- ❌ Geen `super()` functionaliteit
- ❌ Minder krachtig dan Nunjucks
- ❌ Security concerns (kan JavaScript executeren)

**Geschikt voor:** Eenvoudige templates zonder inheritance nodig

---

## Optie 4: Handlebars (Al in Project)

### Wat Handlebars biedt:
- ✅ Al geïnstalleerd in project (`handlebars@^4.7.8`)
- ✅ Standalone HTML template files
- ✅ Partials support (`{{> partial}}`)
- ✅ Helpers systeem
- ✅ Logic-less (veiliger)

### Voorbeeld:
```handlebars
<!-- layout.hbs -->
<!DOCTYPE html>
<html>
<head><title>{{title}}</title></head>
<body>{{{body}}}</body>
</html>

<!-- page.hbs -->
{{> layout title="Setup" body="<h1>Welcome</h1>"}}
```

**Voordelen:**
- ✅ **Al geïnstalleerd** (geen extra dependency)
- ✅ Al gebruikt in project (sync.js)
- ✅ Standalone HTML files
- ✅ Logic-less (veiliger, minder XSS risico)
- ✅ Goede documentatie

**Nadelen:**
- ❌ **Geen echte template inheritance** (alleen partials)
- ❌ Geen `block` systeem zoals Nunjucks
- ❌ Geen `super()` functionaliteit
- ❌ Minder expressief dan Nunjucks

**Geschikt voor:** Projecten die al Handlebars gebruiken, eenvoudige templates

---

## Optie 5: Hono + Handlebars Combinatie

### Concept:
- Hono voor routing en server logic
- Handlebars voor HTML templating
- Best of both worlds

### Implementatie:
```javascript
import { Hono } from 'hono'
import Handlebars from 'handlebars'
import { readFileSync } from 'fs'

const app = new Hono()

// Compile template
const layoutTemplate = Handlebars.compile(
  readFileSync('templates/layout.hbs', 'utf8')
)

app.get('/', (c) => {
  const html = layoutTemplate({ title: 'Setup' })
  return c.html(html)
})
```

**Voordelen:**
- ✅ Gebruikt bestaande Handlebars dependency
- ✅ Standalone HTML template files
- ✅ Hono blijft voor routing/logic
- ✅ Scheiding van concerns

**Nadelen:**
- ❌ Nog steeds geen template inheritance
- ❌ Handmatige template loading
- ❌ Geen `block` systeem

---

## Optie 6: Hono + Nunjucks Combinatie (Aanbevolen)

### Concept:
- Hono voor routing en server logic
- Nunjucks voor HTML templating met inheritance
- Perfecte combinatie voor template inheritance

### Implementatie:
```javascript
import { Hono } from 'hono'
import nunjucks from 'nunjucks'
import { readFileSync } from 'fs'

const app = new Hono()

// Configure Nunjucks
const env = nunjucks.configure('templates', {
  autoescape: true,
  throwOnUndefined: false
})

app.get('/', (c) => {
  const html = env.render('page.html', { title: 'Setup' })
  return c.html(html)
})
```

**Voordelen:**
- ✅ **Echte template inheritance** (`extends`/`block`)
- ✅ Standalone HTML template files
- ✅ Hono blijft voor routing/logic
- ✅ `super()` functionaliteit
- ✅ Filters en macros
- ✅ Designer-vriendelijk

**Nadelen:**
- ❌ Extra dependency (`nunjucks`)
- ❌ Runtime compilation (maar cacheable)
- ❌ Nieuwe syntax leren

---

## Optie 7: Twig.js (JavaScript Port van Twig)

### Wat Twig.js biedt:
- ✅ **Echte template inheritance** (`{% extends %}` / `{% block %}`)
- ✅ Standalone HTML template files
- ✅ **Twig syntax** (bekend voor PHP/Symfony developers)
- ✅ Filters en functions
- ✅ `parent()` voor parent content (Twig's versie van `super()`)
- ✅ Werkt met Node.js en browsers

### Template Inheritance Voorbeeld:
```twig
{# base.html.twig #}
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}Default Title{% endblock %}</title>
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>

{# page.html.twig #}
{% extends "base.html.twig" %}

{% block title %}Setup Wizard{% endblock %}

{% block content %}
<h1>Welcome</h1>
{% endblock %}
```

**Voordelen:**
- ✅ **Echte template inheritance** (zoals CouchCMS)
- ✅ Standalone HTML template files
- ✅ **Twig syntax** (als je bekend bent met PHP/Symfony)
- ✅ `parent()` functionaliteit
- ✅ Filters en functions systeem
- ✅ Werkt met Bun (Node.js compatibel)

**Nadelen:**
- ⚠️ **Minder actief onderhouden** (laatste release ~2 jaar geleden)
- ⚠️ **Niet 100% compatibel** met PHP Twig (subset van features)
- ❌ Extra dependency (`twig`)
- ❌ Runtime template compilation
- ❌ Minder populair in JavaScript ecosystem dan Nunjucks
- ❌ TypeScript support beperkt

**Geschikt voor:** Developers die bekend zijn met PHP Twig/Symfony, projecten die Twig syntax prefereren

### Twig.js vs Nunjucks Vergelijking:

| Feature | Twig.js | Nunjucks |
|---------|---------|----------|
| **Template Inheritance** | ✅ | ✅ |
| **Syntax** | Twig (PHP-achtig) | Jinja2 (Python-achtig) |
| **Actief Onderhoud** | ⚠️ Laag | ✅ Hoog |
| **JavaScript Ecosystem** | ⚠️ Minder populair | ✅ Zeer populair |
| **Documentatie** | ⚠️ Beperkt | ✅ Uitgebreid |
| **Bun Compatibiliteit** | ✅ Ja | ✅ Ja |
| **CouchCMS Vergelijkbaarheid** | ✅ Zeer vergelijkbaar | ✅ Zeer vergelijkbaar |
| **Community Support** | ⚠️ Klein | ✅ Groot |

**Belangrijke Opmerking:**
- Nunjucks heeft zelfs **Twig-compatibiliteit features** (zoals `{% verbatim %}` tag)
- Nunjucks is geïnspireerd op zowel Jinja2 als Twig
- Nunjucks is actiever ontwikkeld en populairder in JavaScript ecosystem

---

## Vergelijkingstabel

| Feature | Hono JSX | Nunjucks | Twig.js | EJS | Handlebars | Hono+Nunjucks |
|---------|----------|----------|---------|-----|------------|---------------|
| **Template Inheritance** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Standalone HTML Files** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Block System** | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **super()/parent() Support** | ❌ | ✅ (`super()`) | ✅ (`parent()`) | ❌ | ❌ | ✅ |
| **TypeScript Support** | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| **Performance** | ⚡⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡ | ⚡⚡ |
| **Dependencies** | 0 | +1 | +1 | +1 | 0 (al aanwezig) | +1 |
| **Actief Onderhoud** | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| **Designer-Friendly** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **CouchCMS-achtig** | ❌ | ✅ | ✅ | ❌ | ⚠️ | ✅ |
| **JavaScript Ecosystem** | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |

---

## Aanbeveling

### Voor Template Inheritance: **Hono + Nunjucks** (of **Hono + Twig.js**)

**Waarom Nunjucks (Aanbevolen):**
1. ✅ **Echte template inheritance** zoals CouchCMS (`<cms:extends>`)
2. ✅ Standalone HTML template files (designer-vriendelijk)
3. ✅ `block` systeem en `super()` functionaliteit
4. ✅ Werkt perfect met Bun
5. ✅ Kan naadloos geïntegreerd worden met Hono
6. ✅ Vergelijkbare syntax met CouchCMS (makkelijker voor developers)
7. ✅ **Actief onderhouden** en populair in JavaScript ecosystem
8. ✅ Uitgebreide documentatie en community support

**Waarom Twig.js (Alternatief):**
1. ✅ **Echte template inheritance** zoals CouchCMS
2. ✅ **Twig syntax** (als je bekend bent met PHP/Symfony)
3. ✅ `parent()` functionaliteit (Twig's versie van `super()`)
4. ✅ Werkt met Bun (Node.js compatibel)
5. ⚠️ **Minder actief onderhouden** dan Nunjucks
6. ⚠️ **Minder populair** in JavaScript ecosystem

**Implementatie Plan:**
```javascript
// scripts/web/templates/base.html
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}CouchCMS AI Toolkit{% endblock %}</title>
    {% block head %}{% endblock %}
</head>
<body>
    {% block content %}{% endblock %}
</body>
</html>

// scripts/web/templates/setup/wizard.html
{% extends "base.html" %}

{% block title %}Setup Wizard - CouchCMS AI Toolkit{% endblock %}

{% block content %}
<div class="container">
    {% block wizard_content %}{% endblock %}
</div>
{% endblock %}
```

### Alternatief: Blijven bij Hono JSX

**Als je:**
- Geen template inheritance nodig hebt
- Developers-only team hebt
- TypeScript type-safety belangrijk vindt
- Performance kritiek is

**Dan:** Blijf bij Hono JSX met component-based approach

---

## Implementatie Kosten

### Hono + Nunjucks:
- **Tijd:** ~2-4 uur refactoring
- **Dependencies:** `nunjucks` (~50KB)
- **Learning Curve:** Laag (vergelijkbaar met CouchCMS)
- **Maintenance:** Laag (minder code duplicatie)

### Blijven bij Hono JSX:
- **Tijd:** 0 (geen wijzigingen)
- **Dependencies:** 0
- **Learning Curve:** 0 (al bekend)
- **Maintenance:** Hoog (code duplicatie blijft)

---

---

## Alternatieven voor Hono (Web Framework)

### Huidige Keuze: Hono
**Status:** ✅ Al geïmplementeerd en werkend

**Voordelen:**
- ✅ Al geïmplementeerd (geen migratie nodig)
- ✅ Zeer lichtgewicht (~50KB)
- ✅ Web Standards-based (werkt overal)
- ✅ Goede Bun compatibiliteit
- ✅ Eenvoudige API
- ✅ Geen vendor lock-in

**Nadelen:**
- ⚠️ Geen ingebouwde templating (moet je zelf toevoegen)
- ⚠️ Minder features dan full-stack frameworks

---

### Alternatief 1: Elysia (Bun-Native)

**Wat Elysia biedt:**
- ✅ **Bun-native** (geoptimaliseerd voor Bun)
- ✅ **End-to-end type safety** (TypeScript-first)
- ✅ Zeer snel (sneller dan Hono)
- ✅ Plugin systeem
- ✅ OpenAPI generatie
- ✅ Built-in validation (TypeBox)

**Templating:**
- ⚠️ Geen ingebouwde templating engine
- ⚠️ Moet je zelf toevoegen (Nunjucks/Twig.js)

**Voorbeeld:**
```typescript
import { Elysia } from 'elysia'
import nunjucks from 'nunjucks'

const app = new Elysia()
  .get('/', ({ set }) => {
    set.headers['content-type'] = 'text/html'
    return nunjucks.render('page.html', { title: 'Setup' })
  })
  .listen(3000)
```

**Voordelen:**
- ✅ **Bun-native** (beste performance op Bun)
- ✅ **Type-safe** (end-to-end TypeScript)
- ✅ Zeer snel
- ✅ Modern en actief ontwikkeld
- ✅ Goede documentatie

**Nadelen:**
- ❌ **Migratie nodig** (Hono → Elysia)
- ❌ Bun-specifiek (minder portabel dan Hono)
- ❌ Geen ingebouwde templating
- ❌ Meer complexiteit voor eenvoudige use case

**Geschikt voor:** Nieuwe projecten op Bun, complexe API's met type safety

---

### Alternatief 2: Fastify

**Wat Fastify biedt:**
- ✅ Zeer snel (sneller dan Express)
- ✅ Plugin systeem
- ✅ Schema validation
- ✅ View engine support (Nunjucks, Handlebars, EJS)
- ✅ Mature en stabiel

**Templating:**
- ✅ **Built-in view engine support**
- ✅ Kan Nunjucks/Handlebars/EJS gebruiken

**Voorbeeld:**
```javascript
import Fastify from 'fastify'
import nunjucks from 'nunjucks'

const fastify = Fastify()
fastify.register(require('@fastify/view'), {
  engine: {
    nunjucks: nunjucks
  }
})

fastify.get('/', (req, reply) => {
  return reply.view('page.html', { title: 'Setup' })
})
```

**Voordelen:**
- ✅ **View engine support** (makkelijk templating)
- ✅ Zeer snel
- ✅ Mature en stabiel
- ✅ Goede plugin ecosystem
- ✅ Werkt met Bun (Node.js compatibel)

**Nadelen:**
- ❌ **Migratie nodig** (Hono → Fastify)
- ❌ Node.js-focused (minder Bun-native)
- ❌ Meer boilerplate dan Hono
- ❌ Minder Web Standards-based

**Geschikt voor:** Node.js projecten, complexe applicaties met veel plugins

---

### Alternatief 3: Express

**Wat Express biedt:**
- ✅ Meest populaire Node.js framework
- ✅ View engine support
- ✅ Grote ecosystem
- ✅ Veel tutorials/documentatie

**Nadelen:**
- ❌ **Legacy** (ouder design)
- ❌ Langzamer dan Hono/Fastify/Elysia
- ❌ Geen type safety out-of-the-box
- ❌ Niet geoptimaliseerd voor Bun
- ❌ Migratie nodig

**Geschikt voor:** Legacy projecten, teams die Express kennen

---

### Alternatief 4: Blijven bij Hono (Aanbevolen)

**Waarom Hono behouden:**
- ✅ **Al geïmplementeerd** (geen migratie)
- ✅ **Web Standards** (werkt overal)
- ✅ Lichtgewicht en snel
- ✅ Goede Bun compatibiliteit
- ✅ Eenvoudig te begrijpen
- ✅ Geen vendor lock-in

**Met Nunjucks voor templating:**
- ✅ Beste van beide werelden
- ✅ Hono voor routing/logic
- ✅ Nunjucks voor templating
- ✅ Geen migratie nodig

---

## Mijn Weloverwogen Advies

### 🎯 Mijn Voorkeur: **Hono + Nunjucks**

**Waarom dit de slimste keuze is:**

1. **Praktisch:**
   - ✅ Hono is **al geïmplementeerd** en werkt goed
   - ✅ Geen migratie nodig (tijd besparen)
   - ✅ Al getest en werkend

2. **Technisch:**
   - ✅ Hono is **lichtgewicht** en snel genoeg voor deze use case
   - ✅ Nunjucks biedt **echte template inheritance**
   - ✅ Combinatie is **bewezen** en stabiel
   - ✅ Werkt perfect met Bun

3. **Onderhoudbaar:**
   - ✅ Minder code duplicatie (template inheritance)
   - ✅ Makkelijker te onderhouden (standalone HTML files)
   - ✅ Designer-vriendelijk (templates kunnen bewerkt worden zonder code)

4. **Toekomstbestendig:**
   - ✅ Web Standards-based (Hono)
   - ✅ Actief onderhouden (beide)
   - ✅ Geen vendor lock-in
   - ✅ Makkelijk te migreren later (als nodig)

### ⚠️ Wanneer Elysia Overwegen:

**Alleen als:**
- Je een **nieuw project** start (niet migreren)
- Je **end-to-end type safety** nodig hebt
- Je **complexe API's** bouwt
- Performance **kritiek** is

**Voor deze browser setup wizard:** Overkill - Hono is meer dan voldoende

### ❌ Wanneer Fastify Overwegen:

**Alleen als:**
- Je **veel plugins** nodig hebt
- Je **Node.js ecosystem** prefereren
- Je **mature framework** nodig hebt voor enterprise

**Voor deze browser setup wizard:** Te zwaar - Hono is lichter en sneller

---

## Conclusie

**Voor template inheritance:** Kies **Hono + Nunjucks**
- Biedt echte template inheritance zoals CouchCMS
- Standalone HTML files
- Designer-vriendelijk
- Makkelijker onderhoudbaar
- **Geen migratie nodig** (Hono blijft)

**Voor huidige setup zonder inheritance:** Blijf bij **Hono JSX**
- Geen extra dependencies
- Type-safe
- Zeer snel
- Component-based

**Voor web framework:** Blijf bij **Hono**
- Al geïmplementeerd
- Werkt perfect
- Geen migratie nodig
- Web Standards-based

---

## Vraag voor Beslissing

Wil je:
1. **Template inheritance met Nunjucks** → Hono + Nunjucks (Aanbevolen)
2. **Template inheritance met Twig syntax** → Hono + Twig.js (Als je Twig/Symfony gewend bent)
3. **Blijven bij huidige aanpak** → Hono JSX (met verbeterde component structuur)
4. **Handlebars gebruiken** (al aanwezig) → Geen inheritance, wel partials

**Mijn Aanbeveling:**
- **Nunjucks** als je template inheritance wilt (actiever onderhouden, populairder)
- **Twig.js** alleen als je specifiek Twig syntax nodig hebt of bekend bent met PHP/Symfony

Laat weten welke optie je voorkeur heeft, dan kunnen we de implementatie starten!
