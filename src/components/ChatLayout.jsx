import React, { Suspense } from 'react';
import ProgressDashboard from './ProgressDashboard';
import ChatInterface from './ChatInterface';
const KrishnaInteractionPanel = React.lazy(() => import('./KrishnaInteractionPanel'));

export default function ChatLayout() {
  return (
    <div className="pt-20 min-h-[calc(100vh-5rem)] px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-28">
            <ProgressDashboard />
          </div>
        </aside>
        <main className="col-span-12 lg:col-span-6">
          <ChatInterface />
        </main>
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-28">
            <Suspense fallback={<div className="bg-white/5 rounded-xl p-4 text-white">Loading Krishna...</div>}>
              <KrishnaInteractionPanel />
            </Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}
