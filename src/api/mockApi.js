import tenantsSeed from '../mocks/tenants';
import invoicesSeed from '../mocks/invoices';
import documentsSeed from '../mocks/documents';
import maintenanceSeed from '../mocks/maintenance';

const KEYS = {
  TENANTS: 'mock.tenants',
  INVOICES: 'mock.invoices',
  DOCUMENTS: 'mock.documents',
  MAINTENANCE: 'mock.maintenance',
};

function loadOrSeed(key, seed) {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed.slice();
}

export function initMock() {
  loadOrSeed(KEYS.TENANTS, tenantsSeed);
  loadOrSeed(KEYS.INVOICES, invoicesSeed);
  loadOrSeed(KEYS.DOCUMENTS, documentsSeed);
  loadOrSeed(KEYS.MAINTENANCE, maintenanceSeed);
}

// Tenants
export async function getTenants() {
  return Promise.resolve(loadOrSeed(KEYS.TENANTS, tenantsSeed));
}

export async function getTenant(id) {
  const list = loadOrSeed(KEYS.TENANTS, tenantsSeed);
  return Promise.resolve(list.find((t) => String(t.id) === String(id)) || null);
}

export async function addTenant(data) {
  const list = loadOrSeed(KEYS.TENANTS, tenantsSeed);
  const next = { id: Date.now(), ...data };
  list.unshift(next);
  localStorage.setItem(KEYS.TENANTS, JSON.stringify(list));
  return Promise.resolve(next);
}

export async function deleteTenant(id) {
  let list = loadOrSeed(KEYS.TENANTS, tenantsSeed);
  list = list.filter((t) => String(t.id) !== String(id));
  localStorage.setItem(KEYS.TENANTS, JSON.stringify(list));
  return Promise.resolve({ success: true });
}

// Invoices
export async function getInvoices(filter = {}) {
  const list = loadOrSeed(KEYS.INVOICES, invoicesSeed);
  if (filter.tenantId) return Promise.resolve(list.filter((i) => String(i.tenantId) === String(filter.tenantId)));
  return Promise.resolve(list);
}

export async function addInvoice(data) {
  const list = loadOrSeed(KEYS.INVOICES, invoicesSeed);
  const next = { id: Date.now(), ...data };
  list.unshift(next);
  localStorage.setItem(KEYS.INVOICES, JSON.stringify(list));
  return Promise.resolve(next);
}

// Documents
export async function getDocuments(filter = {}) {
  const list = loadOrSeed(KEYS.DOCUMENTS, documentsSeed);
  if (filter.tenantId) return Promise.resolve(list.filter((d) => String(d.tenantId) === String(filter.tenantId)));
  return Promise.resolve(list);
}

export async function addDocument(data) {
  const list = loadOrSeed(KEYS.DOCUMENTS, documentsSeed);
  const next = { id: Date.now(), ...data };
  list.unshift(next);
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(list));
  return Promise.resolve(next);
}

export async function deleteDocument(id) {
  let list = loadOrSeed(KEYS.DOCUMENTS, documentsSeed);
  list = list.filter((d) => String(d.id) !== String(id));
  localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(list));
  return Promise.resolve({ success: true });
}

// Maintenance
export async function getMaintenance(filter = {}) {
  const list = loadOrSeed(KEYS.MAINTENANCE, maintenanceSeed);
  if (filter.tenantId) return Promise.resolve(list.filter((m) => String(m.tenantId) === String(filter.tenantId)));
  return Promise.resolve(list);
}

export async function addMaintenance(data) {
  const list = loadOrSeed(KEYS.MAINTENANCE, maintenanceSeed);
  const next = { id: Date.now(), ...data };
  list.unshift(next);
  localStorage.setItem(KEYS.MAINTENANCE, JSON.stringify(list));
  return Promise.resolve(next);
}

export async function updateMaintenanceStatus(id, status) {
  const list = loadOrSeed(KEYS.MAINTENANCE, maintenanceSeed);
  const idx = list.findIndex((m) => String(m.id) === String(id));
  if (idx === -1) return Promise.resolve(null);
  list[idx] = { ...list[idx], status };
  localStorage.setItem(KEYS.MAINTENANCE, JSON.stringify(list));
  return Promise.resolve(list[idx]);
}

export default {
  initMock,
  getTenants,
  getTenant,
  addTenant,
  deleteTenant,
  getInvoices,
  addInvoice,
  getDocuments,
  addDocument,
  deleteDocument,
  getMaintenance,
  addMaintenance,
  updateMaintenanceStatus,
};
