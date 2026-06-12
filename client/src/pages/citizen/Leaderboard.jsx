import { useQuery } from '@tanstack/react-query';
import { Award } from 'lucide-react';
import api from '../../services/api.js';

export default function Leaderboard() {
  const leaderboard = useQuery({ queryKey: ['leaderboard'], queryFn: async () => (await api.get('/leaderboard')).data });

  return (
    <section className="section-band">
      <div className="section-header">
        <div>
          <p className="eyebrow">Community Engagement</p>
          <h2>Contributor Leaderboard</h2>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Rank</th><th>Citizen</th><th>Reports</th><th>Points</th><th>Badge</th></tr></thead>
          <tbody>
            {(leaderboard.data || []).map((user) => (
              <tr key={user._id}>
                <td>{user.rank}</td>
                <td>{user.name}</td>
                <td>{user.reportsSubmitted}</td>
                <td>{user.points}</td>
                <td>{user.rank <= 3 ? <span className="top-badge"><Award size={16} /> Top Contributor</span> : 'Monthly Ranking'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
