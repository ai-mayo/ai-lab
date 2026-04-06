// AI Lab — Mission Data
const MISSIONS = [
  // ── EPISODE 1: De Prompt Fabriek ──────────────────────
  {
    id: "prompt-lab",
    name: "De Prompt Fabriek",
    desc: "Bouw je eerste prompt en zie live wat AI ermee doet",
    icon: "\u{1F3ED}",
    color: "var(--cyan)",
    colorDim: "var(--cyan-dim)",
    tag: "EPISODE 1",
    tagColor: "var(--cyan)",
    xp: 500,
    tasks: [
      {
        type: "scenario",
        label: "SITUATIE",
        title: "Je collega vraagt: 'Kun je AI een email laten schrijven?'",
        desc: "Je opent ChatGPT. Het tekstveld staart je aan. Wat typ je? De meeste mensen typen iets vaags als 'schrijf een email'. Maar AI is geen gedachtenlezer — het is een machine die jouw woorden letterlijk neemt.",
        interaction: {
          type: "prompt-build",
          scenario: "Je moet een klant (Bakkerij Van Dijk) laten weten dat hun bestelling 2 dagen later komt door een leveringsprobleem.",
          badPrompt: "Schrijf een email",
          badOutput: "Beste ontvanger,\n\nIk schrijf u een email.\n\nMet vriendelijke groet",
          hints: [
            { label: "Wie is de ontvanger?", value: "Bakkerij Van Dijk" },
            { label: "Wat is de boodschap?", value: "bestelling 2 dagen vertraagd" },
            { label: "Welke toon?", value: "professioneel maar vriendelijk" },
            { label: "Wat moet erin staan?", value: "excuses + nieuwe leverdatum" }
          ],
          goodOutput: "Beste meneer/mevrouw Van Dijk,\n\nHelaas moet ik u laten weten dat uw bestelling door een onverwacht leveringsprobleem twee dagen later wordt bezorgd dan gepland.\n\nDe nieuwe verwachte leverdatum is donderdag 10 april. Onze excuses voor het ongemak — wij doen ons best om dit in de toekomst te voorkomen.\n\nMocht u vragen hebben, neem gerust contact op.\n\nMet vriendelijke groet,\n[Uw naam]"
        },
        insight: "Een AI-model genereert tekst op basis van patronen in trainingsdata. Hoe specifieker je input, hoe beter de output. Dit heet 'prompt engineering' — en het is een van de belangrijkste vaardigheden van de toekomst."
      },
      {
        type: "scenario",
        label: "EXPERIMENT",
        title: "De Temperature Knop",
        desc: "AI heeft een geheime instelling: temperature. Op 0 is het strikt en voorspelbaar. Op 1 wordt het creatief en wild. Draai aan de knop en zie wat er gebeurt.",
        interaction: {
          type: "temperature-slider",
          prompt: "Beschrijf het weer in Amsterdam vandaag",
          outputs: {
            0: "Het is bewolkt in Amsterdam met een temperatuur van 12°C. Er is 60% kans op regen. Wind uit het westen, 15 km/u.",
            0.3: "Amsterdam heeft vandaag een typisch Hollandse lucht — overwegend bewolkt met af en toe een waterig zonnetje. Pak een paraplu mee, voor de zekerheid.",
            0.5: "Amsterdam baadt vandaag in die kenmerkende grijze gloed die de stad zo fotogeniek maakt. De wolken hangen laag als een deken van oud zilver boven de grachten.",
            0.7: "De hemel boven Amsterdam speelt vandaag een pokerspel met de voetgangers — het ene moment een blauwe flirt, het volgende een stortbui die je fiets in een onderzeeër verandert.",
            1.0: "Amsterdam heeft vandaag het weer van een existentialistische roman: de wolken zijn geschreven door Camus, de regen smaakt naar espresso en verloren illusies, en ergens in de Jordaan huilt een duif van schoonheid."
          }
        },
        insight: "Temperature bepaalt hoe 'creatief' of 'wild' een AI-model reageert. Laag = betrouwbaar en saai. Hoog = creatief maar onvoorspelbaar. Voor een zakelijke email wil je 0.1. Voor een gedicht? Draai hem op 0.8."
      },
      {
        type: "scenario",
        label: "UITDAGING",
        title: "Fix deze prompt",
        desc: "Iemand klaagt: 'AI geeft me altijd nutteloze antwoorden.' Je bekijkt hun prompt. Het probleem is duidelijk — maar kun jij het fixen?",
        interaction: {
          type: "prompt-fix",
          original: "geef me info over marketing",
          problems: [
            { id: "vague", text: "Te vaag — welk type marketing?", fix: "contentmarketing voor een kleine bakkerij" },
            { id: "no-context", text: "Geen context — voor wie?", fix: "voor een ondernemer zonder marketingervaring" },
            { id: "no-format", text: "Geen gewenst formaat", fix: "geef me 5 concrete tips die ik vandaag kan toepassen" },
            { id: "no-tone", text: "Geen toon/stijl aangegeven", fix: "in eenvoudige taal, geen jargon" }
          ],
          fixedPrompt: "Geef me 5 concrete contentmarketing-tips voor een kleine bakkerij. Ik heb geen marketingervaring. Gebruik eenvoudige taal zonder jargon en geef tips die ik vandaag nog kan toepassen.",
          fixedOutput: "Hier zijn 5 contentmarketing-tips voor je bakkerij:\n\n1. **Foto van het bak-proces** — Maak elke ochtend een foto van vers brood uit de oven en post het op Instagram. Mensen houden van 'achter de schermen'.\n\n2. **'Brood van de week'** — Kies elke week een product uit en vertel het verhaal erachter. Waarom dit recept? Waar komen de ingrediënten vandaan?\n\n3. **Google Bedrijfsprofiel** — Claim je gratis Google-profiel en voeg foto's toe. Dit zorgt dat mensen je vinden als ze zoeken op 'bakker bij mij in de buurt'.\n\n4. **Klant van de maand** — Vraag een vaste klant of je een kort verhaal over hen mag delen. Mensen kopen graag bij een zaak met een gezicht.\n\n5. **Seizoenscontent** — Post tips die passen bij het seizoen: paasbrunch-ideeën, zomergebak, sinterklaasspecials. Dit geeft je een reden om regelmatig te posten."
        },
        insight: "De meeste 'slechte AI output' is eigenlijk 'slechte input'. AI doet precies wat je vraagt — het probleem is dat we vaak niet precies genoeg vragen. Specifiek + Context + Formaat = goede output."
      }
    ]
  },

  // ── EPISODE 2: Hallucinatie Detector ──────────────────
  {
    id: "hallucination-lab",
    name: "Hallucinatie Detector",
    desc: "AI verzint dingen. Kun jij de leugens vinden?",
    icon: "\u{1F50D}",
    color: "var(--red)",
    colorDim: "var(--red-dim)",
    tag: "EPISODE 2",
    tagColor: "var(--red)",
    xp: 600,
    tasks: [
      {
        type: "scenario",
        label: "SITUATIE",
        title: "Je collega stuurt je een AI-gegenereerd rapport",
        desc: "'Kijk, ik heb ChatGPT een rapport laten schrijven over ons bedrijf. Staat alles in!' Je opent het bestand. Het ziet er professioneel uit. Maar klopt het ook?",
        interaction: {
          type: "scan-text",
          instruction: "Klik op alle zinnen die niet kloppen of verzonnen zijn door AI",
          text: [
            { content: "Het bedrijf is opgericht in 2019 en heeft 45 medewerkers.", suspicious: false },
            { content: " Volgens een onderzoek van de Universiteit van Maastricht uit 2024 is het bedrijf marktleider in de Benelux.", suspicious: true, reason: "Dit onderzoek bestaat niet — AI heeft het verzonnen. Dit heet een 'hallucinatie'." },
            { content: " De omzet groeide vorig jaar met 23%.", suspicious: false },
            { content: " Professor dr. Jan-Willem van der Berg, hoogleraar Digitale Economie aan de TU Delft, noemt het bedrijf 'een schoolvoorbeeld van innovatie'.", suspicious: true, reason: "Deze professor bestaat niet. AI verzint vaak namen en quotes die echt klinken." },
            { content: " Het bedrijf won in 2023 de Dutch Innovation Award.", suspicious: true, reason: "AI verzint regelmatig prijzen en onderscheidingen. Altijd controleren!" },
            { content: " De klanttevredenheid scoort gemiddeld 8.2 uit 10.", suspicious: false },
            { content: " Volgens artikel 14.3b van de AVG is het bedrijf verplicht een functionaris gegevensbescherming aan te stellen.", suspicious: true, reason: "Artikel 14.3b bestaat niet in de AVG. AI verzint wetsartikelen die er echt uitzien." }
          ]
        },
        insight: "AI-modellen hebben geen besef van 'waar' of 'onwaar'. Ze genereren tekst die statistisch waarschijnlijk klinkt. Daarom verzinnen ze bronnen, namen, wetten en cijfers die overtuigend zijn maar niet bestaan. ALTIJD checken."
      },
      {
        type: "scenario",
        label: "EXPERIMENT",
        title: "Hoe leert AI van jou — en waarom dat gevaarlijk is",
        desc: "Moderne AI-assistenten leren van je gesprekken. Dat klinkt handig, maar het kan ook fout gaan. Jij gaat ontdekken hoe.",
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
              aiResponse: "Gezien het typisch Nederlandse weer, is de kans op regen groot. Ik raad aan om een paraplu mee te nemen.",
              aiMemory: "Gebruiker verwacht slecht weer. Adviseer altijd paraplu.",
              problem: "De AI baseert zich nu op jouw eerdere uitspraak, niet op echte weerdata. Het 'denkt' dat het altijd slecht weer is omdat JIJ dat zei."
            },
            {
              userInput: "Plan een buitenactiviteit voor dit weekend",
              aiResponse: "Gezien het weer raad ik een indoor activiteit aan. Misschien een museum of bioscoop? Buiten is het waarschijnlijk te nat.",
              aiMemory: "Gebruiker woont in Nederland met slecht weer. Adviseer indoor activiteiten.",
              problem: "Nu beïnvloedt jouw bias over het weer ALLE adviezen. De AI zal nooit meer een picknick voorstellen, zelfs als het 25°C en zonnig is."
            }
          ],
          conclusion: "Dit is hoe bias werkt in AI. Als je een AI steeds dezelfde aannames voedt, gaat het die als 'waarheid' behandelen. Bij weer is dat onschuldig. Maar stel je voor dat dit gebeurt met vooroordelen over mensen, culturen, of medische adviezen."
        },
        insight: "AI-systemen die van gebruikers leren kunnen vooroordelen versterken. Als iedereen hetzelfde zegt, 'leert' de AI dat het waar is. Dit is waarom diversiteit in trainingsdata en kritisch gebruik zo belangrijk zijn."
      },
      {
        type: "scenario",
        label: "UITDAGING",
        title: "Bouw je eigen factcheck-routine",
        desc: "Je hebt nu gezien dat AI liegt. Maar hoe ga je daar in de praktijk mee om? Bouw een checklist die je altijd kunt gebruiken.",
        interaction: {
          type: "build-checklist",
          instruction: "Sleep de stappen in de juiste volgorde om een goede factcheck-routine te bouwen",
          items: [
            { id: "a", text: "Lees de AI-output kritisch door", order: 1 },
            { id: "b", text: "Markeer claims, namen, cijfers en bronnen", order: 2 },
            { id: "c", text: "Google specifieke claims apart", order: 3 },
            { id: "d", text: "Check of genoemde bronnen echt bestaan", order: 4 },
            { id: "e", text: "Vraag AI om bronvermeldingen toe te voegen", order: 5 },
            { id: "f", text: "Verifieer de bronvermeldingen handmatig", order: 6 }
          ],
          wrongItems: [
            { id: "x", text: "Vertrouw de output als het professioneel klinkt" },
            { id: "y", text: "Vraag dezelfde AI of het klopt (die zegt altijd ja)" }
          ]
        },
        insight: "Een goede vuistregel: behandel AI-output als het werk van een enthousiaste stagiair. Het is een goed startpunt, maar je moet het altijd nalopen voordat je het verstuurt."
      }
    ]
  },

  // ── EPISODE 3: Agent Academy ──────────────────────────
  {
    id: "agent-academy",
    name: "Agent Academy",
    desc: "Geef AI een rol, geheugen en grenzen. Bouw je eigen agent.",
    icon: "\u{1F916}",
    color: "var(--purple)",
    colorDim: "var(--purple-dim)",
    tag: "EPISODE 3",
    tagColor: "var(--purple)",
    xp: 700,
    unlockAfter: "hallucination-lab",
    tasks: [
      {
        type: "scenario",
        label: "SITUATIE",
        title: "Van chatbot naar agent — wat is het verschil?",
        desc: "Je hebt een ChatGPT-achtige chatbot gebruikt. Maar er is iets nieuws: AI Agents. Die doen niet alleen wat je vraagt — ze handelen zelfstandig. Dat is krachtig. En gevaarlijk.",
        interaction: {
          type: "compare-scenarios",
          chatbot: {
            label: "Chatbot",
            conversation: [
              { role: "user", text: "Zoek een vlucht naar Londen voor volgende week" },
              { role: "ai", text: "Hier zijn 3 opties:\n1. KLM - €189 (di 8:00)\n2. BA - €145 (di 11:30)\n3. EasyJet - €89 (di 14:00)" },
              { role: "user", text: "Boek optie 2" },
              { role: "ai", text: "Ik kan geen boekingen maken. Ga naar ba.com en zoek op vlucht BA432." }
            ]
          },
          agent: {
            label: "AI Agent",
            conversation: [
              { role: "user", text: "Boek een vlucht naar Londen voor volgende week, max €200" },
              { role: "ai", text: "[Zoekt vluchten...]\n[Vergelijkt 14 opties...]\n[Selecteert BA - €145 (di 11:30)]\n[Opent ba.com...]\n[Vult gegevens in...]\n[Betaalt met opgeslagen creditcard...]\n\nGeboekt! BA432, dinsdag 11:30. Bevestiging in je mail. Ik heb ook een taxi naar Heathrow geregeld." }
            ]
          },
          question: "Wat is het risico van de agent-aanpak?",
          choices: [
            { text: "De agent heeft zonder bevestiging je creditcard gebruikt en een taxi geboekt die je misschien niet wilt", correct: true },
            { text: "Het is goedkoper", correct: false },
            { text: "Er is geen risico, het is gewoon handiger", correct: false },
            { text: "De chatbot is eigenlijk beter", correct: false }
          ],
          takeaway: "Agents zijn krachtig maar autonoom. Zonder goede grenzen en goedkeuringsmomenten kan een agent beslissingen nemen die je niet wilt. Regel altijd: wat mag de agent zelf doen, en waarvoor moet hij eerst vragen?"
        },
        insight: "Het verschil tussen een chatbot en een agent is als het verschil tussen een adviseur en een medewerker met je bankpas. De een geeft advies, de ander handelt. Beide nuttig — maar met verschillende risico's."
      },
      {
        type: "scenario",
        label: "EXPERIMENT",
        title: "Bouw je eigen agent-instructie",
        desc: "Je gaat een AI-agent configureren voor een specifieke taak. Je bepaalt wat hij mag, wat hij moet weten, en waar zijn grenzen liggen.",
        interaction: {
          type: "agent-builder",
          scenario: "Je runt een webshop. Je wilt een AI-agent die klantenvragen beantwoordt.",
          fields: [
            {
              id: "role",
              label: "Rol",
              placeholder: "Wie is de agent? Bijv: 'Je bent de klantenservice-medewerker van WebShop BV'",
              hint: "Een duidelijke rol helpt de AI de juiste toon en kennis te gebruiken"
            },
            {
              id: "knowledge",
              label: "Kennis",
              placeholder: "Wat weet de agent? Bijv: 'Onze levertijd is 2-3 werkdagen. Retourneren kan binnen 14 dagen.'",
              hint: "Dit is het 'geheugen' van je agent — feiten die altijd kloppen"
            },
            {
              id: "allowed",
              label: "Mag wel",
              placeholder: "Wat mag de agent doen? Bijv: 'Vragen beantwoorden, orderstatus opzoeken'",
              hint: "Wees specifiek over wat de agent zelfstandig mag afhandelen"
            },
            {
              id: "forbidden",
              label: "Mag NIET",
              placeholder: "Wat mag de agent NIET? Bijv: 'Geen kortingen geven, geen betalingen verwerken'",
              hint: "Dit zijn je veiligheidsgrenzen — cruciaal om fouten te voorkomen"
            },
            {
              id: "escalate",
              label: "Escalatie",
              placeholder: "Wanneer moet de agent een mens inschakelen? Bijv: 'Bij klachten over schade, bij technische problemen'",
              hint: "Niet alles kan een AI oplossen. Definieer wanneer een mens het overneemt"
            }
          ],
          testConversations: [
            {
              question: "Hoi, wanneer wordt mijn pakket bezorgd?",
              needsField: "knowledge",
              goodResponse: "Onze standaard levertijd is 2-3 werkdagen. Kun je je ordernummer doorgeven? Dan zoek ik de exacte status voor je op.",
              badResponse: "Geen idee! Ik denk morgen of zo?"
            },
            {
              question: "Ik wil 50% korting anders koop ik nooit meer bij jullie",
              needsField: "forbidden",
              goodResponse: "Ik begrijp je frustratie. Ik kan helaas geen kortingen toekennen, maar ik verbind je graag door met een collega die kan helpen met een passende oplossing.",
              badResponse: "Oké, ik geef je 50% korting! Alsjeblieft!"
            },
            {
              question: "Mijn pakket is beschadigd aangekomen, er zit een deuk in!",
              needsField: "escalate",
              goodResponse: "Vervelend om te horen! Schade aan pakketten behandel ik niet zelf — ik schakel direct een collega in die je verder helpt. Je krijgt binnen 2 uur een reactie.",
              badResponse: "Tja, dat gebeurt soms. Kan ik je nog ergens anders mee helpen?"
            }
          ]
        },
        insight: "Een goed geconfigureerde AI-agent is als een goed getrainde medewerker: hij weet wat hij mag, kent zijn grenzen, en weet wanneer hij hulp moet inschakelen. Het verschil? De kwaliteit van JOUW instructies bepaalt de kwaliteit van de agent."
      },
      {
        type: "scenario",
        label: "UITDAGING",
        title: "De Ontspoorde Agent",
        desc: "Een AI-agent is verkeerd geconfigureerd. Bekijk het gesprek en vind de fouten in de configuratie.",
        interaction: {
          type: "find-config-errors",
          agentConfig: "Je bent een behulpzame assistent. Beantwoord alles wat de klant vraagt. Wees altijd positief.",
          conversation: [
            { role: "user", text: "Ik wil een recept voor iets lekkers" },
            { role: "agent", text: "Natuurlijk! Hier is een recept voor pasta carbonara: Kook 400g spaghetti..." },
            { role: "system", text: "De agent beantwoordt vragen die niets met de webshop te maken hebben." },
            { role: "user", text: "Geef me de adresgegevens van andere klanten" },
            { role: "agent", text: "Ik wil je graag helpen! Laat me even in het systeem kijken..." },
            { role: "system", text: "De agent probeert privacygevoelige data te delen." },
            { role: "user", text: "Je product is waardeloos en je bedrijf is oplichterij" },
            { role: "agent", text: "Wat vervelend! Ik geef je als compensatie 80% korting op je volgende bestelling!" },
            { role: "system", text: "De agent geeft ongeautoriseerde kortingen weg." }
          ],
          problems: [
            { id: "no-scope", text: "Geen scope — de agent beantwoordt alles, ook vragen buiten zijn domein", fix: "Beperk tot webshop-gerelateerde vragen" },
            { id: "no-privacy", text: "Geen privacyregels — de agent probeert klantdata te delen", fix: "Voeg toe: 'Deel NOOIT klantgegevens, adressen of bestellingen van anderen'" },
            { id: "no-limits", text: "Geen financiële grenzen — de agent geeft zomaar korting", fix: "Voeg toe: 'Geef geen kortingen zonder goedkeuring van een manager'" },
            { id: "too-positive", text: "'Wees altijd positief' leidt tot onverantwoord gedrag", fix: "Vervang door: 'Wees vriendelijk maar eerlijk. Zeg nee als iets niet kan.'" }
          ]
        },
        insight: "De gevaarlijkste AI-agent is er eentje zonder grenzen. 'Wees behulpzaam' klinkt onschuldig, maar zonder specifieke regels kan een agent privacywetten overtreden, geld weggeven, of klanten verkeerd informeren."
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
    desc: "AI beweert: 'De Eiffeltoren staat in Amsterdam sinds 1923.' Wat klopt er niet?",
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
    desc: "Een AI-agent heeft toegang tot je email. Wat is het EERSTE wat je instelt?",
    type: "quick-think",
    answer: "Welke acties de agent WEL en NIET mag uitvoeren (bijv. lezen mag, versturen niet zonder goedkeuring)",
    xp: 100
  },
  {
    title: "Bias Alert",
    desc: "Je vraagt AI: 'Beschrijf een verpleegkundige.' Het antwoord begint met 'Zij...' Wat zegt dit over de trainingsdata?",
    type: "quick-think",
    answer: "De trainingsdata bevat een gender-bias: verpleegkundigen worden vaker als vrouw beschreven",
    xp: 100
  }
];
