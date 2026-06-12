import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../../services/api.js';

const colors = ['#1565C0', '#2E7D32', '#FF9800', '#F44336', '#607D8B', '#6D4C41'];

export default function AnalyticsPage() {
  const analytics = useQuery({ queryKey: ['analytics'], queryFn: async () => (await api.get('/analytics')).data });
  const data = analytics.data || {};
  const categoryData = (data.byCategory || []).map((item) => ({ name: item._id, count: item.count }));
  const departmentData = (data.byDepartment || []).map((item) => ({ name: item._id, count: item.count }));

  return (
    <div className="analytics-grid">
      <section className="section-band chart-panel">
        <div className="section-header"><div><p className="eyebrow">Analytics</p><h2>Issues by Category</h2></div></div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={categoryData} dataKey="count" nameKey="name" outerRadius={105} label>
              {categoryData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip /><Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section className="section-band chart-panel">
        <div className="section-header"><div><p className="eyebrow">Performance</p><h2>Department Workload</h2></div></div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis allowDecimals={false} />
            <Tooltip /><Legend />
            <Bar dataKey="count" fill="#1565C0" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
