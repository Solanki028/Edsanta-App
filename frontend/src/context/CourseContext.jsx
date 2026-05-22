import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const CourseContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const USER_ID = import.meta.env.VITE_USER_ID || 'demo-user-123';

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
      setError(err.response?.data?.message || 'Failed to load courses');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourse = useCallback(async (courseId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get(`${API_URL}/api/courses/${courseId}`);
      setCourse(data);
      setModules(data.modules || []);

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
      setError(err.response?.data?.message || 'Failed to load course data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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

      if (data.lastWatchedPositions) {
        const positions =
          data.lastWatchedPositions instanceof Map
            ? Object.fromEntries(data.lastWatchedPositions)
            : data.lastWatchedPositions;
        setLastWatchedPositions(positions);
      }
    } catch (err) {
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

  const markComplete = useCallback(
    async (moduleId) => {
      if (completedModules.has(moduleId)) return;

      const prevCompleted = new Set(completedModules);
      const prevPercentage = percentage;

      const newCompleted = new Set(completedModules);
      newCompleted.add(moduleId);
      const newPercentage = Math.round(
        (newCompleted.size / modules.length) * 100
      );
      setCompletedModules(newCompleted);
      setPercentage(newPercentage);

      try {
        await axios.put(`${API_URL}/api/progress/${USER_ID}/${moduleId}`, {
          courseId: course._id,
        });
      } catch (err) {
        setCompletedModules(prevCompleted);
        setPercentage(prevPercentage);
        setError('Failed to save progress. Please try again.');

        setTimeout(() => setError(null), 3000);
      }
    },
    [completedModules, percentage, modules.length, course]
  );

  const saveWatchPosition = useCallback(
    async (moduleId, position) => {
      setLastWatchedPositions((prev) => ({ ...prev, [moduleId]: position }));

      try {
        await axios.put(
          `${API_URL}/api/progress/${USER_ID}/${moduleId}/position`,
          {
            courseId: course._id,
            position,
          }
        );
      } catch (err) {
      }
    },
    [course]
  );

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

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
