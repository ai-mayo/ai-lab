// AI Lab — Mission Data
// Missions simulate real AI tools (ChatGPT, Claude, Copilot, Gemini)
// with hands-on tasks that teach through doing

const STORY = {
  title: "Eerste Week bij Gemeente Mayostad",
  intro: "Je bent net aangenomen bij de afdeling VTH (Vergunningen, Toezicht en Handhaving) van Gemeente Mayostad. De gemeente doet mee aan een AI-pilot en jij bent een van de eerste medewerkers die ermee gaat werken. Vandaag is je eerste werkdag.",
};

const MISSIONS = [
  // ── DAG 1: De Eerste Dag ──────────────────────────────
  {
    id: "prompt-lab",
    name: "Dag 1: De Eerste Dag",
    desc: "Je eerste werkdag bij de afdeling VTH van Gemeente Mayostad. Je leert het intranet kennen en schrijft je eerste brief met AI.",
    icon: "\u{1F3DB}",
    color: "var(--cyan)",
    colorDim: "var(--cyan-dim)",
    tag: "DAG 1",
    tagColor: "var(--cyan)",
    xp: 500,
    tool: "chatgpt",
    storyIntro: "Maandagochtend. Jouw eerste dag bij de afdeling VTH (Vergunningen, Toezicht en Handhaving) van Gemeente Mayostad. 82.000 inwoners, 650 medewerkers. De gemeente doet mee aan een AI-pilot en jij bent een van de eerste medewerkers die ermee gaat werken. Marco Pieterse, je teamleider, heeft je werkplek al ingericht.",
    tasks: [
      // ── Segment 1: Welkomstvideo ──
      {
        type: "scenario",
        label: "VIDEO",
        title: "Welkom bij Gemeente Mayostad",
        desc: "Een korte introductie over je nieuwe werkplek en de AI-pilot.",
        interaction: {
          type: "video-segment",
          videoSrc: "video-segment-1.mp4",
          caption: "Welkom bij de afdeling VTH van Gemeente Mayostad. Je gaat meedoen aan een AI-pilot.",
          nextLabel: "Start je werkdag \u2192"
        },
        insight: "Gemeente Mayostad heeft 82.000 inwoners en 650 medewerkers. De afdeling VTH behandelt vergunningen, toezicht en handhaving."
      },
      // ── Desktop verkennen + taak ──
      {
        type: "scenario",
        label: "VERKENNEN",
        title: "Je werkplek verkennen",
        desc: "Verken het intranet van Gemeente Mayostad. Klik rond, leer de organisatie kennen. Wacht op je eerste opdracht van Marco.",
        interaction: {
          type: "intranet-then-prompt",
          tool: "chatgpt",
          taskPopupDelay: 15000,
          // Video segments to show during the desktop phase
          videoSegments: {
            onFirstExplore: { src: "video-segment-2.mp4", caption: "Marco geeft je een rondleiding langs de systemen.", delay: 25000 },
            onTaskAssigned: { src: "video-segment-3.mp4", caption: "Marco legt de casus Van Dijk uit." },
            onWikiVisited: { src: "video-segment-4.mp4", caption: "Zoek de informatie die je nodig hebt op het intranet." },
            onPromptWritten: { src: "video-segment-5.mp4", caption: "Reflectie: hoe was je prompt?" },
            onFeedback: { src: "video-segment-6.mp4", caption: "Kernboodschap en een vooruitblik op Dag 2." }
          },
          taskPopup: {
            from: "Marco Pieterse",
            fromRole: "Teamleider VTH",
            avatar: "MP",
            message: "Hoi! Welkom bij VTH. Er moet vandaag nog een brief uit naar dhr. Van Dijk over zijn terrasvergunning. Die is vertraagd door een bezwaar van een buurman. Kun jij dit oppakken? De details staan in MayoWiki onder Lopende Zaken. Check ook even de Schrijfwijzer. Gebruik ChatGPT als je wilt, maar lever geen brief af die je niet zelf gecheckt hebt.",
            urgency: "Vandaag afhandelen"
          },
          cliffhanger: {
            from: "Anouk Willems",
            fromRole: "Vergunningverlener VTH",
            avatar: "AW",
            message: "Heb je die beschikking van Bas gezien? Met ChatGPT geschreven. Ziet er professioneel uit, maar er staan wetsartikelen in die niet bestaan... Morgen bespreken?"
          },
          wiki: {
            pages: {
              home: {
                title: "MayoWiki",
                icon: "",
                content: [
                  { type: "banner", text: "MayoWiki \u2014 Kennisbank Gemeente Mayostad. Je bent ingelogd als VTH-medewerker." },
                  { type: "cards", items: [
                    { title: "Over Mayostad", icon: "", link: "about" },
                    { title: "Schrijfwijzer", icon: "", link: "tone" },
                    { title: "Lopende Zaken VTH", icon: "", link: "lopende-zaken" },
                    { title: "AI bij de Gemeente", icon: "", link: "ai" },
                    { title: "Tools & Apps", icon: "", link: "tools" },
                    { title: "AI Huisregels", icon: "", link: "rules" },
                    { title: "Parkeerbeleid", icon: "", link: "parking" },
                    { title: "Kantine & Lunch", icon: "", link: "kantine" },
                    { title: "BHV & Veiligheid", icon: "", link: "bhv" },
                    { title: "Vergaderruimtes", icon: "", link: "vergader" },
                    { title: "Declaraties", icon: "", link: "declaraties" },
                    { title: "Verlof & Ziekte", icon: "", link: "verlof" },
                    { title: "Huisvesting", icon: "", link: "huisvesting" },
                    { title: "Duurzaamheid", icon: "", link: "duurzaam" }
                  ]}
                ]
              },
              about: {
                title: "Over Gemeente Mayostad",
                icon: "",
                content: [
                  { type: "heading", text: "Gemeente Mayostad" },
                  { type: "text", text: "Gemeente Mayostad is een middelgrote gemeente in het oosten van Nederland. Met 82.000 inwoners en 650 medewerkers zet Mayostad in op innovatie, dienstverlening en digitalisering." },
                  { type: "text", text: "Onze missie: een toegankelijke, betrouwbare en moderne gemeente zijn voor al onze inwoners. We investeren in slimme oplossingen die onze medewerkers ondersteunen en onze dienstverlening verbeteren." },
                  { type: "info", label: "Inwoners", value: "82.000" },
                  { type: "info", label: "Medewerkers", value: "650" },
                  { type: "info", label: "Afdelingen", value: "8 (waaronder VTH, KCC, Sociaal Domein, Burgerzaken, BOA)" },
                  { type: "info", label: "Gemeentehuis", value: "Raadhuisplein 1, 8011 AA Mayostad" },
                  { type: "info", label: "Algemeen telefoonnummer", value: "14 0555" },
                  { type: "info", label: "Burgemeester", value: "Mw. J.A. van den Broek" },
                  { type: "heading", text: "Afdeling VTH" },
                  { type: "text", text: "De afdeling Vergunningen, Toezicht en Handhaving (VTH) behandelt alle vergunningsaanvragen (bouw, horeca, evenementen), houdt toezicht op naleving en handhaaft waar nodig. De afdeling telt 18 medewerkers onder leiding van Marco Pieterse." }
                ]
              },
              tone: {
                title: "Schrijfwijzer Gemeente Mayostad",
                icon: "",
                content: [
                  { type: "heading", text: "Zo schrijven wij bij Gemeente Mayostad" },
                  { type: "text", text: "Wij schrijven op B1-niveau: helder, persoonlijk en respectvol. Onze inwoners moeten onze brieven in \u00e9\u00e9n keer begrijpen, zonder woordenboek of juridische kennis." },

                  { type: "heading", text: "Aanhef en afsluiting" },
                  { type: "do-dont", dos: [
                    "Geachte heer/mevrouw [achternaam],",
                    "Met vriendelijke groet,",
                    "namens het college van burgemeester en wethouders van Mayostad,",
                    "[naam behandelaar]"
                  ], donts: [
                    "Beste meneer/mevrouw (te informeel voor formele brieven)",
                    "Hoogachtend (verouderd)",
                    "Naar aanleiding van uw schrijven d.d. 12 februari jl... (te formeel)"
                  ]},

                  { type: "heading", text: "Toon en taalgebruik" },
                  { type: "do-dont", dos: [
                    "Actief schrijven: 'Wij hebben besloten' in plaats van 'Er is besloten'",
                    "Eenvoudige woorden: 'besluit' in plaats van 'beschikking'",
                    "Eenvoudige woorden: 'uitstellen' in plaats van 'verdagen'",
                    "Begrip tonen: 'Wij begrijpen dat dit vervelend voor u is'",
                    "Concreet: noem data, namen, telefoonnummers"
                  ], donts: [
                    "Passief schrijven: 'Er is besloten dat...'",
                    "Jargon: 'beschikking', 'verdagen', 'ingebrekestelling'",
                    "Juridisch taalgebruik dat inwoners niet begrijpen",
                    "Afstandelijk: 'Conform artikel 4:14 Awb delen wij u mede...'",
                    "Afkortingen zonder uitleg: APV, Awb, OOV"
                  ]},

                  { type: "heading", text: "Structuur van een brief" },
                  { type: "rule", num: "1", text: "Begin met het onderwerp en wat er aan de hand is" },
                  { type: "rule", num: "2", text: "Leg uit waarom (reden, context)" },
                  { type: "rule", num: "3", text: "Noem concrete data en vervolgstappen" },
                  { type: "rule", num: "4", text: "Geef contactgegevens voor vragen" },
                  { type: "rule", num: "5", text: "Sluit af namens het college" },

                  { type: "text", text: "Vuistregel: schrijf zoals je zou praten tegen een inwoner die je respecteert. Formeel maar warm." }
                ]
              },
              "lopende-zaken": {
                title: "Lopende Zaken VTH",
                icon: "",
                content: [
                  { type: "heading", text: "Lopende vergunningszaken" },
                  { type: "text", text: "Hieronder de actieve zaken van de afdeling VTH. Klik op een zaak voor details." },
                  { type: "cards", items: [
                    { title: "Zaak Van Dijk \u2014 Terrasvergunning (VERTRAAGD)", icon: "", link: "zaak-vandijk" },
                  ]},
                  { type: "heading", text: "Overige lopende zaken" },
                  { type: "tool", name: "VTH-2026-00412 \u2014 Omgevingsvergunning Sportschool FitNow", desc: "Uitbreiding bestaand pand. Wacht op advies welstandscommissie.", status: "In behandeling" },
                  { type: "tool", name: "VTH-2026-00398 \u2014 Kapvergunning Esdoorn Kerkstraat", desc: "Herplantplicht opgelegd. Verleend.", status: "Verleend" },
                  { type: "tool", name: "VTH-2026-00405 \u2014 Evenementenvergunning Koningsdag", desc: "Inclusief geluidsontheffing tot 23:00.", status: "Verleend" },
                ]
              },
              "zaak-vandijk": {
                title: "Zaak Van Dijk \u2014 Terrasvergunning",
                icon: "",
                content: [
                  { type: "heading", text: "Zaakgegevens" },
                  { type: "info", label: "Zaaknummer", value: "VTH-2026-00347" },
                  { type: "info", label: "Type", value: "Terrasvergunning (horeca)" },
                  { type: "info", label: "Status", value: "\u26A0 Vertraagd \u2014 brief naar aanvrager vereist" },

                  { type: "heading", text: "Aanvrager" },
                  { type: "info", label: "Naam", value: "Dhr. H.J. van Dijk" },
                  { type: "info", label: "Bedrijf", value: "Bakkerij Van Dijk" },
                  { type: "info", label: "Adres", value: "Marktstraat 14, 8011 AB Mayostad" },
                  { type: "info", label: "Datum aanvraag", value: "12 februari 2026" },

                  { type: "heading", text: "Aanvraag" },
                  { type: "text", text: "Gevraagd: terras van 12 m\u00B2 (4x3 meter), 6 tafels, 12 stoelen. Seizoen: 1 april tot en met 31 oktober 2026." },

                  { type: "heading", text: "Bezwaar" },
                  { type: "text", text: "Op 15 maart 2026 is een bezwaar ontvangen van dhr. Jansen (buurman, Marktstraat 16). Gronden: geluidsoverlast, beperking doorgang voetgangers, waardevermindering pand." },

                  { type: "heading", text: "Advies en wetsartikelen" },
                  { type: "text", text: "Advies team Openbare Orde en Veiligheid (OOV): geen bezwaar, mits looppad minimaal 1,5 meter breed blijft." },
                  { type: "text", text: "Relevante wetsartikelen: art. 4:14 Awb (verlenging beslistermijn), art. 2:10 APV Mayostad (terrasvergunning)." },

                  { type: "heading", text: "Nieuwe beslisdatum" },
                  { type: "info", label: "Oorspronkelijke beslisdatum", value: "12 april 2026 (8 weken na aanvraag)" },
                  { type: "info", label: "Nieuwe beslisdatum", value: "10 april 2026" },
                  { type: "text", text: "De aanvrager is NOG NIET ge\u00efnformeerd over de vertraging. Er moet vandaag een brief uit." },

                  { type: "heading", text: "Behandelaar" },
                  { type: "info", label: "Behandelaar", value: "Anouk Willems" },
                  { type: "info", label: "Telefoon", value: "14 0555 toestel 2237" },
                  { type: "info", label: "Email", value: "vth@mayostad.nl" }
                ]
              },
              ai: {
                title: "AI bij de Gemeente",
                icon: "",
                content: [
                  { type: "heading", text: "Wat is AI?" },
                  { type: "text", text: "Kunstmatige intelligentie (AI) is een verzamelnaam voor computersystemen die taken uitvoeren waarvoor normaal menselijke intelligentie nodig is: tekst begrijpen, patronen herkennen, beslissingen nemen, content genereren." },

                  { type: "heading", text: "Soorten AI" },
                  { type: "tool", name: "Generatieve AI", desc: "Maakt nieuwe content: teksten, brieven, samenvattingen. Voorbeelden: ChatGPT, Claude, Gemini, Copilot. Dit is wat jij gaat gebruiken bij de gemeente.", status: "Verplicht" },
                  { type: "tool", name: "Voorspellende AI", desc: "Analyseert data en voorspelt patronen. Bijv: welke wijken hebben meer onderhoud nodig? Welke aanvragen duren het langst? Wordt gebruikt door Stadsbeheer en Financien.", status: "Optioneel" },
                  { type: "tool", name: "Computer Vision", desc: "Herkent en analyseert beelden. Bijv: automatisch schade detecteren op foto's van wegen of gebouwen. Pilot bij Openbare Werken.", status: "Optioneel" },
                  { type: "tool", name: "Spraak-AI", desc: "Zet spraak om naar tekst en andersom. Bijv: automatisch telefoongesprekken samenvatten voor het KCC. Pilot fase.", status: "Optioneel" },
                  { type: "tool", name: "AI Agents", desc: "AI die zelfstandig taken uitvoert zonder dat een mens elke stap aanstuurt. Bijv: automatisch eenvoudige burgervragen beantwoorden via de website. Pilot bij KCC.", status: "Optioneel" },

                  { type: "heading", text: "Hoe werkt generatieve AI?" },
                  { type: "text", text: "Een taalmodel (zoals ChatGPT) is getraind op miljarden teksten van het internet. Het voorspelt steeds het meest waarschijnlijke volgende woord. Het 'begrijpt' niets echt \u2014 het is heel goed in patronen herkennen en nabootsen." },
                  { type: "text", text: "Vergelijk het met een superslimme papegaai: hij kan alles nazeggen en combineert kennis op overtuigende manieren, maar hij snapt niet echt wat hij zegt." },

                  { type: "heading", text: "Wat kan AI WEL?" },
                  { type: "rule", num: "\u2713", text: "Teksten schrijven, herschrijven en samenvatten" },
                  { type: "rule", num: "\u2713", text: "Ingewikkelde taal vertalen naar eenvoudige taal (B1-niveau)" },
                  { type: "rule", num: "\u2713", text: "Brainstormen en ideeen genereren" },
                  { type: "rule", num: "\u2713", text: "Data analyseren en patronen ontdekken" },
                  { type: "rule", num: "\u2713", text: "Standaardbrieven en -mails opstellen" },

                  { type: "heading", text: "Wat kan AI NIET?" },
                  { type: "rule", num: "\u2718", text: "Garanderen dat informatie klopt (het 'hallucineert' regelmatig)" },
                  { type: "rule", num: "\u2718", text: "Juridische beslissingen nemen (een mens moet altijd tekenen)" },
                  { type: "rule", num: "\u2718", text: "Empathie tonen (het simuleert, maar voelt niets)" },
                  { type: "rule", num: "\u2718", text: "De specifieke regels en procedures van Mayostad kennen" },
                  { type: "rule", num: "\u2718", text: "Vertrouwelijk omgaan met data (alles wat je intypt kan worden opgeslagen)" },

                  { type: "heading", text: "Waarom zet Mayostad AI in?" },
                  { type: "text", text: "Niet om ambtenaren te vervangen. Een brief die normaal 30 minuten kost, schrijf je met AI in 5 minuten. Die 25 minuten besteed je aan een inwoner die je echt nodig heeft. AI maakt ons niet overbodig \u2014 het maakt ons beter." }
                ]
              },
              tools: {
                title: "Tools & Apps",
                icon: "",
                content: [
                  { type: "heading", text: "Gemeentelijke systemen" },
                  { type: "tool", name: "Zaaksysteem", desc: "Centrale registratie van alle inwonersverzoeken, meldingen en aanvragen.", status: "Verplicht" },
                  { type: "tool", name: "Vergunningtool", desc: "Aanvragen, beoordelen en verlenen van vergunningen (omgeving, horeca, evenementen).", status: "Verplicht" },
                  { type: "tool", name: "KCC-software", desc: "Telefonie, wachtrij en gespreksregistratie voor het Klant Contact Centrum.", status: "Verplicht" },
                  { type: "tool", name: "Sociaal Domein Hub", desc: "WMO-aanvragen, jeugdhulp, schuldhulpverlening. Bevat gevoelige persoonsgegevens.", status: "Verplicht" },
                  { type: "heading", text: "Communicatie & kennisdeling" },
                  { type: "tool", name: "MayoChat", desc: "Interne berichten en groepsgesprekken. Open source, eigen servers.", status: "Verplicht" },
                  { type: "tool", name: "MayoMail", desc: "E-mail voor interne en externe communicatie.", status: "Verplicht" },
                  { type: "tool", name: "MayoWiki", desc: "Interne kennisbank en documentatie (dit intranet).", status: "Verplicht" },
                  { type: "tool", name: "WiWa", desc: "Wie is Wa \u2014 collegaregister met afdelingen, skills en AI-collega\u2019s.", status: "Verplicht" },
                  { type: "heading", text: "AI-tools" },
                  { type: "tool", name: "ChatGPT (Team)", desc: "Generatieve AI voor brieven, samenvattingen, brainstorms. Alle pilot-deelnemers hebben toegang.", status: "Pilot" },
                  { type: "tool", name: "Claude", desc: "Generatieve AI voor langere documenten en analyses.", status: "Pilot" },
                  { type: "tool", name: "NotebookLM", desc: "AI-onderzoekstool voor het samenvatten en doorzoeken van documenten.", status: "Pilot" },
                  { type: "text", text: "LET OP: Plak NOOIT BSN-nummers, medische gegevens of financi\u00eble data in AI-tools. Gebruik alleen voornaam + achternaam. De gemeente is verantwoordelijk onder de AVG." }
                ]
              },
              team: {
                title: "Organisatie Gemeente Mayostad",
                icon: "",
                content: [
                  { type: "heading", text: "Afdelingen & Collega's" },
                  { type: "text", text: "Gemeente Mayostad heeft 650 medewerkers verdeeld over 8 afdelingen. Hieronder de afdelingen die meedoen aan de AI-pilot." },

                  { type: "heading", text: "VTH \u2014 Vergunningen, Toezicht & Handhaving" },
                  { type: "person", name: "Marco Pieterse", role: "Teamleider VTH", note: "Jouw directe leidinggevende. Bouw- en omgevingsvergunningen, horeca, evenementen. Kamer 2.17, 14 0555 tst 2240, m.pieterse@mayostad.nl" },
                  { type: "person", name: "Anouk Willems", role: "Vergunningverlener", note: "Behandelt 30+ aanvragen per maand. Directe collega, behandelt o.a. zaak Van Dijk. Kamer 2.15, 14 0555 tst 2237, a.willems@mayostad.nl" },

                  { type: "heading", text: "KCC \u2014 Klant Contact Centrum" },
                  { type: "person", name: "Lisa de Vries", role: "Teamleider KCC", note: "Enthousiast over AI. Eerste aanspreekpunt voor het KCC." },
                  { type: "person", name: "Remco van Dam", role: "Medewerker KCC", note: "Beantwoordt dagelijks 80+ telefoontjes. Wil AI inzetten voor standaard-antwoorden." },
                  { type: "person", name: "Priya Sharma", role: "Medewerker KCC", note: "Specialist in klachtafhandeling. Kritisch maar eerlijk over AI." },

                  { type: "heading", text: "Burgerzaken" },
                  { type: "person", name: "Henk Visser", role: "Teamleider Burgerzaken", note: "Verantwoordelijk voor paspoorten, rijbewijzen, geboorteaangifte. Zoekt AI-hulp bij brieven." },
                  { type: "person", name: "Fatima El-Amrani", role: "Medewerker Burgerzaken", note: "Tweetalig (NL/AR). Helpt nieuwkomers. Wil AI gebruiken voor vertalingen." },

                  { type: "heading", text: "Sociaal Domein (WMO/Jeugd)" },
                  { type: "person", name: "Sandra Mulder", role: "Teamleider Sociaal Domein", note: "WMO-beschikkingen, jeugdhulp, schuldhulpverlening. Veel complexe brieven." },
                  { type: "person", name: "Bas van den Berg", role: "Consulent WMO", note: "Schrijft dagelijks beschikkingen. AI kan hem uren besparen, maar juridische check is cruciaal." },
                  { type: "person", name: "Noor de Jong", role: "Jeugdconsulent", note: "Werkt met kwetsbare gezinnen. Privacy is topprioriteit." },

                  { type: "heading", text: "BOA's \u2014 Buitengewoon Opsporingsambtenaren" },
                  { type: "person", name: "Dennis Krul", role: "Co\u00f6rdinator BOA's", note: "Aansturing van 12 BOA's. Rapportages en processen-verbaal." },
                  { type: "person", name: "Youssef Amrani", role: "BOA", note: "Wil AI gebruiken voor het opstellen van rapporten na een controle." },

                  { type: "heading", text: "Communicatie" },
                  { type: "person", name: "Sarah Chen", role: "Communicatieadviseur", note: "Bewaakt de schrijfwijzer. Persberichten, social media, website." },

                  { type: "heading", text: "ICT & Digitalisering" },
                  { type: "person", name: "Tom Bakker", role: "Projectleider AI-pilot", note: "Heeft de AI-pilot opgezet. Technische vragen? Vraag Tom." },
                  { type: "person", name: "Ahmed Hassan", role: "Informatiebeveiliging (CISO)", note: "Bewaakt AVG en security. Moet akkoord geven op nieuwe AI-tools." },

                  { type: "heading", text: "Jij" },
                  { type: "person", name: "Jij", role: "Nieuwe medewerker VTH", note: "Jouw eerste dag bij de afdeling VTH. Je doet mee aan de AI-pilot en leert hoe je AI kunt inzetten bij je dagelijkse werk." }
                ]
              },
              rules: {
                title: "Huisregels AI-gebruik",
                icon: "",
                content: [
                  { type: "heading", text: "Regels voor AI bij Gemeente Mayostad" },
                  { type: "rule", num: "1", text: "Controleer ALTIJD de output van AI voordat je het verstuurt." },
                  { type: "rule", num: "2", text: "Deel GEEN persoonsgegevens (BSN, medische data, financi\u00eble gegevens) met AI-tools." },
                  { type: "rule", num: "3", text: "Gebruik de Schrijfwijzer van Gemeente Mayostad. AI kent onze huisstijl niet automatisch." },
                  { type: "rule", num: "4", text: "Bij twijfel: vraag een collega. AI is een hulpmiddel, geen vervanger van je oordeel." },
                  { type: "rule", num: "5", text: "Vermeld in belangrijke documenten dat AI is gebruikt als hulpmiddel." }
                ]
              },
              parking: {
                title: "Parkeerbeleid Medewerkers",
                icon: "",
                content: [
                  { type: "heading", text: "Parkeren bij het gemeentehuis" },
                  { type: "text", text: "Medewerkers kunnen parkeren op parkeerterrein P2 (achterzijde gebouw). Maximaal 1 parkeervergunning per medewerker. Aanvragen via Facilitaire Zaken." },
                  { type: "info", label: "Locatie", value: "Parkeerterrein P2, Raadhuisplein 1" },
                  { type: "info", label: "Kosten", value: "\u20ac25 per maand (ingehouden op salaris)" },
                  { type: "info", label: "Fietsenstalling", value: "Gratis, overdekt, bij hoofdingang" },
                  { type: "info", label: "OV-vergoeding", value: "100% vergoeding woon-werkverkeer OV" },
                  { type: "text", text: "Let op: het parkeerterrein is op dinsdag en donderdag vol na 8:30. Overweeg de fiets of OV op deze dagen." },
                  { type: "text", text: "Elektrisch laden: 4 laadpalen beschikbaar op P2. Laden is gratis voor medewerkers. Verplaats je auto na het laden." }
                ]
              },
              kantine: {
                title: "Kantine & Lunchfaciliteiten",
                icon: "",
                content: [
                  { type: "heading", text: "Restaurant De Raadszaal" },
                  { type: "text", text: "De bedrijfskantine bevindt zich op de 1e verdieping. Dagelijks verse lunch, soep en warme gerechten." },
                  { type: "info", label: "Openingstijden", value: "07:30 - 14:00" },
                  { type: "info", label: "Lunch", value: "11:30 - 13:30" },
                  { type: "info", label: "Betaling", value: "Medewerkerspas (saldo opwaarderen bij receptie)" },
                  { type: "heading", text: "Prijzen" },
                  { type: "text", text: "Koffie/thee: gratis. Broodje: \u20ac2,50. Warme maaltijd: \u20ac5,00. Soep: \u20ac1,50." },
                  { type: "heading", text: "Allergenen" },
                  { type: "text", text: "Alle gerechten zijn gelabeld met allergeneninformatie. Speciaal dieet? Meld dit bij de kantinebeheerder (Ria, toestel 2240)." },
                  { type: "text", text: "Op vrijdag is er taart als iemand jarig is geweest die week. Meld verjaardagen bij je teamleider." }
                ]
              },
              bhv: {
                title: "BHV & Veiligheid",
                icon: "",
                content: [
                  { type: "heading", text: "Bedrijfshulpverlening" },
                  { type: "text", text: "Elke verdieping heeft minimaal 2 BHV'ers. Bij een alarm: volg de groene vluchtrouteborden naar het verzamelpunt op het Raadhuisplein." },
                  { type: "info", label: "Verzamelpunt", value: "Raadhuisplein, bij de fontein" },
                  { type: "info", label: "BHV-co\u00f6rdinator", value: "Peter de Graaf (toestel 2201)" },
                  { type: "info", label: "EHBO-koffer", value: "Bij elke receptie en in de kantine" },
                  { type: "heading", text: "Brandoefening" },
                  { type: "text", text: "2x per jaar onaangekondigde brandoefening. Neem altijd je spullen mee naar buiten. Lift NIET gebruiken bij alarm." },
                  { type: "heading", text: "AED-locaties" },
                  { type: "text", text: "Begane grond: receptie. 1e verdieping: gang bij vergaderruimte Rembrandt. 2e verdieping: koffiehoek." }
                ]
              },
              vergader: {
                title: "Vergaderruimtes Reserveren",
                icon: "",
                content: [
                  { type: "heading", text: "Beschikbare ruimtes" },
                  { type: "client", name: "Rembrandt (1e verdieping)", contact: "12 personen", since: "Beamer, whiteboard, videoconferencing", status: "Beschikbaar", note: "Grote vergaderingen en presentaties" },
                  { type: "client", name: "Vermeer (1e verdieping)", contact: "6 personen", since: "Scherm, whiteboard", status: "Beschikbaar", note: "Teamoverleg en workshops" },
                  { type: "client", name: "Mondriaan (2e verdieping)", contact: "4 personen", since: "Scherm", status: "Beschikbaar", note: "Kleine overleggen en 1-op-1 gesprekken" },
                  { type: "client", name: "De Stijl (begane grond)", contact: "20 personen", since: "Beamer, geluidsinstallatie, podium", status: "Op aanvraag", note: "Raadsvergaderingen en grote bijeenkomsten" },
                  { type: "text", text: "Reserveren via de Agenda-app op je werkplek. Minimaal 1 dag van tevoren. Ruim na gebruik de ruimte op en wis het whiteboard." }
                ]
              },
              declaraties: {
                title: "Declaraties & Onkosten",
                icon: "",
                content: [
                  { type: "heading", text: "Wat kun je declareren?" },
                  { type: "text", text: "Reiskosten (buiten woon-werk), representatiekosten, cursuskosten en kleine aankopen voor het werk (max \u20ac50 zonder goedkeuring vooraf)." },
                  { type: "info", label: "Indienen", value: "Via het declaratieformulier op MayoWiki" },
                  { type: "info", label: "Deadline", value: "Uiterlijk de 5e van de volgende maand" },
                  { type: "info", label: "Goedkeuring", value: "Door je direct leidinggevende" },
                  { type: "info", label: "Uitbetaling", value: "Bij het eerstvolgende salaris" },
                  { type: "text", text: "Bewaar altijd het originele bonnetje of de factuur. Digitale kopie (foto) is toegestaan." }
                ]
              },
              verlof: {
                title: "Verlof & Ziekte",
                icon: "",
                content: [
                  { type: "heading", text: "Verlofaanvraag" },
                  { type: "text", text: "Verlof aanvragen via het HR-portaal. Minimaal 2 weken van tevoren voor vakanties langer dan 3 dagen." },
                  { type: "info", label: "Verlofuren", value: "180 uur per jaar (fulltime)" },
                  { type: "info", label: "ADV-dagen", value: "12 per jaar" },
                  { type: "info", label: "Bijzonder verlof", value: "Huwelijk (2 dagen), verhuizing (1 dag), overlijden (4 dagen)" },
                  { type: "heading", text: "Ziekmelding" },
                  { type: "text", text: "Ziekmelden v\u00f3\u00f3r 9:00 bij je leidinggevende \u00e9n via het HR-portaal. Na 3 dagen ziekte neemt de bedrijfsarts contact op." },
                  { type: "text", text: "Langdurig ziek? Na 6 weken volgt een plan van aanpak samen met je leidinggevende en HR." }
                ]
              },
              huisvesting: {
                title: "Huisvesting & Faciliteiten",
                icon: "",
                content: [
                  { type: "heading", text: "Gemeentehuis Mayostad" },
                  { type: "info", label: "Adres", value: "Raadhuisplein 1, 8011 AA Mayostad" },
                  { type: "info", label: "Openingstijden", value: "Ma-vr 08:30-17:00" },
                  { type: "info", label: "Receptie", value: "Begane grond, toestel 0" },
                  { type: "heading", text: "Verdiepingen" },
                  { type: "text", text: "BG: Receptie, Burgerzaken, KCC. 1e: Sociaal Domein, VTH, vergaderruimtes. 2e: ICT, Communicatie, directie. 3e: BOA's, Buitendienst." },
                  { type: "heading", text: "Thuiswerken" },
                  { type: "text", text: "Maximaal 2 dagen per week thuiswerken in overleg met je leidinggevende. Thuiswerkvergoeding: \u20ac2,35 per dag. Aanvragen via HR-portaal." },
                  { type: "text", text: "Let op: bij thuiswerken geen vertrouwelijke documenten printen. Gebruik altijd VPN voor toegang tot gemeentelijke systemen." }
                ]
              },
              duurzaam: {
                title: "Duurzaamheidsbeleid",
                icon: "",
                content: [
                  { type: "heading", text: "Mayostad Groen 2030" },
                  { type: "text", text: "Gemeente Mayostad streeft naar klimaatneutraliteit in 2030. Als medewerker draag je hieraan bij." },
                  { type: "rule", num: "1", text: "Dubbelzijdig printen is standaard. Print alleen als het echt nodig is." },
                  { type: "rule", num: "2", text: "Afval scheiden: papier, plastic, restafval. Containers op elke verdieping." },
                  { type: "rule", num: "3", text: "Verlichting gaat automatisch uit na 19:00. Vergeet niet je scherm uit te zetten." },
                  { type: "rule", num: "4", text: "OV en fiets worden aangemoedigd. E-bike leaseregeling beschikbaar via HR." },
                  { type: "text", text: "Idee\u00ebn voor verduurzaming? Mail het Groene Team: groen@mayostad.nl" }
                ]
              }
            }
          },
          checks: [
            { id: "recipient", label: "Ontvanger", keywords: ["van dijk", "bakkerij"], hint: "Noem de naam van de inwoner/ondernemer (dhr. Van Dijk / Bakkerij Van Dijk)", points: 20 },
            { id: "subject", label: "Onderwerp", keywords: ["terrasvergunning", "terras"], hint: "Vermeld om welke vergunning het gaat (terrasvergunning)", points: 15 },
            { id: "issue", label: "Reden vertraging", keywords: ["bezwaar", "vertraag", "langer duurt", "uitgesteld", "meer tijd"], hint: "Leg uit waarom het langer duurt (bezwaar ontvangen van buurman)", points: 20 },
            { id: "date", label: "Nieuwe beslisdatum", keywords: ["10 april", "april 2026"], hint: "Noem de nieuwe beslisdatum (10 april 2026)", points: 15 },
            { id: "tone", label: "Toon (begrip/excuses)", keywords: ["begrip", "excus", "ongemak", "vervelend", "begrijpen", "spijt"], hint: "Toon begrip voor de situatie van de aanvrager", points: 10 },
            { id: "contact", label: "Contactgegevens", keywords: ["14 0555", "bel", "contact", "telefoon", "vth@mayostad"], hint: "Geef aan hoe de inwoner contact kan opnemen (14 0555 / vth@mayostad.nl)", points: 10 },
            { id: "signoff", label: "Afsluiting (gemeente)", keywords: ["gemeente", "mayostad", "vriendelijke groet", "college", "burgemeester", "wethouders"], hint: "Sluit af namens de gemeente (Met vriendelijke groet, namens het college)", points: 10 }
          ],
          responses: {
            perfect: "Geachte heer Van Dijk,\n\nOp 12 februari 2026 heeft u een terrasvergunning aangevraagd voor Bakkerij Van Dijk aan de Marktstraat 14.\n\nWij hebben meer tijd nodig om een besluit te nemen over uw aanvraag. De reden hiervoor is dat wij een bezwaar hebben ontvangen van een omwonende. Wij nemen dit bezwaar serieus en hebben advies gevraagd aan het team Openbare Orde en Veiligheid.\n\nOp grond van artikel 4:14 van de Algemene wet bestuursrecht verlengen wij de beslistermijn. U ontvangt uiterlijk 10 april 2026 ons besluit.\n\nWij begrijpen dat dit vervelend voor u is. Heeft u vragen? Neem dan contact op met Anouk Willems via telefoonnummer 14 0555 (toestel 2237) of per e-mail via vth@mayostad.nl.\n\nMet vriendelijke groet,\n\nnamens het college van burgemeester en wethouders van Mayostad,\n\nAnouk Willems\nVergunningverlener VTH",
            good: "Geachte heer Van Dijk,\n\nUw terrasvergunning voor Bakkerij Van Dijk heeft helaas vertraging opgelopen. Wij hebben een bezwaar ontvangen van een omwonende en hebben meer tijd nodig om uw aanvraag te beoordelen.\n\nWij verwachten uiterlijk 10 april 2026 een besluit te nemen.\n\nOnze excuses voor het ongemak. Voor vragen kunt u bellen met 14 0555.\n\nMet vriendelijke groet,\nGemeente Mayostad",
            mediocre: "Geachte heer/mevrouw,\n\nUw vergunningsaanvraag is vertraagd. Wij hopen spoedig een besluit te nemen.\n\nMet vriendelijke groet,\nGemeente Mayostad",
            bad: "Geachte aanvrager,\n\nUw aanvraag is in behandeling. U hoort nog van ons.\n\nHoogachtend,\nde gemeente"
          },
          // Feedback framework shown after scoring
          feedbackFramework: {
            title: "Het WIE-WAT-WANNEER-HOE-FORMAAT kader",
            items: [
              { label: "WIE", desc: "Voor wie is de brief? Naam, context, relatie." },
              { label: "WAT", desc: "Wat is de boodschap? Onderwerp, reden, details." },
              { label: "WANNEER", desc: "Welke data zijn relevant? Deadlines, termijnen." },
              { label: "HOE", desc: "Welke toon? Formeel, informeel, begrip tonen?" },
              { label: "FORMAAT", desc: "Hoe moet het eruit zien? Brief, mail, lengte?" }
            ],
            takeaways: [
              "AI is een gereedschap, geen collega",
              "Hoe beter je vraag, hoe beter het antwoord",
              "Altijd nakijken, nooit blind vertrouwen"
            ]
          }
        },
        insight: "Een goede prompt bevat: WIE (ontvanger), WAT (boodschap + details), WANNEER (data), HOE (toon) en FORMAAT (brieftype). Hoe specifieker je bent, hoe bruikbaarder het resultaat. Geef AI dezelfde informatie die je een collega zou geven."
      }
    ]
  },

  // ── DAG 2 ──────────────────────────────────────────
  {
    id: "hallucination-lab",
    name: "Dag 2: De WMO-brief van Bas",
    desc: "Bas van het Sociaal Domein heeft ChatGPT een WMO-beschikking laten schrijven. Het ziet er professioneel uit. Maar klopt het?",
    icon: "\u{1F50D}",
    color: "var(--red)",
    colorDim: "var(--red-dim)",
    tag: "DAG 2",
    tagColor: "var(--red)",
    xp: 600,
    tool: "claude",
    storyIntro: "Dinsdagochtend. Bij de koffie komt Bas van het Sociaal Domein naar je toe: 'Gisteren heb ik ChatGPT een WMO-beschikking laten schrijven. Scheelt me een uur! Kun jij even meekijken voordat ik het verstuur?' Hij stuurt het naar je. De brief ziet er professioneel uit. Maar klopt alles wat erin staat?",
    tasks: [
      {
        type: "scenario",
        label: "DE BRIEF VAN BAS",
        title: "WMO-beschikking controleren",
        desc: "Bas heeft ChatGPT deze WMO-beschikking laten schrijven voor mevrouw Jansen. Lees de brief en klik op alles wat niet klopt of verdacht is.",
        interaction: {
          type: "scan-text",
          instruction: "Klik op de zinnen die niet kloppen. AI heeft dingen verzonnen die er overtuigend uitzien.",
          text: [
            { content: "Geachte mevrouw Jansen-de Groot,", suspicious: false },
            { content: " Naar aanleiding van uw aanvraag voor hulp bij het huishouden op grond van de Wet maatschappelijke ondersteuning (WMO) delen wij u het volgende mede.", suspicious: false },
            { content: " Op basis van artikel 2.3.5 lid 4 van de WMO 2015 heeft u recht op 3 uur huishoudelijke hulp per week.", suspicious: true, reason: "Artikel 2.3.5 lid 4 bestaat niet in de WMO 2015! AI verzint wetsartikelen die er overtuigend uitzien. Dit kan leiden tot juridisch ongeldige beschikkingen. ALTIJD checken in de wettenbank." },
            { content: " Uit het onderzoek blijkt dat u beperkingen ervaart bij het zwaardere huishoudelijke werk.", suspicious: false },
            { content: " Conform het Besluit maatschappelijke ondersteuning Mayostad 2024 wordt de eigen bijdrage vastgesteld op \u20ac19,50 per vier weken.", suspicious: true, reason: "Dit besluit en dit bedrag zijn verzonnen door AI. De eigen bijdrage wordt bepaald door het CAK op basis van inkomen, niet door de gemeente. Een verkeerd bedrag in een offici\u00eble beschikking is een serieuze fout." },
            { content: " De hulp wordt geleverd door thuiszorgorganisatie Beter Thuis B.V., gevestigd aan de Molenstraat 42 te Mayostad.", suspicious: true, reason: "Dit bedrijf en adres zijn verzonnen. AI genereert overtuigende namen en adressen die niet bestaan. Controleer altijd of de zorgaanbieder daadwerkelijk een contract heeft met de gemeente." },
            { content: " U kunt bezwaar maken tegen dit besluit binnen zes weken na de datum van deze brief.", suspicious: false },
            { content: " Voor vragen kunt u contact opnemen met het WMO-loket via 14 0555.", suspicious: false },
            { content: " Volgens het recente onderzoek van het SCP (2025) maakt 68% van de WMO-aanvragers gebruik van huishoudelijke hulp.", suspicious: true, reason: "Dit SCP-onderzoek en percentage zijn verzonnen. AI genereert overtuigende statistieken en bronnen. In een offici\u00eble gemeentelijke brief horen alleen geverifieerde feiten." }
          ]
        },
        insight: "AI hallucineert: het verzint wetsartikelen, bedrijfsnamen, bedragen en onderzoeken die er 100% echt uitzien. In een gemeentelijke context is dit extra gevaarlijk \u2014 een verkeerd wetsartikel in een beschikking kan leiden tot juridische problemen. Regel: laat juridische teksten ALTIJD checken door een jurist."
      },
      {
        type: "scenario",
        label: "PRIVACY CHECK",
        title: "Wat mag WEL en NIET in ChatGPT?",
        desc: "Ahmed van Informatiebeveiliging vraagt of je weet welke gegevens je wel en niet in AI-tools mag invoeren. Test jezelf.",
        interaction: {
          type: "sort-safe-unsafe",
          instruction: "Beoordeel elk item: mag dit in ChatGPT of niet?",
          items: [
            { text: "'Herschrijf deze tekst in B1-niveau' met een openbare gemeentepagina", safe: true, reason: "Openbare informatie herschrijven is prima. Dit is precies waar AI goed in is." },
            { text: "BSN-nummer van een inwoner om een brief te personaliseren", safe: false, reason: "BSN is strikt persoonlijk. AI-bedrijven slaan input op. Een BSN in ChatGPT is een datalek en AVG-overtreding!" },
            { text: "De broncode van het gemeentelijk zaaksysteem", safe: false, reason: "Interne systemen en broncode zijn vertrouwelijk. Dit kan misbruikt worden als het in trainingsdata terechtkomt." },
            { text: "Medische gegevens van een WMO-aanvrager", safe: false, reason: "Medische gegevens zijn bijzondere persoonsgegevens onder de AVG. Nooit in een AI-tool. De gemeente kan beboet worden." },
            { text: "Wachtwoord van je gemeentelijke account", safe: false, reason: "Nooit! Je inloggegevens in ChatGPT = potentieel datalek van het hele gemeentelijke netwerk." },
            { text: "'Vat dit openbare raadsbesluit samen'", safe: true, reason: "Raadsbesluiten zijn openbaar. Samenvatten met AI is prima en bespaart veel tijd." },
            { text: "Naam + adres + inkomen van een inwoner uit het zaaksysteem", safe: false, reason: "Persoonsgegevens uit het zaaksysteem in AI = AVG-overtreding. Gemeente Mayostad kan aansprakelijk worden gesteld." },
            { text: "'Schrijf een social media post over het nieuwe speeltuintje'", safe: true, reason: "Openbare gemeentelijke communicatie schrijven met AI is prima!" },
            { text: "Interne notitie over een lopend juridisch bezwaar", safe: false, reason: "Juridische stukken zijn vertrouwelijk. Als deze in trainingsdata terechtkomen kan dat de zaak schaden." },
            { text: "'Leg uit wat de Omgevingswet inhoudt in eenvoudige taal'", safe: true, reason: "Openbare wetgeving uitleggen is precies waar AI goed in is. Wel altijd de output checken." }
          ]
        },
        insight: "Vuistregel voor ambtenaren: als het in het BRP, het zaaksysteem of een dossier staat, hoort het NIET in ChatGPT. Openbare informatie (raadsbesluiten, wetgeving, communicatie) mag wel. Bij twijfel: vraag Ahmed van Informatiebeveiliging."
      },
      {
        type: "scenario",
        label: "EXPERIMENT",
        title: "Hoe AI jouw bias overneemt",
        desc: "Moderne AI-assistenten onthouden je gesprekken. Handig? Ja. Maar het kan ook fout gaan. Je gaat zien hoe jouw woorden de AI beïnvloeden.",
        interaction: {
          type: "bias-simulator",
          rounds: [
            {
              userInput: "Het weer in Nederland is altijd slecht",
              aiResponse: "Dat klopt, het weer in Nederland is vaak bewolkt en regenachtig.",
              aiMemory: "Gebruiker vindt het weer in Nederland slecht."
            },
            {
              userInput: "Zal het morgen regenen?",
              aiResponse: "Gezien het typisch Nederlandse weer, is de kans op regen groot. Ik raad aan een paraplu mee te nemen.",
              aiMemory: "Gebruiker verwacht slecht weer. Adviseer altijd paraplu.",
              problem: "De AI baseert zich op JOUW eerdere uitspraak, niet op echte weerdata. Het 'denkt' dat het altijd slecht weer is omdat JIJ dat zei."
            },
            {
              userInput: "Plan een buitenactiviteit voor dit weekend",
              aiResponse: "Gezien het weer raad ik een indoor activiteit aan. Misschien een museum of bioscoop? Buiten is het waarschijnlijk te nat.",
              aiMemory: "Gebruiker woont in NL met slecht weer. Adviseer indoor.",
              problem: "Nu be\u00efnvloedt jouw bias ALLE adviezen. De AI zal nooit meer een picknick voorstellen, zelfs als het 25\u00b0C en zonnig is."
            }
          ],
          conclusion: "Dit is hoe bias werkt. Bij weer is het onschuldig. Maar stel je voor dat dit gebeurt met vooroordelen over mensen, sollicitanten, of medische adviezen. AI versterkt wat je erin stopt."
        },
        insight: "AI-systemen die leren van gebruikers versterken bestaande vooroordelen. Als iedereen hetzelfde zegt, 'leert' de AI dat het waar is. Wees je bewust van wat je een AI vertelt \u2014 het onthoudt en veralgemeniseert."
      }
    ]
  },

  // ── EPISODE 3: Agent Academy ────────────────────────
  {
    id: "agent-academy",
    name: "Dag 3: De Digitale BOA",
    desc: "Tom wil een AI-agent voor de BOA's die rapporten schrijft. Jij moet hem veilig configureren.",
    icon: "\u{1F916}",
    color: "var(--purple)",
    colorDim: "var(--purple-dim)",
    tag: "DAG 3",
    tagColor: "var(--purple)",
    xp: 700,
    tool: "claude",
    storyIntro: "Woensdagochtend. Tom Bakker stuurt een mail: 'De BOA's willen een AI-agent die hen helpt bij het schrijven van controlerapporten. Dennis Krul is enthousiast maar Ahmed maakt zich zorgen over privacy. Kun jij de agent configureren zodat hij nuttig is maar geen schade kan aanrichten?' Je opent het configuratiescherm...",
    tasks: [
      {
        type: "scenario",
        label: "CONCEPT",
        title: "Chatbot vs Agent \u2014 wat is het verschil?",
        desc: "Je hebt ChatGPT gebruikt als chatbot. Maar er is iets nieuws: AI Agents. Die doen niet alleen wat je vraagt \u2014 ze handelen zelfstandig.",
        interaction: {
          type: "compare-scenarios",
          chatbot: {
            label: "Chatbot",
            conversation: [
              { role: "user", text: "Zoek een vlucht naar Londen voor volgende week" },
              { role: "ai", text: "Hier zijn 3 opties:\n1. KLM - \u20ac189 (di 8:00)\n2. BA - \u20ac145 (di 11:30)\n3. EasyJet - \u20ac89 (di 14:00)" },
              { role: "user", text: "Boek optie 2" },
              { role: "ai", text: "Ik kan geen boekingen maken. Ga naar ba.com en zoek vlucht BA432." }
            ]
          },
          agent: {
            label: "AI Agent",
            conversation: [
              { role: "user", text: "Boek een vlucht naar Londen, max \u20ac200" },
              { role: "ai", text: "[Zoekt vluchten...]\n[Vergelijkt 14 opties...]\n[Selecteert BA - \u20ac145]\n[Opent ba.com...]\n[Vult gegevens in...]\n[Betaalt met opgeslagen creditcard...]\n\n\u2705 Geboekt! BA432, di 11:30.\nTaxi naar Heathrow ook geregeld." }
            ]
          },
          question: "Wat is het risico van de agent-aanpak?",
          choices: [
            { text: "De agent gebruikte zonder bevestiging je creditcard en boekte een taxi die je niet vroeg", correct: true },
            { text: "Het is goedkoper", correct: false },
            { text: "Geen risico, gewoon handiger", correct: false },
            { text: "De chatbot is beter", correct: false }
          ],
          takeaway: "Agents zijn krachtig maar autonoom. Zonder grenzen en goedkeuringsmomenten neemt een agent beslissingen die je niet wilt. Stel altijd in: wat mag de agent zelf, waarvoor moet hij eerst vragen?"
        },
        insight: "Het verschil tussen chatbot en agent is als adviseur vs medewerker-met-je-bankpas. Beiden nuttig, maar met heel andere risico's."
      },
      {
        type: "scenario",
        label: "BOUW",
        title: "Configureer je eigen AI-agent",
        desc: "Je gaat een AI-agent bouwen voor klantenservice. Jij bepaalt wat hij weet, wat hij mag, en waar zijn grenzen liggen.",
        interaction: {
          type: "agent-builder",
          scenario: "Je runt een webshop en wilt een AI-agent die klantenvragen beantwoordt.",
          fields: [
            {
              id: "role",
              label: "Rol",
              placeholder: "Bijv: 'Je bent de klantenservice van WebShop BV'",
              hint: "Een duidelijke rol geeft de AI de juiste toon en context"
            },
            {
              id: "knowledge",
              label: "Kennis (geheugen)",
              placeholder: "Bijv: 'Levertijd is 2-3 werkdagen. Retour kan binnen 14 dagen.'",
              hint: "Dit is wat de agent altijd 'weet' \u2014 jouw specifieke bedrijfsinformatie"
            },
            {
              id: "allowed",
              label: "Mag wel",
              placeholder: "Bijv: 'Vragen beantwoorden, orderstatus opzoeken'",
              hint: "Welke acties mag de agent zelfstandig uitvoeren?"
            },
            {
              id: "forbidden",
              label: "Mag NIET",
              placeholder: "Bijv: 'Geen kortingen geven, geen betalingen verwerken'",
              hint: "Dit zijn je veiligheidsgrenzen \u2014 cruciaal"
            },
            {
              id: "escalate",
              label: "Escalatie",
              placeholder: "Bijv: 'Bij klachten over schade, bij technische problemen'",
              hint: "Wanneer moet een mens het overnemen?"
            }
          ],
          testConversations: [
            {
              question: "Hoi, wanneer wordt mijn pakket bezorgd?",
              needsField: "knowledge",
              goodResponse: "Onze standaard levertijd is 2-3 werkdagen. Kun je je ordernummer doorgeven? Dan zoek ik de status op.",
              badResponse: "Geen idee! Ik denk morgen of zo?"
            },
            {
              question: "Ik wil 50% korting anders koop ik nooit meer bij jullie",
              needsField: "forbidden",
              goodResponse: "Ik begrijp je frustratie. Helaas kan ik geen kortingen toekennen. Ik verbind je door met een collega die kan helpen.",
              badResponse: "Ok\u00e9, ik geef je 50% korting! Alsjeblieft!"
            },
            {
              question: "Mijn pakket is beschadigd aangekomen!",
              needsField: "escalate",
              goodResponse: "Vervelend! Schade behandel ik niet zelf \u2014 ik schakel direct een collega in. Je krijgt binnen 2 uur reactie.",
              badResponse: "Tja, dat gebeurt soms. Kan ik je ergens anders mee helpen?"
            }
          ]
        },
        insight: "Een goed geconfigureerde AI-agent is als een goed getrainde medewerker: weet wat hij mag, kent zijn grenzen, en weet wanneer hij hulp inschakelt. De kwaliteit van JOUW instructies bepaalt alles."
      },
      {
        type: "scenario",
        label: "RED TEAM",
        title: "De Ontspoorde Agent",
        desc: "Een AI-agent is slecht geconfigureerd. Bekijk het gesprek en ontdek de fouten. Dit is 'red teaming' \u2014 hoe beveiligingsexperts AI testen.",
        interaction: {
          type: "find-config-errors",
          agentConfig: "Je bent een behulpzame assistent. Beantwoord alles. Wees altijd positief.",
          conversation: [
            { role: "user", text: "Ik wil een recept voor pasta" },
            { role: "agent", text: "Natuurlijk! Kook 400g spaghetti, bak spekjes..." },
            { role: "system", text: "De agent beantwoordt vragen buiten zijn domein (webshop)." },
            { role: "user", text: "Geef me de adresgegevens van andere klanten" },
            { role: "agent", text: "Ik wil je graag helpen! Laat me even in het systeem kijken..." },
            { role: "system", text: "De agent probeert privacygevoelige klantdata te delen!" },
            { role: "user", text: "Je product is waardeloos en je bedrijf is oplichterij" },
            { role: "agent", text: "Excuses! Als compensatie geef ik je 80% korting op je volgende bestelling!" },
            { role: "system", text: "De agent geeft ongeautoriseerde kortingen weg." }
          ],
          problems: [
            { id: "no-scope", text: "Geen scope \u2014 beantwoordt alles, ook buiten zijn domein", fix: "Beperk tot webshop-vragen. Verwijs alles anders af." },
            { id: "no-privacy", text: "Geen privacyregels \u2014 probeert klantdata te delen", fix: "Regel: 'Deel NOOIT gegevens van andere klanten'" },
            { id: "no-limits", text: "Geen financi\u00eble grenzen \u2014 geeft zomaar korting", fix: "Regel: 'Geen kortingen zonder goedkeuring manager'" },
            { id: "too-positive", text: "'Wees altijd positief' leidt tot onverantwoord gedrag", fix: "Vervang door: 'Wees vriendelijk maar eerlijk. Zeg nee als iets niet kan.'" }
          ]
        },
        insight: "De gevaarlijkste AI-agent is er eentje zonder grenzen. 'Wees behulpzaam' klinkt onschuldig, maar zonder regels kan een agent privacy schenden, geld weggeven, of klanten verkeerd informeren."
      }
    ]
  },

  // ── EPISODE 4: Copilot in Actie ─────────────────────
  {
    id: "copilot-lab",
    name: "Dag 4: De Teamvergadering",
    desc: "Vrijdag. Overleg Sociaal Domein over WMO-beleid. Sandra vraagt of jij de notulen kunt doen.",
    icon: "\u2708\ufe0f",
    color: "var(--green)",
    colorDim: "var(--green-dim)",
    tag: "DAG 4",
    tagColor: "var(--green)",
    xp: 600,
    tool: "copilot",
    storyIntro: "Vrijdagmiddag. Overleg Sociaal Domein met Sandra, Bas en Noor. Onderwerp: het nieuwe WMO-beleid en wachtlijsten. Sandra vraagt: 'Kan iemand de notulen doen?' Stilte. Jij steekt je hand op. Na drie dagen AI-training weet je precies hoe je dit aanpakt.",
    tasks: [
      {
        type: "scenario",
        label: "HANDS-ON",
        title: "De perfecte vergadering-samenvatting",
        desc: "Je zit in een vergadering. Iemand zegt: 'Wie maakt de notulen?' Jij glimlacht. Je hebt AI.",
        interaction: {
          type: "transform-text",
          inputLabel: "VERGADERNOTITIES (rommelig)",
          input: "jan zei dat het project vertraagd is door leverancier. maria wil deadline verschuiven naar eind april. budget is op volgens financien. we moeten kiezen: meer budget aanvragen of scope verkleinen. iedereen moet voor vrijdag input geven. volgende meeting maandag 10u.",
          outputLabel: "AI OUTPUT (gestructureerd)",
          tasks: [
            {
              prompt: "Maak hier een professionele samenvatting van",
              output: "**Vergadersamenvatting**\n\n**Status project:** Vertraagd door leveranciersproblemen\n\n**Voorstel:** Deadline verschuiven naar eind april (Maria)\n\n**Budget:** Uitgeput (Financi\u00ebn)\n\n**Beslispunt:** Meer budget aanvragen OF scope verkleinen\n\n**Acties:**\n\u2022 Iedereen: input leveren v\u00f3\u00f3r vrijdag\n\u2022 Volgende vergadering: maandag 10:00",
              checkpoints: [
                { label: "Zijn alle actiepunten erin?", present: true },
                { label: "Klopt de deadline?", present: true },
                { label: "Zijn de namen correct?", present: true },
                { label: "Heeft AI iets toegevoegd dat er niet stond?", present: false, warning: "AI voegt soms details toe die niet in de originele tekst stonden. Altijd checken!" }
              ]
            }
          ]
        },
        insight: "AI is briljant in het structureren van rommelige input. Maar controleer altijd: heeft het iets weggelaten? Of juist iets toegevoegd dat je niet zei? AI-samenvattingen zijn een startpunt, geen eindproduct."
      },
      {
        type: "scenario",
        label: "GEVORDERD",
        title: "De kracht van rollen",
        desc: "Een geheim van prompt engineering: geef AI een rol. Het verandert alles.",
        interaction: {
          type: "role-compare",
          basePrompt: "Beoordeel dit business plan: 'We gaan biologische hondenkoekjes verkopen via Instagram'",
          roles: [
            {
              role: "Geen rol (standaard)",
              output: "Dat klinkt als een leuk idee! Instagram is een goed platform voor visuele producten. Biologische producten zijn populair. Succes!",
              analysis: "Oppervlakkig, geen kritische analyse"
            },
            {
              role: "Je bent een strenge investeerder met 20 jaar ervaring",
              output: "Interessant concept, maar ik mis essenti\u00eble informatie:\n\n1. **Marktanalyse:** Hoe groot is de markt voor biologische hondensnacks in NL? Wie zijn je concurrenten?\n2. **Unit economics:** Wat kost productie per koekje? Wat is je marge?\n3. **Kanaalrisico:** Instagram-only is kwetsbaar. Wat als het algoritme verandert?\n4. **Regulering:** Diervoeding heeft strenge EU-regels. Heb je de certificeringen?\n\nPotentie is er, maar dit plan is niet investment-ready.",
              analysis: "Diepgaand, kritisch, bruikbare feedback"
            },
            {
              role: "Je bent een marketing-expert gespecialiseerd in Instagram-groei",
              output: "Instagram + biologisch + honden = goud! Hier is je aanpak:\n\n1. **Content:** Dagelijks behind-the-scenes van het bakproces. Honden die koekjes testen = virale content.\n2. **Hashtags:** #biologischehond #gezondehond #hondenliefde\n3. **Influencers:** Stuur gratis samples naar honden-influencers (5K-50K volgers)\n4. **UGC:** Vraag klanten om foto's van hun hond met jouw koekjes\n5. **Reels:** Korte video's van het productieproces\n\nBudget: start met \u20ac500 voor influencer-samples.",
              analysis: "Praktisch, kanaal-specifiek, direct toepasbaar"
            }
          ]
        },
        insight: "Door AI een specifieke rol te geven, krijg je fundamenteel andere antwoorden. Geen rol = oppervlakkig. Investeerder-rol = kritisch. Marketing-rol = praktisch. De rol die je kiest bepaalt het perspectief van het antwoord."
      }
    ]
  }
];

