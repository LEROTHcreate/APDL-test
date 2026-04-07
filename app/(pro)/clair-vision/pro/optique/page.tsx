"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";

/* ── LocalStorage ─────────────────────────────────────────────────────────── */
function safeLoad<T>(key: string, fb: T[] = []): T[] {
  if (typeof window === "undefined") return fb;
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; }
  catch { return fb; }
}

/* ── Date utils ──────────────────────────────────────────────────────────── */
function daysSince(iso: string)  { return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000); }
function isToday(d: string)      { return new Date(d).toDateString() === new Date().toDateString(); }
function isThisMonth(d: string)  { const dt=new Date(d),n=new Date(); return dt.getFullYear()===n.getFullYear()&&dt.getMonth()===n.getMonth(); }
function fmtDate(iso: string)    { return new Date(iso).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}); }

/* ── Sparkline ───────────────────────────────────────────────────────────── */
function mkSpark(data: number[], w=110, h=34) {
  const max=Math.max(...data), min=Math.min(...data), r=max-min||1;
  const pts=data.map((v,i)=>`${((i/(data.length-1))*w).toFixed(1)},${(h-((v-min)/r)*(h-6)-3).toFixed(1)}`);
  const line=`M ${pts.join(" L ")}`;
  return { line, fill:`${line} L ${w},${h} L 0,${h} Z` };
}

/* ── Interfaces ──────────────────────────────────────────────────────────── */
type DType = "montures-verres"|"lentilles"|"basse-vision"|"autre";
interface Dossier { id:string; patientNom?:string; patientPrenom?:string; status?:string; type?:DType; dateLivraison?:string; }
interface Rdv     { id:string; date?:string; heure?:string; patientNom?:string; patientPrenom?:string; titre?:string; type?:string; statut?:string; }
interface Patient { id:string; nom?:string; prenom?:string; createdAt?:string; }
interface Facture { id:string; montantTTC?:number; montant?:number; date?:string; createdAt?:string; }

/* ── Constants ───────────────────────────────────────────────────────────── */
const THRESH: Record<DType,number> = {"montures-verres":730,"lentilles":365,"basse-vision":730,"autre":730};
const SOON_OFFSET=60, INACTIVE=365;
const RDV_COL: Record<string,string> = {bilan:"#2D8CFF",adaptation:"#8B5CF6",livraison:"#f59e0b","contrôle":"#10b981",suivi:"#2D8CFF",urgence:"#ef4444"};

/* ── Demo data ───────────────────────────────────────────────────────────── */
const DD: Dossier[] = [
  {id:"dv1",patientNom:"Renaud", patientPrenom:"Isabelle",status:"Livré",type:"montures-verres",dateLivraison:"2021-11-05"},
  {id:"dv2",patientNom:"Mercier",patientPrenom:"Paul",    status:"Livré",type:"montures-verres",dateLivraison:"2022-02-10"},
  {id:"dv3",patientNom:"Caron",  patientPrenom:"Théo",   status:"Livré",type:"lentilles",       dateLivraison:"2023-05-20"},
];
const DP: Patient[] = [
  {id:"pv1",nom:"Lambert",prenom:"Sophie",createdAt:"2022-09-01"},
  {id:"pv2",nom:"Perrin", prenom:"Marc",  createdAt:"2023-01-15"},
];
const ACTIONS = [
  {l:"Nouveau patient",h:"/clair-vision/pro/patients",icon:"M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3Zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5Z"},
  {l:"Agenda",          h:"/clair-vision/pro/agenda",  icon:"M3 4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4Zm0 6h18M8 2v4M16 2v4"},
  {l:"Bilan de vue",    h:"/clair-vision/pro/bilans",  icon:"M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"},
  {l:"Nouveau dossier", h:"/clair-vision/pro/dossiers",icon:"M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"},
];

