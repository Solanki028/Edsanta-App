import { CourseProvider } from './context/CourseContext';
import CoursePage from './pages/CoursePage';

function App() {
  return (
    <CourseProvider>
      <CoursePage />
    </CourseProvider>
  );
}

export default App;
