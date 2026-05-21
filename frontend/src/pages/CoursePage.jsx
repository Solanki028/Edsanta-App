import { useEffect } from 'react';
import { useCourse } from '../context/CourseContext';
import ProgressBar from '../components/ProgressBar';
import CourseSidebar from '../components/CourseSidebar';
import VideoPlayer from '../components/VideoPlayer';

// Course ID from environment or fallback
const COURSE_ID = import.meta.env.VITE_COURSE_ID;

/**
 * Main course page with two-pane layout:
 * - ProgressBar at top
 * - CourseSidebar (left) + VideoPlayer (right)
 */
const CoursePage = () => {
  const { loading, error, fetchCourse, fetchProgress } = useCourse();

  useEffect(() => {
    if (!COURSE_ID) {
      console.error('VITE_COURSE_ID is not set in environment variables');
      return;
    }

    const loadData = async () => {
      await fetchCourse(COURSE_ID);
      await fetchProgress(COURSE_ID);
    };

    loadData();
  }, [fetchCourse, fetchProgress]);

  if (!COURSE_ID) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-600 mb-2">Configuration Error</h2>
          <p className="text-gray-600">
            Please set <code className="bg-gray-100 px-2 py-1 rounded text-sm">VITE_COURSE_ID</code> in your frontend <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> file.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Run <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm run seed</code> in the backend to get a Course ID.
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
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
