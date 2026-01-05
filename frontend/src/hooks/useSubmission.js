import { useState } from 'react';
import { API_ENDPOINTS } from '../constants/api';

const useSubmission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS.GET_ALL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS.GET_BY_ID(id));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubmission(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createSubmission = async (newSubmission) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubmission),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Optionally, refresh the list of submissions or add the new one to the state
      return { success: true, data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (id, updatedSubmission) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS.UPDATE(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSubmission),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Optionally, refresh the list of submissions or update the specific one in state
      return { success: true, data };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.SUBMISSIONS.DELETE(id), {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Optionally, refresh the list of submissions or remove the deleted one from state
      return { success: true };
    } catch (err) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    submissions,
    submission,
    loading,
    error,
    fetchSubmissions,
    fetchSubmissionById,
    createSubmission,
    updateSubmission,
    deleteSubmission,
  };
};

export default useSubmission;
