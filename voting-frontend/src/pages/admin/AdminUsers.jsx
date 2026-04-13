import { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../../api/services';
import { Button, Badge, Spinner, EmptyState } from '../../components/UI';
import GalaxyBg from '../../components/GalaxyBg';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';

export default function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getUsers().then(r => setUsers(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try { await deleteUser(id); toast.success('User deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className={styles.page}><GalaxyBg /><Spinner /></div>;

  return (
    <div className={styles.page}>
      <GalaxyBg />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div className={styles.titleArea}>
            <span className={styles.pageIcon}>👥</span>
            <h1 className={styles.title}>CREW MEMBERS</h1>
            <p className={styles.sub}>Manage registered voters across the galaxy</p>
          </div>
          <Badge color="default">{users.length} TOTAL</Badge>
        </div>

        {users.length === 0 ? (
          <EmptyState icon="🌌" message="No crew members registered yet." />
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className={styles.idCell}>#{String(u.id).padStart(3,'0')}</td>
                    <td className={styles.nameCell}>{u.username}</td>
                    <td className={styles.dimCell}>{u.email || '—'}</td>
                    <td>
                      <Badge color={u.role === 'ROLE_ADMIN' ? 'completed' : 'default'}>
                        {u.role?.replace('ROLE_', '') || 'USER'}
                      </Badge>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                          DELETE
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
