import { useCourse } from '../context/CourseContext';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';

/**
 * Scrollable sidebar listing all video modules.
 * Shows completion status (green checkmark / grey circle)
 * and highlights the currently active module.
 */
const CourseSidebar = () => {
  const { course, modules, activeModule, completedModules, setActiveModule } =
    useCourse();

  return (
    <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Course Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900 leading-tight">
          {course?.title}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {modules.length} modules
        </p>
      </div>

      {/* Module List */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-100">
          {modules.map((mod, index) => {
            const isActive = activeModule?._id === mod._id;
            const isCompleted = completedModules.has(mod._id);

            return (
              <li key={mod._id}>
                <button
                  onClick={() => setActiveModule(mod)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150
                    ${
                      isActive
                        ? 'bg-indigo-50 border-l-4 border-indigo-600'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                >
                  {/* Status Icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : isActive ? (
                      <PlayCircle className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isActive
                          ? 'text-indigo-700'
                          : isCompleted
                          ? 'text-gray-500'
                          : 'text-gray-800'
                      }`}
                    >
                      {index + 1}. {mod.title}
                    </p>
                    {mod.duration && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {mod.duration}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default CourseSidebar;
