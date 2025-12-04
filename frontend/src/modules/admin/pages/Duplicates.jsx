import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from "../../../../constants/api";
import styles from './Duplicates.module.css';

const Duplicates = () => {
  const [duplicateSubmissions, setDuplicateSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuplicates, setSelectedDuplicates] = useState(new Set());

  useEffect(() => {
    // Placeholder for fetching duplicate submissions from an API
    const fetchDuplicates = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SUBMISSIONS.GET_ALL, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch submissions: ${response.statusText}`);
        }
        const allSubmissions = await response.json();

        // Simple client-side duplicate detection based on formData (for demonstration)
        // In a real scenario, duplicates would ideally be flagged by the backend
        const submissionMap = new Map();
        const detectedDuplicates = [];

        allSubmissions.forEach(submission => {
          const formDataString = JSON.stringify(submission.formData); // Assuming formData is an object
          if (submissionMap.has(formDataString)) {
            // If this formData has been seen before, mark both as duplicates
            const existingSubmission = submissionMap.get(formDataString);
            if (!detectedDuplicates.includes(existingSubmission)) {
              detectedDuplicates.push(existingSubmission);
            }
            detectedDuplicates.push(submission);
          } else {
            submissionMap.set(formDataString, submission);
          }
        });
        setDuplicateSubmissions(detectedDuplicates);
      } catch (err) {
        setError('Failed to fetch duplicate submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchDuplicates();
  }, []);

  const handleSelectDuplicate = (id) => {
    const newSelection = new Set(selectedDuplicates);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedDuplicates(newSelection);
  };

  const handleDeleteSelected = () => {
    console.log('Deleting selected duplicates:', Array.from(selectedDuplicates));
    // Implement API call to delete selected duplicates
    setDuplicateSubmissions(duplicateSubmissions.filter(dup => !selectedDuplicates.has(dup.id)));
    setSelectedDuplicates(new Set());
  };

  const handleAutoRemoveDuplicates = () => {
    console.log('Auto-removing duplicates, keeping latest.');
    // Implement logic to identify and remove older duplicates, keeping only the latest
    const uniqueSubmissions = {};
    duplicateSubmissions.forEach(dup => {
      if (!uniqueSubmissions[dup.originalId] || new Date(dup.date) > new Date(uniqueSubmissions[dup.originalId].date)) {
        uniqueSubmissions[dup.originalId] = dup;
      }
    });
    setDuplicateSubmissions(Object.values(uniqueSubmissions));
    setSelectedDuplicates(new Set());
  };

  if (loading) return <div className={styles.loading}>Loading duplicates...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Duplicate Submissions Management</h1>

      <div className={styles.controls}>
        <button
          className={styles.deleteSelectedButton}
          onClick={handleDeleteSelected}
          disabled={selectedDuplicates.size === 0}
        >
          Delete Selected ({selectedDuplicates.size})
        </button>
        <button
          className={styles.autoRemoveButton}
          onClick={handleAutoRemoveDuplicates}
        >
          Auto-Remove Old Duplicates
        </button>
      </div>

      {duplicateSubmissions.length === 0 ? (
        <p className={styles.noDuplicates}>No duplicate submissions found.</p>
      ) : (
        <div className={styles.duplicateList}>
          {duplicateSubmissions.map((dup) => (
            <div key={dup.id} className={styles.duplicateItem}>
              <input
                type="checkbox"
                checked={selectedDuplicates.has(dup.id)}
                onChange={() => handleSelectDuplicate(dup.id)}
              />
              <div className={styles.duplicateDetails}>
                <p><strong>User ID:</strong> {dup.userId}</p>
                <p><strong>Form Data:</strong> {dup.formData}</p>
                <p><strong>Date:</strong> {dup.date}</p>
                <p><strong>Original ID:</strong> {dup.originalId}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Duplicates;
