/* eslint-disable react/prop-types */
import styles from './SubmissionTable.module.css';

const SubmissionTable = ({ submissions, onViewDetails, onEditSubmission, onDeleteSubmission }) => {
  // Log first submission to see data structure
  if (submissions && submissions.length > 0) {
    console.log('First submission data:', JSON.stringify(submissions[0], null, 2));
    console.log('Available fields:', Object.keys(submissions[0]));
    console.log('User name field:', submissions[0].user_name); // Log user_name
    console.log('Station name field:', submissions[0].station_name); // Log station_name
  }

  const getStatusColor = (status) => {
    const statusLower = String(status || '').toLowerCase();
    if (statusLower.includes('completed')) return '#10B981';
    if (statusLower.includes('pending')) return '#F59E0B';
    if (statusLower.includes('contacted')) return '#3B82F6';
    return '#9CA3AF';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  const SafeString = (value) => {
    if (typeof value === 'string') return value;
    return String(value || 'N/A');
  };

  if (!submissions || submissions.length === 0) {
    return <p>No submissions to display.</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Station</th>
            <th>Type</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            return (
              <tr key={submission.id}> {/* Use submission.id for key */}
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{SafeString(submission.user_name)}</div>
                    {/* Assuming user_email might be available in submission.data or directly */}
                    {/* <div className={styles.userEmail}>{SafeString(submission.user_email)}</div> */}
                  </div>
                </td>
                <td>{SafeString(submission.station_name)}</td>
                <td>
                  <span className={styles.typeTag}>
                    {SafeString(submission.submission_type)}
                  </span>
                </td>
                <td>{formatDate(submission.createdAt)}</td>
                <td>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(submission.status) }}
                  >
                    {SafeString(submission.status || 'pending')}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => onViewDetails && onViewDetails(submission.id)}
                      title="View"
                    >
                      👁️
                    </button>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => onEditSubmission && onEditSubmission(submission.id)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => onDeleteSubmission && onDeleteSubmission(submission.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionTable;