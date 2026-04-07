// AI Lab — Mission Data
// Missions simulate real AI tools (ChatGPT, Claude, Copilot, Gemini)
// with hands-on tasks that teach through doing

const STORY = {
  title: "Eerste Week bij Nova",
  intro: "Je bent net aangenomen bij Nova, een snelgroeiend techbedrijf. Op je eerste dag ontdek je dat iedereen hier AI gebruikt. Je manager zegt: 'Wij werken niet harder. Wij werken met AI.' Jij hebt nog nooit een AI-tool geopend. Dat gaat vandaag veranderen.",
};

const MISSIONS = [
  // ── DAG 1 ──────────────────────────────────────────
  {
    id: "prompt-lab",
    name: "Dag 1: Je Eerste Opdracht",
    desc: "Je manager vraagt je een klant-email te schrijven. 'Gebruik ChatGPT,' zegt ze. Je opent het.",
    icon: "\u{1F3ED}",
    color: "var(--cyan)",
    colorDim: "var(--cyan-dim)",
    tag: "DAG 1",
    tagColor: "var(--cyan)",
    xp: 500,
    tool: "chatgpt",
    storyIntro: "Maandagochtend. Je loopt het kantoor van Nova binnen. Nieuwe laptop, nieuw bureau. Je manager Lisa loopt langs: 'Heb je al een ChatGPT account? Je gaat het nodig hebben.' Ze lacht en loopt door. Op je scherm staat een sticky note: 'Bakkerij Van Dijk bellen - bestelling vertraagd. Schrijf een email.' Je opent je browser...",
    tasks: [
      {
        type: "scenario",
        label: "OPEN CHATGPT",
        title: "Je opent ChatGPT voor het eerst",
        desc: "Lisa geeft je een opdracht. Schrijf zelf de prompt in ChatGPT.",
        interaction: {
          type: "free-prompt",
          tool: "chatgpt",
          briefing: {
            title: "Opdracht van Lisa",
            text: "Schrijf een excuus-email aan de klant over de vertraagde bestelling. Gebruik ChatGPT.",
            companyInfo: {
              name: "Nova",
              tagline: "Innovatieve oplossingen voor moderne bedrijven",
              toneOfVoice: "Professioneel maar warm. We zijn geen bank - we zijn een team dat geeft om klanten. Gebruik voornaam + achternaam, niet 'Geachte'. Sluit af met 'Hartelijke groet' niet 'Hoogachtend'.",
              signoff: "Team Nova",
              phone: "020-1234567",
              email: "klantenservice@nova.nl"
            },
            customerInfo: {
              name: "Meneer Van Dijk",
              company: "Bakkerij Van Dijk",
              customerSince: "2021",
              orderNumber: "#4891",
              issue: "Bestelling 2 dagen vertraagd door leveranciersprobleem",
              newDate: "Donderdag 10 april",
              notes: "Trouwe klant, altijd op tijd betaald. Behandel met zorg."
            }
          },
          checks: [
            { id: "recipient", label: "Ontvanger", keywords: ["van dijk", "bakkerij"], hint: "Noem de naam van de klant", points: 20 },
            { id: "order", label: "Bestelnummer", keywords: ["4891", "#4891"], hint: "Vermeld het bestelnummer", points: 15 },
            { id: "issue", label: "Probleem", keywords: ["vertraag", "later", "uitgesteld", "leverancier"], hint: "Leg uit wat er aan de hand is", points: 20 },
            { id: "date", label: "Nieuwe datum", keywords: ["10 april", "donderdag"], hint: "Noem de nieuwe leverdatum", points: 20 },
            { id: "tone", label: "Toon/stijl", keywords: ["excus", "sorry", "onze excuses", "spijt", "vervelend"], hint: "Bied excuses aan", points: 10 },
            { id: "format", label: "Formaat", keywords: ["kort", "bondig", "zinnen", "beknopt"], hint: "Geef aan hoe lang de email moet zijn", points: 5 },
            { id: "signoff", label: "Ondertekening", keywords: ["nova", "team nova", "namens"], hint: "Vermeld namens wie je schrijft", points: 10 }
          ],
          responses: {
            perfect: "Beste meneer Van Dijk,\n\nHelaas moet ik u laten weten dat uw bestelling #4891 door een onverwacht leveranciersprobleem twee dagen vertraging heeft opgelopen.\n\nDe nieuwe verwachte leverdatum is donderdag 10 april. Onze oprechte excuses voor het ongemak.\n\nNeem bij vragen gerust contact op via 020-1234567.\n\nHartelijke groet,\nTeam Nova",
            good: "Beste meneer Van Dijk,\n\nUw bestelling heeft helaas vertraging opgelopen. We verwachten deze op donderdag 10 april te kunnen leveren.\n\nOnze excuses voor het ongemak.\n\nMet vriendelijke groet,\nTeam Nova",
            mediocre: "Beste klant,\n\nUw bestelling is vertraagd. We hopen deze binnenkort te leveren.\n\nExcuses voor het ongemak.\n\nGroeten",
            bad: "Hallo,\n\nEr is een vertraging.\n\nGroeten"
          }
        },
        insight: "Een goede prompt bevat: WIE (ontvanger), WAT (boodschap + details), HOE (toon), en FORMAAT (lengte). Hoe specifieker je bent, hoe bruikbaarder het resultaat. Tip: geef AI dezelfde informatie die je een collega zou geven."
      },
      {
        type: "scenario",
        label: "EXPERIMENT",
        title: "Temperature: de creativiteitsknop",
        desc: "Onder de motorkap heeft elk AI-model een instelling genaamd 'temperature'. Die bepaalt hoe creatief of strikt het antwoord is.",
        interaction: {
          type: "temperature-slider",
          prompt: "Beschrijf het weer in Amsterdam vandaag",
          outputs: {
            0: "Het is bewolkt in Amsterdam met een temperatuur van 12\u00B0C. Er is 60% kans op regen. Wind uit het westen, 15 km/u.",
            0.3: "Amsterdam heeft vandaag typisch Hollands weer \u2014 overwegend bewolkt met af en toe een waterig zonnetje. Pak een paraplu mee.",
            0.5: "Amsterdam baadt vandaag in die kenmerkende grijze gloed die de stad zo fotogeniek maakt. De wolken hangen laag als een deken van oud zilver boven de grachten.",
            0.7: "De hemel boven Amsterdam speelt pokerspel met de voetgangers \u2014 het ene moment een blauwe flirt, het volgende een stortbui die je fiets in een onderzee\u00EBr verandert.",
            1.0: "Amsterdam heeft het weer van een existentialistische roman: de wolken zijn geschreven door Camus, de regen smaakt naar espresso en verloren illusies, en ergens in de Jordaan huilt een duif van schoonheid."
          }
        },
        insight: "Temperature bepaalt creativiteit vs. betrouwbaarheid. Voor een zakelijke email: laag (0.1). Voor een gedicht: hoog (0.8). De meeste AI-tools verbergen deze instelling, maar het is goed om te weten dat het bestaat."
      },
      {
        type: "scenario",
        label: "VERGELIJK",
        title: "ChatGPT vs Claude vs Gemini",
        desc: "Dezelfde prompt, drie verschillende AI-modellen. Welke geeft het beste antwoord? En waarom?",
        interaction: {
          type: "model-compare",
          prompt: "Leg uit wat blockchain is in 2 zinnen voor iemand van 70",
          models: [
            {
              name: "ChatGPT",
              icon: "\u{1F7E2}",
              color: "#10a37f",
              output: "Blockchain is als een digitaal kasboek dat door duizenden computers tegelijk wordt bijgehouden, zodat niemand er stiekem iets in kan veranderen. Stel je voor dat elke transactie in een glazen kluis staat die iedereen kan bekijken maar niemand kan openmaken.",
              strengths: ["Goede metafoor (kasboek)", "Toegankelijke taal"],
              weaknesses: ["Tweede zin is wat abstract"]
            },
            {
              name: "Claude",
              icon: "\u{1F7E0}",
              color: "#d97706",
              output: "Blockchain is een soort gedeeld huishoudboekje op internet: als u iets koopt of verkoopt, schrijven heel veel computers dat tegelijk op, waardoor niemand kan sjoemelen. Het is de technologie achter Bitcoin, maar wordt ook gebruikt voor andere dingen zoals het bijhouden van eigendomsbewijzen.",
              strengths: ["Heel toegankelijk (huishoudboekje)", "Geeft context (Bitcoin)"],
              weaknesses: ["Iets langer dan gevraagd"]
            },
            {
              name: "Gemini",
              icon: "\u{1F535}",
              color: "#4285f4",
              output: "Blockchain is een digitaal logboek dat op veel computers tegelijk staat, waardoor het heel moeilijk te vervalsen is. Het wordt vooral gebruikt voor digitaal geld zoals Bitcoin.",
              strengths: ["Kort en bondig", "Precies 2 zinnen"],
              weaknesses: ["Minder beeldend, wat droger"]
            }
          ],
          question: "Welk model volgt de opdracht het beste op? (2 zinnen, voor iemand van 70)",
          correctModel: "Claude",
          explanation: "Alle drie zijn bruikbaar, maar Claude combineert de meest begrijpelijke taal ('huishoudboekje') met praktische context. ChatGPT is creatiever, Gemini is het kortst. Er is geen 'beste' model \u2014 het hangt af van wat je nodig hebt."
        },
        insight: "Elk AI-model heeft een eigen 'persoonlijkheid'. ChatGPT is vaak creatief, Claude is voorzichtig en precies, Gemini is beknopt. Tip: probeer belangrijke vragen in meerdere tools en vergelijk de antwoorden."
      }
    ]
  },

  // ── DAG 2 ──────────────────────────────────────────
  {
    id: "hallucination-lab",
    name: "Dag 2: De Waarheid Checken",
    desc: "Je collega stuurt je een AI-rapport. Het ziet er perfect uit. Maar klopt het ook?",
    icon: "\u{1F50D}",
    color: "var(--red)",
    colorDim: "var(--red-dim)",
    tag: "DAG 2",
    tagColor: "var(--red)",
    xp: 600,
    tool: "claude",
    storyIntro: "Dinsdagochtend. Je bent trots op gisteren - die email was goed. Bij de koffie zegt je collega Tom: 'Ik heb ChatGPT een heel rapport laten schrijven voor de directie. Kijk eens!' Hij stuurt het naar je. Het ziet er professioneel uit. Maar iets voelt niet helemaal goed...",
    tasks: [
      {
        type: "scenario",
        label: "SITUATIE",
        title: "Je collega stuurt een AI-rapport",
        desc: "'Kijk, ChatGPT heeft dit rapport geschreven. Ziet er professioneel uit!' Je opent het. Maar klopt het ook? Scan de tekst en klik op alles wat verdacht is.",
        interaction: {
          type: "scan-text",
          instruction: "Klik op de verdachte zinnen. AI heeft er dingen bij verzonnen.",
          text: [
            { content: "Het bedrijf is opgericht in 2019 en heeft 45 medewerkers.", suspicious: false },
            { content: " Volgens een onderzoek van de Universiteit van Maastricht uit 2024 is het bedrijf marktleider in de Benelux.", suspicious: true, reason: "Dit onderzoek bestaat niet. AI verzint regelmatig academische bronnen die overtuigend klinken. Dit heet een 'hallucinatie'." },
            { content: " De omzet groeide vorig jaar met 23%.", suspicious: false },
            { content: " Professor dr. Jan-Willem van der Berg, hoogleraar Digitale Economie aan de TU Delft, noemt het bedrijf 'een schoolvoorbeeld van innovatie'.", suspicious: true, reason: "Deze professor bestaat niet. AI verzint namen, titels en quotes. Altijd Googlen!" },
            { content: " Het bedrijf won in 2023 de Dutch Innovation Award.", suspicious: true, reason: "AI verzint prijzen en onderscheidingen. Check altijd of een prijs echt bestaat." },
            { content: " De klanttevredenheid scoort gemiddeld 8.2 uit 10.", suspicious: false },
            { content: " Op grond van artikel 14.3b van de AVG is het bedrijf verplicht een functionaris gegevensbescherming aan te stellen.", suspicious: true, reason: "Artikel 14.3b bestaat niet in de AVG. AI verzint wetsartikelen die er legitiem uitzien. Levensgevaarlijk in juridische contexten!" }
          ]
        },
        insight: "AI 'hallucineert': het genereert tekst die statistisch waarschijnlijk klinkt maar feitelijk onjuist is. Bronnen, namen, wetten, cijfers \u2014 ALTIJD checken. Behandel AI-output als ongecontroleerde informatie."
      },
      {
        type: "scenario",
        label: "GEVAAR",
        title: "Wat je NOOIT in een AI moet typen",
        desc: "Veel mensen plakken van alles in ChatGPT zonder na te denken. Maar alles wat je intypt kan worden opgeslagen en gebruikt voor training. Welke van deze dingen mag je WEL in een AI typen?",
        interaction: {
          type: "sort-safe-unsafe",
          instruction: "Sleep elk item naar 'Veilig' of 'Niet doen'",
          items: [
            { text: "Een recept voor appeltaart", safe: true, reason: "Openbare informatie, geen risico" },
            { text: "Je BSN-nummer om belastingadvies te krijgen", safe: false, reason: "Je BSN is strikt persoonlijk. AI-bedrijven kunnen je data opslaan. Nooit persoonlijke nummers delen!" },
            { text: "De broncode van je bedrijfssoftware", safe: false, reason: "Bedrijfsgeheimen kunnen in trainingsdata terechtkomen. Samsung-medewerkers lekten zo per ongeluk broncode via ChatGPT." },
            { text: "'Herschrijf deze tekst' met een Wikipedia-artikel", safe: true, reason: "Openbare informatie, geen risico" },
            { text: "Medische klachten voor een diagnose", safe: false, reason: "AI is geen arts. Medische data is privacygevoelig, en AI-diagnoses zijn onbetrouwbaar en potentieel gevaarlijk." },
            { text: "Wachtwoorden of inloggegevens", safe: false, reason: "Nooit! Je credentials kunnen worden opgeslagen. Gebruik een password manager, geen AI." },
            { text: "'Vat deze publieke nieuwsartikelen samen'", safe: true, reason: "Openbare informatie samenvatten is prima" },
            { text: "Klantgegevens uit je CRM-systeem", safe: false, reason: "Persoonsgegevens van klanten delen met AI kan een AVG-overtreding zijn. Je bedrijf kan hiervoor beboet worden." },
            { text: "Een verjaardagsgedicht voor je oma", safe: true, reason: "Creatieve content zonder gevoelige data is prima!" }
          ]
        },
        insight: "Vuistregel: als je het niet op een briefje op het prikbord van de kantine zou hangen, typ het dan niet in een AI-tool. Persoonlijke data, bedrijfsgeheimen, inloggegevens en medische info zijn no-go."
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
              problem: "Nu be\u00EFnvloedt jouw bias ALLE adviezen. De AI zal nooit meer een picknick voorstellen, zelfs als het 25\u00B0C en zonnig is."
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
    name: "Dag 3: De Robot Collega",
    desc: "IT introduceert een AI-agent die taken zelfstandig uitvoert. Jij moet hem configureren.",
    icon: "\u{1F916}",
    color: "var(--purple)",
    colorDim: "var(--purple-dim)",
    tag: "DAG 3",
    tagColor: "var(--purple)",
    xp: 700,
    tool: "claude",
    storyIntro: "Woensdagochtend. Er staat een mail van IT in je inbox: 'Vanaf vandaag heeft elk team een AI-agent voor klantenservice. Configureer hem voor jullie afdeling.' Je opent de link. Een leeg configuratiescherm staart je aan. Lisa loopt langs: 'Wees voorzichtig met wat je hem laat doen. Vorige week heeft het sales-team per ongeluk 40% korting weggegeven via hun agent.'",
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
              { role: "ai", text: "Hier zijn 3 opties:\n1. KLM - \u20AC189 (di 8:00)\n2. BA - \u20AC145 (di 11:30)\n3. EasyJet - \u20AC89 (di 14:00)" },
              { role: "user", text: "Boek optie 2" },
              { role: "ai", text: "Ik kan geen boekingen maken. Ga naar ba.com en zoek vlucht BA432." }
            ]
          },
          agent: {
            label: "AI Agent",
            conversation: [
              { role: "user", text: "Boek een vlucht naar Londen, max \u20AC200" },
              { role: "ai", text: "[Zoekt vluchten...]\n[Vergelijkt 14 opties...]\n[Selecteert BA - \u20AC145]\n[Opent ba.com...]\n[Vult gegevens in...]\n[Betaalt met opgeslagen creditcard...]\n\n\u2705 Geboekt! BA432, di 11:30.\nTaxi naar Heathrow ook geregeld." }
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
              badResponse: "Ok\u00E9, ik geef je 50% korting! Alsjeblieft!"
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
            { id: "no-limits", text: "Geen financi\u00EBle grenzen \u2014 geeft zomaar korting", fix: "Regel: 'Geen kortingen zonder goedkeuring manager'" },
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
    name: "Dag 4: De Vergadering",
    desc: "Vrijdag. Grote vergadering. Jij hebt AI. De rest niet.",
    icon: "\u{2708}\uFE0F",
    color: "var(--green)",
    colorDim: "var(--green-dim)",
    tag: "DAG 4",
    tagColor: "var(--green)",
    xp: 600,
    tool: "copilot",
    storyIntro: "Vrijdagmiddag. Teamvergadering. De manager vraagt: 'Wie maakt de notulen?' Stilte. Je glimlacht en steekt je hand op. Iedereen kijkt verbaasd - jij was altijd degene die notulen haatte. Maar jij hebt iets dat de rest niet heeft. Je opent je laptop...",
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
              output: "**Vergadersamenvatting**\n\n**Status project:** Vertraagd door leveranciersproblemen\n\n**Voorstel:** Deadline verschuiven naar eind april (Maria)\n\n**Budget:** Uitgeput (Financi\u00EBn)\n\n**Beslispunt:** Meer budget aanvragen OF scope verkleinen\n\n**Acties:**\n\u2022 Iedereen: input leveren v\u00F3\u00F3r vrijdag\n\u2022 Volgende vergadering: maandag 10:00",
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
              output: "Interessant concept, maar ik mis essenti\u00EBle informatie:\n\n1. **Marktanalyse:** Hoe groot is de markt voor biologische hondensnacks in NL? Wie zijn je concurrenten?\n2. **Unit economics:** Wat kost productie per koekje? Wat is je marge?\n3. **Kanaalrisico:** Instagram-only is kwetsbaar. Wat als het algoritme verandert?\n4. **Regulering:** Diervoeding heeft strenge EU-regels. Heb je de certificeringen?\n\nPotentie is er, maar dit plan is niet investment-ready.",
              analysis: "Diepgaand, kritisch, bruikbare feedback"
            },
            {
              role: "Je bent een marketing-expert gespecialiseerd in Instagram-groei",
              output: "Instagram + biologisch + honden = goud! Hier is je aanpak:\n\n1. **Content:** Dagelijks behind-the-scenes van het bakproces. Honden die koekjes testen = virale content.\n2. **Hashtags:** #biologischehond #gezondehond #hondenliefde\n3. **Influencers:** Stuur gratis samples naar honden-influencers (5K-50K volgers)\n4. **UGC:** Vraag klanten om foto's van hun hond met jouw koekjes\n5. **Reels:** Korte video's van het productieproces\n\nBudget: start met \u20AC500 voor influencer-samples.",
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
    desc: "Mag je een klant-emailadres in ChatGPT plakken om een antwoord te schrijven?",
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
