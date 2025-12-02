/* eslint-disable react/prop-types */
const SubmissionTable = ({ submissions }) => {
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

  if (!submissions || submissions.length === 0) {
    return <p>No submissions to display.</p>;
  }

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>User</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Status</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr key={submission.id}>
            <td style={tdStyle}>{submission.id}</td>
            <td style={tdStyle}>{submission.user}</td>
            <td style={tdStyle}>{submission.type}</td>
            <td style={tdStyle}>{submission.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubmissionTable;
