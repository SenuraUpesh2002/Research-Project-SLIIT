/* eslint-disable react/prop-types */
const UserTable = ({ users }) => {
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  };

  const thStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  };

  if (!users || users.length === 0) {
    return <p>No users to display.</p>;
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Role</th>
          <th style={thStyle}>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td style={tdStyle}>{user.id}</td>
            <td style={tdStyle}>{user.name}</td>
            <td style={tdStyle}>{user.email}</td>
            <td style={tdStyle}>{user.role}</td>
            <td style={tdStyle}>{user.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
