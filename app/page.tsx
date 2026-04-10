
import { useState, useRef, useEffect } from "react";
import { Sparkles, ChevronRight, CheckCircle2, Clock, AlertCircle, Users, User, X, ChevronDown, ChevronUp, Pencil, Send, Lock, Plus } from "lucide-react";

const timelineStages = [
  { id:"ASSIGNED", label:"Assigned" },
  { id:"CONTEXT_REVIEWED", label:"Context Reviewed" },
  { id:"TEST_PLAN_READY", label:"Test Plan Ready" },
  { id:"FIELDWORK_IN_PROGRESS", label:"Fieldwork In Progress" },
  { id:"RESULTS_SUMMARIZED", label:"Results Summarized" },
  { id:"EVALUATION_COMPLETE", label:"Evaluation Complete" },
  { id:"AUDIT_CLOSED", label:"Audit Closed" },
  { id:"FOLLOW_UP_ACTIVE", label:"Follow-up Active" },
];

const myAudits = [
  { id:"1", title:"Revenue recognition Q1 2026", dueDate:"11 May 2026", stage:"FIELDWORK_IN_PROGRESS", controlTests:{closed:12,open:3}, progress:80, needsAttention:true, plan:"2026 Annual Financial Audit Plan" },
  { id:"5", title:"Cybersecurity Controls Review", dueDate:"1 Jun 2026", stage:"FIELDWORK_IN_PROGRESS", controlTests:{closed:15,open:5}, progress:75, needsAttention:true, plan:"2026 IT Audit Plan" },
  { id:"2", title:"IT General Controls Assessment", dueDate:"15 May 2026", stage:"TEST_PLAN_READY", controlTests:{closed:8,open:7}, progress:53, needsAttention:false, plan:"2026 IT Audit Plan" },
  { id:"3", title:"Inventory Management Review", dueDate:"20 May 2026", stage:"CONTEXT_REVIEWED", controlTests:{closed:5,open:10}, progress:33, needsAttention:false, plan:"2026 Operational Audit Plan" },
  { id:"4", title:"Procurement Process Audit", dueDate:"25 May 2026", stage:"CONTEXT_REVIEWED", controlTests:{closed:2,open:13}, progress:13, needsAttention:false, plan:"2026 Operational Audit Plan" },
];

const otherAudits = [
  { id:"o1", title:"Risk Assessment Review", dueDate:"12 Jun 2026", stage:"ASSIGNED", controlTests:{closed:17,open:5}, progress:77, needsAttention:false, plan:"2026 Risk Audit Plan" },
  { id:"o2", title:"Payroll Processing Audit", dueDate:"8 May 2026", stage:"CONTEXT_REVIEWED", controlTests:{closed:2,open:13}, progress:13, needsAttention:false, plan:"2026 HR Audit Plan" },
  { id:"o3", title:"Cash Management Audit", dueDate:"9 May 2026", stage:"CONTEXT_REVIEWED", controlTests:{closed:0,open:0}, progress:95, needsAttention:true, plan:"2026 Finance Audit Plan" },
  { id:"o4", title:"Fixed Assets Verification", dueDate:"25 Jun 2026", stage:"TEST_PLAN_READY", controlTests:{closed:4,open:8}, progress:33, needsAttention:false, plan:"2026 Finance Audit Plan" },
];

const allAudits = [...myAudits, ...otherAudits];

const getMilestones = (auditId, stageId) => {
  if (auditId === "1") {
    const byStage = {
      ASSIGNED: [
        { id:"a1", title:"Audit assigned to team", status:"approved", step:1, assignedTo:["user"], action:{label:"View",disabled:false} },
        { id:"a2", title:"Kickoff meeting scheduled", status:"approved", step:2, assignedTo:["ai"], action:{label:"View",disabled:false} },
      ],
      CONTEXT_REVIEWED: [
        { id:"c1", title:"Prior audit findings reviewed", status:"approved", step:1, assignedTo:["user"], action:{label:"View",disabled:false} },
        { id:"c2", title:"Entity context documented", status:"approved", step:2, assignedTo:["ai","user"], action:{label:"View",disabled:false} },
        { id:"c3", title:"Risk areas identified", status:"approved", step:3, assignedTo:["ai"], action:{label:"View",disabled:false} },
      ],
      TEST_PLAN_READY: [
        { id:"t1", title:"Control objectives defined", status:"approved", step:1, assignedTo:["user"], action:{label:"View",disabled:false} },
        { id:"t2", title:"Test procedures drafted", status:"approved", step:2, assignedTo:["ai","user"], action:{label:"View",disabled:false} },
        { id:"t3", title:"Sampling strategy approved", status:"approved", step:3, assignedTo:["user"], action:{label:"View",disabled:false} },
      ],
      FIELDWORK_IN_PROGRESS: [
        { id:"1", title:"Meetings planned", status:"approved", step:1, assignedTo:["ai"], action:{label:"View",disabled:false} },
        { id:"2", title:"Interview script prepared", status:"approved", step:2, assignedTo:["ai"], action:{label:"View",disabled:false} },
        { id:"3", title:"Interviews conducted", status:"waiting", step:3, assignedTo:["user","ai","others"], action:{label:"Review and approve",disabled:false} },
        { id:"4", title:"Evidence requests sent", status:"waiting", step:4, assignedTo:["ai"], action:{label:"Review and approve",disabled:false} },
        { id:"5", title:"Automatic data collected", status:"approved", step:5, assignedTo:["ai"], action:{label:"View",disabled:false} },
        { id:"6", title:"Responses managed and validated", status:"waiting", step:6, assignedTo:["ai","user","others"], action:{label:"Review and approve",disabled:false} },
        { id:"7", title:"Evidence completeness confirmed", status:"blocked", step:7, assignedTo:["user"], statusMessage:"Pending response validation", action:{label:"Confirm",disabled:true} },
      ],
    };
    return byStage[stageId] || [];
  }
  return [];
};

