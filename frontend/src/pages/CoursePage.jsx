import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import ProgressBar from '../components/ProgressBar';
import CourseSidebar from '../components/CourseSidebar';
import VideoPlayer from '../components/VideoPlayer';
import HomePage from './HomePage';

// Course ID from environment or fallback
const COURSE_ID = import.meta.env.VITE_COURSE_ID;

/**
 * Main course page with two-pane layout:
 * - ProgressBar at top
 * - CourseSidebar (left) + VideoPlayer (right)
 */
const CoursePage = () => {
  const { course, loading, error, fetchCourses, selectCourse } = useCourse();
  const [isCourseOpen, setIsCourseOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchCourses();

      if (COURSE_ID) {
        await selectCourse(COURSE_ID);
      }
    };

    loadData();
  }, [fetchCourses, selectCourse]);

  const handleStartCourse = async (courseId) => {
    const selectedCourse = await selectCourse(courseId || course?._id);
    if (selectedCourse) {
      setIsCourseOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isCourseOpen) {
    return <HomePage onStartCourse={handleStartCourse} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsCourseOpen(false)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </button>
        <p className="min-w-0 truncate text-sm font-semibold text-gray-700">
          {course?.title}
        </p>
      </div>

      {/* Global Progress Bar */}
      <ProgressBar />

      {/* Two-Pane Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <CourseSidebar />
        <VideoPlayer />
      </div>
    </div>
  );
};

export default CoursePage;
