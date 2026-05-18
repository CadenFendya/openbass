export function ActivityRing({ score }: { score: number }) {
  return <div className="activity-ring" style={{ background: `conic-gradient(rgba(67, 241, 180, .95) ${score * 3.6}deg, rgba(255,255,255,.08) 0deg)` }}>
    <div><strong>{score}</strong><span>/100</span></div>
  </div>;
}
