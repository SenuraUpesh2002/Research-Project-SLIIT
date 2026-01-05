import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from "../../../constants/api";
import apiClient from '../../../services/apiClient';
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
        const token = localStorage.getItem('authToken');
        console.log('Token in Submissions:', token);

        // Rely on `apiClient` request interceptor to attach Authorization header
        const response = await apiClient.get(API_ENDPOINTS.SUBMISSIONS.GET_ALL);
        const data = response.data || [];
        console.log('Submissions data:', data);
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setSubmissions(data);
        } else if (data && typeof data === 'object') {
          // If it's a single object, wrap it in an array
          setSubmissions([data]);
        } else {
          setSubmissions([]);
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to fetch submissions.');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log('Search term updated:', value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    // Safe string conversion
    const getName = () => {
      const name = submission.name || submission.user;
      return typeof name === 'string' ? name : (name?.name || '');
    };
    
    const getEmail = () => {
      const email = submission.email;
      return typeof email === 'string' ? email : (email?.email || '');
    };
    
    const getVehicleType = () => {
      const type = submission.vehicleType || submission.type;
      return typeof type === 'string' ? type : (type?.type || '');
    };

    const name = getName().toLowerCase();
    const email = getEmail().toLowerCase();
    const vehicleType = getVehicleType().toLowerCase();
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch = search === '' || name.includes(search) || email.includes(search);
    const matchesFilter = filterType === 'all' || vehicleType.includes(filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  console.log('Search term:', searchTerm, 'Filtered results:', filteredSubmissions.length);

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
          <option value="all">All Types</option>
          <option value="EV Form">EV Form</option>
          <option value="Fuel Form">Fuel Form</option>
        </select>
        <select className={styles.sortSelect} value={sortBy} onChange={handleSortChange}>
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
        </select>
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