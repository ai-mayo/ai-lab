// App UI renderers for desktop apps
// Each function takes a container element and renders the app inside it

const APP_RENDERERS = {
  // ─── Zaaksysteem ────────────────────────────────────
  zaaksysteem(container) {
    container.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;background:#f8f9fa;font-family:-apple-system,'Inter',sans-serif;font-size:13px">
        <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:#fff;border-bottom:1px solid #e5e7eb">
          <span style="font-weight:700;color:#0f766e;font-size:0.95rem">Zaaksysteem</span>
          <span style="font-size:0.7rem;color:#888;background:#f3f4f6;padding:2px 8px;border-radius:4px">Gemeente Mayostad</span>
          <input placeholder="Zoek op zaaknummer of naam..." style="margin-left:auto;padding:6px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:0.8rem;width:220px;outline:none;font-family:inherit">
        </div>
        <div style="flex:1;overflow:auto;padding:16px">
          <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
            <thead>
              <tr style="background:#f9fafb;border-bottom:2px solid #e5e7eb;font-size:0.7rem;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px">
                <th style="padding:10px 14px;text-align:left">Zaaknr</th>
                <th style="padding:10px 14px;text-align:left">Omschrijving</th>
                <th style="padding:10px 14px;text-align:left">Type</th>
                <th style="padding:10px 14px;text-align:left">Aanvrager</th>
                <th style="padding:10px 14px;text-align:left">Status</th>
                <th style="padding:10px 14px;text-align:left">Behandelaar</th>
                <th style="padding:10px 14px;text-align:left">Datum</th>
              </tr>
            </thead>
            <tbody>
              ${[
                ["ZK-2026-0412","Terrasvergunning Bakkerij Van Dijk","Vergunning","H. van Dijk","Vertraagd","Anouk Willems","12-02-2026"],
                ["ZK-2026-0398","WMO hulp bij huishouden","WMO","R. Jansen-de Groot","In behandeling","Bas van den Berg","08-03-2026"],
                ["ZK-2026-0385","Subsidie buurtfeest Zuiderpark","Subsidie","F. El-Amrani","Toegekend","Remco van Dam","15-01-2026"],
                ["ZK-2026-0371","Bezwaar parkeerboete","Bezwaar","D. Krul","Afgehandeld","Ahmed Hassan","22-01-2026"],
                ["ZK-2026-0420","Omgevingsvergunning uitbreiding sportschool","Vergunning","J. de Boer","In behandeling","Marco Pieterse","18-03-2026"],
                ["ZK-2026-0425","Melding geluidsoverlast Parkweg","Melding","Anoniem","Nieuw","Dennis Krul","04-04-2026"],
                ["ZK-2026-0430","Aanvraag gehandicaptenparkeerkaart","WMO","M. Smit","In behandeling","Bas van den Berg","01-04-2026"],
                ["ZK-2026-0418","Kapvergunning Esdoorn Kerkstraat","Vergunning","Gem. Mayostad","Verleend","Anouk Willems","25-03-2026"],
                ["ZK-2026-0405","Evenementenvergunning Koningsdag","Vergunning","Oranjevereniging","Verleend","Marco Pieterse","10-02-2026"],
                ["ZK-2026-0432","Klacht afhandeltijd paspoort","Klacht","P. de Vries","Nieuw","Lisa de Vries","05-04-2026"],
              ].map(r => {
                const statusColors = {Vertraagd:"#dc2626",Nieuw:"#2563eb","In behandeling":"#d97706",Toegekend:"#059669",Afgehandeld:"#6b7280",Verleend:"#059669"};
                return `<tr style="border-bottom:1px solid #f3f4f6;cursor:default;transition:background 0.1s" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='#fff'">
                  <td style="padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#6b7280">${r[0]}</td>
                  <td style="padding:10px 14px;font-weight:500;color:#111827">${r[1]}</td>
                  <td style="padding:10px 14px"><span style="font-size:0.7rem;background:#f3f4f6;padding:2px 8px;border-radius:4px;color:#4b5563">${r[2]}</span></td>
                  <td style="padding:10px 14px;color:#4b5563">${r[3]}</td>
                  <td style="padding:10px 14px"><span style="font-size:0.7rem;font-weight:600;color:${statusColors[r[4]]||"#888"}">\u2022 ${r[4]}</span></td>
                  <td style="padding:10px 14px;color:#4b5563">${r[5]}</td>
                  <td style="padding:10px 14px;color:#9ca3af;font-size:0.8rem">${r[6]}</td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:0.75rem;color:#9ca3af">
            <span>10 van 847 zaken</span>
            <span>Pagina 1 van 85</span>
          </div>
        </div>
      </div>`;
  },

  // ─── Vergunningtool (met kaart) ──────────────────────
  vergunning(container) {
    const vergunningen = [
      {title:"Terrasvergunning Bakkerij Van Dijk",id:"VG-2026-042",status:"Vertraagd",statusColor:"#dc2626",type:"Horeca",lat:52.078,lng:4.315,adres:"Dorpsstraat 23",aanvrager:"H. van Dijk",date:"12-02-2026",note:"Bezwaar buurman ontvangen. Hoorzitting gepland 8 april.",plan:"Terras van 6x3m aan de voorzijde. 8 tafels, 16 stoelen. Openingstijden: 08:00-22:00. Parasols in huisstijl gemeente."},
      {title:"Omgevingsvergunning Sportschool FitNow",id:"VG-2026-048",status:"In behandeling",statusColor:"#d97706",type:"Bouw",lat:52.082,lng:4.320,adres:"Industrieweg 5",aanvrager:"J. de Boer",date:"18-03-2026",note:"Wacht op advies welstandscommissie.",plan:"Uitbreiding bestaand pand met 200m\u00B2. Nieuwe sportzaal + kleedkamers. Bouwlaag: 1. Materiaal: staal/glas."},
      {title:"Kapvergunning Esdoorn Kerkstraat",id:"VG-2026-045",status:"Verleend",statusColor:"#059669",type:"Kap",lat:52.076,lng:4.312,adres:"Kerkstraat 41",aanvrager:"Gemeente Mayostad",date:"25-03-2026",note:"Herplantplicht: 2 nieuwe bomen binnen 1 jaar.",plan:"Kap van 1 esdoorn (omtrek 180cm). Reden: wortelopdruk trottoir. Herplant: 2 lindes."},
      {title:"Evenementenvergunning Koningsdag",id:"VG-2026-038",status:"Verleend",statusColor:"#059669",type:"Evenement",lat:52.079,lng:4.318,adres:"Marktplein 1",aanvrager:"Oranjevereniging Mayostad",date:"10-02-2026",note:"Inclusief geluidsontheffing tot 23:00.",plan:"Koningsmarkt 08:00-18:00, live muziek 14:00-23:00. Verwacht: 5.000 bezoekers. Verkeersmaatregelen: afsluiting centrum."},
      {title:"Terrasvergunning Caf\u00E9 Het Hoekje",id:"VG-2026-051",status:"Nieuw",statusColor:"#2563eb",type:"Horeca",lat:52.080,lng:4.310,adres:"Havenstraat 1",aanvrager:"M. Hendriks",date:"02-04-2026",note:"Eerste aanvraag, nog niet in behandeling.",plan:"Terras 4x5m op het trottoir. 6 tafels. Aanvraag inclusief verwarmingselementen voor winter."},
      {title:"Reclamevergunning AH XL",id:"VG-2026-049",status:"In behandeling",statusColor:"#d97706",type:"Reclame",lat:52.083,lng:4.322,adres:"Winkelcentrum Mayostad 12",aanvrager:"Albert Heijn B.V.",date:"20-03-2026",note:"Lichtplan ontbreekt, nagevraagd bij aanvrager.",plan:"Verlichte gevelreclame 8x1.5m. LED-verlichting. Dimbaar na 22:00 conform APV."},
    ];

    let selectedId = null;
    function renderVG() {
      const sel = selectedId ? vergunningen.find(v => v.id === selectedId) : null;
      container.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;background:#f5f3ff;font-family:-apple-system,'Inter',sans-serif;font-size:13px">
          <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:#fff;border-bottom:1px solid #e5e7eb">
            <span style="font-weight:700;color:#7c3aed;font-size:0.95rem">Vergunningtool</span>
            <span style="font-size:0.7rem;color:#888;background:#f3f4f6;padding:2px 8px;border-radius:4px">${vergunningen.length} aanvragen</span>
          </div>
          <div style="flex:1;display:flex;overflow:hidden">
            <div id="vg-map" style="flex:1;min-height:300px"></div>
            <div style="width:320px;background:#fff;border-left:1px solid #e5e7eb;overflow-y:auto;flex-shrink:0" id="vg-detail">
              ${sel ? `
                <div style="padding:16px;border-bottom:1px solid #e5e7eb">
                  <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                    <span style="font-family:monospace;font-size:0.7rem;color:#9ca3af">${sel.id}</span>
                    <span style="font-size:0.65rem;background:#f5f3ff;color:#7c3aed;padding:2px 8px;border-radius:4px;font-weight:600">${sel.type}</span>
                  </div>
                  <div style="font-weight:700;color:#111;font-size:1rem;margin-bottom:8px">${sel.title}</div>
                  <div style="font-size:0.7rem;font-weight:600;color:${sel.statusColor};margin-bottom:12px">\u2022 ${sel.status}</div>
                  <div style="font-size:0.78rem;color:#555;margin-bottom:6px"><strong>Adres:</strong> ${sel.adres}</div>
                  <div style="font-size:0.78rem;color:#555;margin-bottom:6px"><strong>Aanvrager:</strong> ${sel.aanvrager}</div>
                  <div style="font-size:0.78rem;color:#555;margin-bottom:6px"><strong>Datum:</strong> ${sel.date}</div>
                  <div style="font-size:0.78rem;color:#555;margin-bottom:12px"><strong>Notitie:</strong> ${sel.note}</div>
                </div>
                <div style="padding:16px">
                  <div style="font-size:0.7rem;font-weight:600;color:#7c3aed;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Plan / Omschrijving</div>
                  <div style="font-size:0.82rem;color:#374151;line-height:1.6;background:#faf5ff;border:1px solid #e9d5ff;border-radius:6px;padding:12px">${sel.plan}</div>
                </div>
              ` : `
                <div style="padding:40px 20px;text-align:center;color:#9ca3af">
                  <div style="font-size:2rem;margin-bottom:8px">\u{1F4CD}</div>
                  <div style="font-size:0.85rem">Klik op een marker op de kaart om de aanvraag te bekijken</div>
                </div>
                ${vergunningen.map(v => `
                  <div class="vg-list-item" data-vgid="${v.id}" style="padding:10px 16px;border-bottom:1px solid #f3f4f6;cursor:pointer" onmouseover="this.style.background='#faf5ff'" onmouseout="this.style.background=''">
                    <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                      <span style="font-weight:500;font-size:0.82rem;color:#111">${v.title}</span>
                    </div>
                    <div style="display:flex;gap:8px;font-size:0.7rem;color:#9ca3af">
                      <span style="color:${v.statusColor};font-weight:600">${v.status}</span>
                      <span>${v.adres}</span>
                    </div>
                  </div>
                `).join("")}
              `}
            </div>
          </div>
        </div>`;

      // Init map
      try {
        const map = L.map(container.querySelector("#vg-map")).setView([52.079, 4.316], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "\u00A9 OpenStreetMap"
        }).addTo(map);

        vergunningen.forEach(v => {
          const color = v.statusColor;
          const icon = L.divIcon({
            className: "",
            html: `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.5rem;color:white;font-weight:700">${v.type[0]}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          const marker = L.marker([v.lat, v.lng], { icon }).addTo(map);
          marker.bindTooltip(v.title, { direction: "top", offset: [0, -14] });
          marker.on("click", () => { selectedId = v.id; renderVG(); });
        });

        setTimeout(() => map.invalidateSize(), 100);
      } catch(e) {}

      // List item clicks
      container.querySelectorAll("[data-vgid]").forEach(item => {
        item.addEventListener("click", () => { selectedId = item.dataset.vgid; renderVG(); });
      });
    }
    renderVG();
  },

  // ─── KCC-software ───────────────────────────────────
  kcc(container) {
    container.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;background:#f0f9ff;font-family:-apple-system,'Inter',sans-serif;font-size:13px">
        <div style="display:flex;align-items:center;gap:16px;padding:10px 16px;background:#fff;border-bottom:1px solid #e5e7eb">
          <span style="font-weight:700;color:#0369a1;font-size:0.95rem">KCC Dashboard</span>
          <div style="display:flex;gap:16px;margin-left:auto">
            <div style="text-align:center"><div style="font-size:1.3rem;font-weight:800;color:#0369a1">12</div><div style="font-size:0.6rem;color:#888">In wachtrij</div></div>
            <div style="text-align:center"><div style="font-size:1.3rem;font-weight:800;color:#059669">3</div><div style="font-size:0.6rem;color:#888">In gesprek</div></div>
            <div style="text-align:center"><div style="font-size:1.3rem;font-weight:800;color:#6b7280">4:12</div><div style="font-size:0.6rem;color:#888">Gem. wachttijd</div></div>
            <div style="text-align:center"><div style="font-size:1.3rem;font-weight:800;color:#d97706">89</div><div style="font-size:0.6rem;color:#888">Vandaag afgehandeld</div></div>
          </div>
        </div>
        <div style="flex:1;overflow:auto;padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:start">
          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px;grid-column:span 2">
            <div style="font-weight:700;color:#222;margin-bottom:12px;font-size:0.85rem">Wachtrij</div>
            ${["Vraag over afvalcontainer ophalen","Paspoort afhalen - wanneer klaar?","Parkeervergunning aanvragen","Klacht: stoep niet gerepareerd","Info bouwvergunning nodig","Vraag: wanneer is zwembad open?","Melding kapotte lantaarn","Status WMO-aanvraag","Probleem met DigiD","Vraag over hondenbelasting","Info over schuldhulpverlening","Klacht: te lang wachten bij balie"].map((q,i) => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:0.82rem">
                <span style="width:22px;height:22px;border-radius:50%;background:${i<3?"#dcfce7":"#f3f4f6"};display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:${i<3?"#059669":"#9ca3af"};font-weight:700;flex-shrink:0">${i+1}</span>
                <span style="color:#374151;flex:1">${q}</span>
                <span style="font-size:0.65rem;color:#9ca3af">${i<3?"In gesprek":"Wachtend"}</span>
                <span style="font-size:0.65rem;color:#9ca3af">${Math.floor(Math.random()*15)+1} min</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>`;
  },

  // ─── Sociaal Domein Hub ─────────────────────────────
  sociaal(container) {
    container.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;background:#fdf2f8;font-family:-apple-system,'Inter',sans-serif;font-size:13px">
        <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:#fff;border-bottom:1px solid #e5e7eb">
          <span style="font-weight:700;color:#be185d;font-size:0.95rem">Sociaal Domein Hub</span>
          <div style="display:flex;gap:6px;margin-left:16px">
            <span style="padding:4px 12px;background:#be185d;color:white;border-radius:6px;font-size:0.75rem;font-weight:600;cursor:pointer">WMO</span>
            <span style="padding:4px 12px;background:#f3f4f6;border-radius:6px;font-size:0.75rem;color:#666;cursor:pointer">Jeugdhulp</span>
            <span style="padding:4px 12px;background:#f3f4f6;border-radius:6px;font-size:0.75rem;color:#666;cursor:pointer">Schuldhulp</span>
          </div>
          <span style="margin-left:auto;font-size:0.65rem;background:#fef2f2;color:#dc2626;padding:3px 8px;border-radius:4px;font-weight:600">\u{1F512} Beveiligd</span>
        </div>
        <div style="flex:1;overflow:auto;padding:16px">
          <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:0.82rem;color:#856404">
            \u26A0 Dit systeem bevat bijzondere persoonsgegevens. Deel NOOIT informatie uit dit systeem met AI-tools. AVG-artikel 9 is van toepassing.
          </div>
          ${[
            {name:"R. Jansen-de Groot",type:"WMO",status:"In behandeling",desc:"Hulp bij huishouden. 78 jaar, alleenstaand.",consulent:"Bas van den Berg",date:"08-03-2026"},
            {name:"Fam. De Boer",type:"WMO",status:"Indicatie gesteld",desc:"Dagbesteding + vervoer. Echtpaar, beide beperkingen.",consulent:"Bas van den Berg",date:"15-02-2026"},
            {name:"M. Smit",type:"WMO",status:"In behandeling",desc:"Gehandicaptenparkeerkaart aangevraagd.",consulent:"Bas van den Berg",date:"01-04-2026"},
            {name:"Fam. Ahmad",type:"Jeugdhulp",status:"Actief",desc:"Gezinsbegeleiding. 3 kinderen, oudste 14.",consulent:"Noor de Jong",date:"10-01-2026"},
            {name:"T. Verhagen",type:"Schuldhulp",status:"Traject gestart",desc:"Minnelijk traject. Schuld: \u20AC18.400.",consulent:"Sandra Mulder",date:"20-02-2026"},
          ].map(d => `
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:10px;border-left:4px solid #be185d">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="font-weight:600;color:#111827">${d.name}</span>
                <span style="font-size:0.65rem;background:#fdf2f8;color:#be185d;padding:2px 8px;border-radius:4px;font-weight:600">${d.type}</span>
              </div>
              <div style="font-size:0.8rem;color:#6b7280;margin-bottom:6px">${d.desc}</div>
              <div style="display:flex;gap:16px;font-size:0.72rem;color:#9ca3af">
                <span>Status: <strong style="color:#4b5563">${d.status}</strong></span>
                <span>Consulent: ${d.consulent}</span>
                <span>${d.date}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>`;
  },

  // ─── MayoChat ───────────────────────────────────────
  chat(container) {
    const channels = [
      {name:"# algemeen", unread:3},
      {name:"# ai-pilot", unread:7},
      {name:"# kcc-team", unread:0},
      {name:"# sociaal-domein", unread:2},
      {name:"# vth", unread:0},
      {name:"# boa-team", unread:1},
      {name:"# grappig", unread:12},
    ];
    const messages = [
      {user:"Tom Bakker",time:"09:14",text:"Goedemorgen! Wie heeft er al met ChatGPT gewerkt vandaag?",avatar:"https://randomuser.me/api/portraits/men/22.jpg"},
      {user:"Sarah Chen",time:"09:16",text:"Ik heb net een persbericht laten herschrijven. Best goed resultaat!",avatar:"https://randomuser.me/api/portraits/women/75.jpg"},
      {user:"Remco van Dam",time:"09:18",text:"Ik probeerde een standaard-antwoord voor de afvalcontainer-vraag. Werkt prima als je specifiek genoeg bent.",avatar:"https://randomuser.me/api/portraits/men/32.jpg"},
      {user:"Lisa de Vries",time:"09:22",text:"Top! Vergeet niet de schrijfwijzer te checken voordat je iets verstuurt naar inwoners.",avatar:"https://randomuser.me/api/portraits/women/44.jpg"},
      {user:"Ahmed Hassan",time:"09:25",text:"\u26A0\uFE0F Reminder: GEEN BSN-nummers of medische gegevens in ChatGPT plakken. Wie dat doet krijgt taart-plicht voor het hele team.",avatar:"https://randomuser.me/api/portraits/men/91.jpg"},
      {user:"Dennis Krul",time:"09:30",text:"Haha Ahmed, begrepen! Youssef heeft gisteren een controlerapport laten schrijven. Zag er goed uit maar we moesten 2 feitelijke fouten eruit halen.",avatar:"https://randomuser.me/api/portraits/men/76.jpg"},
      {user:"Priya Sharma",time:"09:35",text:"Ik ben nog sceptisch. Hoe weet je zeker dat AI geen onzin schrijft in een offici\u00EBle brief?",avatar:"https://randomuser.me/api/portraits/women/68.jpg"},
      {user:"Tom Bakker",time:"09:37",text:"Goede vraag Priya! Daarom is er altijd een menselijke check nodig. AI schrijft het concept, jij controleert en verstuurt.",avatar:"https://randomuser.me/api/portraits/men/22.jpg"},
    ];

    container.innerHTML = `
      <div style="flex:1;display:flex;background:#1a1a2e;font-family:-apple-system,'Inter',sans-serif;font-size:13px;color:#e2e8f0">
        <div style="width:200px;background:#151528;border-right:1px solid #252545;padding:10px 0;overflow-y:auto;flex-shrink:0">
          <div style="padding:8px 14px;font-weight:700;font-size:0.85rem;color:#7dd3fc;margin-bottom:8px">MayoChat</div>
          ${channels.map(c => `
            <div style="display:flex;align-items:center;padding:5px 14px;cursor:pointer;color:${c.unread?"#e2e8f0":"#64748b"};font-size:0.82rem;font-weight:${c.unread?"500":"400"}" onmouseover="this.style.background='#1e1e38'" onmouseout="this.style.background=''">
              <span style="flex:1">${c.name}</span>
              ${c.unread ? `<span style="background:#dc2626;color:white;font-size:0.6rem;padding:1px 5px;border-radius:8px;font-weight:700">${c.unread}</span>` : ""}
            </div>
          `).join("")}
        </div>
        <div style="flex:1;display:flex;flex-direction:column">
          <div style="padding:10px 16px;border-bottom:1px solid #252545;font-weight:600;font-size:0.85rem"># ai-pilot <span style="font-weight:400;color:#64748b;font-size:0.75rem">\u2022 8 leden</span></div>
          <div style="flex:1;overflow-y:auto;padding:12px 16px">
            ${messages.map(m => `
              <div style="display:flex;gap:10px;margin-bottom:14px">
                <img src="${m.avatar}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;flex-shrink:0">
                <div>
                  <div style="display:flex;gap:8px;align-items:baseline;margin-bottom:2px">
                    <span style="font-weight:600;font-size:0.82rem;color:#e2e8f0">${m.user}</span>
                    <span style="font-size:0.65rem;color:#64748b">${m.time}</span>
                  </div>
                  <div style="font-size:0.85rem;color:#cbd5e1;line-height:1.5">${m.text}</div>
                </div>
              </div>
            `).join("")}
          </div>
          <div style="padding:10px 16px;border-top:1px solid #252545">
            <div style="display:flex;align-items:center;gap:8px;background:#1e1e38;border:1px solid #333;border-radius:8px;padding:8px 12px">
              <input placeholder="Bericht in #ai-pilot..." style="flex:1;background:transparent;border:none;color:#e2e8f0;font-family:inherit;font-size:0.85rem;outline:none" readonly>
              <span style="color:#64748b;cursor:pointer">\u{1F4CE}</span>
              <span style="color:#64748b;cursor:pointer">\u{1F600}</span>
            </div>
          </div>
        </div>
      </div>`;
  },

  // ─── MayoMail ───────────────────────────────────────
  mail(container) {
    const emails = [
      {from:"Lisa de Vries",subject:"Welkom bij het team!",preview:"Hoi! Welkom bij Gemeente Mayostad. In de bijlage vind je het inwerkprogramma...",time:"09:00",unread:true},
      {from:"Tom Bakker",subject:"AI-pilot: handleiding ChatGPT",preview:"Hierbij de handleiding voor het gebruik van ChatGPT binnen de gemeente...",time:"08:45",unread:true},
      {from:"Ahmed Hassan",subject:"Beveiligingsprotocol AI-tools",preview:"Beste collega, bijgaand het beveiligingsprotocol voor het gebruik van AI...",time:"08:30",unread:true},
      {from:"HR Gemeente Mayostad",subject:"Arbeidsvoorwaarden en huisregels",preview:"Welkom! In de bijlage vind je je arbeidsovereenkomst en de huisregels...",time:"Gisteren",unread:false},
      {from:"Facilitaire Zaken",subject:"Parkeervergunning en toegangspas",preview:"Je parkeervergunning en toegangspas liggen klaar bij de receptie...",time:"Gisteren",unread:false},
      {from:"ICT Servicedesk",subject:"Inloggegevens werkplek",preview:"Hierbij je inloggegevens. Wijzig je wachtwoord bij eerste gebruik...",time:"Gisteren",unread:false},
      {from:"Sarah Chen",subject:"Schrijfwijzer Gemeente Mayostad",preview:"Hoi! Hier is de link naar onze schrijfwijzer op MayoWiki. Lees deze...",time:"Gisteren",unread:false},
    ];

    container.innerHTML = `
      <div style="flex:1;display:flex;background:#fff;font-family:-apple-system,'Inter',sans-serif;font-size:13px">
        <div style="width:70px;background:#1e40af;display:flex;flex-direction:column;align-items:center;padding:12px 0;gap:16px;flex-shrink:0">
          <div style="width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:white;font-size:1.1rem">\u{2709}</div>
          <div style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:1.1rem">\u{1F4C5}</div>
          <div style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.5);font-size:1.1rem">\u{1F465}</div>
        </div>
        <div style="width:250px;border-right:1px solid #e5e7eb;overflow-y:auto;flex-shrink:0">
          <div style="padding:12px 14px;border-bottom:1px solid #e5e7eb">
            <div style="font-weight:700;font-size:0.9rem;color:#111827;margin-bottom:8px">Inbox</div>
            <input placeholder="Zoek in mail..." style="width:100%;padding:6px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:0.78rem;outline:none;font-family:inherit">
          </div>
          ${emails.map(e => `
            <div style="padding:10px 14px;border-bottom:1px solid #f3f4f6;cursor:pointer;${e.unread?"background:#eff6ff;":""}transition:background 0.1s" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='${e.unread?"#eff6ff":""}'">
              <div style="display:flex;justify-content:space-between;margin-bottom:2px">
                <span style="font-weight:${e.unread?"600":"400"};font-size:0.82rem;color:#111827">${e.from}</span>
                <span style="font-size:0.65rem;color:#9ca3af">${e.time}</span>
              </div>
              <div style="font-size:0.78rem;font-weight:${e.unread?"600":"400"};color:#374151;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.subject}</div>
              <div style="font-size:0.72rem;color:#9ca3af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${e.preview}</div>
            </div>
          `).join("")}
        </div>
        <div style="flex:1;padding:24px;overflow-y:auto">
          <div style="font-size:1.1rem;font-weight:700;color:#111827;margin-bottom:4px">Welkom bij het team!</div>
          <div style="font-size:0.78rem;color:#6b7280;margin-bottom:16px">Van: Lisa de Vries &lt;l.devries@mayostad.nl&gt; \u2022 Vandaag 09:00</div>
          <div style="font-size:0.88rem;color:#374151;line-height:1.7">
            <p>Hoi!</p>
            <p>Welkom bij Gemeente Mayostad! Fijn dat je er bent als onze nieuwe AI-pilot co\u00F6rdinator.</p>
            <p>Een paar dingen voor je eerste dag:</p>
            <ul style="margin:8px 0;padding-left:20px">
              <li>Open MayoWiki en lees je in over de organisatie</li>
              <li>Bekijk je collega's in WiWa</li>
              <li>Check MayoBoard voor je eerste opdrachten</li>
              <li>Lees de AI Huisregels en Schrijfwijzer</li>
            </ul>
            <p>Ik stuur je straks je eerste echte opdracht via MayoBoard. Succes!</p>
            <p>Groet,<br>Lisa de Vries<br><span style="color:#9ca3af">Teamleider KCC \u2022 Gemeente Mayostad</span></p>
          </div>
        </div>
      </div>`;
  },

  // ─── NotebookLM ─────────────────────────────────────
  notebooklm(container) {
    container.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;background:#1a1a1a;font-family:-apple-system,'Inter',sans-serif;font-size:13px;color:#e0e0e0">
        <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#242424;border-bottom:1px solid #333">
          <span style="font-weight:700;color:#EA8B47;font-size:0.95rem">\u{1F4D3} NotebookLM</span>
          <span style="font-size:0.7rem;color:#888;background:#333;padding:2px 8px;border-radius:4px">Gemeente Mayostad workspace</span>
        </div>
        <div style="flex:1;display:flex;overflow:hidden">
          <div style="width:240px;background:#1e1e1e;border-right:1px solid #333;padding:12px;overflow-y:auto;flex-shrink:0">
            <div style="font-size:0.7rem;color:#888;font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Bronnen</div>
            ${["Schrijfwijzer Mayostad 2026.pdf","WMO Beleidsplan 2025-2028.pdf","Omgevingsvisie Mayostad.pdf","Nota Grondbeleid 2024.pdf","APV Gemeente Mayostad.pdf","AI-beleid gemeenten (VNG).pdf","Coalitieakkoord 2022-2026.pdf","Jaarverslag 2025.pdf"].map(d => `
              <div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;margin-bottom:2px;font-size:0.8rem;color:#aaa" onmouseover="this.style.background='#2a2a2a'" onmouseout="this.style.background=''">
                <span style="color:#EA8B47">\u{1F4C4}</span>${d}
              </div>
            `).join("")}
          </div>
          <div style="flex:1;padding:24px;overflow-y:auto">
            <div style="max-width:600px;margin:0 auto">
              <div style="font-size:1.2rem;font-weight:700;margin-bottom:16px">Stel een vraag over je bronnen</div>
              <div style="background:#242424;border:1px solid #444;border-radius:12px;padding:14px">
                <input placeholder="Bijv: Wat staat er in de schrijfwijzer over aanhef?" style="width:100%;background:transparent;border:none;color:#e0e0e0;font-size:0.9rem;outline:none;font-family:inherit" readonly>
              </div>
              <div style="margin-top:24px;font-size:0.7rem;color:#666;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px">Suggesties</div>
              ${["Vat de schrijfwijzer samen in 5 punten","Wat zijn de belangrijkste wijzigingen in het WMO-beleid?","Welke AI-regels gelden voor gemeenten volgens de VNG?","Wat staat er in het coalitieakkoord over digitalisering?"].map(s => `
                <div style="padding:10px 14px;background:#242424;border:1px solid #333;border-radius:8px;margin-bottom:6px;cursor:pointer;font-size:0.85rem;color:#aaa" onmouseover="this.style.borderColor='#EA8B47';this.style.color='#e0e0e0'" onmouseout="this.style.borderColor='#333';this.style.color='#aaa'">${s}</div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>`;
  },
};