const milestoneDetails = {
  "3": {
    evidences:[
      { label:"Revenue transaction sample - January 2026", by:"ai" },
      { label:"Customer contract review - Enterprise clients", by:"user" },
      { label:"Revenue reconciliation report - Q1 2026", by:"others" },
      { label:"Sales order confirmations batch", by:"ai" },
      { label:"Signed client acceptance forms", by:"user" },
    ],
    procedures:[
      { label:"Revenue cut-off testing", by:"ai" },
      { label:"Invoice matching verification", by:"user" },
      { label:"Contract terms compliance", by:"others" },
      { label:"Period-end journal entry review", by:"ai" },
    ],
    sampleDocs:[
      { label:"Q1 Sales Register Extract", by:"ai" },
      { label:"Customer Acknowledgment Letters", by:"user" },
      { label:"Delivery confirmation log", by:"others" },
    ],
    findings:[
      { label:"Incomplete contract documentation", by:"user", severity:"Low", description:"Four customer contracts missing signed acceptance forms, though delivery confirmations are on file.", recommendation:"Establish a contract completion checklist. Follow up with customers to obtain missing signatures within 30 days." },
      { label:"Revenue recognised before delivery", by:"ai", severity:"High", description:"Two transactions in January show revenue recognised 3–5 days before confirmed delivery, inconsistent with the company's revenue policy.", recommendation:"Reverse and repost affected entries. Update recognition triggers in the billing system to require delivery confirmation." },
      { label:"Missing approval on journal entry #JE-0312", by:"others", severity:"Medium", description:"A manual journal entry adjusting deferred revenue lacks a second-level approval signature as required by policy.", recommendation:"Obtain retroactive approval or reverse the entry pending review. Reinforce dual-approval controls for manual journals." },
    ],
  }
};

const getWelcomeMessage = (audit) => {
  if (!audit) return { text:"Select an audit to get started.", suggestions:[] };
  if (audit.id==="1") return {
    text:`You're on **Fieldwork In Progress** for **${audit.title}**. Step 3 (Interviews conducted) is waiting for your review — you have 2 interviews assigned. I've also flagged 3 potential evidence gaps. What would you like to tackle first?`,
    suggestions:["Summarize the 3 evidence gaps","Show my 2 assigned interviews","What's blocking step 7?","Review findings so far"],
  };
  return {
    text:`You're on **${timelineStages.find(s=>s.id===audit.stage)?.label}** for **${audit.title}**. Due ${audit.dueDate}. ${audit.needsAttention?"⚠️ This audit needs attention.":"Everything looks on track."} How can I help?`,
    suggestions:["What needs attention here?","Summarize open control tests","What's the next step?"],
  };
};

const AssigneeTag = ({ type, small }) => {
  const cfg = {
    ai:     { bg:"bg-violet-50 text-violet-700 border-violet-200", icon:<Sparkles className={small?"h-2.5 w-2.5":"h-3 w-3"}/>, label:"AI" },
    user:   { bg:"bg-blue-50 text-blue-700 border-blue-200", icon:<User className={small?"h-2.5 w-2.5":"h-3 w-3"}/>, label:"You" },
    others: { bg:"bg-gray-100 text-gray-600 border-gray-200", icon:<Users className={small?"h-2.5 w-2.5":"h-3 w-3"}/>, label:"Others" },
  }[type];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.bg}`}>{cfg.icon}{cfg.label}</span>;
};

const ByTag = ({ by }) => {
  const cfg = {
    ai:     { bg:"bg-violet-50 text-violet-600 border-violet-200", icon:<Sparkles className="h-3 w-3"/> },
    user:   { bg:"bg-blue-50 text-blue-600 border-blue-200", icon:<User className="h-3 w-3"/> },
    others: { bg:"bg-gray-50 text-gray-500 border-gray-200", icon:<Users className="h-3 w-3"/> },
  }[by] || {};
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.bg}`}>{cfg.icon}{by==="ai"?"AI":by==="user"?"You":"Others"}</span>;
};

const stepStatusStyle = (status) => ({
  approved:{ bg:"bg-green-500" },
  waiting: { bg:"bg-amber-400" },
  blocked: { bg:"bg-red-400" },
}[status] || { bg:"bg-gray-300" });

