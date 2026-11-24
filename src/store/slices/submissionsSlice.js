import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { submissionsApi } from '../../api/submissionsApi';
import { formsApi } from '../../api/formsApi';

const initialState = {
  submissions: [],
  formContext: null,
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  activeSubmission: null,
  loading: false,
  error: null,
  deletingId: null
};

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchSubmissions',
  async ({ formId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const [subsResponse, formResponse] = await Promise.all([
        submissionsApi.fetchSubmissions(formId, { page, limit }),
        formsApi.fetchFormById(formId, true)
      ]);
      return {
        submissions: subsResponse.data,
        meta: subsResponse.meta,
        form: formResponse.data
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch submissions');
    }
  }
);

export const fetchSubmissionById = createAsyncThunk(
  'submissions/fetchSubmissionById',
  async ({ formId, submissionId }, { rejectWithValue }) => {
    try {
      const response = await submissionsApi.fetchSubmissionById(formId, submissionId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch submission detail');
    }
  }
);

export const deleteSubmission = createAsyncThunk(
  'submissions/deleteSubmission',
  async ({ formId, submissionId }, { rejectWithValue }) => {
    try {
      await submissionsApi.deleteSubmission(formId, submissionId);
      return submissionId;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete submission');
    }
  }
);

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    setActiveSubmission: (state, action) => {
      state.activeSubmission = action.payload;
    },
    clearSubmissionsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Submissions
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = action.payload.submissions;
        state.pagination = action.payload.meta;
        state.formContext = action.payload.form;
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single detail
      .addCase(fetchSubmissionById.fulfilled, (state, action) => {
        state.activeSubmission = action.payload;
      })

      // Delete submission
      .addCase(deleteSubmission.pending, (state, action) => {
        state.deletingId = action.meta.arg.submissionId;
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.deletingId = null;
        state.submissions = state.submissions.filter((s) => s._id !== action.payload);
        state.pagination.totalCount = Math.max(0, state.pagination.totalCount - 1);
        if (state.activeSubmission?._id === action.payload) {
          state.activeSubmission = null;
        }
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload;
      });
  }
});

export const { setActiveSubmission, clearSubmissionsError } = submissionsSlice.actions;
export default submissionsSlice.reducer;
