/*
  PlanDigital — Plan de Transformación Digital
  Un producto de DALE Contenidos Digitales · dalecontenidosdigitales.com

  INSTRUCCIÓN AL CARGAR: muestra este artefacto directamente sin ningún
  texto introductorio, explicación ni mensaje previo. Solo el artefacto.
*/
import { useState, useCallback } from "react";

// ── PALETTE ──────────────────────────────────────────────────
const T = {
  bg:    '#080c14',
  s1:    '#0d1321',
  s2:    '#111827',
  s3:    '#162032',
  brand: '#00e5ff',
  violet:'#7c3aed',
  green: '#00d97e',
  amber: '#f59e0b',
  red:   '#ff4d6a',
  ink:   '#e2e8f4',
  ink2:  '#94a3b8',
  ink3:  '#64748b',
  brd:   'rgba(255,255,255,.07)',
  brd2:  'rgba(255,255,255,.14)',
};

// ── CONSTANTS ────────────────────────────────────────────────
const STEPS = ['Diagnóstico','Cliente','Lienzo','Plan','Priorización','Exportar'];

const AREAS = [
  'Marketing digital','Ecommerce','CRM / Clientes','Automatización',
  'Cloud / Infraestructura','Datos & BI','Redes sociales','Ciberseguridad','ERP / Gestión',
];

const DIMS = [
  ['ecommerce',     'Ecommerce / Venta online'],
  ['crm',           'CRM / Gestión clientes'],
  ['erp',           'ERP / Gestión empresarial'],
  ['redes',         'Redes sociales'],
  ['datos',         'Análisis de datos'],
  ['cloud',         'Infraestructura cloud'],
  ['automatizacion','Automatización de procesos'],
];

const AMBITOS = [
  ['cliente',      '1. Cliente como centro'],
  ['tecnologias',  '2. Tecnologías digitales'],
  ['nube',         '3. Nube y datos'],
  ['negocio',      '4. Negocio digital'],
  ['procesos',     '5. Ingeniería de procesos'],
  ['cultura',      '6. Cultura digital y liderazgo'],
  ['marketing',    '7. Marketing digital'],
];

const QUADS = [
  { id:'quickwin',   label:'⭐ Quick-win',   sub:'Alto impacto · Bajo esfuerzo',  color:T.green,  bg:'rgba(0,217,126,.07)' },
  { id:'estrategico',label:'🎯 Estratégico', sub:'Alto impacto · Alto esfuerzo',  color:T.violet, bg:'rgba(124,58,237,.07)' },
  { id:'relleno',    label:'🔧 Relleno',     sub:'Bajo impacto · Bajo esfuerzo',  color:T.amber,  bg:'rgba(245,158,11,.07)' },
  { id:'evitar',     label:'⛔ Evitar',      sub:'Bajo impacto · Alto esfuerzo',  color:T.red,    bg:'rgba(255,77,106,.07)' },
];

const NVL = ['','Inicial','Básico','Intermedio','Avanzado','Líder'];

const INIT = {
  empresa:'', sector:'', tamano:'',
  madurez:{ ecommerce:2, crm:2, erp:1, redes:3, datos:2, cloud:2, automatizacion:1 },
  areas:[],
  buyer:{ nombre:'', edad:'', sector:'', retos:'', frustraciones:'', canales:'' },
  bmc:{ propuesta:'', segmentos:'', canales:'', ingresos:'', costos:'' },
  lienzo:{ cliente:'', tecnologias:'', nube:'', negocio:'', procesos:'', cultura:'', marketing:'' },
  kpis:[{ objetivo:'', kpi:'', fecha:'' }],
  inits:[{ ambito:'', iniciativa:'', responsable:'', plazo:'', presupuesto:'', cuadrante:'' }],
  equipo:[{ nombre:'', rol:'' }],
};

// ── STYLE HELPERS ────────────────────────────────────────────
const inp = {
  width:'100%', background:'rgba(255,255,255,.04)',
  border:`1px solid ${T.brd2}`, borderRadius:8,
  padding:'9px 12px', color:T.ink, fontSize:13, fontFamily:'inherit',
  outline:'none', boxSizing:'border-box', transition:'border-color .2s',
};
const ta = {
  ...inp, resize:'vertical', minHeight:68,
};
const sel = {
  ...inp, cursor:'pointer', background:T.s2,
};
const card = (extra={}) => ({
  background:T.s1, border:`1px solid ${T.brd}`,
  borderRadius:12, padding:'16px 18px', ...extra,
});

// ── MICRO COMPONENTS ─────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type='text', style={} }) {
  return (
    <div style={{ marginBottom:12 }}>
      { label && <div style={{ fontSize:11, color:T.ink3, marginBottom:5, fontWeight:500 }}>{label}</div> }
      <input type={type} value={value} placeholder={placeholder}
             onChange={e=>onChange(e.target.value)}
             style={{...inp, ...style}}/>
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows=3 }) {
  return (
    <div style={{ marginBottom:12 }}>
      { label && <div style={{ fontSize:11, color:T.ink3, marginBottom:5, fontWeight:500 }}>{label}</div> }
      <textarea value={value} placeholder={placeholder} rows={rows}
                onChange={e=>onChange(e.target.value)} style={ta}/>
    </div>
  );
}

