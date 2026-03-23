# Minimales TOC Beispiel mit PagedJS

## Verwendung

1. **Datei öffnen**: Öffnen Sie `toc-minimal-example.html` in einem modernen Browser
2. **PagedJS laden lassen**: Warten Sie, bis PagedJS das Dokument verarbeitet hat
3. **Drucken/PDF**:
   - Drucken über Browser (Strg+P / Cmd+P)
   - Oder "Als PDF speichern" wählen

## Wichtige Features

### ✅ Automatische Seitenzahlen
- Seitenzahlen im Inhaltsverzeichnis werden automatisch generiert
- Bei Änderungen am Content aktualisieren sich die Seitenzahlen automatisch
- Keine manuelle Pflege erforderlich

### ✅ Professionelles Layout
- A4 Format mit korrekten Rändern
- Kopfzeilen mit Seitennummerierung
- Fußzeilen mit Dokumenttitel
- Verschiedene Seitentypen (@page toc, @page content)

### ✅ Über 20 Seiten Content
- 9 Hauptkapitel
- Realistische Textmengen
- Einige Kapitel gehen über mehrere Seiten
- Kontrollierte Seitenumbrüche

## Kernkonzepte

### CSS target-counter()
```css
.toc-link::after {
    content: target-counter(attr(href), page);
    /* Generiert automatisch die Seitenzahl des verlinkten Elements */
}
```

### HTML-Struktur
```html
<a href="#kapitel-id" class="toc-link">Kapiteltitel</a>
<!-- Seitenzahl wird automatisch nach dem Link eingefügt -->
```

### Seitentypen definieren
```css
@page toc {
    /* Spezielle Stile für TOC-Seiten */
}

@page content {
    /* Stile für normale Inhaltsseiten */
}
```

## Anpassungen

### Neue Kapitel hinzufügen:
1. TOC-Eintrag hinzufügen mit entsprechendem `href="#neue-id"`
2. Neues Kapitel mit `id="neue-id"` erstellen
3. PagedJS generiert automatisch die korrekte Seitenzahl

### Styling anpassen:
- Farben, Schriftarten in den CSS-Variablen ändern
- @page Regeln für andere Seitengrößen anpassen
- Layout-Klassen nach Bedarf modifizieren

## Browser-Kompatibilität
- Chrome/Chromium: ✅ Vollständig unterstützt
- Firefox: ✅ Unterstützt
- Safari: ✅ Unterstützt
- Edge: ✅ Unterstützt

## PDF-Generierung
Für beste Ergebnisse beim PDF-Export:
1. Chrome verwenden
2. Druckeinstellungen: "Als PDF speichern"
3. Optionen: "Hintergrundgrafiken" aktivieren
