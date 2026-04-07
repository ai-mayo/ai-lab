# AI Lab - Gemeente Mayostad
## Volledig ontwerp en takenuitwerking

---

## De gebruiker

**Wie ben je?**
Je bent een nieuwe medewerker bij de afdeling VTH (Vergunningen, Toezicht en Handhaving) van Gemeente Mayostad. De gemeente doet mee aan een AI-pilot en jij bent een van de eerste medewerkers die ermee gaat werken.

**Je teamleider:** Marco Pieterse (VTH)
**Je directe collega:** Anouk Willems (vergunningverlener)
**AI-projectleider:** Tom Bakker (ICT)
**CISO:** Ahmed Hassan (bewaakt privacy/AVG)

**Wat je al weet:** Je hebt basiskennis van computers en je werk als ambtenaar. Je hebt nog NOOIT een AI-tool gebruikt.

**Wat je gaat leren:**
- Hoe generatieve AI werkt (en wat het niet kan)
- Hoe je een goede prompt schrijft
- Welke data wel/niet in AI-tools mag
- Hoe je AI-output controleert op fouten
- Hoe AI-agents werken en wat de risico's zijn

---

## De werkplek (desktop)

Bij het opstarten zie je een macOS/Windows-achtig bureaublad met:

### Apps op het bureaublad:
| App | Functie | Echte UI? |
|-----|---------|-----------|
| MayoBoard | Kanban takenbord (Jira-stijl) | Ja |
| Vergunningen | Vergunningtool met kaart | Ja |
| Zaaksysteem | Alle zaken in tabelweergave | Ja |
| ChatGPT | AI-tool (extern, Amerikaans) | Ja |
| GAIMS | Lokale AI-chatbot (AVG-proof) | Ja |
| Copilot | Microsoft AI-tool | Ja |
| MayoWiki | Kennisbank (BookStack-stijl) | Ja |
| WiWa | Wie is Waarvan - collegaregister | Ja |
| MayoMail | Email | Ja |
| MayoChat | Interne berichten | Ja |

### Widgets rechts:
- Taken vandaag (klikbaar naar MayoBoard)
- Welkomstbericht met rol

### Menubalk:
- Apple-logo, Opslaan, Archief, Weergave
- Wifi, batterij, klok

---

## Dag 1: De Brief (VTH)

### Doel
De gebruiker leert een goede prompt schrijven door zelf een brief op te stellen in ChatGPT.

### Verhaallijn
Je eerste dag bij VTH. Marco (teamleider) vraagt je een brief te schrijven aan meneer Van Dijk van Bakkerij Van Dijk. Zijn terrasvergunning is vertraagd door een bezwaar van de buurman. Verwacht besluit: 10 april.

### Flow
1. **Desktop verkennen** - Gebruiker klikt rond, opent WiWa, MayoWiki, etc.
2. **Taak verschijnt op MayoBoard** (na 12 sec) - Melding rechtsonder
3. **Gebruiker opent MayoBoard** - Ziet de taak met details + hint
4. **Hint vertelt:** 
   - Stap 1: MayoWiki > Schrijfwijzer (hoe schrijft de gemeente?)
   - Stap 2: MayoWiki > Lopende Zaken (details Van Dijk)
   - Stap 3: Open ChatGPT en schrijf de prompt
5. **Gebruiker schrijft zelf de prompt in ChatGPT**
6. **Systeem checkt op elementen:**
   - Ontvanger (Van Dijk, bakkerij) - 20 punten
   - Onderwerp (terrasvergunning) - 15 punten
   - Reden (bezwaar, vertraging) - 20 punten
   - Datum (10 april) - 15 punten
   - Toon (excuses, begrip) - 10 punten
   - Contact (14 0555) - 10 punten
   - Afsluiting (gemeente, vriendelijke groet) - 10 punten
7. **AI genereert brief op basis van score:**
   - 90%+ = perfecte brief
   - 60-89% = goede brief maar mist details
   - 30-59% = matige brief, veel feedback
   - <30% = slechte brief
8. **Feedback + inzicht:** "Een goede prompt = WIE + WAT + WANNEER + HOE + FORMAAT"
9. **Gebruiker kan opnieuw proberen**

### Wat de gebruiker leert
- Een goede prompt schrijven
- De schrijfwijzer van de gemeente raadplegen
- Relevante informatie opzoeken voor de prompt
- AI-output beoordelen

---

## Dag 2: De Hallucinatie (Sociaal Domein)

### Doel
De gebruiker leert dat AI liegt en hoe je dat herkent.

### Verhaallijn
Dag 2. Bas van het Sociaal Domein heeft ChatGPT een WMO-beschikking laten schrijven. Het ziet er professioneel uit, maar er zitten fouten in.

### Flow
1. **Taak op MayoBoard:** "WMO-beschikking Bas controleren"
2. **Gebruiker opent de brief in een viewer**
3. **Scan-opdracht:** Klik op alle zinnen die niet kloppen
4. **Verzonnen elementen:**
   - Artikel 2.3.5 lid 4 WMO 2015 (bestaat niet)
   - Eigen bijdrage van 19,50 per 4 weken (verzonnen bedrag, CAK bepaalt dit)
   - Thuiszorgorganisatie "Beter Thuis B.V." (bestaat niet)
   - SCP-onderzoek 2025 met 68% statistiek (verzonnen)