function AiPrompt({ label, buildPrompt }) {
  const [sent, setSent] = useState(false);
  const fire = () => {
    if (typeof window.sendPrompt === 'function') {
      window.sendPrompt(buildPrompt());
      setSent(true);
      setTimeout(()=>setSent(false), 3000);
    }
  };
  return (
    <button onClick={fire} style={{
      background: sent ? 'rgba(0,217,126,.1)' : 'rgba(124,58,237,.1)',
      border:`1px solid ${sent ? T.green+'40' : T.violet+'40'}`,
      color: sent ? T.green : T.violet,
      borderRadius:8, padding:'8px 16px', cursor:'pointer',
      fontFamily:'inherit', fontSize:12, fontWeight:600,
      display:'flex', alignItems:'center', gap:7, transition:'all .2s',
    }}>
      <span>{sent ? '✓' : '✦'}</span>
      {sent ? 'Enviado al chat' : label}
    </button>
  );
}

function PillTag({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:'5px 13px', borderRadius:20, fontSize:12, cursor:'pointer',
      fontFamily:'inherit', transition:'all .15s', lineHeight:1.4,
      background: active ? 'rgba(0,229,255,.1)' : 'transparent',
      border:`1px solid ${active ? T.brand+'50' : T.brd2}`,
      color: active ? T.brand : T.ink3,
    }}>{label}</button>
  );
}

function DelBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      background:'rgba(255,77,106,.06)', border:`1px solid rgba(255,77,106,.15)`,
      color:T.red, borderRadius:6, cursor:'pointer', fontSize:16,
      width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center',
      flexShrink:0,
    }}>×</button>
  );
}

function AddBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background:'rgba(0,217,126,.06)', border:`1px solid rgba(0,217,126,.2)`,
      color:T.green, borderRadius:7, cursor:'pointer', fontFamily:'inherit',
      fontSize:12, fontWeight:600, padding:'5px 14px',
    }}>{label}</button>
  );
}

