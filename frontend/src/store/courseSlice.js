import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
const USER_ID = import.meta.env.VITE_USER_ID

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/courses`);
      if (data && data.length > 0) {
        const defaultCourse = data[0];
        dispatch(fetchProgress(defaultCourse._id));
      }
      return data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load courses');
    }
  }
);

export const fetchCourse = createAsyncThunk(
  'course/fetchCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/courses/${courseId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load course data');
    }
  }
);

export const fetchProgress = createAsyncThunk(
  'course/fetchProgress',
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/progress/${USER_ID}/${courseId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load progress');
    }
  }
);

export const selectCourse = createAsyncThunk(
  'course/selectCourse',
  async (courseId, { dispatch, getState, rejectWithValue }) => {
    try {
      const { courses } = getState().course;
      const catalogCourse = courses.find((item) => item._id === courseId);
      if (catalogCourse) {
        dispatch(fetchProgress(courseId));
        return catalogCourse;
      }
      const { data } = await axios.get(`${API_URL}/api/courses/${courseId}`);
      dispatch(fetchProgress(courseId));
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to select course');
    }
  }
);

export const markComplete = createAsyncThunk(
  'course/markComplete',
  async (moduleId, { getState, rejectWithValue }) => {
    const { course } = getState().course;
    try {
      const { data } = await axios.put(`${API_URL}/api/progress/${USER_ID}/${moduleId}`, {
        courseId: course._id,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save progress');
    }
  }
);

export const saveWatchPosition = createAsyncThunk(
  'course/saveWatchPosition',
  async ({ moduleId, position }, { getState, rejectWithValue }) => {
    const { course } = getState().course;
    try {
      const { data } = await axios.put(
        `${API_URL}/api/progress/${USER_ID}/${moduleId}/position`,
        {
          courseId: course._id,
          position,
        }
      );
      return { moduleId, position, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save watch position');
    }
  }
);

const courseSlice = createSlice({
  name: 'course',
  initialState: {
    courses: [],
    course: null,
    modules: [],
    activeModule: null,
    completedModules: {},
    percentage: 0,
    lastWatchedPositions: {},
    loading: true,
    error: null,
  },
  reducers: {
    setActiveModule: (state, action) => {
      state.activeModule = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        if (action.payload.length > 0) {
          const defaultCourse = action.payload[0];
          state.course = state.course || defaultCourse;
          state.modules = state.modules.length > 0 ? state.modules : defaultCourse.modules || [];
          state.activeModule = state.activeModule || defaultCourse.modules?.[0] || null;
        }
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
        state.modules = action.payload.modules || [];
        state.activeModule = action.payload.modules?.[0] || null;
        state.completedModules = {};
        state.percentage = 0;
        state.lastWatchedPositions = {};
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        const completedDict = {};
        (action.payload.completedModules || []).forEach((id) => {
          completedDict[id.toString()] = true;
        });
        state.completedModules = completedDict;
        state.percentage = action.payload.percentage || 0;

        if (action.payload.lastWatchedPositions) {
          state.lastWatchedPositions = action.payload.lastWatchedPositions;
        }
      })
      .addCase(selectCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
        state.modules = action.payload.modules || [];
        state.activeModule = action.payload.modules?.[0] || null;
        state.completedModules = {};
        state.percentage = 0;
        state.lastWatchedPositions = {};
      })
      .addCase(selectCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markComplete.pending, (state, action) => {
        const moduleId = action.meta.arg;
        if (!state.completedModules[moduleId]) {
          state.completedModules[moduleId] = true;
          const completedCount = Object.keys(state.completedModules).length;
          state.percentage = Math.round((completedCount / state.modules.length) * 100);
        }
      })
      .addCase(markComplete.fulfilled, (state, action) => {
        const completedDict = {};
        (action.payload.completedModules || []).forEach((id) => {
          completedDict[id.toString()] = true;
        });
        state.completedModules = completedDict;
        state.percentage = action.payload.percentage || 0;
      })
      .addCase(markComplete.rejected, (state, action) => {
        const moduleId = action.meta.arg;
        if (state.completedModules[moduleId]) {
          delete state.completedModules[moduleId];
          const completedCount = Object.keys(state.completedModules).length;
          state.percentage = state.modules.length > 0
            ? Math.round((completedCount / state.modules.length) * 100)
            : 0;
        }
        state.error = action.payload || 'Failed to complete module. Progress rolled back.';
      })
      .addCase(saveWatchPosition.pending, (state, action) => {
        const { moduleId, position } = action.meta.arg;
        state.lastWatchedPositions[moduleId] = position;
      })
      .addCase(saveWatchPosition.fulfilled, (state, action) => {
        if (action.payload.data?.lastWatchedPositions) {
          state.lastWatchedPositions = action.payload.data.lastWatchedPositions;
        }
      });
  },
});

export const { setActiveModule, clearError, setError } = courseSlice.actions;
export default courseSlice.reducer;
