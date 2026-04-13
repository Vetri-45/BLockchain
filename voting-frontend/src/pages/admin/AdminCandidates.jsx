import { useState, useEffect } from 'react';
import {
  getCandidates, getElections, createCandidate,
  updateCandidate, deleteCandidate
} from '../../api/services';
import { Button, Badge, Modal, Input, Select, Spinner, EmptyState } from '../../components/UI';
import GalaxyBg from '../../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';

const EMPTY = { name: '', party: '', election: { id: '' } };

export default function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);

  const load = () => {
    Promise.all([getCandidates(), getElections()])
      .then(([cRes, eRes]) => { setCandidates(cRes.data); setElections(eRes.data); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditTarget(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (c) => {
    setEditTarget(c);
    setForm({ name: c.name || '', party: c.party || '', election: { id: c.election?.id || '' } });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.election.id) { toast.error('Please select an election'); return; }
    setSaving(true);
    try {
      const payload = { ...form, election: { id: Number(form.election.id) } };
      if (editTarget) { await updateCandidate(editTarget.id, payload); toast.success('Candidate updated'); }
      else            { await createCandidate(payload); toast.success('Candidate added'); }
      setModal(false); load();
    } catch (err) {
      toast.error(err.response?.data || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this candidate?')) return;
    try { await deleteCandidate(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className={styles.page}><GalaxyBg /><Spinner /></div>;

  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <span className={styles.pageIcon}>👤</span>
            <h1 className={styles.title}>MANAGE CANDIDATES</h1>
            <p className={styles.sub}>Register crew members for each election</p>
          </div>
          <Button variant="primary" onClick={openCreate}>+ ADD CANDIDATE</Button>
        </div>

        {candidates.length === 0 ? (
          <EmptyState icon="🌌" message="No candidates registered yet." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Party</th><th>Election</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr key={c.id}>
                    <td className={styles.idCell}>#{String(c.id).padStart(3,'0')}</td>
                    <td className={styles.nameCell}>{c.name}</td>
                    <td className={styles.dimCell}>{c.party || '—'}</td>
                    <td>
                      <span className={styles.electionTag}>
                        {c.election?.name || `Election #${c.election?.id}`}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button variant="secondary" size="sm" onClick={() => openEdit(c)}>EDIT</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>DELETE</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal open={modal} onClose={() => setModal(false)}
          title={editTarget ? 'EDIT CANDIDATE' : 'NEW CANDIDATE'}>
          <div className={styles.formStack}>
            <Input label="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Candidate name" />
            <Input label="Party" value={form.party}
              onChange={e => setForm({ ...form, party: e.target.value })}
              placeholder="Party name (optional)" />
            <Select label="Election" value={form.election.id}
              onChange={e => setForm({ ...form, election: { id: e.target.value } })}>
              <option value="">Select an election</option>
              {elections.map(e => (
                <option key={e.id} value={e.id}>{e.name || e.title} (#{e.id})</option>
              ))}
            </Select>
            <div className={styles.modalActions}>
              <Button variant="ghost" onClick={() => setModal(false)}>CANCEL</Button>
              <Button variant="primary" loading={saving} onClick={handleSave}>
                {editTarget ? 'SAVE CHANGES' : 'ADD CANDIDATE'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
