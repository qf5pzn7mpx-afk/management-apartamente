import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MaintenanceChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch('https://management-apartamente-api.onrender.com/api/mentenanta', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const items = await response.json();
          const counts = {};
          
          items.forEach((it) => {
            const s = it.status || 'Nouă'; // Default pentru baza de date
            counts[s] = (counts[s] || 0) + 1;
          });

          const labels = Object.keys(counts);
          const vals = labels.map((l) => counts[l]);
          
          setData({ 
            labels, 
            datasets: [{ label: 'Cereri', data: vals, backgroundColor: '#f59e0b' }] 
          });
        }
      } catch (error) {
         console.error('Error loading maintenance data:', error);
      }
    }
    load();
  }, []);

  if (!data) return <div className="h-44 rounded-md bg-slate-800/40" />;

  const options = { responsive: true, plugins: { legend: { display: false } } };
  return <Bar data={data} options={options} />;
}