import { useCourse } from '../hooks/useCourse';

const ProgressBar = () => {
  const { modules, completedModules, percentage } = useCourse();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-700">
          Course Progress
        </h2>
        <span className="text-sm font-medium text-gray-600">
          {completedModules.size} of {modules.length} videos completed —{' '}
          <span className="text-indigo-600 font-bold">{percentage}%</span>
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
