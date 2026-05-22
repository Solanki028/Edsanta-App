import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCourses,
  fetchCourse,
  fetchProgress,
  selectCourse as selectCourseAction,
  markComplete as markCompleteAction,
  saveWatchPosition as saveWatchPositionAction,
  setActiveModule as setActiveModuleAction,
} from '../store/courseSlice';

export const useCourse = () => {
  const dispatch = useDispatch();

  const {
    courses,
    course,
    modules,
    activeModule,
    completedModules,
    percentage,
    lastWatchedPositions,
    loading,
    error,
  } = useSelector((state) => state.course);

  const memoizedCompletedSet = useMemo(() => {
    return new Set(Object.keys(completedModules));
  }, [completedModules]);

  const boundFetchCourses = useCallback(async () => {
    try {
      return await dispatch(fetchCourses()).unwrap();
    } catch (err) {
      return [];
    }
  }, [dispatch]);

  const boundFetchCourse = useCallback(async (courseId) => {
    try {
      return await dispatch(fetchCourse(courseId)).unwrap();
    } catch (err) {
      return null;
    }
  }, [dispatch]);

  const boundFetchProgress = useCallback(async (courseId) => {
    try {
      return await dispatch(fetchProgress(courseId)).unwrap();
    } catch (err) {
      return null;
    }
  }, [dispatch]);

  const boundSelectCourse = useCallback(async (courseId) => {
    try {
      return await dispatch(selectCourseAction(courseId)).unwrap();
    } catch (err) {
      return null;
    }
  }, [dispatch]);

  const boundMarkComplete = useCallback((moduleId) => {
    dispatch(markCompleteAction(moduleId));
  }, [dispatch]);

  const boundSaveWatchPosition = useCallback((moduleId, position) => {
    dispatch(saveWatchPositionAction({ moduleId, position }));
  }, [dispatch]);

  const boundGetResumePosition = useCallback((moduleId) => {
    return lastWatchedPositions[moduleId] || 0;
  }, [lastWatchedPositions]);

  const boundSetActiveModule = useCallback((module) => {
    dispatch(setActiveModuleAction(module));
  }, [dispatch]);

  return {
    courses,
    course,
    modules,
    activeModule,
    completedModules: memoizedCompletedSet,
    percentage,
    loading,
    error,
    userId: import.meta.env.VITE_USER_ID || 'demo-user-123',
    setActiveModule: boundSetActiveModule,
    fetchCourses: boundFetchCourses,
    fetchCourse: boundFetchCourse,
    fetchProgress: boundFetchProgress,
    selectCourse: boundSelectCourse,
    markComplete: boundMarkComplete,
    saveWatchPosition: boundSaveWatchPosition,
    getResumePosition: boundGetResumePosition,
  };
};