function TimelineSideSheet({ activeAuditId, onSelectAudit, onClose }) {
  const [scope, setScope] = useState("mine");
  const displayed = scope === "mine" ? myAudits : otherAudits;
  const total = displayed.reduce((s,a) => s+a.controlTests.closed+a.controlTests.open, 0);

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0" style={{width:272}}>
      <div className="flex items-stretch flex-shrink-0">
        <div className="flex-1 px-3 pt-3 pb-2">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-sm font-bold text-gray-900">Audits</span>
            <button onClick={()=>setScope(s=>s==="mine"?"others":"mine")} className="text-xs font-medium text-violet-600 hover:text-violet-700">
              {scope==="mine"?"Other assignments":"Your assignments"}
            </button>
          </div>
          <p className="text-xs text-gray-400 leading-snug">{total} control tests across {displayed.length} audits</p>
        </div>
        <button onClick={onClose} title="Collapse panel"
          className="flex-shrink-0 flex items-center justify-center border-l border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-violet-500 transition-colors"
          style={{width:32}}>
          <ChevronDown className="h-3.5 w-3.5 -rotate-90"/>
        </button>
      </div>
      <div className="border-t border-gray-200 mx-0 flex-shrink-0"/>
      <div className="flex-1 overflow-y-auto pt-2 pb-4">
        {timelineStages.map((stage, si) => {
          const audits = displayed.filter(a => a.stage === stage.id);
          const isLast = si === timelineStages.length - 1;
          return (
            <div key={stage.id} className="flex">
              <div className="flex flex-col items-center flex-shrink-0" style={{width:28,paddingLeft:14}}>
                {si !== 0 && <div className="w-px bg-gray-200" style={{height:8}}/>}
                <div className="h-2 w-2 rounded-full bg-gray-300 flex-shrink-0"/>
                {!isLast && <div className="flex-1 w-px bg-gray-200" style={{minHeight:8}}/>}
              </div>
              <div className="flex-1 pr-2 min-w-0">
                <div style={{height:si!==0?8:0}}/>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{lineHeight:"8px",marginBottom:8}}>{stage.label}</p>
                {audits.length === 0
                  ? <p className="text-xs text-gray-300 mb-1.5">No audits</p>
                  : audits.map(audit => {
                      const isActive = audit.id === activeAuditId;
                      const tot = audit.controlTests.closed + audit.controlTests.open;
                      return (
                        <button key={audit.id} onClick={() => onSelectAudit(audit.id)}
                          className={`w-full text-left px-2.5 py-2.5 rounded-xl mb-1.5 border transition-all ${isActive?"bg-violet-50 border-violet-200":"bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}>
                          <p className={`text-xs font-semibold leading-snug mb-0.5 truncate ${isActive?"text-violet-900":"text-gray-900"}`}>{audit.title}</p>
                          <p className="text-xs text-gray-400 mb-1.5">Due: {audit.dueDate}</p>
                          <span className={`inline-block text-xs px-1.5 py-0.5 rounded-md font-medium mb-1.5 ${isActive?"bg-green-100 text-green-700":"bg-green-50 text-green-600"}`}>
                            Closed: {audit.controlTests.closed}/{tot}
                          </span>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isActive?"bg-violet-500":"bg-green-500"}`} style={{width:`${audit.progress}%`}}/>
                          </div>
                          {audit.needsAttention && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <AlertCircle className="h-3 w-3 text-red-500"/>
                              <span className="text-xs text-red-500">Needs attention</span>
                            </div>
                          )}
                        </button>
                      );
                    })
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StageTabBar({ auditStageId, viewingStageId, onSelectStage }) {
  const activeIdx = timelineStages.findIndex(s => s.id === auditStageId);
  const scrollRef = useRef(null);
  useEffect(() => {
    const el = scrollRef.current?.querySelector("[data-active='true']");
    if (el) el.scrollIntoView({ inline:"center", block:"nearest", behavior:"smooth" });
  }, [auditStageId]);
  return (
    <div className="flex-shrink-0 bg-white overflow-x-auto border-b border-gray-100" ref={scrollRef} style={{scrollbarWidth:"none"}}>
      <div className="flex items-stretch min-w-max">
        {timelineStages.map((stage, idx) => {
          const isDone=idx<activeIdx, isCurrent=idx===activeIdx, isViewing=stage.id===viewingStageId, isUpcoming=idx>activeIdx;
          let Icon, iconCls;
          if (isDone) { Icon=CheckCircle2; iconCls="text-green-500"; }
          else if (isCurrent) { Icon=Clock; iconCls="text-orange-400"; }
          else { Icon=Lock; iconCls="text-gray-300"; }
          return (
            <button key={stage.id} data-active={isViewing}
              onClick={() => onSelectStage(stage.id)}
              className={["flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0",
                isViewing?"border-violet-600 text-violet-700 bg-white"
                :isDone?"border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                :isCurrent?"border-transparent text-gray-700 hover:text-violet-600 hover:bg-gray-50"
                :"border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"].join(" ")}
            >
              <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${isViewing?"text-violet-500":iconCls}`}/>
              {stage.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MilestonesRail({ audit, viewingStageId, onOpenMilestone }) {
  const milestones = getMilestones(audit?.id, viewingStageId);
  const viewingIdx = timelineStages.findIndex(s => s.id === viewingStageId);
  const activeIdx = timelineStages.findIndex(s => s.id === audit?.stage);
  const isUpcoming=viewingIdx>activeIdx, isCompleted=viewingIdx<activeIdx;

  if (!audit) return null;

  if (isUpcoming) {
    const placeholders = [
      { step:1, title:"Stage kickoff", docs:["Kickoff checklist","Prior stage sign-off","Team assignment confirmation"] },
      { step:2, title:"Preparation & review", docs:["Risk assessment summary","Control objectives list","Prior findings report"] },
      { step:3, title:"Execution", docs:["Test procedures document","Sampling methodology","Evidence request templates"] },
      { step:4, title:"Sign-off", docs:["Draft findings report","Management response template","Approval sign-off form"] },
    ];
    return (
      <div className="flex-shrink-0 bg-white px-6 pt-3 pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Milestones</span>
          <span className="text-xs text-gray-400">{placeholders.length} steps</span>
        </div>
        {placeholders.map((m, idx) => (
          <div key={m.step} className="flex gap-2">
            <div className="flex flex-col items-center flex-shrink-0" style={{width:20,marginLeft:8}}>
              {idx > 0 && <div className="flex-1 w-px bg-gray-200"/>}
              <div className="h-5 w-5 rounded-full bg-red-300 flex items-center justify-center flex-shrink-0 z-10" style={{marginTop:idx===0?10:0,marginBottom:idx===placeholders.length-1?10:0}}>
                <span className="text-white text-[9px] font-bold">{m.step}</span>
              </div>
              {idx < placeholders.length - 1 && <div className="flex-1 w-px bg-gray-200"/>}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 py-2 pr-2">
                <span className="text-xs text-gray-500 flex-1 truncate">{m.title}</span>
                <button onClick={() => onOpenMilestone({ id:`upcoming-${m.step}`, title:m.title, docs:m.docs, upcoming:true })}
                  className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full text-gray-500 hover:text-violet-600 transition-colors">
                  Review
                </button>
              </div>
              {idx < placeholders.length - 1 && <div className="border-t border-gray-100 mr-2"/>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (milestones.length===0) return (
    <div className="flex-shrink-0 bg-white px-6 py-3 border-b border-gray-100">
      <p className="text-xs text-gray-400 italic">No milestones for this stage.</p>
    </div>
  );

  const completed=milestones.filter(m=>m.status==="approved").length;
  const activeStep=milestones.find(m=>m.status!=="approved")||milestones[milestones.length-1];

  return (
    <div className="flex-shrink-0 bg-white px-6 pt-3 pb-0 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Milestones</span>
        <span className="text-xs text-gray-400">{completed}/{milestones.length} done</span>
      </div>
      {milestones.map((m, idx) => {
        const { bg }=stepStatusStyle(m.status);
        const isActive=!isCompleted&&m.id===activeStep.id;
        const isDone=m.status==="approved", isLast=idx===milestones.length-1;
        return (
          <div key={m.id} className="flex gap-2">
            <div className="flex flex-col items-center flex-shrink-0" style={{width:20,marginLeft:8}}>
              {idx > 0 && <div className="flex-1 w-px bg-gray-200"/>}
              <div className={`h-5 w-5 rounded-full ${bg} flex items-center justify-center flex-shrink-0 z-10`} style={{marginTop:idx===0?10:0,marginBottom:isLast?10:0}}>
                <span className="text-white text-[9px] font-bold">{m.step}</span>
              </div>
              {!isLast && <div className="flex-1 w-px bg-gray-200"/>}
            </div>
            <div className={["flex-1 transition-all", !isDone&&!isActive?"opacity-70":""].join(" ")}>
              <div className="flex items-center gap-2 py-2 pr-2">
                <span className={`text-xs min-w-0 truncate ${isActive||m.status==="waiting"?"font-semibold text-gray-900":isDone?"text-gray-500":"text-gray-700"}`}>{m.title}</span>
                {m.assignedTo&&m.assignedTo.length>0&&(
                  <div className="flex items-center gap-0.5 flex-shrink-0 ml-1.5">
                    {m.assignedTo.map(a=><AssigneeTag key={a} type={a} small/>)}
                  </div>
                )}
                <div className="flex-1"/>
                {m.statusMessage&&<span className="text-xs text-red-500 flex-shrink-0 hidden sm:block">{m.statusMessage}</span>}
                <button onClick={()=>{ if(milestoneDetails[m.id]) onOpenMilestone(m); }}
                  className={["flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full transition-all",
                    isCompleted||isDone?"text-gray-600 hover:text-violet-600"
                    :m.action.disabled?"text-gray-300 cursor-not-allowed"
                    :m.status==="waiting"?"bg-violet-600 text-white hover:bg-violet-700"
                    :"text-gray-400 hover:text-violet-600"].join(" ")}>
                  {isCompleted||isDone?"View":m.action.label}
                </button>
              </div>
              {!isLast&&<div className="border-t border-gray-100 mr-2"/>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MilestoneDrawer({ milestone, onClose }) {
  if (milestone.upcoming) {
    return (
      <div className="h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0" style={{width:"33.333%",minWidth:300,maxWidth:480}}>
        <div className="px-4 py-3 flex items-start justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h2 className="text-sm font-bold text-gray-900">{milestone.title}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-400 border border-red-100">
              <Lock className="h-3 w-3"/>Upcoming
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 flex-shrink-0"><X className="h-4 w-4"/></button>
        </div>
        <div className="border-t border-gray-200 flex-shrink-0"/>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-xs text-gray-500 mb-4">This milestone is part of a stage that has not yet been reached. Below are the typical requirements and documents associated with it.</p>
          <p className="text-xs font-semibold text-gray-700 mb-2">Required documents & inputs</p>
          <div className="space-y-1">
            {milestone.docs?.map((doc, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2 border border-gray-200 rounded-xl">
                <div className="h-1.5 w-1.5 rounded-full bg-red-300 flex-shrink-0"/>
                <span className="text-xs text-gray-700">{doc}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs text-amber-700 font-medium mb-0.5">Prerequisites</p>
            <p className="text-xs text-amber-600">Complete all prior stages before this milestone becomes actionable.</p>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
          <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50">Close</button>
        </div>
      </div>
    );
  }

  const [tab, setTab] = useState("mine");
  const [expandedFinding, setExpandedFinding] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const detail = milestoneDetails[milestone.id];
  const toggleSection = key => setCollapsed(p=>({...p,[key]:!p[key]}));

  const SectionHeader = ({ sectionKey, title, count, action }) => {
    const isCollapsed=!!collapsed[sectionKey];
    return (
      <div className="flex items-center justify-between mb-1.5">
        <button onClick={()=>toggleSection(sectionKey)} className="flex items-center gap-1.5 min-w-0">
          {isCollapsed?<ChevronDown className="h-3.5 w-3.5 text-gray-400 flex-shrink-0"/>:<ChevronUp className="h-3.5 w-3.5 text-gray-400 flex-shrink-0"/>}
          <p className="text-xs font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400 ml-1">{count}</p>
        </button>
        {action&&!isCollapsed&&(
          <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-600 text-xs font-medium flex-shrink-0">
            <Sparkles className="h-3 w-3"/>{action}
          </button>
        )}
      </div>
    );
  };

  const renderItems = items => items.map((e,i)=>(
    <div key={i} className="flex items-center justify-between px-2.5 py-2 border border-gray-200 rounded-xl mb-1 hover:bg-gray-50">
      <span className="text-xs text-gray-800 font-medium truncate mr-2">{e.label}</span>
      <div className="flex items-center gap-1.5 flex-shrink-0"><ByTag by={e.by}/><ChevronDown className="h-3 w-3 text-gray-400"/></div>
    </div>
  ));

  const renderFindings = (items, pfx) => items.map((f,i)=>{
    const key=`${pfx}-${i}`, open=expandedFinding===key;
    return (
      <div key={key} className={`border rounded-xl overflow-hidden mb-1.5 ${open?"border-violet-300":"border-gray-200"}`}>
        <button onClick={()=>setExpandedFinding(open?null:key)} className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-gray-50">
          <span className="text-xs text-gray-800 font-medium text-left">{f.label}</span>
          <div className="flex items-center gap-1.5 flex-shrink-0"><ByTag by={f.by}/>{open?<ChevronUp className="h-3 w-3 text-gray-400"/>:<ChevronDown className="h-3 w-3 text-gray-400"/>}</div>
        </button>
        {open&&(
          <div className="px-2.5 pb-2.5 border-t border-gray-100">
            <div className="mt-1.5 mb-1.5"><span className="text-xs text-gray-500">Severity: </span><span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${f.severity==="High"?"bg-red-100 text-red-700":f.severity==="Medium"?"bg-orange-100 text-orange-700":"bg-amber-100 text-amber-700"}`}>{f.severity}</span></div>
            <p className="text-xs font-semibold text-gray-700 mb-0.5">Description</p>
            <p className="text-xs text-gray-600 mb-1.5">{f.description}</p>
            <p className="text-xs font-semibold text-gray-700 mb-0.5">Recommendation</p>
            <p className="text-xs text-gray-600 mb-2">{f.recommendation}</p>
            <div className="flex gap-1.5 flex-wrap">
              <button className="text-xs px-2.5 py-1 border border-gray-300 rounded-full font-medium text-gray-700">Add to report</button>
              <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1 border border-gray-300 rounded-full font-medium text-gray-700"><Pencil className="h-3 w-3"/>Edit</button>
              <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1 border border-violet-200 rounded-full bg-violet-50 font-medium text-violet-700"><Sparkles className="h-3 w-3"/>Refine</button>
            </div>
          </div>
        )}
      </div>
    );
  });

  if (!detail) return null;
  const byUser = arr => arr.filter(x=>x.by==="user");

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0" style={{width:"33.333%",minWidth:300,maxWidth:480}}>
      <div className="px-4 py-3 flex items-start justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <h2 className="text-sm font-bold text-gray-900">{milestone.title}</h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white bg-amber-400"><Clock className="h-3 w-3"/>Waiting</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 flex-shrink-0"><X className="h-4 w-4"/></button>
      </div>
      <div className="px-4 pb-3 flex-shrink-0">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-full">
          {[["mine","Your tasks"],["all","All tasks"]].map(([v,label])=>(
            <button key={v} onClick={()=>setTab(v)} className={`flex-1 py-1.5 text-xs font-medium rounded-full flex items-center justify-center transition-all ${tab===v?"bg-white text-gray-900 shadow-sm":"text-gray-500 hover:text-gray-700"}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 flex-shrink-0"/>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {tab==="all"?(
          <>
            <section><SectionHeader sectionKey="ev-all" title="Evidences" count={`${detail.evidences.length} items`} action="Summarize all"/>{!collapsed["ev-all"]&&renderItems(detail.evidences)}</section>
            <section><SectionHeader sectionKey="pr-all" title="Procedure results" count={`${detail.procedures.length} procedures`} action="Generate report"/>{!collapsed["pr-all"]&&renderItems(detail.procedures)}</section>
            <section><SectionHeader sectionKey="sd-all" title="Sample docs" count={`${detail.sampleDocs.length} documents`}/>{!collapsed["sd-all"]&&renderItems(detail.sampleDocs)}</section>
            <section><SectionHeader sectionKey="fi-all" title="Findings" count={`${detail.findings.length} issues`} action="Suggest actions"/>{!collapsed["fi-all"]&&renderFindings(detail.findings,"all")}</section>
          </>
        ):(
          <>
            <section><SectionHeader sectionKey="ev-mine" title="Evidences" count={`${byUser(detail.evidences).length} assigned to you`} action={byUser(detail.evidences).length?"Summarize all":null}/>{!collapsed["ev-mine"]&&(byUser(detail.evidences).length?renderItems(byUser(detail.evidences)):<p className="text-xs text-gray-400 px-1 pb-1">None assigned to you.</p>)}</section>
            <section><SectionHeader sectionKey="pr-mine" title="Procedure results" count={`${byUser(detail.procedures).length} assigned to you`}/>{!collapsed["pr-mine"]&&(byUser(detail.procedures).length?renderItems(byUser(detail.procedures)):<p className="text-xs text-gray-400 px-1 pb-1">None assigned to you.</p>)}</section>
            <section><SectionHeader sectionKey="sd-mine" title="Sample docs" count={`${byUser(detail.sampleDocs).length} assigned to you`}/>{!collapsed["sd-mine"]&&(byUser(detail.sampleDocs).length?renderItems(byUser(detail.sampleDocs)):<p className="text-xs text-gray-400 px-1 pb-1">None assigned to you.</p>)}</section>
            <section><SectionHeader sectionKey="fi-mine" title="Findings" count={`${byUser(detail.findings).length} assigned to you`} action={byUser(detail.findings).length?"Suggest actions":null}/>{!collapsed["fi-mine"]&&(byUser(detail.findings).length?renderFindings(byUser(detail.findings),"mine"):<p className="text-xs text-gray-400 px-1 pb-1">None assigned to you.</p>)}</section>
          </>
        )}
      </div>
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end gap-2 flex-shrink-0">
        <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50">Cancel</button>
        <button className="px-3 py-1.5 text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-full">Approve</button>
      </div>
    </div>
  );
}

function ContextPicker({ contextAudit, onSelect, onNewThread }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const shortTitle = t => t.split(" ").slice(0,3).join(" ")+"…";
  return (
    <div className="relative mb-2" ref={ref}>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Thread:</span>
        <button onClick={()=>setOpen(o=>!o)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium hover:bg-violet-100 transition-colors">
          <Sparkles className="h-2.5 w-2.5 flex-shrink-0"/>
          <span className="truncate max-w-[160px]">{shortTitle(contextAudit?.title||"Select audit")}</span>
          <ChevronDown className="h-3 w-3 flex-shrink-0"/>
        </button>
      </div>
      {open&&(
        <div className="absolute bottom-full left-6 mb-1.5 w-72 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Switch thread</span>
            <button onClick={()=>{ onNewThread(); setOpen(false); }}
              className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 px-2 py-0.5 rounded-full hover:bg-violet-50 transition-colors">
              <Plus className="h-3 w-3"/>New thread
            </button>
          </div>
          <div className="py-1 max-h-72 overflow-y-auto">
            <div className="px-3 py-1.5"><span className="text-xs font-semibold text-gray-400">Your audits</span></div>
            {myAudits.map(a=>(
              <button key={a.id} onClick={()=>{ onSelect(a); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors text-left ${a.id===contextAudit?.id?"bg-violet-50":""}`}>
                <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${a.id===contextAudit?.id?"bg-violet-500":"bg-transparent"}`}/>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${a.id===contextAudit?.id?"text-violet-700":"text-gray-800"}`}>{a.title}</p>
                  <p className="text-xs text-gray-400">{timelineStages.find(s=>s.id===a.stage)?.label} · Due {a.dueDate}</p>
                </div>
                {a.needsAttention&&<AlertCircle className="h-3 w-3 text-red-400 flex-shrink-0"/>}
              </button>
            ))}
            <div className="px-3 py-1.5 mt-1 border-t border-gray-100"><span className="text-xs font-semibold text-gray-400">Other audits</span></div>
            {otherAudits.map(a=>(
              <button key={a.id} onClick={()=>{ onSelect(a); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors text-left ${a.id===contextAudit?.id?"bg-violet-50":""}`}>
                <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${a.id===contextAudit?.id?"bg-violet-500":"bg-transparent"}`}/>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${a.id===contextAudit?.id?"text-violet-700":"text-gray-800"}`}>{a.title}</p>
                  <p className="text-xs text-gray-400">{timelineStages.find(s=>s.id===a.stage)?.label} · Due {a.dueDate}</p>
                </div>
                {a.needsAttention&&<AlertCircle className="h-3 w-3 text-red-400 flex-shrink-0"/>}
              </button>
            ))}
            <div className="px-3 py-1.5 mt-1 border-t border-gray-100"><span className="text-xs font-semibold text-gray-400">General GRC</span></div>
            {[
              { id:"grc-1", title:"Regulatory updates & compliance", subtitle:"SOX, IFRS, local regulations" },
              { id:"grc-2", title:"Risk framework discussion", subtitle:"ERM, control environment" },
              { id:"grc-3", title:"Audit methodology & best practices", subtitle:"IIA standards, sampling" },
            ].map(item=>(
              <button key={item.id} onClick={()=>{ onSelect({id:item.id,title:item.title,stage:null}); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors text-left ${item.id===contextAudit?.id?"bg-violet-50":""}`}>
                <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${item.id===contextAudit?.id?"bg-violet-500":"bg-transparent"}`}/>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${item.id===contextAudit?.id?"text-violet-700":"text-gray-800"}`}>{item.title}</p>
                  <p className="text-xs text-gray-400">{item.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MainPanel({ audit, activeAuditId, onSelectAudit, onOpenMilestone, timelineOpen, onToggleTimeline }) {
  const [viewingStageId, setViewingStageId] = useState(audit?.stage);
  const [chatsByStage, setChatsByStage] = useState({});
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [contextAudit, setContextAudit] = useState(audit);
  const endRef = useRef(null);
  const textareaRef = useRef(null);

  const activeIdx = timelineStages.findIndex(s => s.id === audit?.stage);
  const viewingIdx = timelineStages.findIndex(s => s.id === viewingStageId);
  const isViewingUpcoming = viewingIdx > activeIdx;

  const messages = chatsByStage[viewingStageId] || [];
  const setMessages = (updater) => setChatsByStage(prev => {
    const cur = prev[viewingStageId] || [];
    const next = typeof updater === "function" ? updater(cur) : updater;
    return { ...prev, [viewingStageId]: next };
  });

  useEffect(() => {
    if (!audit) return;
    setChatsByStage(prev => {
      if (prev[audit.stage]?.length) return prev;
      const welcome = getWelcomeMessage(audit);
      return { ...prev, [audit.stage]: [{ id:"w0", role:"assistant", content:welcome.text, suggestions:welcome.suggestions, timestamp:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}) }] };
    });
    setContextAudit(audit);
    setViewingStageId(audit.stage);
  }, [audit?.id]);

  useEffect(() => {
    if (!audit || !isViewingUpcoming) return;
    setChatsByStage(prev => {
      if (prev[viewingStageId]?.length) return prev;
      const stageName = timelineStages.find(s => s.id === viewingStageId)?.label;
      const currentStageName = timelineStages.find(s => s.id === audit.stage)?.label;
      const prereqs = timelineStages.slice(activeIdx + 1, viewingIdx).map(s => s.label);
      const prereqText = prereqs.length ? prereqs.join(", ") + ", and " : "";
      const msg = {
        id:"locked-0", role:"assistant",
        content:`**${stageName}** is not yet available.\n\nTo unlock this stage, you first need to complete ${prereqText}**${currentStageName}**. No actions can be taken here until all prerequisites are done.`,
        suggestions: [`Go to ${currentStageName}`, ...prereqs.slice(0,1).map(p=>`Go to ${p}`), "What's blocking progress?"].slice(0,3),
        locked: true,
        timestamp: new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),
      };
      return { ...prev, [viewingStageId]: [msg] };
    });
  }, [viewingStageId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const buildSystemPrompt = (ctx) => {
    const ms = getMilestones(ctx?.id, ctx?.stage);
    const activeStep = ms.find(m=>m.status!=="approved");
    const summary = allAudits.map(a=>`- "${a.title}" (${timelineStages.find(s=>s.id===a.stage)?.label}, due ${a.dueDate}${a.needsAttention?" — needs attention":""})`).join("\n");
    return `You are AuditAI, an expert internal audit assistant. Current context audit: "${ctx?.title||"none"}" in stage "${timelineStages.find(s=>s.id===ctx?.stage)?.label||"unknown"}". Active step: "${activeStep?.title||"none"}".

All audits the user has access to:
${summary}

Be concise (2–4 short paragraphs max). Use **bold** for emphasis. After your answer, if appropriate, suggest 2–3 follow-up actions at the very end like: SUGGESTIONS:["action1","action2"]. Only include SUGGESTIONS if genuinely useful.`;
  };

  const send = async (text) => {
    if (!text.trim()||loading) return;
    const ts = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
    const userMsg = { id:`u${Date.now()}`, role:"user", content:text, timestamp:ts };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);
    setPrompt("");
    try {
      const history = newMessages.map(m=>({ role:m.role==="user"?"user":"assistant", content:m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:buildSystemPrompt(contextAudit), messages:history }),
      });
      const data = await res.json();
      let aiText = data.content?.find(b=>b.type==="text")?.text||"Sorry, something went wrong.";
      let suggestions = [];
      const sugMatch = aiText.match(/SUGGESTIONS:\[([^\]]+)\]/);
      if (sugMatch) {
        try { suggestions = JSON.parse(`[${sugMatch[1]}]`); } catch {}
        aiText = aiText.replace(/SUGGESTIONS:\[[^\]]+\]/,"").trim();
      }
      setMessages(prev=>[...prev,{ id:`a${Date.now()}`, role:"assistant", content:aiText, suggestions, timestamp:ts }]);
    } catch {
      setMessages(prev=>[...prev,{ id:`e${Date.now()}`, role:"assistant", content:"Something went wrong. Please try again.", suggestions:[], timestamp:ts }]);
    } finally { setLoading(false); }
  };

  const handleSuggestion = (s) => {
    const goMatch = s.match(/^Go to (.+)$/);
    if (goMatch) {
      const target = timelineStages.find(st => st.label === goMatch[1]);
      if (target) { setViewingStageId(target.id); return; }
    }
    send(s);
  };

  const handleKey = e => { if (e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(prompt); } };

  const renderContent = (text) =>
    text.split("\n").map((line,i)=>{
      const html = line.replace(/\*\*(.+?)\*\*/g,(_,m)=>`<strong>${m}</strong>`);
      return <p key={i} className="leading-relaxed" style={{marginBottom:line===""?4:0}} dangerouslySetInnerHTML={{__html:html}}/>;
    });

  const stageName = timelineStages.find(s=>s.id===audit?.stage)?.label;

  if (!audit) return <div className="flex-1 flex items-center justify-center text-xs text-gray-400">Select an audit to get started.</div>;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white min-w-0">
      <div className="flex-shrink-0 pt-4 pb-3 bg-white flex">
        <div className="flex-shrink-0 flex flex-col" style={{width:28}}>
          <div style={{height:25}}/>
          <button onClick={onToggleTimeline} title={timelineOpen?"Collapse panel":"Expand panel"}
            className="flex items-center justify-center bg-white border border-gray-200 hover:bg-violet-50 hover:text-violet-500 text-gray-400 transition-colors flex-shrink-0"
            style={{width:28,height:36,borderRadius:"0 6px 6px 0",borderLeft:"none"}}>
            <div className="flex flex-col gap-0.5">
              <div className="h-px rounded-full bg-current" style={{width:9}}/>
              <div className="h-px rounded-full bg-current" style={{width:7}}/>
              <div className="h-px rounded-full bg-current" style={{width:8}}/>
            </div>
          </button>
        </div>
        <div className="flex-1 min-w-0 px-6">
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <span>Home</span><ChevronRight className="h-3 w-3"/>
            <span className="text-gray-500 truncate">{audit.plan}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 leading-tight truncate">{audit.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <span className="text-xs text-gray-500">Due <span className="font-semibold text-gray-700">{audit.dueDate}</span></span>
                {stageName&&(<span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100"><Clock className="h-3 w-3"/>{stageName}</span>)}
                {audit.needsAttention&&(<span className="inline-flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle className="h-3.5 w-3.5"/>Needs attention</span>)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-violet-500" style={{width:`${audit.progress}%`}}/>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{audit.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StageTabBar auditStageId={audit.stage} viewingStageId={viewingStageId} onSelectStage={setViewingStageId}/>
      <MilestonesRail audit={audit} viewingStageId={viewingStageId} onOpenMilestone={onOpenMilestone}/>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-gray-50">
        {messages.map(m=>(
          <div key={m.id}>
            <div className={`flex gap-2.5 ${m.role==="user"?"flex-row-reverse":""}`}>
              {m.role==="assistant"
                ?<div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5"><Sparkles className="h-3 w-3 text-white"/></div>
                :<div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5">JD</div>
              }
              <div className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${m.role==="user"?"bg-violet-600 text-white rounded-tr-sm":"bg-white border border-gray-200 text-gray-800 rounded-tl-sm"}`}>
                {m.role==="user"?<p>{m.content}</p>:<div className="space-y-0.5">{renderContent(m.content)}</div>}
              </div>
            </div>
            {m.suggestions&&m.suggestions.length>0&&(
              <div className={`flex flex-wrap gap-1.5 mt-2 ${m.role==="assistant"?"ml-8":"mr-8 justify-end"}`}>
                {m.suggestions.map(s=>(
                  <button key={s} onClick={()=>handleSuggestion(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors font-medium">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading&&(
          <div className="flex gap-2.5">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5"><Sparkles className="h-3 w-3 text-white"/></div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-1.5">
              {[0,1,2].map(i=><div key={i} className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div className="flex-shrink-0 bg-gray-50 px-6 pt-0 pb-4">
        <div className="border-t border-gray-200 mb-3"/>
        <ContextPicker contextAudit={contextAudit} onSelect={setContextAudit} onNewThread={()=>{
          setContextAudit({id:`thread-${Date.now()}`,title:"New thread",stage:null});
          setMessages([{id:"w-new",role:"assistant",content:"New thread started. What would you like to discuss?",suggestions:["Open audit risks","Upcoming deadlines","Recent findings across audits"],timestamp:new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}]);
        }}/>
        <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2 focus-within:border-violet-300 focus-within:ring-1 focus-within:ring-violet-100 transition-all">
          <textarea ref={textareaRef} value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={handleKey}
            rows={1} className="flex-1 text-xs text-gray-800 placeholder-gray-400 focus:outline-none resize-none bg-transparent py-0.5"
            placeholder="Ask about findings, evidence, control tests, or any audit…" style={{maxHeight:72}}/>
          <button onClick={()=>send(prompt)} disabled={!prompt.trim()||loading}
            className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-all ${prompt.trim()&&!loading?"bg-violet-600 text-white hover:bg-violet-700":"bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            <Send className="h-3 w-3"/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeAuditId, setActiveAuditId] = useState("1");
  const [openMilestone, setOpenMilestone] = useState(null);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const audit = allAudits.find(a=>a.id===activeAuditId);
  const panelWidth = 272;

  const selectAudit = id => {
    setActiveAuditId(id);
    setOpenMilestone(null);
  };

  return (
    <div className="flex flex-col bg-white overflow-hidden" style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",height:"100vh"}}>
      <header className="flex-shrink-0 border-b border-gray-200 bg-gray-50 flex items-center px-5 gap-2" style={{height:48}}>
        <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white"/>
        </div>
        <span className="font-bold text-gray-900 text-sm">AuditAI</span>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {timelineOpen && (
          <TimelineSideSheet activeAuditId={activeAuditId} onSelectAudit={selectAudit} onClose={()=>setTimelineOpen(false)}/>
        )}
        <MainPanel audit={audit} activeAuditId={activeAuditId} onSelectAudit={selectAudit}
          onOpenMilestone={setOpenMilestone} timelineOpen={timelineOpen} onToggleTimeline={()=>setTimelineOpen(o=>!o)}/>
        {openMilestone && <MilestoneDrawer milestone={openMilestone} onClose={()=>setOpenMilestone(null)}/>}
      </div>
    </div>
  );
}