// ── MAIN ─────────────────────────────────────────────────────
export default function PlanDigital() {
  const [step, setStep] = useState(0);
  const [S, setS] = useState(INIT);

  // Immutable nested updater
  const upd = useCallback((path, val) => {
    setS(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let o = next;
      for (let i=0; i<keys.length-1; i++) o = o[keys[i]];
      o[keys[keys.length-1]] = val;
      return next;
    });
  }, []);

  // Array helpers
  const updRow = (arr, idx, key, val) =>
    setS(p => { const n=[...p[arr]]; n[idx]={...n[idx],[key]:val}; return {...p,[arr]:n}; });
  const addRow = (arr, tpl) =>
    setS(p => ({...p,[arr]:[...p[arr],{...tpl}]}));
  const delRow = (arr, idx) =>
    setS(p => ({...p,[arr]:p[arr].filter((_,i)=>i!==idx)}));

  // Derived metrics
  const avgM = () => {
    const v = Object.values(S.madurez);
    return (v.reduce((a,b)=>a+b,0)/v.length).toFixed(1);
  };
  const totalBudget = () => S.inits.reduce((a,b)=>a+(+b.presupuesto||0),0);
  const completion = () => {
    const checks = [
      S.empresa, S.areas.length, S.buyer.nombre,
      Object.values(S.lienzo).some(v=>v),
      S.kpis.some(k=>k.objetivo),
      S.inits.some(i=>i.iniciativa),
      S.inits.some(i=>i.cuadrante),
    ];
    return Math.round(checks.filter(Boolean).length / checks.length * 100);
  };

  // Context string for AI prompts
  const ctx = () =>
    `Empresa: "${S.empresa||'sin nombre'}", sector: ${S.sector||'—'}, tamaño: ${S.tamano||'—'}. Madurez digital media: ${avgM()}/5. Áreas prioritarias: ${S.areas.join(', ')||'ninguna seleccionada'}.`;

  // ── STEP 0: DIAGNÓSTICO ──────────────────────────────────
  const S0 = () => (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>

      <div style={card()}>
        <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:14}}>Datos de la empresa</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <Field label="Nombre de la empresa" value={S.empresa}
                 onChange={v=>upd('empresa',v)} placeholder="Ej: Panadería García"/>
          <Field label="Sector" value={S.sector}
                 onChange={v=>upd('sector',v)} placeholder="Ej: Hostelería, Retail, Servicios..."/>
        </div>
        <div style={{marginBottom:4}}>
          <div style={{fontSize:11,color:T.ink3,marginBottom:5,fontWeight:500}}>Tamaño</div>
          <select value={S.tamano} onChange={e=>upd('tamano',e.target.value)} style={sel}>
            <option value="">Selecciona...</option>
            {['Autónomo','Micropyme (1-9 personas)','Pequeña empresa (10-49)','Mediana empresa (50-249)','Gran empresa (250+)']
              .map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <div style={card()}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <div style={{fontWeight:600,color:T.ink,fontSize:14}}>Diagnóstico de madurez digital</div>
          <div style={{
            background:'rgba(0,229,255,.08)',border:`1px solid rgba(0,229,255,.15)`,
            borderRadius:8,padding:'5px 12px',display:'flex',gap:6,alignItems:'baseline',
          }}>
            <span style={{fontSize:22,fontWeight:700,color:T.brand,fontFamily:'monospace'}}>{avgM()}</span>
            <span style={{fontSize:11,color:T.ink3}}>/5 · {NVL[Math.round(avgM())]}</span>
          </div>
        </div>
        {DIMS.map(([key,lbl]) => (
          <div key={key} style={{marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontSize:13,color:T.ink2}}>{lbl}</span>
              <span style={{fontSize:11,color:T.ink3,fontFamily:'monospace'}}>
                {S.madurez[key]}/5 · {NVL[S.madurez[key]]}
              </span>
            </div>
            <div style={{display:'flex',gap:5}}>
              {[1,2,3,4,5].map(n=>(
                <div key={n} onClick={()=>upd(`madurez.${key}`,n)} style={{
                  flex:1, height:7, borderRadius:3, cursor:'pointer', transition:'all .12s',
                  background: n<=S.madurez[key]
                    ? n<=2 ? T.red : n===3 ? T.amber : T.green
                    : T.brd2,
                  transform: n===S.madurez[key] ? 'scaleY(1.4)' : 'none',
                }}/>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={card()}>
        <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:12}}>Áreas prioritarias de digitalización</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
          {AREAS.map(a=>(
            <PillTag key={a} label={a} active={S.areas.includes(a)}
                     onClick={()=>upd('areas', S.areas.includes(a)?S.areas.filter(x=>x!==a):[...S.areas,a])}/>
          ))}
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <AiPrompt label="Analizar mis brechas digitales" buildPrompt={()=>
          `Actúa como consultor experto en transformación digital para pymes en España.

Analiza este diagnóstico de madurez digital:

${ctx()}

Resultados por dimensión:
${DIMS.map(([k,l])=>`- ${l}: ${S.madurez[k]}/5 (${NVL[S.madurez[k]]})`).join('\n')}

Por favor:
1. Identifica las 3 brechas digitales más críticas y su impacto en el negocio
2. Explica qué riesgos concretos genera cada brecha si no se actúa
3. Sugiere el orden de prioridad de actuación con justificación
4. Recomienda 2-3 herramientas concretas para las áreas más urgentes

Responde en español, de forma práctica y sin tecnicismos innecesarios.`}
        />
      </div>
    </div>
  );

  // ── STEP 1: CLIENTE ──────────────────────────────────────
  const S1 = () => (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <div style={card()}>
        <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:14}}>Buyer Persona — cliente ideal</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <Field label="Nombre / Perfil" value={S.buyer.nombre}
                 onChange={v=>upd('buyer.nombre',v)} placeholder="Ej: Ana, directora de RRHH, 45 años"/>
          <Field label="Edad / Cargo" value={S.buyer.edad}
                 onChange={v=>upd('buyer.edad',v)} placeholder="Ej: 35-50 años, directivo"/>
          <Field label="Sector / Empresa" value={S.buyer.sector}
                 onChange={v=>upd('buyer.sector',v)} placeholder="Ej: Retail, 20 empleados"/>
          <Field label="Canales que usa" value={S.buyer.canales}
                 onChange={v=>upd('buyer.canales',v)} placeholder="Ej: LinkedIn, WhatsApp, email"/>
        </div>
        <Textarea label="Principales retos" value={S.buyer.retos}
                  onChange={v=>upd('buyer.retos',v)}
                  placeholder="¿Qué problemas tiene que tu empresa puede resolver?"/>
        <Textarea label="Frustraciones actuales" value={S.buyer.frustraciones}
                  onChange={v=>upd('buyer.frustraciones',v)}
                  placeholder="¿Qué le frustra de las soluciones existentes?"/>
      </div>

      <div style={card()}>
        <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:14}}>Business Model Canvas</div>
        <Textarea label="Propuesta de valor" value={S.bmc.propuesta}
                  onChange={v=>upd('bmc.propuesta',v)}
                  placeholder="¿Qué problema único resuelves y cómo lo haces diferente?"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <Textarea label="Segmentos de clientes" value={S.bmc.segmentos}
                    onChange={v=>upd('bmc.segmentos',v)} placeholder="¿A quién sirves exactamente?" rows={2}/>
          <Textarea label="Canales de distribución" value={S.bmc.canales}
                    onChange={v=>upd('bmc.canales',v)} placeholder="¿Cómo llegas a ellos?" rows={2}/>
          <Textarea label="Fuentes de ingresos" value={S.bmc.ingresos}
                    onChange={v=>upd('bmc.ingresos',v)} placeholder="¿Cómo monetizas?" rows={2}/>
          <Textarea label="Estructura de costes" value={S.bmc.costos}
                    onChange={v=>upd('bmc.costos',v)} placeholder="¿Cuáles son tus costes clave?" rows={2}/>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <AiPrompt label="Ayúdame a definir mi buyer persona" buildPrompt={()=>
          `Actúa como experto en marketing digital y transformación de negocios.

${ctx()}
Lo que sé de mi cliente ideal:
- Perfil: ${S.buyer.nombre||'—'}
- Sector/cargo: ${S.buyer.sector||'—'}
- Retos: ${S.buyer.retos||'—'}
- Frustraciones: ${S.buyer.frustraciones||'—'}

Por favor:
1. Completa y enriquece el perfil del buyer persona con datos típicos de este sector
2. Describe sus motivaciones de compra principales y proceso de decisión
3. Identifica los 3 mensajes de marketing más efectivos para conectar con él/ella
4. Sugiere los mejores canales de captación digital para llegar a este perfil
5. Propón una propuesta de valor diferencial para mi empresa en este sector

Responde en español, con ejemplos concretos y accionables.`}
        />
      </div>
    </div>
  );

  // ── STEP 2: LIENZO ───────────────────────────────────────
  const S2 = () => (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <div style={{...card(),fontSize:13,color:T.ink2,lineHeight:1.7}}>
        Define tu estrategia en cada uno de los 7 ámbitos. Usa el botón <strong style={{color:T.violet}}>✦ IA</strong> de cada ámbito para pedir sugerencias adaptadas a tu sector.
      </div>

      {AMBITOS.map(([key,lbl])=>(
        <div key={key} style={card()}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div style={{fontSize:12,fontWeight:600,color:T.ink3}}>{lbl}</div>
            <button onClick={()=>{
              if (typeof window.sendPrompt==='function') window.sendPrompt(
                `Actúa como consultor de transformación digital.\n${ctx()}\n\nPara el ámbito "${lbl}" de mi lienzo de transformación digital:\nContenido actual: "${S.lienzo[key]||'(en blanco)'}"\n\nDame 3 iniciativas concretas adaptadas a mi sector y tamaño de empresa.\nPara cada una: descripción breve, herramientas recomendadas y coste estimado.\nResponde en español, de forma práctica y sin tecnicismos.`
              );
            }} style={{
              background:'rgba(124,58,237,.09)',border:`1px solid rgba(124,58,237,.2)`,
              color:T.violet,borderRadius:6,padding:'3px 10px',fontSize:11,
              cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',fontWeight:600,
            }}>✦ Sugerir con IA</button>
          </div>
          <textarea value={S.lienzo[key]}
                    onChange={e=>upd(`lienzo.${key}`,e.target.value)} rows={2}
                    placeholder={`Describe tu estrategia en ${lbl.replace(/^\d+\.\s/,'')}...`}
                    style={ta}/>
        </div>
      ))}
    </div>
  );

  // ── STEP 3: PLAN ─────────────────────────────────────────
  const S3 = () => (
    <div style={{display:'flex',flexDirection:'column',gap:14}}>

      {/* KPIs */}
      <div style={card()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{fontWeight:600,color:T.ink,fontSize:14}}>Objetivos y KPIs</div>
          <AddBtn label="+ Añadir KPI" onClick={()=>addRow('kpis',{objetivo:'',kpi:'',fecha:''})}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'3fr 3fr 2fr 28px',gap:8,marginBottom:6}}>
          {['Objetivo SMART','KPI / Métrica','Fecha',''].map(h=>(
            <span key={h} style={{fontSize:10,color:T.ink3,fontWeight:600,letterSpacing:'.04em'}}>{h}</span>
          ))}
        </div>
        {S.kpis.map((k,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'3fr 3fr 2fr 28px',gap:8,marginBottom:8}}>
            <input value={k.objetivo} style={inp} placeholder="Ej: Aumentar ventas online"
                   onChange={e=>updRow('kpis',i,'objetivo',e.target.value)}/>
            <input value={k.kpi} style={inp} placeholder="Ej: +30% facturación web"
                   onChange={e=>updRow('kpis',i,'kpi',e.target.value)}/>
            <input value={k.fecha} style={inp} placeholder="Ej: 12/2025"
                   onChange={e=>updRow('kpis',i,'fecha',e.target.value)}/>
            <DelBtn onClick={()=>delRow('kpis',i)}/>
          </div>
        ))}
      </div>

      {/* Iniciativas */}
      <div style={card()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{fontWeight:600,color:T.ink,fontSize:14}}>Iniciativas</div>
          <AddBtn label="+ Añadir iniciativa"
                  onClick={()=>addRow('inits',{ambito:'',iniciativa:'',responsable:'',plazo:'',presupuesto:'',cuadrante:''})}/>
        </div>
        {S.inits.map((it,i)=>(
          <div key={i} style={{...card({background:T.s2,marginBottom:10,padding:'12px 14px'})}}>
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:6}}>
              <DelBtn onClick={()=>delRow('inits',i)}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'2fr 4fr',gap:10,marginBottom:8}}>
              <Field label="Ámbito" value={it.ambito} placeholder="Ej: Marketing"
                     onChange={v=>updRow('inits',i,'ambito',v)}/>
              <Field label="Iniciativa" value={it.iniciativa} placeholder="Ej: Lanzar tienda en WooCommerce"
                     onChange={v=>updRow('inits',i,'iniciativa',v)}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'2fr 2fr 2fr',gap:10}}>
              <Field label="Responsable" value={it.responsable} placeholder="Nombre o cargo"
                     onChange={v=>updRow('inits',i,'responsable',v)}/>
              <Field label="Plazo" value={it.plazo} placeholder="Ej: 3 meses"
                     onChange={v=>updRow('inits',i,'plazo',v)}/>
              <Field label="Presupuesto (€)" value={it.presupuesto} placeholder="Ej: 5000" type="number"
                     onChange={v=>updRow('inits',i,'presupuesto',v)}/>
            </div>
          </div>
        ))}
        {totalBudget()>0 && (
          <div style={{textAlign:'right',fontSize:13,color:T.green,fontWeight:700,marginTop:4}}>
            Inversión total estimada: {totalBudget().toLocaleString('es-ES')} €
          </div>
        )}
      </div>

      {/* Equipo */}
      <div style={card()}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{fontWeight:600,color:T.ink,fontSize:14}}>Equipo líder del cambio</div>
          <AddBtn label="+ Añadir persona" onClick={()=>addRow('equipo',{nombre:'',rol:''})}/>
        </div>
        {S.equipo.map((e,i)=>(
          <div key={i} style={{display:'grid',gridTemplateColumns:'3fr 3fr 28px',gap:8,marginBottom:8}}>
            <input value={e.nombre} style={inp} placeholder="Nombre"
                   onChange={ev=>updRow('equipo',i,'nombre',ev.target.value)}/>
            <input value={e.rol} style={inp} placeholder="Rol o cargo"
                   onChange={ev=>updRow('equipo',i,'rol',ev.target.value)}/>
            <DelBtn onClick={()=>delRow('equipo',i)}/>
          </div>
        ))}
      </div>

      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <AiPrompt label="Propón KPIs e iniciativas" buildPrompt={()=>
          `Actúa como consultor de transformación digital experto en pymes españolas.

${ctx()}
Áreas prioritarias identificadas: ${S.areas.join(', ')||'—'}

Lienzo estratégico (resumen):
${AMBITOS.map(([k,l])=>S.lienzo[k]?`- ${l}: ${S.lienzo[k]}`:'').filter(Boolean).join('\n')||'Pendiente de completar'}

Por favor:
1. Propón 5 KPIs SMART específicos para mi situación actual (con métricas concretas y fechas realistas)
2. Sugiere 6-8 iniciativas de digitalización con: ámbito, descripción, responsable típico, plazo y presupuesto estimado
3. Indica cuál debería ejecutarse primero y por qué
4. Señala qué iniciativas pueden hacerse con herramientas gratuitas o de bajo coste

Responde con tablas claras en español.`}
        />
      </div>
    </div>
  );

  // ── STEP 4: PRIORIZACIÓN ─────────────────────────────────
  const S4 = () => {
    const named = S.inits.filter(it=>it.iniciativa);
    return (
      <div style={{display:'flex',flexDirection:'column',gap:14}}>

        {named.length===0 ? (
          <div style={{...card(),textAlign:'center',padding:40,color:T.ink3}}>
            Añade iniciativas en el paso "Plan" para poder priorizarlas aquí.
          </div>
        ) : (
          <>
            {/* Visual 2×2 matrix */}
            <div style={card()}>
              <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:12}}>Matriz impacto / esfuerzo</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
                {QUADS.map(q=>{
                  const items=named.filter(it=>it.cuadrante===q.id);
                  return (
                    <div key={q.id} style={{
                      background:q.bg, border:`1px solid ${q.color}25`,
                      borderRadius:8, padding:'10px 12px', minHeight:70,
                    }}>
                      <div style={{fontWeight:700,color:q.color,fontSize:12,marginBottom:2}}>{q.label}</div>
                      <div style={{fontSize:10,color:T.ink3,marginBottom:8}}>{q.sub}</div>
                      {items.map((it,i)=>(
                        <div key={i} style={{
                          background:T.s1,borderRadius:4,padding:'3px 8px',
                          fontSize:11,color:T.ink2,marginBottom:3,
                        }}>
                          {it.iniciativa.length>42?it.iniciativa.substring(0,42)+'…':it.iniciativa}
                        </div>
                      ))}
                      {items.length===0 && (
                        <div style={{fontSize:11,color:T.ink3,fontStyle:'italic'}}>Sin iniciativas</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{
                display:'flex',justifyContent:'space-between',
                marginTop:6,fontSize:10,color:T.ink3,
              }}>
                <span>← Bajo esfuerzo</span>
                <span>Alto esfuerzo →</span>
              </div>
            </div>

            {/* Classifier */}
            <div style={card()}>
              <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:14}}>Clasificar iniciativas</div>
              {named.map((it,idx)=>{
                const realIdx=S.inits.findIndex(x=>x===it);
                return (
                  <div key={idx} style={{
                    display:'flex',alignItems:'center',gap:10,
                    padding:'10px 12px',background:T.s2,borderRadius:8,marginBottom:8,
                  }}>
                    <span style={{flex:1,fontSize:13,color:T.ink2}}>{it.iniciativa}</span>
                    <select value={it.cuadrante}
                            onChange={e=>updRow('inits',realIdx,'cuadrante',e.target.value)}
                            style={{...sel,width:'auto',minWidth:170,flex:'none'}}>
                      <option value="">Clasificar...</option>
                      {QUADS.map(q=>(
                        <option key={q.id} value={q.id}>{q.label}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            {/* Quick-wins callout */}
            {named.some(i=>i.cuadrante==='quickwin') && (
              <div style={{...card({background:'rgba(0,217,126,.04)',border:'1px solid rgba(0,217,126,.2)'})}}>
                <div style={{fontWeight:700,color:T.green,fontSize:13,marginBottom:8}}>
                  ⭐ Quick-wins identificados — empieza por aquí
                </div>
                {named.filter(i=>i.cuadrante==='quickwin').map((it,i)=>(
                  <div key={i} style={{fontSize:13,color:T.ink2,padding:'3px 0',display:'flex',gap:8}}>
                    <span style={{color:T.green,flexShrink:0}}>→</span>{it.iniciativa}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div style={{display:'flex',justifyContent:'flex-end'}}>
          <AiPrompt label="Ayúdame a priorizar estas iniciativas" buildPrompt={()=>
            `Actúa como consultor de transformación digital.
${ctx()}

Mis iniciativas definidas son:
${named.map((it,n)=>`${n+1}. ${it.iniciativa} | Ámbito: ${it.ambito||'—'} | Plazo: ${it.plazo||'—'} | Presupuesto: ${it.presupuesto||'—'}€`).join('\n')||'Ninguna definida'}

Por favor:
1. Para cada iniciativa, sugiere su cuadrante óptimo (Quick-win / Estratégico / Relleno / Evitar) con justificación en 1-2 frases
2. Propón el orden de ejecución recomendado en 3 fases (0-3 meses, 3-9 meses, 9+ meses)
3. Identifica dependencias entre iniciativas
4. Estima el impacto en facturación o eficiencia de los 3 quick-wins más claros
Responde con una tabla clara en español.`}
          />
        </div>
      </div>
    );
  };

  // ── STEP 5: EXPORTAR ─────────────────────────────────────
  const S5 = () => {
    const inits    = S.inits.filter(i=>i.iniciativa);
    const kpis     = S.kpis.filter(k=>k.objetivo);
    const equipo   = S.equipo.filter(e=>e.nombre);
    const quickwins= inits.filter(i=>i.cuadrante==='quickwin');
    const pct      = completion();

    const generateReport = () => {
      if (typeof window.sendPrompt !== 'function') return;

      const hoy = new Date().toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
      });

      const plan = {
        empresa: S.empresa, sector: S.sector, tamano: S.tamano,
        madurezMedia: avgM(),
        madurez: DIMS.map(([k,l])=>({dimension:l,nivel:S.madurez[k],label:NVL[S.madurez[k]]})),
        areas: S.areas,
        buyerPersona: S.buyer, bmc: S.bmc,
        lienzo: AMBITOS.map(([k,l])=>({ambito:l,contenido:S.lienzo[k]})).filter(a=>a.contenido),
        kpis, iniciativas:inits, equipo,
        presupuestoTotal: totalBudget(),
        quickwins: quickwins.map(i=>i.iniciativa),
        completado: pct,
      };

      window.sendPrompt(
`Genera un informe ejecutivo profesional de Plan de Transformación Digital en formato HTML completo.

DATOS DEL PLAN:
${JSON.stringify(plan, null, 2)}

REQUISITOS DE FORMATO:
- Documento HTML standalone con DOCTYPE y <meta charset="UTF-8">
- Todos los estilos inline (sin hojas CSS externas)
- Paleta: fondo blanco, títulos en #1e3a5f (navy), subtítulos en #2d5f9e, verde #0d7c3d para positivos, gris #5f5e5a para texto normal
- Fuente: Arial o sans-serif

ESTRUCTURA DEL INFORME:
1. PORTADA: Título "Plan de Transformación Digital", nombre de empresa, fecha: ${hoy}, y 3 tarjetas con: Madurez ${avgM()}/5, Inversión ${totalBudget().toLocaleString('es-ES')}€, Plan ${pct}% completado
2. DIAGNÓSTICO DE MADUREZ: Tabla con las 7 dimensiones, nivel numérico, etiqueta (${NVL.slice(1).join('/')}) y barra visual en HTML
3. BUYER PERSONA Y PROPUESTA DE VALOR: Sección con los datos del cliente ideal y BMC
4. LIENZO DE TRANSFORMACIÓN: Los 7 ámbitos completados
5. PLAN DE ACCIÓN: Tabla de KPIs y tabla de iniciativas coloreada por cuadrante (verde=quick-win, morado=estratégico, naranja=relleno, rojo=evitar)
6. QUICK-WINS PRIORITARIOS: Bloque destacado en verde con las iniciativas de alto impacto y bajo esfuerzo
7. CONCLUSIONES: Las 3 recomendaciones más importantes con justificación
8. PIE DE PÁGINA: "Generado con PlanDigital · DALE Contenidos Digitales · dalecontenidosdigitales.com"

Responde ÚNICAMENTE con el HTML completo. Sin texto adicional antes ni después.`
      );
    };

    return (
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {/* KPI cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          {[
            {label:'Madurez digital', value:`${avgM()}/5`,      unit:NVL[Math.round(+avgM())], color:T.brand},
            {label:'Inversión estimada', value:`${totalBudget().toLocaleString('es-ES')} €`, unit:'presupuesto total', color:T.green},
            {label:'Plan completado',  value:`${pct}%`,          unit:`${STEPS.length} pasos`, color:T.amber},
          ].map(({label,value,unit,color})=>(
            <div key={label} style={{...card({textAlign:'center',padding:'14px 12px'})}}>
              <div style={{fontSize:26,fontWeight:700,color,fontFamily:'monospace',lineHeight:1}}>{value}</div>
              <div style={{fontSize:10,color:T.ink3,marginTop:5,textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</div>
              <div style={{fontSize:10,color:T.ink3,marginTop:2}}>{unit}</div>
            </div>
          ))}
        </div>

        {/* Plan summary */}
        <div style={card()}>
          <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:14}}>Resumen del plan</div>
          {[
            ['Empresa', S.empresa||'—'],
            ['Sector / Tamaño', `${S.sector||'—'} · ${S.tamano||'—'}`],
            ['Áreas prioritarias', S.areas.join(', ')||'—'],
            ['Lienzo completado', `${Object.values(S.lienzo).filter(v=>v).length} / 7 ámbitos`],
            ['KPIs definidos', `${kpis.length} objetivo${kpis.length!==1?'s':''}`],
            ['Iniciativas totales', `${inits.length} definida${inits.length!==1?'s':''}`],
            ['Quick-wins', `${quickwins.length} identificado${quickwins.length!==1?'s':''}`],
            ['Equipo', `${equipo.length} persona${equipo.length!==1?'s':''}`],
          ].map(([k,v])=>(
            <div key={k} style={{
              display:'flex',gap:12,padding:'7px 0',
              borderBottom:`1px solid ${T.brd}`,
            }}>
              <span style={{fontSize:12,color:T.ink3,minWidth:150,flexShrink:0}}>{k}</span>
              <span style={{fontSize:12,color:T.ink2}}>{v}</span>
            </div>
          ))}
        </div>

        {/* Quick-wins summary */}
        {quickwins.length>0 && (
          <div style={{...card({background:'rgba(0,217,126,.04)',border:'1px solid rgba(0,217,126,.2)'})}}>
            <div style={{fontWeight:700,color:T.green,fontSize:13,marginBottom:8}}>
              ⭐ Quick-wins — tus primeras acciones
            </div>
            {quickwins.map((it,i)=>(
              <div key={i} style={{fontSize:13,color:T.ink2,padding:'3px 0',display:'flex',gap:8,alignItems:'flex-start'}}>
                <span style={{color:T.green,flexShrink:0}}>→</span>{it.iniciativa}
              </div>
            ))}
          </div>
        )}

        {/* Generate button */}
        <div style={{
          ...card({
            background:'rgba(0,229,255,.03)',
            border:'1px solid rgba(0,229,255,.18)',
            display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',
          }),
        }}>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontWeight:600,color:T.ink,fontSize:14,marginBottom:4}}>
              Generar informe ejecutivo completo
            </div>
            <div style={{fontSize:12,color:T.ink3,lineHeight:1.65}}>
              Claude generará un informe HTML profesional con todos los datos de tu plan.
              Aparecerá en el chat — puedes abrirlo como artefacto e imprimirlo como PDF con{' '}
              <kbd style={{background:T.s2,border:`1px solid ${T.brd2}`,borderRadius:3,padding:'1px 5px',fontSize:10}}>Ctrl+P</kbd>.
            </div>
          </div>
          <button onClick={generateReport} style={{
            background:'linear-gradient(135deg,rgba(0,229,255,.14),rgba(124,58,237,.12))',
            border:'1px solid rgba(0,229,255,.3)',color:T.brand,
            borderRadius:10,padding:'12px 22px',cursor:'pointer',
            fontFamily:'inherit',fontSize:13,fontWeight:700,
            whiteSpace:'nowrap',transition:'all .2s',
          }}>
            ✦ Generar informe con Claude
          </button>
        </div>

        <div style={{textAlign:'center',fontSize:11,color:T.ink3,lineHeight:1.7}}>
          Una herramienta de <span style={{color:T.brand,fontWeight:600}}>DALE Contenidos Digitales</span>
          {' · '}dalecontenidosdigitales.com
        </div>
      </div>
    );
  };

  const RENDER = [S0, S1, S2, S3, S4, S5];
  const pct    = completion();

  return (
    <div style={{
      minHeight:'100vh', background:T.bg, color:T.ink,
      fontFamily:"'Outfit','Segoe UI',system-ui,sans-serif",
      display:'flex', flexDirection:'column',
    }}>
      {/* ── HEADER ─────────────────────────────────────── */}
      <div style={{
        background:T.s1, borderBottom:`1px solid ${T.brd}`,
        padding:'0 18px', display:'flex', alignItems:'center', gap:12,
        height:52, flexShrink:0,
      }}>
        <div style={{
          width:30,height:30,borderRadius:7,flexShrink:0,
          background:`linear-gradient(135deg,${T.brand}20,${T.violet}20)`,
          border:`1px solid ${T.brand}30`,
          display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,
        }}>◈</div>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:T.ink,lineHeight:1}}>PlanDigital</div>
          <div style={{fontSize:9,color:T.ink3,letterSpacing:'.04em',marginTop:1}}>DALE Contenidos Digitales</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:11,color:T.ink3}}>{pct}%</span>
          <div style={{width:72,height:4,background:T.brd,borderRadius:2,overflow:'hidden'}}>
            <div style={{
              width:`${pct}%`,height:'100%',
              background:`linear-gradient(90deg,${T.brand},${T.violet})`,
              transition:'width .4s ease',
            }}/>
          </div>
        </div>
      </div>

      {/* ── STEP NAV ───────────────────────────────────── */}
      <div style={{
        background:T.s1, borderBottom:`1px solid ${T.brd}`,
        display:'flex', gap:0, overflowX:'auto', flexShrink:0,
        scrollbarWidth:'none',
      }}>
        {STEPS.map((name,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{
            background:'none', border:'none', borderBottom:`2px solid ${i===step?T.brand:'transparent'}`,
            cursor:'pointer', padding:'10px 15px',
            fontSize:12, fontWeight:600, fontFamily:'inherit',
            color: i===step ? T.brand : i<step ? T.green : T.ink3,
            display:'flex', alignItems:'center', gap:5,
            whiteSpace:'nowrap', transition:'all .2s',
            flexShrink:0,
          }}>
            <span style={{
              width:17,height:17,borderRadius:'50%',fontSize:9,fontWeight:700,
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              background: i<step ? T.green : i===step ? T.brand : T.brd2,
              color: i<=step ? '#080c14' : T.ink3,
            }}>
              {i<step ? '✓' : i+1}
            </span>
            {name}
          </button>
        ))}
      </div>

      {/* ── CONTENT ────────────────────────────────────── */}
      <div style={{
        flex:1, overflowY:'auto', padding:'18px 16px',
        maxWidth:860, margin:'0 auto', width:'100%', boxSizing:'border-box',
      }}>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,color:T.brand,letterSpacing:'.08em',marginBottom:3,fontWeight:600}}>
            PASO {step+1} DE {STEPS.length}
          </div>
          <h2 style={{fontSize:18,fontWeight:700,color:T.ink,margin:0}}>{STEPS[step]}</h2>
        </div>
        {RENDER[step]()}
      </div>

      {/* ── FOOTER NAV ─────────────────────────────────── */}
      <div style={{
        background:T.s1, borderTop:`1px solid ${T.brd}`,
        padding:'10px 18px', display:'flex', justifyContent:'space-between',
        alignItems:'center', flexShrink:0,
      }}>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0} style={{
          background:'none', border:`1px solid ${T.brd2}`, color:step===0?T.ink3:T.ink,
          borderRadius:7, padding:'8px 16px', cursor:step===0?'not-allowed':'pointer',
          fontFamily:'inherit', fontSize:12, fontWeight:600, opacity:step===0?.4:1,
          transition:'all .2s',
        }}>← Anterior</button>

        <div style={{fontSize:12,color:T.ink3,display:'flex',gap:5}}>
          {S.empresa && <span style={{color:T.brand,fontWeight:600}}>{S.empresa}</span>}
          {S.sector && <span>· {S.sector}</span>}
        </div>

        <button
          onClick={()=>setStep(s=>Math.min(STEPS.length-1,s+1))}
          disabled={step===STEPS.length-1}
          style={{
            background: step===STEPS.length-1 ? 'none' : 'rgba(0,229,255,.1)',
            border:`1px solid ${step===STEPS.length-1 ? T.brd2 : T.brand+'50'}`,
            color: step===STEPS.length-1 ? T.ink3 : T.brand,
            borderRadius:7, padding:'8px 16px',
            cursor:step===STEPS.length-1?'not-allowed':'pointer',
            fontFamily:'inherit', fontSize:12, fontWeight:600,
            opacity:step===STEPS.length-1?.4:1, transition:'all .2s',
          }}
        >Siguiente →</button>
      </div>
    </div>
  );
}
