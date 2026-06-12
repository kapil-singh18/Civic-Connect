export default function MetricCard({ icon: Icon, label, value, tone = 'blue' }) {
  const tones = {
    blue: 'text-civic-blue bg-blue-50',
    green: 'text-civic-green bg-green-50',
    amber: 'text-amber-700 bg-amber-50',
    red: 'text-red-700 bg-red-50'
  };

  return (
    <div className="metric-card">
      <div className={`icon-tile ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="metric-label">{label}</p>
        <p className="metric-value">{value}</p>
      </div>
    </div>
  );
}
