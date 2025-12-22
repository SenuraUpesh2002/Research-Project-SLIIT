import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from "../../../constants/api";
import styles from './Users.module.css';
import UserTable from '../components/UserTable'; // Assuming this path

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.USERS.GET_ALL, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.statusText}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError('Failed to load users.');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className={styles.container}>Loading users...</div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>User Management</h1>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        <select value={filterRole} onChange={handleFilterChange} className={styles.filterSelect}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>
      <UserTable users={filteredUsers} />
    </div>
  );
};

export default Users;
