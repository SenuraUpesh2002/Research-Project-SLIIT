import { useState, useEffect, useCallback } from 'react';
import apiClient from "../../../services/apiClient";
import styles from './Users.module.css';
import AdminSidebar from '../components/AdminSidebar';
import UserTable from '../components/UserTable'; // Import UserTable
import { toast } from 'react-toastify'; // Import toast

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      toast.error("Failed to fetch users.");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiClient.delete(`/users/${userId}`);
        toast.success("User deleted successfully!");
        fetchUsers(); // Refresh the list
      } catch (err) {
        toast.error("Failed to delete user.");
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleEditUser = (user) => {
    // Placeholder for edit functionality
    toast.info(`Editing user: ${user.name}`);
    console.log("Edit user:", user);
    // In a real application, this would open a modal or navigate to an edit page
  };

  const handleCreateUser = () => {
    toast.info("Create new user functionality not yet implemented.");
    console.log("Create new user");
    // In a real application, this would open a modal or navigate to a create user page
  };

  if (loading) return <div className={styles.loading}>Loading users...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>Users</h1>
              <p className={styles.subtitle}>Manage all registered users</p>
            </div>
            <button onClick={handleCreateUser} className={styles.createButton}>
              Create New User
            </button>
          </div>

          <div className={styles.panel}>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <UserTable
                users={users}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}