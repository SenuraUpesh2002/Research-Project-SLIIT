import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from "../../../../constants/api";
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
        // In a real application, you would call a user service here
        // const data = await userService.getUsers();
        
        // Mock data for now
        const mockUsers = [
          { id: 'user1', name: 'Alice Smith', email: 'alice@example.com', role: 'admin', status: 'active' },
          { id: 'user2', name: 'Bob Johnson', email: 'bob@example.com', role: 'user', status: 'active' },
          { id: 'user3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', status: 'inactive' },
          { id: 'user4', name: 'Diana Prince', email: 'diana@example.com', role: 'admin', status: 'active' },
        ];
        setUsers(mockUsers);
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
