import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import mockApi from '../api/mockApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MaintenanceChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const items = await mockApi.getMaintenance();
      const counts = {};
      items.forEach((it) => {
        const s = it.status || 'Necunoscut';
        counts[s] = (counts[s] || 0) + 1;
      });

      const labels = Object.keys(counts);
      const vals = labels.map((l) => counts[l]);
      setData({ labels, datasets: [{ label: 'Cereri', data: vals, backgroundColor: '#f59e0b' }] });
    }
    load();
  }, []);

  if (!data) return <div className="h-44 rounded-md bg-slate-800/40" />;

  const options = { responsive: true, plugins: { legend: { display: false } } };
  return <Bar data={data} options={options} />;
}
