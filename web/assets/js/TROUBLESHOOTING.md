# JavaScript Refactoring - Troubleshooting

## Error: "(intermediate value)(intermediate value)(intermediate value)(...) is not a function"

### Oplossing 1: Browser Cache Leegmaken

De browser kan een oude versie van `wizard.js` laden uit cache:

1. **Hard Refresh**:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) of `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` (Windows) of `Cmd+Shift+R` (Mac)

2. **DevTools Cache Disable**:
   - Open DevTools (F12)
   - Network tab → Check "Disable cache"
   - Refresh de pagina

3. **Browser Cache Leegmaken**:
   - Verwijder browser cache voor localhost
   - Herstart browser

### Oplossing 2: Build Opnieuw Uitvoeren

Zorg dat de build opnieuw is uitgevoerd na alle fixes:

```bash
cd scripts/web
bun build.js
```

### Oplossing 3: Verifieer Module Volgorde

De modules moeten in deze volgorde worden geladen:

1. `core/constants.js`
2. `core/dom.js`
3. `core/htmx.js`
4. `core/state.js`
5. Wizard modules...
6. Step modules...

Build.js bundelt ze al in de juiste volgorde.

### Oplossing 4: Controleer Browser Console

Kijk in de browser console voor:
- Dependency errors (WIZARD_CONFIG, WIZARD_CONSTANTS, DOMUtils)
- Syntax errors
- Loading errors

### Oplossing 5: Test Direct

Test of de gebundelde file werkt:

```bash
# Syntax check
node -c scripts/web/public/dist/js/wizard.js

# File size check (moet ~81 KB zijn)
ls -lh scripts/web/public/dist/js/wizard.js
```

## Status

✅ Alle modules hebben semicolons (`})();`)
✅ Optionele chaining operators zijn vervangen waar mogelijk
✅ Build.js bundelt in correcte volgorde
✅ Dependency checks zijn toegevoegd

## Als Probleem Blijft Bestaan

1. Check browser console voor exacte error
2. Check Network tab of wizard.js correct wordt geladen
3. Verifieer dat build recent is (check timestamp)
4. Probeer incognito/private browsing mode
