import { useState, useEffect } from 'react';
import {
  getElections, createElection, updateElection,
  deleteElection, startElection, endElection
} from '../../api/services';
import { Button, Badge, Modal, Input, Spinner, EmptyState } from '../../components/UI';
import GalaxyBg from '../../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';

const EMPTY = { name: '', title: '' };

function statusColor(s) {
  if (!s) return 'default';
  if (s.toUpperCase() === 'ACTIVE') return 'active';
  if (s.toUpperCase() === 'COMPLETED') return 'completed';
  return 'pending';
}

export default function AdminElections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);

  const load = () => {
    getElections().then(r => setElections(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (e) => { setEditTarget(e); setForm({ name: e.name || '', title: e.title || '' }); setModal(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editTarget) { await updateElection(editTarget.id, form); toast.success('Election updated'); }
      else            { await createElection(form); toast.success('Election created'); }
      setModal(false); load();
    } catch (err) {
      toast.error(err.response?.data || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this election?')) return;
    try { await deleteElection(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const handleStart = async (id) => {
    try { await startElection(id); toast.success('Election launched! 🚀'); load(); }
    catch (err) { toast.error(err.response?.data || 'Failed'); }
  };

  const handleEnd = async (id) => {
    try { await endElection(id); toast.success('Election ended'); load(); }
    catch (err) { toast.error(err.response?.data || 'Failed'); }
  };

  if (loading) return <div className={styles.page}><GalaxyBg /><Spinner /></div>;

  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <span className={styles.pageIcon}>🗳️</span>
            <h1 className={styles.title}>MANAGE ELECTIONS</h1>
            <p className={styles.sub}>Launch, manage and close galactic elections</p>
          </div>
          <Button variant="primary" onClick={openCreate}>+ NEW ELECTION</Button>
        </div>

        {elections.length === 0 ? (
          <EmptyState icon="🌌" message="No elections yet. Launch one to get started." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Title</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {elections.map(e => (
                  <tr key={e.id}>
                    <td className={styles.idCell}>#{String(e.id).padStart(3,'0')}</td>
                    <td className={styles.nameCell}>{e.name}</td>
                    <td className={styles.dimCell}>{e.title || '—'}</td>
                    <td><Badge color={statusColor(e.status)}>{e.status || 'PENDING'}</Badge></td>
                    <td>
                      <div className={styles.actions}>
                        {(!e.status || e.status.toUpperCase() === 'PENDING') && (
                          <Button variant="success" size="sm" onClick={() => handleStart(e.id)}>LAUNCH</Button>
                        )}
                        {e.status?.toUpperCase() === 'ACTIVE' && (
                          <Button variant="warning" size="sm" onClick={() => handleEnd(e.id)}>END</Button>
                        )}
                        <Button variant="secondary" size="sm" onClick={() => openEdit(e)}>EDIT</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(e.id)}>DELETE</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal open={modal} onClose={() => setModal(false)}
          title={editTarget ? 'EDIT ELECTION' : 'NEW ELECTION'}>
          <div className={styles.formStack}>
            <Input label="Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Presidential Election 2025" />
            <Input label="Title / Description" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. National Election" />
            <div className={styles.modalActions}>
              <Button variant="ghost" onClick={() => setModal(false)}>CANCEL</Button>
              <Button variant="primary" loading={saving} onClick={handleSave}>
                {editTarget ? 'SAVE CHANGES' : 'CREATE ELECTION'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
