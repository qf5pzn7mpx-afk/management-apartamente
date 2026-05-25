import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import mockApi from '../api/mockApi';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function InvoiceBreakdown() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const invoices = await mockApi.getInvoices();
      let paid = 0;
      let unpaid = 0;
      invoices.forEach((i) => {
        const status = (i.status || '').toString().toLowerCase();
        if (status.includes('pl') || status.includes('paid') || status.includes('plat')) paid += Number(i.suma || i.amount || 0) || 0;
        else unpaid += Number(i.suma || i.amount || 0) || 0;
      });

      setData({
        labels: ['Plătite', 'Neplătite'],
        datasets: [
          {
            data: [paid, unpaid],
            backgroundColor: ['#10b981', '#f43f5e'],
            hoverOffset: 6,
          },
        ],
      });
    }
    load();
  }, []);

  if (!data) return <div className="h-44 rounded-md bg-slate-800/40" />;

  return <Pie data={data} />;
}
