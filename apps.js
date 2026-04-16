// App UI renderers for desktop apps
// Each function takes a container element and renders the app inside it

const APP_RENDERERS = {
  // ─── Zaaksysteem ────────────────────────────────────
  zaaksysteem(container) {
    const zaken = [
      {nr:"VTH-2026-00347",titel:"Terrasvergunning Bakkerij Van Dijk",type:"Vergunning",aanvrager:"H.J. van Dijk",status:"Vertraagd",behandelaar:"Anouk Willems",datum:"12-02-2026",detail:"vandijk"},
      {nr:"VTH-2026-00412",titel:"Omgevingsvergunning Sportschool FitNow",type:"Vergunning",aanvrager:"J. de Boer",status:"In behandeling",behandelaar:"Marco Pieterse",datum:"18-03-2026"},
      {nr:"VTH-2026-00398",titel:"Kapvergunning Esdoorn Kerkstraat",type:"Vergunning",aanvrager:"Gem. Mayostad",status:"Verleend",behandelaar:"Anouk Willems",datum:"25-03-2026"},
      {nr:"VTH-2026-00405",titel:"Evenementenvergunning Koningsdag",type:"Vergunning",aanvrager:"Oranjevereniging",status:"Verleend",behandelaar:"Marco Pieterse",datum:"10-02-2026"},
      {nr:"VTH-2026-00425",titel:"Melding geluidsoverlast Parkweg",type:"Melding",aanvrager:"Anoniem",status:"Nieuw",behandelaar:"Dennis Krul",datum:"04-04-2026"},
      {nr:"ZK-2026-0398",titel:"WMO hulp bij huishouden",type:"WMO",aanvrager:"R. Jansen-de Groot",status:"In behandeling",behandelaar:"Bas van den Berg",datum:"08-03-2026"},
      {nr:"ZK-2026-0385",titel:"Subsidie buurtfeest Zuiderpark",type:"Subsidie",aanvrager:"F. El-Amrani",status:"Toegekend",behandelaar:"Remco van Dam",datum:"15-01-2026"},
      {nr:"ZK-2026-0371",titel:"Bezwaar parkeerboete",type:"Bezwaar",aanvrager:"D. Krul",status:"Afgehandeld",behandelaar:"Ahmed Hassan",datum:"22-01-2026"},
      {nr:"ZK-2026-0430",titel:"Aanvraag gehandicaptenparkeerkaart",type:"WMO",aanvrager:"M. Smit",status:"In behandeling",behandelaar:"Bas van den Berg",datum:"01-04-2026"},
      {nr:"ZK-2026-0432",titel:"Klacht afhandeltijd paspoort",type:"Klacht",aanvrager:"P. de Vries",status:"Nieuw",behandelaar:"Lisa de Vries",datum:"05-04-2026"},
    ];
    const statusColors = {Vertraagd:"#dc2626",Nieuw:"#2563eb","In behandeling":"#d97706",Toegekend:"#059669",Afgehandeld:"#6b7280",Verleend:"#059669"};

    function renderList() {
      container.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;background:#f8f9fa;font-family:-apple-system,'Inter',sans-serif;font-size:13px">
          <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:#fff;border-bottom:1px solid #e5e7eb">
            <span style="font-weight:700;color:#0f766e;font-size:0.95rem">Zaaksysteem</span>
            <span style="font-size:0.7rem;color:#888;background:#f3f4f6;padding:2px 8px;border-radius:4px">Gemeente Mayostad</span>
            <span style="font-size:0.7rem;color:#0f766e;background:#d1fae5;padding:2px 8px;border-radius:4px">Afdeling VTH</span>
            <input placeholder="Zoek op zaaknummer of naam..." style="margin-left:auto;padding:6px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:0.8rem;width:220px;outline:none;font-family:inherit">
          </div>
          <div style="padding:10px 16px;background:#fffbeb;border-bottom:1px solid #fef3c7;font-size:0.75rem;color:#92400e"><strong>1 zaak vereist aandacht:</strong> VTH-2026-00347 is vertraagd, aanvrager moet worden geinformeerd.</div>
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
              <tbody id="zaak-rows">
                ${zaken.map(r => `
                  <tr data-zaak="${r.nr}" style="border-bottom:1px solid #f3f4f6;cursor:pointer;transition:background 0.1s${r.status==='Vertraagd'?';background:#fef2f2':''}" onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='${r.status==='Vertraagd'?'#fef2f2':'#fff'}'">
                    <td style="padding:10px 14px;font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#0f766e;font-weight:600">${r.nr}</td>
                    <td style="padding:10px 14px;font-weight:500;color:#111827">${r.titel}</td>
                    <td style="padding:10px 14px"><span style="font-size:0.7rem;background:#f3f4f6;padding:2px 8px;border-radius:4px;color:#4b5563">${r.type}</span></td>
                    <td style="padding:10px 14px;color:#4b5563">${r.aanvrager}</td>
                    <td style="padding:10px 14px"><span style="font-size:0.7rem;font-weight:600;color:${statusColors[r.status]||'#888'}">&bull; ${r.status}</span></td>
                    <td style="padding:10px 14px;color:#4b5563">${r.behandelaar}</td>
                    <td style="padding:10px 14px;color:#9ca3af;font-size:0.8rem">${r.datum}</td>
                  </tr>`).join("")}
              </tbody>
            </table>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:0.75rem;color:#9ca3af">
              <span>10 van 847 zaken</span>
              <span>Pagina 1 van 85</span>
            </div>
          </div>
        </div>`;
      container.querySelectorAll("tr[data-zaak]").forEach(tr => {
        tr.addEventListener("click", () => {
          const z = zaken.find(x => x.nr === tr.dataset.zaak);
          if (z && z.detail === "vandijk") renderVanDijkDetail();
          else renderGenericDetail(z);
        });
      });
    }

    function renderVanDijkDetail() {
      container.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;background:#f8f9fa;font-family:-apple-system,'Inter',sans-serif;font-size:13px;overflow:auto">
          <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:#fff;border-bottom:1px solid #e5e7eb">
            <button id="back-zaken" style="background:none;border:1px solid #d1d5db;border-radius:6px;padding:4px 12px;font-size:0.75rem;color:#6b7280;cursor:pointer;font-family:inherit">&larr; Alle zaken</button>
            <span style="font-weight:700;color:#0f766e;font-size:0.95rem">Zaak VTH-2026-00347</span>
            <span style="font-size:0.7rem;font-weight:600;color:#dc2626;background:#fef2f2;padding:3px 10px;border-radius:4px">&bull; VERTRAAGD</span>
          </div>
          <div style="padding:24px 32px;max-width:860px">
            <h1 style="font-size:1.5rem;color:#111;margin-bottom:6px">Terrasvergunning Bakkerij Van Dijk</h1>
            <div style="font-size:0.85rem;color:#6b7280;margin-bottom:20px">Aanvraag ontvangen op 12 februari 2026 | Behandelaar: Anouk Willems</div>

            <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px 16px;border-radius:6px;margin-bottom:24px">
              <div style="font-weight:700;color:#991b1b;margin-bottom:4px">Actie vereist</div>
              <div style="font-size:0.85rem;color:#7f1d1d">De aanvrager is NOG NIET geinformeerd over de vertraging. Er moet vandaag een brief uit.</div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-bottom:24px">
              <div>
                <h3 style="font-size:0.75rem;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px;margin-bottom:10px">Aanvrager</h3>
                <div style="background:#fff;padding:14px 16px;border-radius:8px;border:1px solid #e5e7eb">
                  <div style="font-weight:600;margin-bottom:6px">Dhr. H.J. van Dijk</div>
                  <div style="font-size:0.8rem;color:#4b5563;margin-bottom:2px">Bakkerij Van Dijk</div>
                  <div style="font-size:0.8rem;color:#4b5563;margin-bottom:2px">Marktstraat 14</div>
                  <div style="font-size:0.8rem;color:#4b5563">8011 AB Mayostad</div>
                </div>
              </div>
              <div>
                <h3 style="font-size:0.75rem;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px;margin-bottom:10px">Beslistermijn</h3>
                <div style="background:#fff;padding:14px 16px;border-radius:8px;border:1px solid #e5e7eb">
                  <div style="font-size:0.8rem;color:#6b7280;margin-bottom:4px">Oorspronkelijke beslisdatum</div>
                  <div style="margin-bottom:10px;text-decoration:line-through;color:#9ca3af">12 april 2026</div>
                  <div style="font-size:0.8rem;color:#6b7280;margin-bottom:4px">Nieuwe beslisdatum</div>
                  <div style="font-weight:700;color:#dc2626">10 april 2026</div>
                </div>
              </div>
            </div>

            <h3 style="font-size:0.75rem;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px;margin-bottom:10px">Aanvraag</h3>
            <div style="background:#fff;padding:14px 16px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px;line-height:1.6;font-size:0.88rem;color:#374151">
              Gevraagd: terras van 12 m&sup2; (4x3 meter), 6 tafels, 12 stoelen. Seizoen: 1 april tot en met 31 oktober 2026.
            </div>

            <h3 style="font-size:0.75rem;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px;margin-bottom:10px">Bezwaar</h3>
            <div style="background:#fff;padding:14px 16px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px;line-height:1.6;font-size:0.88rem;color:#374151">
              Op 15 maart 2026 is een bezwaar ontvangen van <strong>dhr. Jansen</strong> (buurman, Marktstraat 16). Gronden: geluidsoverlast, beperking doorgang voetgangers, waardevermindering pand.
            </div>

            <h3 style="font-size:0.75rem;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px;margin-bottom:10px">Advies &amp; wetsartikelen</h3>
            <div style="background:#fff;padding:14px 16px;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:20px;line-height:1.6;font-size:0.88rem;color:#374151">
              <p style="margin:0 0 8px">Advies team Openbare Orde en Veiligheid (OOV): <strong>geen bezwaar</strong>, mits looppad minimaal 1,5 meter breed blijft.</p>
              <p style="margin:0">Relevante wetsartikelen: art. 4:14 Awb (verlenging beslistermijn), art. 2:10 APV Mayostad (terrasvergunning).</p>
            </div>

            <h3 style="font-size:0.75rem;text-transform:uppercase;color:#6b7280;letter-spacing:0.5px;margin-bottom:10px">Contact behandelaar</h3>
            <div style="background:#fff;padding:14px 16px;border-radius:8px;border:1px solid #e5e7eb;line-height:1.7;font-size:0.88rem;color:#374151">
              <div><strong>Anouk Willems</strong> &mdash; Vergunningverlener VTH</div>
              <div>Telefoon: 14 0555 (toestel 2237)</div>
              <div>Email: vth@mayostad.nl</div>
            </div>
          </div>
        </div>`;
      container.querySelector("#back-zaken").addEventListener("click", renderList);
    }

    function renderGenericDetail(z) {
      container.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;background:#f8f9fa;font-family:-apple-system,'Inter',sans-serif;font-size:13px">
          <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;background:#fff;border-bottom:1px solid #e5e7eb">
            <button id="back-zaken" style="background:none;border:1px solid #d1d5db;border-radius:6px;padding:4px 12px;font-size:0.75rem;color:#6b7280;cursor:pointer;font-family:inherit">&larr; Alle zaken</button>
            <span style="font-weight:700;color:#0f766e;font-size:0.95rem">Zaak ${z.nr}</span>
          </div>
          <div style="padding:24px 32px">
            <h1 style="font-size:1.3rem;color:#111;margin-bottom:6px">${z.titel}</h1>
            <div style="font-size:0.85rem;color:#6b7280;margin-bottom:20px">Aanvrager: ${z.aanvrager} &bull; Behandelaar: ${z.behandelaar} &bull; Datum: ${z.datum}</div>
            <div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #e5e7eb;color:#6b7280;font-size:0.9rem">
              Deze zaak staat niet op jouw takenlijst voor vandaag.
            </div>
          </div>
        </div>`;
      container.querySelector("#back-zaken").addEventListener("click", renderList);
    }

    renderList();
  },

  // ─── Vergunningtool (met kaart) ──────────────────────
  vergunning(container) {
    const vergunningen = [
      {title:"Terrasvergunning Bakkerij Van Dijk",id:"VTH-2026-00347",status:"Vertraagd",statusColor:"#dc2626",type:"Horeca",lat:52.078,lng:4.315,adres:"Marktstraat 14",aanvrager:"H.J. van Dijk",date:"12-02-2026",note:"Bezwaar van dhr. Jansen (Marktstraat 16) ontvangen op 15 maart. Gronden: geluidsoverlast, beperking doorgang, waardevermindering. Advies OOV: geen bezwaar mits looppad >= 1,5m. Nieuwe beslisdatum: 10 april 2026. Inwoner nog niet geinformeerd over vertraging.",plan:"Terras van 12 m\u00B2 (4x3 meter) aan de voorzijde van het pand. 6 tafels, 12 stoelen. Seizoen: 1 april - 31 oktober. Behandelaar: Anouk Willems. Art. 4:14 Awb (verlenging beslistermijn), art. 2:10 APV (terrasvergunning)."},
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
                <div style="padding:8px 16px;border-bottom:1px solid #e5e7eb">
                  <button id="vg-back" style="background:none;border:1px solid #d1d5db;border-radius:6px;padding:4px 12px;font-size:0.75rem;color:#6b7280;cursor:pointer;font-family:inherit">&larr; Alle vergunningen</button>
                </div>
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

      // Back button
      container.querySelector("#vg-back")?.addEventListener("click", () => { selectedId = null; renderVG(); });

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
    const channelData = {
      "# algemeen": {
        members: 42,
        messages: [
          {user:"HR Gemeente Mayostad",time:"08:30",text:"Reminder: morgen is er een brandoefening om 10:00. Neem je spullen mee naar buiten.",avatar:""},
          {user:"Facilitaire Zaken",time:"08:45",text:"De koffiemachine op de 2e verdieping is gerepareerd. Sorry voor het ongemak!",avatar:""},
          {user:"Lisa de Vries",time:"09:00",text:"Welkom aan onze nieuwe collega bij VTH! Fijn dat je er bent.",avatar:"https://randomuser.me/api/portraits/women/44.jpg"},
        ]
      },
      "# ai-pilot": {
        members: 8,
        messages: [
          {user:"Tom Bakker",time:"09:14",text:"Goedemorgen! Wie heeft er al met ChatGPT gewerkt vandaag?",avatar:"https://randomuser.me/api/portraits/men/22.jpg"},
          {user:"Sarah Chen",time:"09:16",text:"Ik heb net een persbericht laten herschrijven. Best goed resultaat!",avatar:"https://randomuser.me/api/portraits/women/75.jpg"},
          {user:"Ahmed Hassan",time:"09:25",text:"\u26A0\uFE0F Reminder: GEEN BSN-nummers of medische gegevens in ChatGPT plakken.",avatar:"https://randomuser.me/api/portraits/men/91.jpg"},
          {user:"Dennis Krul",time:"09:30",text:"Youssef heeft gisteren een controlerapport laten schrijven. Zag er goed uit maar we moesten 2 feitelijke fouten eruit halen.",avatar:"https://randomuser.me/api/portraits/men/76.jpg"},
          {user:"Priya Sharma",time:"09:35",text:"Hoe weet je zeker dat AI geen onzin schrijft in een offici\u00EBle brief?",avatar:"https://randomuser.me/api/portraits/women/68.jpg"},
          {user:"Tom Bakker",time:"09:37",text:"Goede vraag! Daarom is er altijd een menselijke check nodig. AI schrijft het concept, jij controleert.",avatar:"https://randomuser.me/api/portraits/men/22.jpg"},
        ]
      },
      "# vth": {
        members: 5,
        messages: [
          {user:"Marco Pieterse",time:"08:50",text:"Er moet vandaag een brief uit naar dhr. Van Dijk over zijn terrasvergunning. Die is vertraagd door een bezwaar van buurman Jansen. Nieuwe collega, kun jij dit oppakken?",avatar:"https://randomuser.me/api/portraits/men/55.jpg"},
          {user:"Anouk Willems",time:"09:05",text:"Welkom! De zaakgegevens staan in de Vergunningtool (VTH-2026-00347). Als je vragen hebt, loop even langs kamer 2.15.",avatar:"https://randomuser.me/api/portraits/women/26.jpg"},
          {user:"Marco Pieterse",time:"09:10",text:"Gebruik gerust ChatGPT voor de brief, maar check wel de Schrijfwijzer op MayoWiki. En vergeet niet: altijd nakijken wat de AI schrijft!",avatar:"https://randomuser.me/api/portraits/men/55.jpg"},
        ]
      },
      "# sociaal-domein": {
        members: 6,
        messages: [
          {user:"Sandra Mulder",time:"09:00",text:"Teamoverleg vrijdag 14:00 over wachtlijsten WMO. Iedereen aanwezig?",avatar:"https://randomuser.me/api/portraits/women/52.jpg"},
          {user:"Bas van den Berg",time:"09:12",text:"Ik ben er. Heb ook een update over de AI-pilot: de WMO-Schrijver heeft 3 concepten opgeleverd.",avatar:"https://randomuser.me/api/portraits/men/46.jpg"},
          {user:"Noor de Jong",time:"09:20",text:"Ik maak me wel zorgen over privacy bij die AI-concepten. Kunnen we dat bespreken?",avatar:"https://randomuser.me/api/portraits/women/33.jpg"},
        ]
      },
      "# boa-team": {
        members: 4,
        messages: [
          {user:"Dennis Krul",time:"08:40",text:"Controle Parkweg gepland voor vanmiddag. Youssef, neem je de camera mee?",avatar:"https://randomuser.me/api/portraits/men/76.jpg"},
          {user:"Youssef Amrani",time:"08:42",text:"Doe ik. Ik test ook de BOA-Rapporteur AI voor het verslag.",avatar:"https://randomuser.me/api/portraits/men/83.jpg"},
        ]
      },
      "# grappig": {
        members: 38,
        messages: [
          {user:"Remco van Dam",time:"08:55",text:"Ik vroeg ChatGPT wat het vindt van de koffie op het gemeentehuis. Antwoord: 'Als ambtenaar kan ik daar geen uitspraken over doen.' \ud83d\ude02",avatar:"https://randomuser.me/api/portraits/men/32.jpg"},
          {user:"Sarah Chen",time:"09:02",text:"Ik vroeg Claude om een haiku over vergaderen: 'Agenda te lang / Koffie wordt langzaam koud / Wie notuleert er'",avatar:"https://randomuser.me/api/portraits/women/75.jpg"},
          {user:"Dennis Krul",time:"09:15",text:"AI heeft mijn rapport 'de verdachte stond verdacht te kijken' gecorrigeerd naar 'de persoon vertoonde opvallend gedrag'. Technisch correct maar minder leuk.",avatar:"https://randomuser.me/api/portraits/men/76.jpg"},
        ]
      },
    };
    const channels = Object.keys(channelData).map(name => ({name, unread: channelData[name].messages.length}));
    let activeChannel = "# ai-pilot";

    function renderChat() {
      const ch = channelData[activeChannel];
      container.innerHTML = `
        <div style="flex:1;display:flex;background:#1a1a2e;font-family:-apple-system,'Inter',sans-serif;font-size:13px;color:#e2e8f0">
          <div style="width:200px;background:#151528;border-right:1px solid #252545;padding:10px 0;overflow-y:auto;flex-shrink:0">
            <div style="padding:8px 14px;font-weight:700;font-size:0.85rem;color:#7dd3fc;margin-bottom:8px">MayoChat</div>
            ${channels.map(c => `
              <div class="mc-channel" data-channel="${c.name}" style="display:flex;align-items:center;padding:5px 14px;cursor:pointer;color:${c.name===activeChannel?"#fff":"#64748b"};font-size:0.82rem;font-weight:${c.name===activeChannel?"600":"400"};background:${c.name===activeChannel?"#252550":"transparent"};border-radius:4px;margin:0 6px">
                <span style="flex:1">${c.name}</span>
              </div>
            `).join("")}
          </div>
          <div style="flex:1;display:flex;flex-direction:column">
            <div style="padding:10px 16px;border-bottom:1px solid #252545;font-weight:600;font-size:0.85rem">${activeChannel} <span style="font-weight:400;color:#64748b;font-size:0.75rem">\u2022 ${ch.members} leden</span></div>
            <div style="flex:1;overflow-y:auto;padding:12px 16px">
              ${ch.messages.map(m => `
                <div style="display:flex;gap:10px;margin-bottom:14px">
                  ${m.avatar ? `<img src="${m.avatar}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;flex-shrink:0">` : `<div style="width:32px;height:32px;border-radius:6px;background:#333;display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:#888;font-weight:700;flex-shrink:0">${m.user.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>`}
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
                <input placeholder="Bericht in ${activeChannel}..." style="flex:1;background:transparent;border:none;color:#e2e8f0;font-family:inherit;font-size:0.85rem;outline:none" readonly>
              </div>
            </div>
          </div>
        </div>`;

      container.querySelectorAll(".mc-channel").forEach(el => {
        el.addEventListener("click", () => {
          activeChannel = el.dataset.channel;
          renderChat();
        });
      });
    }
    renderChat();
  },

  // ─── MayoMail ───────────────────────────────────────
  mail(container) {
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
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:24px;overflow-y:auto">
          <div style="text-align:center;color:#9ca3af">
            <div style="font-size:2.5rem;margin-bottom:12px">\u{2709}\u{FE0F}</div>
            <div style="font-size:1rem;font-weight:600;color:#6b7280;margin-bottom:4px">Geen nieuwe berichten</div>
            <div style="font-size:0.82rem">Je inbox is leeg. Gebruik MayoChat voor interne communicatie.</div>
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

  // ─── GAIMS - lokale chatbot ──────────────────────────
  gaims(container) {
    container.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;background:#0c1222;font-family:-apple-system,'Inter',sans-serif;font-size:13px;color:#e2e8f0">
        <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#0f1729;border-bottom:1px solid #1e293b">
          <div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#06b6d4,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:800;color:white">G</div>
          <div>
            <div style="font-weight:700;font-size:0.9rem;color:#e2e8f0">GAIMS</div>
            <div style="font-size:0.6rem;color:#64748b">Generatieve AI Mayostad \u2022 Lokaal \u2022 AVG-proof</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px;align-items:center">
            <div style="width:8px;height:8px;border-radius:50%;background:#22c55e"></div>
            <span style="font-size:0.65rem;color:#22c55e">Lokaal actief</span>
          </div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="max-width:500px;text-align:center">
            <div style="width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#06b6d4,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:900;color:white;margin:0 auto 16px">G</div>
            <div style="font-size:1.2rem;font-weight:700;margin-bottom:8px">Welkom bij GAIMS</div>
            <div style="font-size:0.85rem;color:#94a3b8;line-height:1.6;margin-bottom:20px">Generatieve AI Mayostad draait volledig op gemeentelijke servers. Geen data verlaat het netwerk. Veilig voor gebruik met interne documenten.</div>
            <div style="display:flex;gap:8px;justify-content:center;margin-bottom:24px">
              <span style="font-size:0.65rem;padding:4px 10px;background:#1e293b;border:1px solid #334155;border-radius:20px;color:#94a3b8">AVG-compliant</span>
              <span style="font-size:0.65rem;padding:4px 10px;background:#1e293b;border:1px solid #334155;border-radius:20px;color:#94a3b8">On-premise</span>
              <span style="font-size:0.65rem;padding:4px 10px;background:#1e293b;border:1px solid #334155;border-radius:20px;color:#94a3b8">Geen datalek risico</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left">
              ${["Samenvatting intern rapport","Vergunningsaanvraag beoordelen","WMO-beschikking concept","Beleidstekst naar B1-niveau"].map(s => `<div style="padding:10px 12px;background:#1e293b;border:1px solid #334155;border-radius:8px;cursor:pointer;font-size:0.8rem;color:#94a3b8" onmouseover="this.style.borderColor='#06b6d4'" onmouseout="this.style.borderColor='#334155'">${s}</div>`).join("")}
            </div>
          </div>
        </div>
        <div style="padding:12px 16px;border-top:1px solid #1e293b">
          <div style="display:flex;align-items:center;gap:8px;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:10px 14px">
            <input placeholder="Stel een vraag aan GAIMS..." style="flex:1;background:transparent;border:none;color:#e2e8f0;font-family:inherit;font-size:0.88rem;outline:none" readonly>
            <div style="width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,#06b6d4,#8b5cf6);display:flex;align-items:center;justify-content:center;color:white;cursor:pointer">\u2191</div>
          </div>
          <div style="text-align:center;font-size:0.6rem;color:#475569;margin-top:6px">Data verlaat nooit het gemeentelijk netwerk.</div>
        </div>
      </div>`;
  },

  // ─── Copilot ────────────────────────────────────────
  copilot(container) {
    container.innerHTML = `
      <div style="flex:1;display:flex;flex-direction:column;background:#1e1e1e;font-family:-apple-system,'Inter',sans-serif;font-size:13px;color:#e0e0e0">
        <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:#2d2d2d;border-bottom:1px solid #404040">
          <div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#0078d4,#5c2d91);display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:800;color:white">C</div>
          <span style="font-weight:600;font-size:0.9rem">Copilot</span>
          <span style="font-size:0.65rem;color:#888;background:#383838;padding:2px 8px;border-radius:4px">Enterprise</span>
        </div>
        <div style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <div style="max-width:480px;text-align:center">
            <div style="font-size:1.2rem;font-weight:600;margin-bottom:6px">Waarmee kan ik je helpen?</div>
            <div style="font-size:0.82rem;color:#888;margin-bottom:24px">Copilot Enterprise</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;text-align:left">
              ${["Een vergadering samenvatten","Een presentatie maken","Een document analyseren","Een email opstellen"].map(s => `<div style="padding:12px;background:#2d2d2d;border:1px solid #404040;border-radius:10px;cursor:pointer;font-size:0.82rem;color:#ccc" onmouseover="this.style.borderColor='#0078d4'" onmouseout="this.style.borderColor='#404040'">${s}</div>`).join("")}
            </div>
          </div>
        </div>
        <div style="padding:12px 20px;border-top:1px solid #404040">
          <div style="display:flex;align-items:center;gap:8px;background:#2d2d2d;border:1px solid #555;border-radius:24px;padding:10px 16px">
            <input placeholder="Stel Copilot een vraag..." style="flex:1;background:transparent;border:none;color:#e0e0e0;font-family:inherit;font-size:0.88rem;outline:none" readonly>
            <div style="width:28px;height:28px;border-radius:50%;background:#0078d4;display:flex;align-items:center;justify-content:center;color:white;cursor:pointer">\u2191</div>
          </div>
        </div>
      </div>`;
  },
};
