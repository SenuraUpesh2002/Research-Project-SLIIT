import React, { useState, useEffect } from 'react';
import styles from './Submissions.module.css';
import SubmissionTable from '../components/SubmissionTable'; // Assuming this component exists

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    // Placeholder for fetching submissions from an API
    const fetchSubmissions = async () => {
      try {
        // Simulate API call
        const mockSubmissions = [
          { id: '1', name: 'John Doe', email: 'john@example.com', vehicleType: 'EV', province: 'Western', town: 'Colombo', date: '2023-10-26' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', vehicleType: 'ICE', province: 'Southern', town: 'Galle', date: '2023-10-25' },
          { id: '3', name: 'Peter Jones', email: 'peter@example.com', vehicleType: 'EV', province: 'Central', town: 'Kandy', date: '2023-10-24' },
        ];
        setSubmissions(mockSubmissions);
      } catch (err) {
        setError('Failed to fetch submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          submission.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || submission.vehicleType.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const handleViewDetails = (id) => {
    console.log(`View details for submission ${id}`);
    // Navigate to a detailed view page or open a modal
  };

  const handleEditSubmission = (id) => {
    console.log(`Edit submission ${id}`);
    // Navigate to an edit page or open an edit modal
  };

  const handleDeleteSubmission = (id) => {
    console.log(`Delete submission ${id}`);
    // Implement deletion logic, e.g., API call and state update
    setSubmissions(submissions.filter(sub => sub.id !== id));
  };

  const handleCreateSubmission = () => {
    console.log('Create new submission');
    // Navigate to a create new submission page or open a form modal
  };

  if (loading) return <div className={styles.loading}>Loading submissions...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Submissions Management</h1>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by name or email..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearch}
        />
        <select className={styles.filterSelect} value={filterType} onChange={handleFilterChange}>
          <option value="all">All Vehicle Types</option>
          <option value="ev">EV</option>
          <option value="ice">ICE</option>
        </select>
        <select className={styles.sortSelect} value={sortBy} onChange={handleSortChange}>
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
        <button className={styles.createButton} onClick={handleCreateSubmission}>
          Create New Submission
        </button>
      </div>

      <SubmissionTable
        submissions={sortedSubmissions}
        onViewDetails={handleViewDetails}
        onEditSubmission={handleEditSubmission}
        onDeleteSubmission={handleDeleteSubmission}
      />
    </div>
  );
};

export default Submissions;
