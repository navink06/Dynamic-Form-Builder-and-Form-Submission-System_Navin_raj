import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formsApi } from '../../api/formsApi';
import { submissionsApi } from '../../api/submissionsApi';

const initialState = {
  formDefinition: null,
  values: {},
  errors: {},
  touched: {},
  loading: false,
  submitting: false,
  submitSuccess: false,
  submissionId: null,
  submittedRecord: null,
  error: null
};

export const fetchPublicForm = createAsyncThunk(
  'formRenderer/fetchPublicForm',
  async ({ formId, isPreview = false }, { rejectWithValue }) => {
    try {
      const response = await formsApi.fetchFormById(formId, isPreview);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch form definition');
    }
  }
);

export const submitPublicForm = createAsyncThunk(
  'formRenderer/submitPublicForm',
  async ({ formId, values }, { rejectWithValue }) => {
    try {
      const response = await submissionsApi.submitForm(formId, values);
      return response.data;
    } catch (err) {
      return rejectWithValue({
        message: err.message || 'Submission failed',
        fieldErrors: err.errors || {}
      });
    }
  }
);

const formRendererSlice = createSlice({
  name: 'formRenderer',
  initialState,
  reducers: {
    setFieldValue: (state, action) => {
      const { key, value } = action.payload;
      state.values[key] = value;
      // Clear field error when user starts typing/correcting
      if (state.errors[key]) {
        delete state.errors[key];
      }
    },
    setFieldTouched: (state, action) => {
      state.touched[action.payload] = true;
    },
    setClientValidationError: (state, action) => {
      const { key, error } = action.payload;
      if (error) {
        state.errors[key] = error;
      } else {
        delete state.errors[key];
      }
    },
    closeSubmissionModal: (state) => {
      state.submitSuccess = false;
    },
    resetSubmissionState: (state) => {
      state.submitSuccess = false;
      state.submissionId = null;
      state.submittedRecord = null;
      state.errors = {};
      state.touched = {};
      // Re-initialize default values from form definition
      if (state.formDefinition?.fields) {
        const defaults = {};
        state.formDefinition.fields.forEach((f) => {
          defaults[f.key] = f.defaultValue !== null && f.defaultValue !== undefined
            ? f.defaultValue
            : f.type === 'CHECKBOX' ? [] : '';
        });
        state.values = defaults;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Form
      .addCase(fetchPublicForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.formDefinition = null;
        state.values = {};
        state.errors = {};
        state.submitSuccess = false;
        state.submittedRecord = null;
      })
      .addCase(fetchPublicForm.fulfilled, (state, action) => {
        state.loading = false;
        state.formDefinition = action.payload;
        // Populate default values
        const defaults = {};
        (action.payload.fields || []).forEach((f) => {
          defaults[f.key] =
            f.defaultValue !== null && f.defaultValue !== undefined
              ? f.defaultValue
              : f.type === 'CHECKBOX'
              ? []
              : '';
        });
        state.values = defaults;
      })
      .addCase(fetchPublicForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Form
      .addCase(submitPublicForm.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitPublicForm.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        state.submissionId = action.payload._id;
        state.submittedRecord = action.payload;
        state.errors = {};
      })
      .addCase(submitPublicForm.rejected, (state, action) => {
        state.submitting = false;
        if (action.payload?.fieldErrors) {
          state.errors = action.payload.fieldErrors;
        }
        state.error = action.payload?.message || 'Form submission failed';
      });
  }
});

export const {
  setFieldValue,
  setFieldTouched,
  setClientValidationError,
  resetSubmissionState,
  closeSubmissionModal
} = formRendererSlice.actions;

export default formRendererSlice.reducer;
