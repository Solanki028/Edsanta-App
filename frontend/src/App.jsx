import { Provider } from 'react-redux';
import { store } from './store';
import CoursePage from './pages/CoursePage';

function App() {
  return (
    <Provider store={store}>
      <CoursePage />
    </Provider>
  );
}

export default App;
