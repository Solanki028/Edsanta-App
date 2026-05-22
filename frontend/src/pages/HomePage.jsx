import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  PlayCircle,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useCourse } from '../context/CourseContext';

const COURSE_IMAGE_EXTENSIONS = ['jpg', 'png', 'webp', 'svg'];
const DEFAULT_COURSE_IMAGE = '/course-images/default.svg';

const slugifyCourseTitle = (title = '') =>
  title
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const CourseImage = ({ title, className, alt = '' }) => {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const slug = slugifyCourseTitle(title);
  const extension = COURSE_IMAGE_EXTENSIONS[extensionIndex];
  const src =
    slug && extension
      ? `/course-images/${slug}.${extension}`
      : DEFAULT_COURSE_IMAGE;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        if (extensionIndex < COURSE_IMAGE_EXTENSIONS.length - 1) {
          setExtensionIndex((currentIndex) => currentIndex + 1);
          return;
        }

        event.currentTarget.onerror = null;
        event.currentTarget.src = DEFAULT_COURSE_IMAGE;
      }}
    />
  );
};

const formatCreatedDate = (dateValue) => {
  if (!dateValue) return 'Recently added';

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue));
};

const durationToSeconds = (duration) => {
  if (!duration) return 0;

  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN)) return 0;

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
};

const formatTotalDuration = (modules) => {
  const totalSeconds = modules.reduce(
    (total, mod) => total + durationToSeconds(mod.duration),
    0
  );

  if (!totalSeconds) return 'Self paced';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const HomePage = ({ onStartCourse }) => {
  const { course, courses, modules, completedModules, percentage } =
    useCourse();

  const highlightedCourse = course || courses[0];
  const highlightedModules = highlightedCourse?.modules || modules;
  const totalDuration = formatTotalDuration(highlightedModules);
  const createdDate = formatCreatedDate(highlightedCourse?.createdAt);
  const totalCatalogLessons = courses.reduce(
    (total, item) => total + (item.modules?.length || 0),
    0
  );

  const sections = [
    {
      icon: GraduationCap,
      title: 'Guided Skill Tracks',
      text: 'Structured modules help learners move from concept to applied practice with a clear sequence.',
    },
    {
      icon: Target,
      title: 'Outcome Based Learning',
      text: 'Every course keeps attention on completion, practice, and measurable progress.',
    },
    {
      icon: Users,
      title: 'Learner First Support',
      text: 'Simple navigation, resume state, and progress visibility make repeated study sessions easier.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-gray-900">
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white grid place-items-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">EdSanta</p>
              <p className="text-xs text-gray-500">Learning dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onStartCourse(highlightedCourse?._id)}
            disabled={!highlightedCourse}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            <PlayCircle className="h-4 w-4" />
            Continue
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">
          <div className="flex flex-col justify-center">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Featured course
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-normal text-gray-950">
              Learn with clarity, track progress with confidence.
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-8 text-gray-600">
              Explore practical technology courses through focused video
              modules, completion tracking, and a course experience designed
              for steady learning momentum.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-2xl font-bold text-gray-950">
                  {courses.length}
                </p>
                <p className="text-xs font-medium text-gray-500">Courses</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-2xl font-bold text-gray-950">
                  {totalCatalogLessons}
                </p>
                <p className="text-xs font-medium text-gray-500">Lessons</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-2xl font-bold text-gray-950">
                  {percentage}%
                </p>
                <p className="text-xs font-medium text-gray-500">Progress</p>
              </div>
            </div>
          </div>

          <article className="rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm">
            <div className="relative">
              <CourseImage
                title={highlightedCourse?.title}
                alt={highlightedCourse?.title || 'Featured course'}
                className="h-64 sm:h-80 w-full object-cover"
              />
              <div className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-2 shadow-sm">
                <p className="text-xs font-semibold text-gray-500">
                  Current course
                </p>
                <p className="text-sm font-bold text-gray-950">
                  {percentage}% completed
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Created {createdDate}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  {totalDuration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layers3 className="h-4 w-4" />
                  {highlightedModules.length} lessons
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-950">
                {highlightedCourse?.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {highlightedCourse?.description}
              </p>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => onStartCourse(highlightedCourse?._id)}
                  disabled={!highlightedCourse}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Start learning
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {completedModules.size} lessons completed
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <p className="text-sm font-semibold text-indigo-700">
              Available courses
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-950">
              Choose your next learning path.
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            {courses.length} courses with {totalCatalogLessons} lessons
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
            <h3 className="text-lg font-bold text-gray-950">
              No courses found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Run the backend seed script, then refresh this page.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((item) => {
              const itemDuration = formatTotalDuration(item.modules || []);
              return (
                <article
                  key={item._id}
                  className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm"
                >
                  <CourseImage
                    title={item.title}
                    alt={item.title}
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {itemDuration}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Layers3 className="h-3.5 w-3.5" />
                        {item.modules?.length || 0} lessons
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-gray-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => onStartCourse(item._id)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                    >
                      Open course
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="rounded-lg border border-gray-200 bg-white p-5"
                >
                  <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-700 grid place-items-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-950">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {section.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-indigo-700">
              Course roadmap
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-950">
              A clear path from first lesson to completion.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {highlightedModules.slice(0, 4).map((mod, index) => (
              <div
                key={mod._id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-indigo-700">
                      Lesson {index + 1}
                    </p>
                    <h3 className="mt-1 text-sm font-bold text-gray-950">
                      {mod.title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    {mod.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300">
              <BarChart3 className="h-4 w-4" />
              Progress driven learning
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Pick up where you left off and keep moving.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onStartCourse(highlightedCourse?._id)}
            disabled={!highlightedCourse}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-100 transition-colors"
          >
            Open course
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
