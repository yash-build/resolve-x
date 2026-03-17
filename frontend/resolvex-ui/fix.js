const fs = require('fs');

const code = `import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { classifyIssue } from "../services/ai/issueClassifier";
import { detectDuplicateIssues } from "../services/ai/duplicateDetection";
import { notifyIssueCreated } from "../services/notificationService";

const CATS = [
  { value: "Hostel", committee: "Hostel Committee" },
  { value: "Food", committee: "Mess Committee" },
  { value: "Hygiene", committee: "Sanitation Committee" },
  { value: "Infrastructure", committee: "Maintenance Committee" },
  { value: "Discipline", committee: "Disciplinary Committee" },
];

const CMAP = {
  Hostel: "Hostel Committee",
  Food: "Mess Committee",
  Hygiene: "Sanitation Committee",
  Infrastructure: "Maintenance Committee",
  Discipline: "Disciplinary Committee",
};

const SCFG = {
  1: { label: "Low", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  2: { label: "Medium", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  3: { label: "High", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  4: { label: "Critical", cls: "bg-red-50 text-red-700 border-red-200" },
};

function getSeverity(text) {
  const t = text.toLowerCase();
  if (["urgent","emergency","dangerous","critical","ragging","harassment","no water","no power"].some(k => t.includes(k))) return 4;
  if (["broken","damage","repair","bad","poor","dirty","smell","problem"].some(k => t.includes(k))) return 3;
  if (["suggestion","minor","small","wish"].some(k => t.includes(k))) return 1;
  return 2;
}

function getConf(desc, cat) {
  const kw = {
    Food: ["food","mess","meal","canteen","lunch","dinner","taste"],
    Hostel: ["hostel","room","fan","bed","light","electricity"],
    Infrastructure: ["classroom","bench","projector","building","ceiling"],
    Hygiene: ["dirty","garbage","smell","toilet","washroom","sanitation"],
    Discipline: ["fight","noise","harassment","bullying","violation"],
  };
  const hits = (kw[cat] || []).filter(k => desc.toLowerCase().includes(k)).length;
  return Math.min(40 + hits * 12, 95);
}

function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("");
  const [committee, setCommittee] = useState("");
  const [sev, setSev] = useState(null);
  const [conf, setConf] = useState(null);
  const [aiUsed, setAiUsed] = useState(false);
  const [existing, setExisting] = useState([]);
  const [dups, setDups] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [doneCommittee, setDoneCommittee] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    getDocs(collection(db, "issues"))
      .then(s => setExisting(s.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!title.trim()) { setDups([]); return; }
    setDups(detectDuplicateIssues(title, existing));
  }, [title, existing]);

  function aiSuggest() {
    if (!desc.trim()) return;
    const r = classifyIssue(desc);
    setCat(r.category);
    setCommittee(r.committee);
    setSev(getSeverity(desc));
    setConf(getConf(desc, r.category));
    setAiUsed(true);
  }

  function selectCat(v) {
    setCat(v);
    setCommittee(CMAP[v]);
    setAiUsed(false);
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!title.trim() || !desc.trim()) { setErr("Title and description required."); return; }
    if (!cat) { setErr("Please select a category."); return; }
    setBusy(true);
    try {
      await addDoc(collection(db, "issues"), {
        title: title.trim(),
        description: desc.trim(),
        category: cat,
        assignedCommittee: committee,
        severity: sev || 2,
        aiConfidence: conf || null,
        images: [],
        createdBy: user.uid,
        createdByName: user.displayName || user.email,
        status: "pending",
        upvotes: 0,
        voters: [],
        createdAt: serverTimestamp(),
      });
      await notifyIssueCreated({ userId: user.uid, title: title.trim() });
      setDoneCommittee(committee);
      setDone(true);
    } catch (e) {
      console.error(e);
      setErr("Failed to submit. Try again.");
    }
    setBusy(false);
  }

  function reset() {
    setTitle("");
    setDesc("");
    setCat("");
    setCommittee("");
    setSev(null);
    setConf(null);
    setAiUsed(false);
    setDups([]);
    setErr("");
    setDone(false);
    setDoneCommittee("");
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Issue Reported</h2>
          <p className="text-sm text-gray-500 mb-1">Routed to:</p>
          <p className="text-sm font-semibold text-indigo-700 mb-6">{doneCommittee}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Report another
            </button>
            <button
              onClick={() => navigate("/feed")}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/student")}
            className="text-sm text-indigo-600 hover:underline inline-block mb-3"
          >
            Back to dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Report a Campus Issue</h1>
          <p className="text-sm text-gray-500 mt-1">
            Describe the problem and let AI route it to the right committee.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Broken fan in hostel room 204"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {dups.length > 0 && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-700 mb-1">Similar issues already reported:</p>
                <ul className="space-y-1">
                  {dups.map(i => (
                    <li key={i.id} className="text-xs text-amber-700">{i.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              rows={5}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <button
              type="button"
              onClick={aiSuggest}
              disabled={!desc.trim()}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suggest Category with AI
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">Category *</label>
            {aiUsed && cat && (
              <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 mb-0.5">AI Suggestion</p>
                  <p className="text-sm font-semibold text-indigo-900">{cat} to {committee}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {sev && (
                    <span className={"inline-block text-xs font-medium px-2 py-0.5 rounded border " + SCFG[sev].cls}>
                      {SCFG[sev].label} severity
                    </span>
                  )}
                  {conf && (
                    <p className="text-xs text-indigo-400 mt-1">{conf}% confidence</p>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {CATS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => selectCat(c.value)}
                  className={"px-4 py-2 rounded-lg text-sm font-medium border transition-colors " + (cat === c.value ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600")}
                >
                  {c.value}
                </button>
              ))}
            </div>
            {cat && (
              <p className="mt-3 text-xs text-gray-500">
                Routed to: <span className="font-medium text-gray-700">{committee}</span>
              </p>
            )}
          </div>
          {err && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{err}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {busy ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            {busy ? "Submitting..." : "Submit Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;
`;

fs.writeFileSync('src/pages/ReportIssue.js', code);
console.log('Done. Lines:', code.split('\n').length);
