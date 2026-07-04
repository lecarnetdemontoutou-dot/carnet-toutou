"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./bingo.module.css";

type Cell = { text: string; points: number };
type BingoState = {
  cells: Cell[];
  checks: Record<number, string[]>;
  notified: boolean;
};

const ADMIN_CODE = "ORIANE2026";
const NAME_STORAGE_KEY = "oriane-bingo:name";

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function computeLeaderboard(state: BingoState) {
  const tally: Record<string, number> = {};
  Object.entries(state.checks).forEach(([idx, names]) => {
    const points = state.cells[Number(idx)]?.points ?? 0;
    names.forEach((name) => {
      tally[name] = (tally[name] ?? 0) + points;
    });
  });
  return Object.entries(tally)
    .map(([name, points]) => ({ name, points }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
}

export default function BingoPage() {
  const [state, setState] = useState<BingoState | null>(null);
  const [myName, setMyName] = useState(() =>
    typeof window === "undefined" ? "" : window.localStorage.getItem(NAME_STORAGE_KEY) ?? ""
  );
  const [tab, setTab] = useState<"grid" | "board">("grid");
  const [status, setStatus] = useState("Connexion…");
  const [editOpen, setEditOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [editCells, setEditCells] = useState<Cell[]>([]);
  const [justCheckedIndex, setJustCheckedIndex] = useState<number | null>(null);

  const confettiLayerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const notifyTriggeredRef = useRef(false);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch("/api/bingo", { cache: "no-store" });
        if (!res.ok) throw new Error("bad response");
        const data: BingoState = await res.json();
        if (!active) return;
        setState(data);
        setStatus("Synchronisé · dernière mise à jour " + new Date().toLocaleTimeString());

        const checkedCount = data.cells.filter((_, i) => (data.checks[i] ?? []).length > 0).length;
        if (checkedCount === 20 && !data.notified && !notifyTriggeredRef.current) {
          notifyTriggeredRef.current = true;
          try {
            const notifyRes = await fetch("/api/bingo/notify", { method: "POST" });
            const notifyData = await notifyRes.json();
            if (!notifyData.alreadyNotified) {
              burstConfetti();
              setStatus("🎉 Bingo complet ! Bravo à tous !");
            }
          } catch {
            // tant pis, pas de fête, pas grave
          } finally {
            notifyTriggeredRef.current = false;
          }
        }
      } catch {
        if (active) setStatus("Hors ligne, nouvel essai…");
      }
    }

    poll();
    const id = setInterval(poll, 3500);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  function handleNameChange(value: string) {
    setMyName(value);
    window.localStorage.setItem(NAME_STORAGE_KEY, value);
  }

  function burstConfetti() {
    const layer = confettiLayerRef.current;
    if (!layer) return;
    const colors = ["#f7e6ad", "#ffffff", "#4fa67a", "#faf3da"];
    for (let k = 0; k < 26; k++) {
      const c = document.createElement("div");
      c.className = styles.confetto;
      const startX = 40 + Math.random() * 20;
      c.style.left = startX + "%";
      c.style.top = "40%";
      c.style.background = colors[k % colors.length];
      const baseTransform = `translate(${(Math.random() - 0.5) * 40}px, 0) rotate(${Math.random() * 360}deg)`;
      c.style.transform = baseTransform;
      layer.appendChild(c);
      const dx = (Math.random() - 0.5) * 320;
      const dy = 120 + Math.random() * 260;
      const rot = Math.random() * 720 - 360;
      c.animate(
        [
          { transform: baseTransform, opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }
      );
      setTimeout(() => c.remove(), 1500);
    }
  }

  async function toggleCell(index: number) {
    if (!myName.trim()) {
      nameInputRef.current?.focus();
      return;
    }
    if (!state) return;

    const wasChecked = (state.checks[index] ?? []).includes(myName);

    try {
      const res = await fetch("/api/bingo/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, name: myName }),
      });
      if (!res.ok) throw new Error("failed");
      const data: BingoState = await res.json();
      setState(data);
      if (!wasChecked) {
        setJustCheckedIndex(index);
        setTimeout(() => setJustCheckedIndex((cur) => (cur === index ? null : cur)), 400);
        burstConfetti();
      }
    } catch {
      setStatus("Erreur de sauvegarde, réessayez.");
    }
  }

  function openEditPanel() {
    if (!adminUnlocked) {
      const code = window.prompt("Code admin pour accéder au tableau de personnalisation :");
      if (code !== ADMIN_CODE) {
        if (code !== null) setStatus("Code incorrect.");
        return;
      }
      setAdminUnlocked(true);
    }
    if (state) setEditCells(state.cells.map((c) => ({ ...c })));
    setEditOpen(true);
  }

  async function saveEdits() {
    try {
      const res = await fetch("/api/bingo/cells", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminCode: ADMIN_CODE, cells: editCells }),
      });
      if (!res.ok) throw new Error("failed");
      const data: BingoState = await res.json();
      setState(data);
      setStatus("Cases mises à jour pour tout le monde.");
    } catch {
      setStatus("Erreur lors de la sauvegarde des cases.");
    }
    setEditOpen(false);
  }

  async function resetChecks() {
    if (!window.confirm("Réinitialiser toutes les coches pour tout le monde ?")) return;
    try {
      const res = await fetch("/api/bingo/reset", { method: "POST" });
      const data: BingoState = await res.json();
      setState(data);
    } catch {
      setStatus("Erreur lors de la réinitialisation.");
    }
  }

  if (!state) {
    return (
      <div className={styles.page}>
        <div className={styles.wrap}>
          <p className={styles.status}>{status}</p>
        </div>
      </div>
    );
  }

  const checkedCount = state.cells.filter((_, i) => (state.checks[i] ?? []).length > 0).length;
  const pct = Math.round((checkedCount / 20) * 100);
  const editTotal = editCells.reduce((sum, c) => sum + (Number(c.points) || 0), 0);
  const ranking = computeLeaderboard(state);
  const maxPoints = ranking[0]?.points || 1;
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div className={cx(styles.deco, styles.decoLeaf)}>
          <svg viewBox="0 0 160 160" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 150 C50 120 65 95 78 62" strokeWidth={3} />
            <path d="M78 62 C70 50 55 44 38 46 C50 50 60 58 64 70 C50 64 36 64 24 72 C38 72 50 78 56 88 C44 84 32 86 22 96 C36 94 48 98 54 108" />
            <path d="M78 62 C88 52 102 48 118 52 C106 54 96 62 92 74 C104 70 118 72 128 80 C114 78 102 82 96 92 C108 90 120 96 126 106 C114 102 102 104 94 112" />
            <path d="M78 62 C76 46 80 30 90 16 M78 62 C66 50 60 34 62 16 M78 62 C82 46 96 36 112 32 M78 62 C66 56 50 54 36 60" />
          </svg>
        </div>
        <div className={cx(styles.deco, styles.decoLeaf2)}>
          <svg viewBox="0 0 140 140" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M120 130 C100 100 86 76 74 46" strokeWidth={2.8} />
            <path d="M74 46 C82 36 96 32 110 36 C98 38 88 46 84 56 C96 52 108 54 116 62 C104 60 94 64 90 72 C100 70 110 74 116 82" />
            <path d="M74 46 C66 36 52 32 38 36 C50 38 60 46 64 56 C52 52 40 54 32 62 C44 60 54 64 58 72 C48 70 38 74 32 82" />
            <path d="M74 46 C72 32 76 18 86 6" />
          </svg>
        </div>
        <div className={cx(styles.deco, styles.decoStar)}>
          <svg viewBox="0 0 60 60" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 4 L36 24 L56 30 L36 36 L30 56 L24 36 L4 30 L24 24 Z" />
          </svg>
        </div>
        <div className={cx(styles.deco, styles.decoPine)}>
          <svg viewBox="0 0 110 150" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M55 35 C45 18 35 8 22 2 M55 35 C58 16 62 6 70 0 M55 35 C50 14 50 2 50 -4" transform="translate(0,8)" />
            <ellipse cx={55} cy={100} rx={34} ry={46} />
            <path d="M30 75 q12 8 0 18 M40 65 q12 8 0 18 M50 60 q12 8 0 18 M60 65 q12 8 0 18 M70 75 q12 8 0 18 M30 105 q12 8 0 18 M50 110 q12 8 0 18 M70 105 q12 8 0 18" />
          </svg>
        </div>

        <div className={styles.header}>
          <div className={styles.eyebrow}>Bingo collaboratif</div>
          <h1 className={styles.h1}>
            Joyeux anniversaire <span>Oriane</span> 🎉
          </h1>
          <p className={styles.sub}>
            Cochez une case dès que le souvenir se produit pendant la soirée. Tout le monde voit la grille se remplir en direct !
          </p>
        </div>

        <div className={styles.namebar}>
          <label htmlFor="nameInput">Vous êtes :</label>
          <input
            id="nameInput"
            ref={nameInputRef}
            type="text"
            placeholder="Votre prénom"
            maxLength={20}
            autoComplete="off"
            value={myName}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          {myName && <span className={styles.youPill}>Vous : {myName}</span>}
        </div>

        <div className={styles.progressRow}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: pct + "%" }} />
          </div>
          <div className={styles.progressLabel}>{checkedCount} / 20 cochées</div>
        </div>

        <div className={styles.toolbar} style={{ marginBottom: 16 }}>
          <button className={cx(styles.btn, tab === "grid" && styles.btnPrimary)} onClick={() => setTab("grid")}>
            🔲 Grille
          </button>
          <button className={cx(styles.btn, tab === "board" && styles.btnPrimary)} onClick={() => setTab("board")}>
            🏆 Classement
          </button>
        </div>

        {tab === "grid" && (
          <div className={styles.grid}>
            {state.cells.map((cellData, i) => {
              const checkers = state.checks[i] ?? [];
              const isChecked = checkers.length > 0;
              return (
                <div
                  key={i}
                  className={cx(styles.cell, isChecked && styles.checked, justCheckedIndex === i && styles.justChecked)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isChecked}
                  onClick={() => toggleCell(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleCell(i);
                    }
                  }}
                >
                  <div className={styles.cellTop}>
                    <div className={styles.cellNum}>{String(i + 1).padStart(2, "0")}</div>
                    <div className={styles.cellPoints}>{cellData.points} pts</div>
                  </div>
                  <div className={styles.cellText}>{cellData.text}</div>
                  <div className={styles.cellCheckers}>
                    {checkers.map((n) => (
                      <span key={n} className={styles.chip}>
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "board" && (
          <div className={styles.leaderboard}>
            {ranking.length === 0 ? (
              <div className={styles.lbEmpty}>
                Personne n&apos;a encore coché de case. Le concours commence dès la première coche !
              </div>
            ) : (
              ranking.map((entry, i) => (
                <div
                  key={entry.name}
                  className={cx(
                    styles.lbRow,
                    i === 0 && styles.lbRowRank1,
                    i === 1 && styles.lbRowRank2,
                    i === 2 && styles.lbRowRank3
                  )}
                >
                  <div className={styles.lbRank}>#{i + 1}</div>
                  <div className={styles.lbMedal}>{i < 3 ? medals[i] : ""}</div>
                  <div className={cx(styles.lbName, entry.name === myName && styles.lbNameIsMe)}>{entry.name}</div>
                  <div className={styles.lbBarTrack}>
                    <div className={styles.lbBarFill} style={{ width: Math.round((entry.points / maxPoints) * 100) + "%" }} />
                  </div>
                  <div className={styles.lbCount}>{entry.points} pts</div>
                </div>
              ))
            )}
          </div>
        )}

        <div className={styles.toolbar}>
          <button className={styles.btn} onClick={openEditPanel}>
            🛠️ Tableau admin
          </button>
          <button className={styles.btn} onClick={resetChecks}>
            ↺ Réinitialiser les coches
          </button>
        </div>

        <div className={cx(styles.editPanel, editOpen && styles.editPanelOpen)}>
          <h3>Tableau admin — cases &amp; points</h3>
          <p className={styles.editHint}>
            Modifie le texte et les points de chaque case. Le total de points possibles est recalculé automatiquement.
          </p>
          <div className={styles.editTable}>
            <div className={styles.editTableHead}>
              <span>#</span>
              <span>Texte du souvenir</span>
              <span>Points</span>
            </div>
            <div>
              {editCells.map((c, i) => (
                <div key={i} className={styles.editRow}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <input
                    value={c.text}
                    onChange={(e) => {
                      const next = editCells.slice();
                      next[i] = { ...next[i], text: e.target.value };
                      setEditCells(next);
                    }}
                  />
                  <input
                    type="number"
                    min={0}
                    step={5}
                    className={styles.editPoints}
                    value={c.points}
                    onChange={(e) => {
                      const next = editCells.slice();
                      next[i] = { ...next[i], points: Number(e.target.value) || 0 };
                      setEditCells(next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.editTotal}>
            Total possible : <strong>{editTotal} pts</strong> sur 20 cases
          </div>
          <div className={styles.editActions}>
            <button className={styles.btn} onClick={() => setEditOpen(false)}>
              Annuler
            </button>
            <button className={cx(styles.btn, styles.btnPrimary)} onClick={saveEdits}>
              Enregistrer pour tout le monde
            </button>
          </div>
        </div>

        <p className={styles.status}>{status}</p>
        <div className={styles.footer}>Fait avec 💛 pour la soirée d&apos;Oriane</div>
      </div>

      <div ref={confettiLayerRef} className={styles.confettiLayer} />
    </div>
  );
}