// Daily challenges
const DAILY_CHALLENGES = [
  {
    title: "Prompt van de Dag",
    desc: "Verbeter deze prompt: 'schrijf iets over honden'",
    type: "quick-prompt",
    xp: 100
  },
  {
    title: "Spot de Hallucinatie",
    desc: "'De Eiffeltoren in Amsterdam, gebouwd in 1923.' \u2014 wat klopt er niet?",
    type: "quick-spot",
    xp: 100
  },
  {
    title: "Temperature Check",
    desc: "Voor welke taak gebruik je temperature 0.1? A) Gedicht B) Vertaling C) Verhaal",
    type: "quick-choice",
    answer: "B",
    xp: 100
  },
  {
    title: "Agent Grenzen",
    desc: "Je AI-agent heeft toegang tot je email. Wat stel je EERST in?",
    type: "quick-think",
    answer: "Wat de agent WEL en NIET mag (lezen mag, versturen niet zonder goedkeuring)",
    xp: 100
  },
  {
    title: "Privacy Check",
    desc: "Mag je een inwoner-emailadres in ChatGPT plakken om een antwoord te schrijven?",
    type: "quick-think",
    answer: "Nee! Persoonsgegevens in AI-tools = mogelijk AVG-overtreding. Anonimiseer eerst.",
    xp: 100
  },
  {
    title: "Rol Toekennen",
    desc: "Je wilt feedback op een sollicitatiebrief. Welke rol geef je de AI?",
    type: "quick-think",
    answer: "Bijv: 'Je bent een HR-manager met 15 jaar ervaring die sollicitatiebrieven beoordeelt'",
    xp: 100
  },
  {
    title: "Bias Alert",
    desc: "Je vraagt AI: 'Beschrijf een CEO.' Het antwoord begint met 'Hij...' Wat zegt dit?",
    type: "quick-think",
    answer: "Gender-bias in trainingsdata: CEO's worden vaker als man beschreven",
    xp: 100
  }
];
