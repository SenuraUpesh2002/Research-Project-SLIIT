/* eslint-disable react/prop-types */
import styles from './UserTable.module.css';

const UserTable = ({ users }) => {
  if (!users || users.length === 0) {
    return <p>No users to display.</p>;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>ID</th>
          <th className={styles.th}>Name</th>
          <th className={styles.th}>Email</th>
          <th className={styles.th}>Role</th>
          <th className={styles.th}>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className={styles.td}>{user.id}</td>
            <td className={styles.td}>{user.name}</td>
            <td className={styles.td}>{user.email}</td>
            <td className={styles.td}>{user.role}</td>
            <td className={styles.td}>{user.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
