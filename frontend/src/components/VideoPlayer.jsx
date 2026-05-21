import { useRef, useEffect, useCallback } from 'react';
import { useCourse } from '../context/CourseContext';
import { CheckCircle } from 'lucide-react';

/**
 * Video player component using HTML5 <video> element.
 * Includes "Mark as Complete" action and bonus video resume state.
 */
const VideoPlayer = () => {
  const {
    activeModule,
    completedModules,
    markComplete,
    error,
    saveWatchPosition,
    getResumePosition,
  } = useCourse();

  const videoRef = useRef(null);
  const lastSavedPositionRef = useRef(0);

  const isCompleted = activeModule
    ? completedModules.has(activeModule._id)
    : false;

  /**
   * Bonus: Set video to resume position when module changes
   */
  useEffect(() => {
    if (activeModule) {
      lastSavedPositionRef.current = getResumePosition(activeModule._id);
    }
  }, [activeModule, getResumePosition]);

  const handleLoadedMetadata = useCallback(() => {
    if (!activeModule || !videoRef.current) return;

    const resumePos = getResumePosition(activeModule._id);
    const video = videoRef.current;

    if (resumePos > 0 && Number.isFinite(video.duration)) {
      video.currentTime = Math.min(resumePos, Math.max(video.duration - 1, 0));
    } else {
      video.currentTime = resumePos;
    }

    lastSavedPositionRef.current = resumePos;
  }, [activeModule, getResumePosition]);

  /**
   * Bonus: Save position on pause
   */
  const handlePause = useCallback(() => {
    if (activeModule && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      saveWatchPosition(activeModule._id, currentTime);
    }
  }, [activeModule, saveWatchPosition]);

  /**
   * Bonus: Periodically save position during playback (every 5 seconds)
   */
  const handleTimeUpdate = useCallback(() => {
    if (activeModule && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      // Save every 5 seconds of playback
      if (Math.abs(currentTime - lastSavedPositionRef.current) >= 5) {
        lastSavedPositionRef.current = currentTime;
        saveWatchPosition(activeModule._id, currentTime);
      }
    }
  }, [activeModule, saveWatchPosition]);

  if (!activeModule) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-lg">Select a module to start learning</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
      {/* Video Container */}
      <div className="bg-black">
        <div className="max-w-4xl mx-auto">
          <video
            ref={videoRef}
            key={activeModule._id}
            className="w-full aspect-video"
            controls
            onLoadedMetadata={handleLoadedMetadata}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            src={activeModule.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Module Info & Actions */}
      <div className="max-w-4xl mx-auto w-full px-6 py-6">
        {/* Error Toast */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900">
          {activeModule.title}
        </h2>

        {activeModule.duration && (
          <p className="text-sm text-gray-500 mt-1">
            Duration: {activeModule.duration}
          </p>
        )}

        <p className="text-gray-600 mt-3 leading-relaxed">
          Learn about {activeModule.title.toLowerCase()} in this comprehensive
          video lesson. Follow along with the examples and practice the concepts
          covered.
        </p>

        {/* Mark as Complete Button */}
        <div className="mt-6">
          {isCompleted ? (
            <button
              disabled
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-medium cursor-default"
            >
              <CheckCircle className="w-5 h-5" />
              Completed
            </button>
          ) : (
            <button
              onClick={() => markComplete(activeModule._id)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-150 shadow-sm"
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
