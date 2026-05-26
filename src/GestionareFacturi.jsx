import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import mockApi from './api/mockApi';

function GestionareFacturi() {
  const [facturi, setFacturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eroare, setEroare] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [paginaCurenta, setPaginaCurenta] = useState(1);
  const facturiPerPagina = 5;

  useEffect(() => {
    mockApi
      .getInvoices()
      .then((data) => {
        if (Array.isArray(data)) {
          setFacturi(data);
        } else {
          setEroare('Format date invalid.');
        }
      })
      .catch(() => {
        setEroare('Nu pot încărca facturile.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const facturiFiltrate = facturi.filter((factura) => {
    const matchesSearch =
      factura.chirias_nume
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      factura.id?.toString().includes(searchTerm);

    const matchesStatus = statusFilter
      ? factura.status === statusFilter
      : true;

    const dataFactura = factura.data_emiterii
      ? new Date(factura.data_emiterii)
      : null;

    const matchesStart =
      startDate && dataFactura
        ? dataFactura >= new Date(startDate)
        : true;

    const matchesEnd =
      endDate && dataFactura
        ? dataFactura <= new Date(endDate)
        : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesStart &&
      matchesEnd
    );
  });

  const indexUltimaFactura =
    paginaCurenta * facturiPerPagina;

  const indexPrimaFactura =
    indexUltimaFactura - facturiPerPagina;

  const facturiCurente = facturiFiltrate.slice(
    indexPrimaFactura,
    indexUltimaFactura
  );

  const totalPagini = Math.ceil(
    facturiFiltrate.length / facturiPerPagina
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 rounded-[32px] border border-slate-800 bg-slate-900 p-8 shadow-2xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
                  Gestionare Facturi
                </p>

                <h1 className="mt-3 text-4xl font-bold text-white">
                  Facturi și plăți
                </h1>

                <p className="mt-4 max-w-2xl text-slate-400">
                  Caută, filtrează și administrează toate
                  facturile chiriașilor într-un singur loc.
                </p>
              </div>

              <Link
                to="/adauga-factura"
                className="inline-flex items-center justify-center rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-bold text-black transition hover:scale-105"
              >
                + Adaugă Factură
              </Link>
            </div>
          </div>

          <div className="mb-8 grid gap-4 rounded-[32px] border border-slate-800 bg-slate-900 p-6 md:grid-cols-4">

            <input
              type="text"
              placeholder="Caută chiriaș sau ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPaginaCurenta(1);
              }}
              className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPaginaCurenta(1);
              }}
              className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              <option value="">Toate statusurile</option>
              <option value="Plătită">Plătită</option>
              <option value="Neplătită">Neplătită</option>
              <option value="În așteptare">În așteptare</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPaginaCurenta(1);
              }}
              className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPaginaCurenta(1);
              }}
              className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-yellow-400"
            />
          </div>

          {eroare && (
            <div className="mb-6 rounded-2xl border border-red-500 bg-red-500/10 px-5 py-4 text-red-300">
              {eroare}
            </div>
          )}

          <div className="rounded-[32px] border border-slate-800 bg-slate-900 p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Lista Facturilor
                </h2>

                <p className="mt-1 text-slate-400">
                  {facturiFiltrate.length} facturi găsite
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400">
                Se încarcă facturile...
              </div>
            ) : facturiCurente.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-800/50 p-12 text-center text-slate-400">
                Nu există facturi.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="px-4 py-4 text-sm font-semibold text-slate-300">
                        Factură
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-slate-300">
                        Chiriaș
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-slate-300">
                        Sumă
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-slate-300">
                        Emisă
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-slate-300">
                        Scadență
                      </th>

                      <th className="px-4 py-4 text-sm font-semibold text-slate-300">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {facturiCurente.map((factura) => (
                      <tr
                        key={factura.id}
                        className="border-b border-slate-800 transition hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-5 text-white">
                          #{factura.id}
                        </td>

                        <td className="px-4 py-5 text-slate-300">
                          {factura.chirias_nume || '—'}
                        </td>

                        <td className="px-4 py-5 font-semibold text-yellow-400">
                          {factura.suma || 0} RON
                        </td>

                        <td className="px-4 py-5 text-slate-300">
                          {factura.data_emiterii || '—'}
                        </td>

                        <td className="px-4 py-5 text-slate-300">
                          {factura.data_scadentei || '—'}
                        </td>

                        <td className="px-4 py-5">
                          <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                            {factura.status || 'Neplătită'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPagini > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">

                {Array.from(
                  { length: totalPagini },
                  (_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setPaginaCurenta(index + 1)
                      }
                      className={`h-11 w-11 rounded-xl font-semibold transition ${
                        paginaCurenta === index + 1
                          ? 'bg-yellow-400 text-black'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionareFacturi;