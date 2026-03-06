import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axiosConfig';

const handleAsyncError = (error, rejectWithValue) => {
    return rejectWithValue(error.response?.data || "A server error occurred");
};

export const fetchCourses = createAsyncThunk('school/fetchCourses', async (_, { getState, rejectWithValue }) => {
    try {
        const { user } = getState().auth;
        const endpoint = user?.role === 'TEACHER' ? '/api/courses/my-courses/' : '/api/courses/enrolled-courses/';
        const response = await API.get(endpoint);
        return response.data;
    } catch (error) {
        return handleAsyncError(error, rejectWithValue);
    }
});

export const createCourse = createAsyncThunk('school/createCourse', async (formData, { rejectWithValue }) => {
    try {
        const response = await API.post('/api/courses/', formData);
        return response.data;
    } catch (err) {
        return handleAsyncError(err, rejectWithValue);
    }
});

export const fetchCourseDetail = createAsyncThunk('school/fetchCourseDetail', async (courseId, { rejectWithValue }) => {
    try {
        const response = await API.get(`/api/courses/${courseId}/`);
        return response.data;
    } catch (err) {
        return handleAsyncError(err, rejectWithValue);
    }
});

export const deleteCourse = createAsyncThunk('school/deleteCourse', async (courseId, { rejectWithValue }) => {
    try {
        await API.delete(`/api/courses/${courseId}/`); // Fixed: Used API instead of axios
        return courseId;
    } catch (err) {
        return handleAsyncError(err, rejectWithValue);
    }
});

export const updateCourse = createAsyncThunk('school/updateCourse', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await API.patch(`/api/courses/${id}/`, data);
        return response.data;
    } catch (error) {
        return handleAsyncError(error, rejectWithValue);
    }
});

export const fetchSubmissions = createAsyncThunk('school/fetchSubmissions', async (_, { rejectWithValue }) => {
    try {
        const response = await API.get('/api/submissions/');
        return response.data;
    } catch (error) {
        return handleAsyncError(error, rejectWithValue);
    }
});

export const gradeSubmission = createAsyncThunk('school/gradeSubmission', async ({ id, grade, feedback }, { rejectWithValue }) => {
    try {
        const response = await API.post(`/api/submissions/${id}/grade/`, { grade, feedback });
        return response.data;
    } catch (error) {
        return handleAsyncError(error, rejectWithValue);
    }
});

export const markLessonComplete = createAsyncThunk(
  'school/markLessonComplete',
  async ({ courseId, lessonId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/api/courses/${courseId}/lessons/${lessonId}/complete/`);
      return { lessonId, progress: response.data }; // Returning lessonId to update local array
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const schoolSlice = createSlice({
    name: 'school',
    initialState: {
        courses: [],           
        instructorCourses: [], 
        submissions: [],
        currentCourse: null,   
        status: 'idle',
        error: null,
    },
    reducers: {
        clearSchoolError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchCourses.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.courses = action.payload;
                state.instructorCourses = action.payload; // Syncing both for now
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(fetchCourseDetail.fulfilled, (state, action) => {
                state.currentCourse = action.payload;
            })

            .addCase(createCourse.fulfilled, (state, action) => {
                state.instructorCourses.push(action.payload);
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                const index = state.instructorCourses.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.instructorCourses[index] = action.payload;
                if (state.currentCourse?.id === action.payload.id) state.currentCourse = action.payload;
            })

            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.instructorCourses = state.instructorCourses.filter(c => c.id !== action.payload);
                if (state.currentCourse?.id === action.payload) state.currentCourse = null;
            })

            .addCase(fetchSubmissions.fulfilled, (state, action) => {
                state.submissions = action.payload;
            })
            .addCase(gradeSubmission.fulfilled, (state, action) => {
                const index = state.submissions.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.submissions[index] = action.payload;
            })

            .addCase(markLessonComplete.fulfilled, (state, action) => {
                if (!state.completedLessons.includes(action.payload.lessonId)) {
                    state.completedLessons.push(action.payload.lessonId);
                }
            })
    }
});

export const { clearSchoolError } = schoolSlice.actions;
export default schoolSlice.reducer;