5. **Per gevonden fout:** uitleg waarom het fout is + wat het risico is
6. **Inzicht:** AI hallucineert - verzint wetsartikelen, bedrijven, cijfers

### Privacy-opdracht (vervolg)
7. **Sorteer-opdracht:** Welke gegevens mag je WEL/NIET in ChatGPT?
   - Wel: openbare teksten, raadsbesluiten, communicatie
   - Niet: BSN, medische data, zaaksysteem-gegevens, wachtwoorden

### Bias-opdracht (vervolg)
8. **Simulatie:** Hoe AI jouw vooroordelen overneemt
   - 3 rondes waarin de gebruiker ziet hoe AI bias opbouwt

### Wat de gebruiker leert
- AI verzint dingen die echt lijken (hallucinaties)
- Altijd controleren, vooral juridische teksten
- Welke data wel/niet in AI-tools mag (AVG)
- Hoe bias werkt in AI

---

## Dag 3: De BOA-Agent (BOA-afdeling)

### Doel
De gebruiker leert wat AI-agents zijn en hoe je ze veilig configureert.

### Verhaallijn
Tom wil een AI-agent voor de BOA's die controlerapporten schrijft. Dennis (coordinator BOA's) is enthousiast maar Ahmed (CISO) maakt zich zorgen over privacy.

### Flow
1. **Vergelijking chatbot vs agent** - Twee scenario's naast elkaar
2. **Agent configureren:**
   - Rol: Wat is de agent?
   - Kennis: Wat weet de agent?
   - Mag wel: Welke acties?
   - Mag niet: Grenzen?
   - Escalatie: Wanneer mens inschakelen?
3. **Test de agent** met 3 gesprekken:
   - Standaardvraag (test kennis)
   - Grensoverschrijdend verzoek (test grenzen)
   - Complexe situatie (test escalatie)
4. **Red-team opdracht:** Bekijk een slecht geconfigureerde agent en vind de fouten

### Agent info zichtbaar per taak:
- Welk model (GPT-4o, Claude, etc.)
- Temperature instelling
- Welke tools/skills de agent heeft
- Grenzen en beperkingen

### Wat de gebruiker leert
- Verschil chatbot vs agent
- Hoe je een agent veilig configureert
- Waarom grenzen cruciaal zijn
- Red-teaming: hoe test je een agent?

---

## Dag 4: De Vergadering (Sociaal Domein)

### Doel
De gebruiker leert AI als assistent te gebruiken bij dagelijkse taken.

### Verhaallijn
Vrijdag. Overleg Sociaal Domein over WMO-beleid. Sandra vraagt of jij de notulen kunt doen.

### Flow
1. **Vergadernotities omzetten** naar gestructureerde samenvatting
2. **Output controleren:** Checklist - zijn alle actiepunten erin? Klopt alles?
3. **Rollen-opdracht:** Dezelfde vraag, 3 verschillende AI-rollen
   - Geen rol = oppervlakkig antwoord
   - Beleidsadviseur-rol = diepgaande analyse
   - Communicatie-rol = eenvoudige samenvatting

### Wat de gebruiker leert
- AI als notuleerder
- Output controleren op volledigheid
- De kracht van rollen in prompts

---

## Toekomstige dagen (nog te bouwen)

### Dag 5: De Deepfake (Communicatie)
- AI-gegenereerde beelden herkennen
- Desinformatie spotting
- Fact-checking routine bouwen

### Dag 6: De Inwoner (KCC)
- AI als KCC-medewerker testen
- Complexe burgervragen beantwoorden
- Wanneer escaleert de AI naar een mens?

### Dag 7: De Eindpresentatie
- Alles samenvatten
- Certificaat/badge verdienen
- Aanbevelingen doen voor de gemeente

---

## Interactie-principes

1. **Geen quizjes** - altijd DOE-opdrachten
2. **De gebruiker schrijft zelf** - niet kiezen uit opties
3. **Informatie moet je zelf zoeken** - staat verspreid over MayoWiki, WiWa, MayoChat
4. **Onzin-info ertussen** - parkeerbeleid, kantine, BHV (niet relevant voor de taak)
5. **Feedback pas achteraf** - geen live checklist, je ontdekt zelf wat er mist
6. **AI-agents zichtbaar** - model, temperature, tools, skills bij elk onderdeel
7. **Desktop voelt echt** - alle apps werken, je klikt zelf door

---

## Technische stack

- Pure HTML/CSS/JS (geen framework)
- GitHub Pages hosting (ai-mayo.github.io/ai-lab)
- Leaflet.js voor kaarten
- randomuser.me voor profielfoto's
- robohash.org voor robot-foto's
- URL-based voortgang opslaan
- Responsive: laptop only (mobiel geblokkeerd)
