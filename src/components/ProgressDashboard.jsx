import React, { useState } from 'react';

const mock = {
  score: 76,
  streak: 5,
  milestones: [
    { id: 1, title: '5-day streak', achieved: true },
    { id: 2, title: 'First Time Capsule', achieved: false },
  ],
  sessions: [
    { id: 1, date: '2025-09-12', summary: 'Talked about stress at work' },
    { id: 2, date: '2025-09-14', summary: 'Explored gratitude' },
  ],
};

export default function ProgressDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const { score, streak, milestones, sessions } = mock;
  return (
    <div className="bg-white/5 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg mb-2">Progress Dashboard</h3>
        <button onClick={() => setCollapsed((c) => !c)} className="text-sm bg-white/10 px-2 py-1 rounded">
          {collapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
      {collapsed ? (
        <div className="text-sm text-white/80 py-4">Collapsed — expand to view details</div>
      ) : (
        <>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-extrabold">{score}%</div>
            <div className="text-sm text-white/80">Emotional balance score</div>
          </div>
          <div className="w-24 h-24 flex items-center justify-center bg-white/10 rounded-full">
            <div className="text-xl">{streak}🔥</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Milestones</h4>
        <ul className="mt-2">
          {milestones.map((m) => (
            <li key={m.id} className={`py-1 ${m.achieved ? 'text-gold-200' : 'text-white/70'}`}>
              {m.title} {m.achieved ? '✓' : ''}
            </li>
          ))}
        </ul>
      </div>

          <div>
            <h4 className="font-semibold">Recent Sessions</h4>
            <ul className="mt-2 text-sm text-white/80">
              {sessions.map((s) => (
                <li key={s.id} className="py-1 border-b border-white/5">{s.date} — {s.summary}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
