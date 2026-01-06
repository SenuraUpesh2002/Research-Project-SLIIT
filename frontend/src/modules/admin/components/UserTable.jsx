/* eslint-disable react/prop-types */
import styles from './UserTable.module.css';

const UserTable = ({ users, onEditUser, onDeleteUser }) => {
  if (!users || users.length === 0) {
    return <p>No users to display.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>Name</th>
          <th className={styles.th}>Email</th>
          <th className={styles.th}>Role</th>
          <th className={styles.th}>Status</th>
          <th className={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td className={styles.td}>{user.name}</td>
            <td className={styles.td}>{user.email}</td>
            <td className={styles.td}>{user.role}</td>
            <td className={styles.td}>{user.status}</td>
            <td className={styles.td}>
              <button onClick={() => onEditUser(user)} className={styles.editButton}>Edit</button>
              <button onClick={() => onDeleteUser(user._id)} className={styles.deleteButton}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
