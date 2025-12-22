/* eslint-disable react/prop-types */
import styles from './SubmissionTable.module.css';

const SubmissionTable = ({ submissions, onViewDetails, onEditSubmission, onDeleteSubmission }) => {
  // Log first submission to see data structure
  if (submissions && submissions.length > 0) {
    console.log('First submission data:', JSON.stringify(submissions[0], null, 2));
    console.log('Available fields:', Object.keys(submissions[0]));
    console.log('Name field:', submissions[0].name);
    console.log('User field:', submissions[0].user);
    console.log('Email field:', submissions[0].email);
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
    if (typeof value === 'object' && value !== null && value.name) return value.name;
    if (typeof value === 'object' && value !== null && value.email) return value.email;
    return String(value || 'N/A');
  };

  if (!submissions || submissions.length === 0) {
    return <p>No submissions to display.</p>;
  }

  // Count submissions per user using user_id as the unique identifier
  const submissionCountByUser = {};
  submissions.forEach(submission => {
    const userId = submission.user_id; // Use user_id as the primary identifier
    if (userId) {
      submissionCountByUser[userId] = (submissionCountByUser[userId] || 0) + 1;
    }
  });
  
  console.log('Submission count by user:', submissionCountByUser);

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
            const userId = submission.user_id;
            const submissionCount = submissionCountByUser[userId] || 0;
            
            return (
              <tr key={submission.id || Math.random()}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{SafeString(submission.name || submission.user)}</div>
                    <div className={styles.userEmail}>{SafeString(submission.email)}</div>
                  </div>
                </td>
                <td>{SafeString(submission.station || submission.stationName || 'N/A')}</td>
                <td>
                  <span className={styles.typeTag}>
                    {SafeString(submission.submissionType || submission.submission_type || submission.formType || submission.type || submission.vehicleType || 'N/A')}
                  </span>
                </td>
                <td>{formatDate(submission.date || submission.createdAt)}</td>
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
