import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const CourseContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const USER_ID = 'demo-user-123'; // Hardcoded userId (no auth required per assessment)

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [percentage, setPercentage] = useState(0);
  const [lastWatchedPositions, setLastWatchedPositions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch catalog data for the home page.
   */
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${API_URL}/api/courses`);
      setCourses(data || []);

      if (data?.length > 0) {
        setCourse((currentCourse) => currentCourse || data[0]);
        setModules((currentModules) =>
          currentModules.length > 0 ? currentModules : data[0].modules || []
        );
        setActiveModule((currentModule) =>
          currentModule || data[0].modules?.[0] || null
        );
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.message || 'Failed to load courses');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch course data with populated modules
   */
  const fetchCourse = useCallback(async (courseId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${API_URL}/api/courses/${courseId}`);
      setCourse(data);
      setModules(data.modules || []);

      // Set first module as active by default
      if (data.modules?.length > 0) {
        setActiveModule(data.modules[0]);
      } else {
        setActiveModule(null);
      }

      setCompletedModules(new Set());
      setPercentage(0);
      setLastWatchedPositions({});
      return data;
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.response?.data?.message || 'Failed to load course data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch user's progress for the course
   */
  const fetchProgress = useCallback(async (courseId) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/progress/${USER_ID}/${courseId}`
      );

      const completedSet = new Set(
        (data.completedModules || []).map((id) => id.toString())
      );
      setCompletedModules(completedSet);
      setPercentage(data.percentage || 0);

      // Bonus: Restore last watched positions
      if (data.lastWatchedPositions) {
        const positions =
          data.lastWatchedPositions instanceof Map
            ? Object.fromEntries(data.lastWatchedPositions)
            : data.lastWatchedPositions;
        setLastWatchedPositions(positions);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
      // Non-critical: progress starts at 0 if fetch fails
    }
  }, []);

  const selectCourse = useCallback(
    async (courseId) => {
      if (!courseId) return null;

      const catalogCourse = courses.find((item) => item._id === courseId);
      if (catalogCourse) {
        setCourse(catalogCourse);
        setModules(catalogCourse.modules || []);
        setActiveModule(catalogCourse.modules?.[0] || null);
        setCompletedModules(new Set());
        setPercentage(0);
        setLastWatchedPositions({});
        await fetchProgress(courseId);
        return catalogCourse;
      }

      const selectedCourse = await fetchCourse(courseId);
      if (selectedCourse) {
        await fetchProgress(courseId);
      }

      return selectedCourse;
    },
    [courses, fetchCourse, fetchProgress]
  );

  /**
   * Mark a module as complete — uses OPTIMISTIC UI UPDATE
   * 1. Instantly update local state (snappy UX)
   * 2. Send PUT request to backend
   * 3. Rollback on failure
   */
  const markComplete = useCallback(
    async (moduleId) => {
      if (completedModules.has(moduleId)) return; // Already completed

      // --- Snapshot previous state for rollback ---
      const prevCompleted = new Set(completedModules);
      const prevPercentage = percentage;

      // --- Optimistic update ---
      const newCompleted = new Set(completedModules);
      newCompleted.add(moduleId);
      const newPercentage = Math.round(
        (newCompleted.size / modules.length) * 100
      );
      setCompletedModules(newCompleted);
      setPercentage(newPercentage);

      try {
        // --- Send to backend ---
        await axios.put(`${API_URL}/api/progress/${USER_ID}/${moduleId}`, {
          courseId: course._id,
        });
      } catch (err) {
        // --- Rollback on failure ---
        console.error('Error marking complete, rolling back:', err);
        setCompletedModules(prevCompleted);
        setPercentage(prevPercentage);
        setError('Failed to save progress. Please try again.');

        // Auto-clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    },
    [completedModules, percentage, modules.length, course]
  );

  /**
   * Bonus: Save the last watched position for a module
   */
  const saveWatchPosition = useCallback(
    async (moduleId, position) => {
      setLastWatchedPositions((prev) => ({ ...prev, [moduleId]: position }));

      // Fire-and-forget save to backend (non-blocking)
      try {
        await axios.put(
          `${API_URL}/api/progress/${USER_ID}/${moduleId}/position`,
          {
            courseId: course._id,
            position,
          }
        );
      } catch (err) {
        console.error('Error saving watch position:', err);
      }
    },
    [course]
  );

  /**
   * Get the resume position for a specific module
   */
  const getResumePosition = useCallback(
    (moduleId) => {
      return lastWatchedPositions[moduleId] || 0;
    },
    [lastWatchedPositions]
  );

  const value = {
    course,
    courses,
    modules,
    activeModule,
    completedModules,
    percentage,
    loading,
    error,
    userId: USER_ID,
    setActiveModule,
    fetchCourses,
    fetchCourse,
    fetchProgress,
    selectCourse,
    markComplete,
    saveWatchPosition,
    getResumePosition,
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