/* ══════════════════════════════════════════════════════════════════════════ */
export default function VisionDashboard() {
  const [ok,setOk]=useState(false);
  useEffect(()=>setOk(true),[]);

  const dossiers=useMemo(()=>{const d=ok?safeLoad<Dossier>("thor_pro_dossiers"):[];return d.length?d:DD;},[ok]);
  const patients=useMemo(()=>{const p=ok?safeLoad<Patient>("thor_pro_patients"):[];return p.length?p:DP;},[ok]);
  const rdvs    =useMemo(()=>ok?safeLoad<Rdv>("thor_pro_rdv"):[]     ,[ok]);
  const factures=useMemo(()=>ok?safeLoad<Facture>("thor_pro_factures"):[]   ,[ok]);

  const rdvToday=useMemo(()=>rdvs.filter(r=>r.date&&isToday(r.date)),[rdvs]);
  const caMonth =useMemo(()=>factures.filter(f=>{const d=f.date??f.createdAt??"";return d&&isThisMonth(d);}).reduce((s,f)=>s+(f.montantTTC??f.montant??0),0),[factures]);
  const agenda  =useMemo(()=>rdvToday.slice().sort((a,b)=>(a.heure??"").localeCompare(b.heure??"")), [rdvToday]);

  const renewals=useMemo(()=>
    dossiers.filter(d=>d.status==="Livré"&&d.dateLivraison)
      .map(d=>{
        const t=THRESH[d.type??"montures-verres"]??730;
        const days=daysSince(d.dateLivraison!);
        const s=days>=t?"eligible":days>=t-SOON_OFFSET?"soon":null;
        return s?{...d,days,s,left:t-days,t}:null;
      }).filter(Boolean).sort((a,b)=>b!.days-a!.days).slice(0,6) as Array<Dossier&{days:number;s:"eligible"|"soon";left:number;t:number}>,
  [dossiers]);

  const inactive=useMemo(()=>
    patients.map(p=>{
      const nm=`${p.nom??""} ${p.prenom??""}`.trim().toLowerCase();
      const last=rdvs.filter(r=>`${r.patientNom??""} ${r.patientPrenom??""}`.trim().toLowerCase()===nm&&r.date).sort((a,b)=>b.date!.localeCompare(a.date!))[0];
      const d=daysSince(last?.date??p.createdAt??"2099-01-01");
      return d>=INACTIVE?{...p,days:d}:null;
    }).filter(Boolean).sort((a,b)=>b!.days-a!.days).slice(0,5) as Array<Patient&{days:number}>,
  [patients,rdvs]);

  const greet  =useMemo(()=>{const h=new Date().getHours();return h<12?"Bonjour":h<18?"Bonne après-midi":"Bonsoir";},[]);
  const dateLbl=useMemo(()=>new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),[]);

  const caDisplay=caMonth>=1000?`${(caMonth/1000).toFixed(1).replace(".",",")} k€`:`${caMonth.toLocaleString("fr-FR")} €`;
  const spR=mkSpark([10,13,12,15,14,16,15,17,15,18]);
  const spP=mkSpark([108,112,118,121,124,128,132,135,138,142]);
  const spC=mkSpark([3200,3500,3300,3800,3600,4100,3900,4300,4100,4500]);

  return (
    <div>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32,flexWrap:"wrap",gap:12}}>
          <div>
            <p style={{fontSize:12,fontWeight:600,color:"#64748b",letterSpacing:".09em",textTransform:"uppercase",margin:"0 0 6px"}}>{dateLbl}</p>
            <h1 style={{fontSize:28,fontWeight:900,color:"#0f172a",letterSpacing:"-.035em",margin:0}}>{greet}</h1>
          </div>
          <Link href="/clair-vision/pro/patients" style={{
            display:"flex",alignItems:"center",gap:8,padding:"11px 22px",
            background:"linear-gradient(135deg,#2D8CFF,#1a6fe0)",
            color:"#fff",borderRadius:14,fontSize:13,fontWeight:700,
            textDecoration:"none",boxShadow:"0 8px 24px rgba(45,140,255,.35),0 2px 8px rgba(45,140,255,.2)",letterSpacing:".01em"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Nouveau patient
          </Link>
        </div>

        {/* KPI strip */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:32}}>

          <KpiCard id="vrdv" label="RDV aujourd'hui" value={String(ok?rdvToday.length:0)}
            grad="linear-gradient(135deg,rgba(45,140,255,0.08) 0%,rgba(255,255,255,0.6) 100%)"
            glow="rgba(45,140,255,.10)" accent="#2D8CFF" sp={spR}/>

          <KpiCard id="vpat" label="Patients actifs" value={String(ok?patients.length:0)}
            grad="linear-gradient(135deg,rgba(99,102,241,0.08) 0%,rgba(255,255,255,0.6) 100%)"
            glow="rgba(99,102,241,.10)" accent="#6366f1" sp={spP}/>

          <KpiCard id="vca" label="CA du mois" value={caDisplay}
            grad="linear-gradient(135deg,rgba(16,185,129,0.08) 0%,rgba(255,255,255,0.6) 100%)"
            glow="rgba(16,185,129,.10)" accent="#10b981" sp={spC}/>
        </div>

        {/* Section label */}
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <div style={{flex:1,height:1,background:"linear-gradient(90deg,rgba(45,140,255,.2),transparent)"}}/>
          <span style={{fontSize:11,fontWeight:800,color:"#2D8CFF",letterSpacing:".12em",textTransform:"uppercase"}}>Radar Clinique</span>
          <div style={{flex:1,height:1,background:"linear-gradient(270deg,rgba(45,140,255,.2),transparent)"}}/>
        </div>

        {/* Summary banner */}
        {(renewals.length>0||inactive.length>0)&&(
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:24}}>
            {renewals.filter(r=>r.s==="eligible").length>0&&(
              <div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.22)",borderRadius:12}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#10b981"}}/>
                <span style={{fontSize:13,fontWeight:700,color:"#059669"}}>{renewals.filter(r=>r.s==="eligible").length} renouvellement{renewals.filter(r=>r.s==="eligible").length>1?"s":""} disponible{renewals.filter(r=>r.s==="eligible").length>1?"s":""}</span>
              </div>
            )}
            {renewals.filter(r=>r.s==="soon").length>0&&(
              <div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",background:"rgba(59,130,246,.08)",border:"1px solid rgba(59,130,246,.18)",borderRadius:12}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#3b82f6"}}/>
                <span style={{fontSize:13,fontWeight:700,color:"#2563eb"}}>{renewals.filter(r=>r.s==="soon").length} bientôt éligible{renewals.filter(r=>r.s==="soon").length>1?"s":""}</span>
              </div>
            )}
            {inactive.length>0&&(
              <div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)",borderRadius:12}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#f59e0b"}}/>
                <span style={{fontSize:13,fontWeight:700,color:"#d97706"}}>{inactive.length} patient{inactive.length>1?"s":""} à relancer</span>
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div style={{display:"grid",gridTemplateColumns:"1fr min(320px,35%)",gap:24,alignItems:"start"}}>

          {/* LEFT */}
          <div style={{display:"flex",flexDirection:"column",gap:22}}>

            {/* Renouvellements */}
            <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",border:"1px solid rgba(255,255,255,.9)",boxShadow:"0 8px 40px rgba(0,0,0,.06)",borderRadius:24,padding:28}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
                <div style={{width:46,height:46,borderRadius:14,background:"linear-gradient(135deg,rgba(45,140,255,.15),rgba(45,140,255,.06))",border:"1px solid rgba(45,140,255,.18)",display:"grid",placeItems:"center",flexShrink:0}}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2D8CFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <h2 style={{fontSize:17,fontWeight:800,color:"#0f172a",margin:0,letterSpacing:"-.01em"}}>Renouvellements SS</h2>
                    {renewals.length>0&&<span style={{fontSize:12,fontWeight:800,color:"#2D8CFF",background:"rgba(45,140,255,.12)",padding:"2px 10px",borderRadius:20,flexShrink:0}}>{renewals.length}</span>}
                  </div>
                  <p style={{fontSize:12,color:"#94a3b8",margin:"3px 0 0"}}>Montures &amp; Verres : 2 ans · Lentilles : 1 an</p>
                </div>
              </div>

              {renewals.length===0 ? (
                <EmptyState text="Aucun équipement livré éligible au renouvellement pour l'instant." />
              ) : [...renewals].sort((a,b)=>(a.s==="eligible"?0:1)-(b.s==="eligible"?0:1)).map(r=>{
                const eli=r.s==="eligible";
                const bc=eli?"#10b981":"#3b82f6";
                const pct=Math.min(100,Math.round(r.days/r.t*100));
                const typeLabel=r.type==="lentilles"?"Lentilles":"Montures & Verres";
                const eligibleDate=new Date(new Date(r.dateLivraison!).getTime()+r.t*86_400_000);
                const eligibleLabel=eli?`Éligible depuis le ${fmtDate(eligibleDate.toISOString())}`:`Éligible le ${fmtDate(eligibleDate.toISOString())}`;
                return (
                  <div key={r.id} style={{
                    padding:"16px 20px",borderRadius:16,marginBottom:10,cursor:"pointer",
                    background:eli?"linear-gradient(90deg,rgba(16,185,129,.06),rgba(255,255,255,.6))":"rgba(255,255,255,.7)",
                    border:`1px solid ${eli?"rgba(16,185,129,.22)":"rgba(59,130,246,.15)"}`,
                    boxShadow:eli?"0 2px 16px rgba(16,185,129,.08)":"none",
                    transition:"transform .15s,box-shadow .15s"
                  }}>
                    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
                      <div style={{width:42,height:42,borderRadius:"50%",background:`${bc}18`,display:"grid",placeItems:"center",fontSize:14,fontWeight:800,color:bc,flexShrink:0,border:`1.5px solid ${bc}30`}}>
                        {(r.patientPrenom?.[0]??"")}{(r.patientNom?.[0]??"")}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:14,fontWeight:700,color:"#0f172a",margin:"0 0 2px"}}>{r.patientPrenom} {r.patientNom}</p>
                        <p style={{fontSize:12,color:"#64748b",margin:"0 0 1px"}}>{typeLabel} · Livré le {fmtDate(r.dateLivraison!)}</p>
                        <p style={{fontSize:11,color:bc,margin:0,fontWeight:600}}>{eligibleLabel}</p>
                      </div>
                      <span style={{flexShrink:0,fontSize:11,fontWeight:800,color:bc,background:`${bc}15`,padding:"5px 13px",borderRadius:20,border:`1px solid ${bc}25`,whiteSpace:"nowrap"}}>
                        {eli?"✓ Renouvellable":"Bientôt éligible"}
                      </span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{flex:1,height:5,background:"rgba(0,0,0,.06)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",background:eli?"linear-gradient(90deg,#10b981,#059669)":"linear-gradient(90deg,#93c5fd,#3b82f6)",borderRadius:3}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,color:bc,flexShrink:0}}>{pct}%</span>
                      <span style={{fontSize:11,color:"#94a3b8",flexShrink:0}}>
                        {eli?`+${Math.round((r.days-r.t)/30)}m dépassé`:`~${r.left}j restants`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inactifs */}
            <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",border:"1px solid rgba(255,255,255,.9)",boxShadow:"0 8px 40px rgba(0,0,0,.06)",borderRadius:24,padding:28}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
                <div style={{width:46,height:46,borderRadius:14,background:"linear-gradient(135deg,rgba(245,158,11,.15),rgba(245,158,11,.06))",border:"1px solid rgba(245,158,11,.18)",display:"grid",placeItems:"center",flexShrink:0}}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <h2 style={{fontSize:17,fontWeight:800,color:"#0f172a",margin:0,letterSpacing:"-.01em"}}>Patients à relancer</h2>
                    {inactive.length>0&&<span style={{fontSize:12,fontWeight:800,color:"#f59e0b",background:"rgba(245,158,11,.12)",padding:"2px 10px",borderRadius:20,flexShrink:0}}>{inactive.length}</span>}
                  </div>
                  <p style={{fontSize:12,color:"#94a3b8",margin:"3px 0 0"}}>Sans rendez-vous depuis plus de 12 mois</p>
                </div>
              </div>

              {inactive.length===0 ? (
                <EmptyState text="Tous vos patients ont eu un suivi récent. Bravo !" icon="✓"/>
              ) : inactive.map(p=>{
                const months=Math.round(p.days/30);
                const urg=p.days>730?"#ef4444":p.days>548?"#f59e0b":"#94a3b8";
                return (
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",background:"rgba(255,255,255,.7)",borderRadius:14,border:"1px solid rgba(0,0,0,.05)",marginBottom:9}}>
                    <div style={{width:40,height:40,borderRadius:"50%",background:`${urg}15`,display:"grid",placeItems:"center",fontSize:13,fontWeight:800,color:urg,flexShrink:0,border:`1.5px solid ${urg}25`}}>
                      {(p.prenom?.[0]??"")}{(p.nom?.[0]??"")}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#0f172a",margin:"0 0 3px"}}>{p.prenom} {p.nom}</p>
                      <p style={{fontSize:11,color:"#94a3b8",margin:0}}>
                        Dernière visite : <span style={{color:urg,fontWeight:700}}>il y a {months} mois</span>
                      </p>
                    </div>
                    <Link href="/clair-vision/pro/agenda" style={{flexShrink:0,padding:"8px 16px",background:"rgba(45,140,255,.1)",color:"#2D8CFF",borderRadius:10,fontSize:12,fontWeight:700,textDecoration:"none",border:"1px solid rgba(45,140,255,.2)"}}>
                      Planifier
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{display:"flex",flexDirection:"column",gap:18}}>

            <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",border:"1px solid rgba(255,255,255,.9)",boxShadow:"0 8px 40px rgba(0,0,0,.06)",borderRadius:22,padding:24}}>
              <SideTitle label="Agenda du jour" accent="#2D8CFF"/>
              {agenda.length===0 ? (
                <div style={{textAlign:"center",padding:"24px 0"}}>
                  <p style={{fontSize:13,color:"#94a3b8",fontWeight:500,margin:0}}>Journée libre</p>
                </div>
              ) : agenda.map(r=>{
                const col=RDV_COL[r.type??""]??"#2D8CFF";
                return (
                  <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(248,250,252,.9)",borderRadius:12,border:"1px solid rgba(0,0,0,.04)",marginBottom:8}}>
                    <div style={{width:3,height:36,borderRadius:2,background:col,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:13,fontWeight:700,color:"#0f172a",margin:"0 0 2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.patientPrenom} {r.patientNom}</p>
                      <p style={{fontSize:11,color:"#64748b",margin:0}}>{r.heure??"—"} · <span style={{color:col,fontWeight:700}}>{r.titre??r.type??"RDV"}</span></p>
                    </div>
                    {r.statut==="Confirmé"&&<div style={{width:8,height:8,borderRadius:"50%",background:"#10b981",flexShrink:0}}/>}
                  </div>
                );
              })}
              <Link href="/clair-vision/pro/agenda" style={{display:"block",textAlign:"center",marginTop:12,fontSize:12,color:"#2D8CFF",fontWeight:700,textDecoration:"none"}}>
                Voir l'agenda →
              </Link>
            </div>

            <div style={{background:"rgba(255,255,255,.78)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",border:"1px solid rgba(255,255,255,.9)",boxShadow:"0 8px 40px rgba(0,0,0,.06)",borderRadius:22,padding:24}}>
              <SideTitle label="Actions rapides" accent="#2D8CFF"/>
              {ACTIONS.map((a,i)=>(
                <Link key={i} href={a.h} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,
                  background:"rgba(248,250,252,.9)",border:"1px solid rgba(45,140,255,.12)",
                  textDecoration:"none",color:"#0f172a",fontWeight:600,fontSize:13,marginBottom:9
                }}>
                  <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,rgba(45,140,255,.15),rgba(45,140,255,.07))",display:"grid",placeItems:"center",flexShrink:0}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2D8CFF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon}/></svg>
                  </div>
                  {a.l}
                </Link>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}

/* ── Shared components ───────────────────────────────────────────────────── */
function KpiCard({id,label,value,grad,glow,accent,sp}:{id:string;label:string;value:string;grad:string;glow:string;accent:string;sp:{line:string;fill:string}}) {
  return (
    <div style={{borderRadius:24,padding:"26px 28px 22px",background:grad,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",boxShadow:`0 8px 32px ${glow},0 2px 8px rgba(0,0,0,.04)`,border:"1px solid rgba(255,255,255,0.72)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-28,right:-28,width:110,height:110,borderRadius:"50%",background:"rgba(255,255,255,.45)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:-12,right:18,width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,.30)",pointerEvents:"none"}}/>
      <p style={{fontSize:10,fontWeight:800,color:accent,letterSpacing:".1em",textTransform:"uppercase",margin:"0 0 16px",opacity:.7}}>{label}</p>
      <p style={{fontSize:50,fontWeight:900,color:"#0f172a",letterSpacing:"-.05em",lineHeight:1,margin:"0 0 16px"}}>{value}</p>
      <svg width="100%" height="34" viewBox="0 0 110 34" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gk-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity=".25"/>
            <stop offset="100%" stopColor={accent} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={sp.fill} fill={`url(#gk-${id})`}/>
        <path d={sp.line} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity=".7"/>
      </svg>
    </div>
  );
}

function SideTitle({label,accent}:{label:string;accent:string}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:18}}>
      <div style={{width:3,height:18,borderRadius:2,background:accent}}/>
      <p style={{fontSize:11,fontWeight:800,color:"#0f172a",letterSpacing:".08em",textTransform:"uppercase",margin:0}}>{label}</p>
    </div>
  );
}

function EmptyState({text}:{text:string;icon?:string}) {
  return (
    <div style={{textAlign:"center",padding:"28px 0",background:"rgba(248,250,252,.8)",borderRadius:14}}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{margin:"0 auto 10px",display:"block"}}><path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <p style={{fontSize:13,color:"#94a3b8",margin:0}}>{text}</p>
    </div>
  );
}
