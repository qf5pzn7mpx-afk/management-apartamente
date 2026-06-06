import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function lastNMonths(n = 6) {
  const res = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
    res.push(dt.toLocaleString('default', { month: 'short', year: 'numeric' }));
  }
  return res;
}

export default function RevenueChart({ months = 6 }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch('https://management-apartamente-api.onrender.com/api/facturi', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const invoices = await response.json();
          const labels = lastNMonths(months);
          const map = new Map(labels.map((l) => [l, 0]));

          invoices.forEach((inv) => {
            const dateStr = inv.data_emiterii || inv.data || inv.created_at || inv.date || '';
            const d = dateStr ? new Date(dateStr) : null;
            const key = d ? d.toLocaleString('default', { month: 'short', year: 'numeric' }) : labels[labels.length - 1];
            
            if (!map.has(key)) return;
            const value = Number(inv.suma || inv.amount || inv.amount_due || 0) || 0;
            map.set(key, map.get(key) + value);
          });

          setData({
            labels: Array.from(map.keys()),
            datasets: [
              {
                label: 'Venit lunar (RON)',
                data: Array.from(map.values()),
                fill: true,
                backgroundColor: 'rgba(99,102,241,0.12)',
                borderColor: 'rgba(99,102,241,0.9)',
                tension: 0.3,
                pointRadius: 3,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error loading revenue data:', error);
      }
    }

    load();
  }, [months]);

  if (!data) return <div className="h-44 rounded-md bg-slate-800/40" />;

  const options = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.03)' } } },
  };

  return <Line data={data} options={options} />;
}