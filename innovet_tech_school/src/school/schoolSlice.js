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

export const fetchCourseById = createAsyncThunk(
  "school/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/courses/${courseId}/`);
      
      return response.data;
    } catch (err) {
      
      const message = 
        err.response?.data?.detail || 
        err.response?.data?.message || 
        "Failed to load course details";
        
      return rejectWithValue(message);
    }
  }
);

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
        await API.delete(`/api/courses/${courseId}/`); 
        return courseId;
    } catch (err) {
        return handleAsyncError(err, rejectWithValue);
    }
});

export const updateCourse = createAsyncThunk('school/updateCourse', async ({ id, data }, { getState,  rejectWithValue }) => {
    try {

        const token = getState().auth.token
        const response = await API.patch(`/api/courses/${id}/update/`, data, {
            headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        });
        
        return response.data;
    } catch (error) {
        return handleAsyncError(error, rejectWithValue);
    }
});

export const enrollStudent = createAsyncThunk(
  "school/enrollStudent",
  async ({ courseId, email }, { rejectWithValue }) => {
    try {
    
      const response = await API.post(`/api/courses/${courseId}/enroll/`, { email });
      
      
      return { courseId, student: response.data }; 
    } catch (err) {
    
      const message = err.response?.data?.detail || err.response?.data?.message || "Enrollment failed";
      return rejectWithValue(message);
    }
  }
);

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
  async ({ lessonId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/api/lessons/${lessonId}/complete/`);
      return { lessonId, progress: response.data }; 
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
                state.instructorCourses = action.payload; 
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(fetchCourseById.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.currentCourse = action.payload;
                state.completedLessons = action.payload.completed_lesson_ids || [];
                state.status = 'succeeded';
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.currentCourse = null;
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

            .addCase(enrollStudent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(enrollStudent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                
                if (state.currentCourse && state.currentCourse.id === action.payload.courseId) {

                state.currentCourse.enrolled_count += 1;
                }
            })
            .addCase(enrollStudent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(fetchSubmissions.fulfilled, (state, action) => {
                state.submissions = action.payload;
            })
            .addCase(gradeSubmission.fulfilled, (state, action) => {
                const index = state.submissions.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.submissions[index] = action.payload;
            })

            .addCase(markLessonComplete.fulfilled, (state, action) => {
            const { lessonId } = action.payload;
            
            if (!state.completedLessons.includes(lessonId)) {
                state.completedLessons.push(lessonId);
            }
            
            if (action.payload.progress?.overall_percent) {
                state.currentCourseProgress = action.payload.progress.overall_percent;
            }
            });
    }
});

export const { clearSchoolError } = schoolSlice.actions;
export default schoolSlice.reducer;