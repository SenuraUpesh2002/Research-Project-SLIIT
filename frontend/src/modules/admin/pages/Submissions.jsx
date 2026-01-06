import { useState, useEffect } from 'react';
import apiClient from "../../../services/apiClient";
import styles from './Submissions.module.css';
import AdminSidebar from '../components/AdminSidebar';
import SubmissionTable from '../components/SubmissionTable'; // Import SubmissionTable
import { toast } from 'react-toastify'; // For notifications
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/submissions', { params: { search: searchTerm } });
      setSubmissions(response.data);
    } catch (err) {
      setError(err);
      toast.error('Failed to fetch submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [searchTerm]); // Re-fetch when searchTerm changes

  const handleDeleteSubmission = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await apiClient.delete(`/submissions/${id}`);
        toast.success('Submission deleted successfully!');
        fetchSubmissions(); // Refresh the list
      } catch (err) {
        toast.error('Failed to delete submission.');
        console.error('Delete submission error:', err);
      }
    }
  };

  const handleEditSubmission = (id) => {
    // Implement edit logic here, e.g., open a modal or navigate to an edit page
    toast.info(`Edit functionality for submission ID: ${id} is not yet implemented.`);
    console.log('Edit submission with ID:', id);
  };

  // Remove client-side filtering as it's now handled by the backend
  // const filteredSubmissions = submissions.filter(submission =>
  //   submission.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   submission.submissionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   submission.status.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  if (loading) return <div className={styles.loading}>Loading submissions...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.headerRow}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>Submissions</h1>
              <p className={styles.subtitle}>Manage all user submissions</p>
            </div>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search submissions..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.panel}>
            {submissions.length === 0 && searchTerm === '' ? (
              <p>No submissions found.</p>
            ) : submissions.length === 0 && searchTerm !== '' ? (
              <p>No submissions match your search.</p>
            ) : (
              <SubmissionTable 
                submissions={submissions} 
                onDeleteSubmission={handleDeleteSubmission}
                onEditSubmission={handleEditSubmission}
                // onViewDetails={handleViewDetails} // If you want to implement a view details function
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}