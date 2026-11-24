import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formsApi } from '../../api/formsApi';

const initialState = {
  items: [],
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  filters: {
    status: '',
    search: '',
    department: ''
  },
  loading: false,
  error: null,
  deleteLoadingId: null
};

export const fetchFormsList = createAsyncThunk(
  'forms/fetchFormsList',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().forms;
      const mergedParams = {
        page: params.page || state.pagination.page,
        limit: params.limit || state.pagination.limit,
        status: params.status !== undefined ? params.status : state.filters.status,
        search: params.search !== undefined ? params.search : state.filters.search,
        department: params.department !== undefined ? params.department : state.filters.department
      };
      const response = await formsApi.fetchForms(mergedParams);
      return {
        forms: response.data,
        meta: response.meta,
        filters: {
          status: mergedParams.status,
          search: mergedParams.search,
          department: mergedParams.department
        }
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch forms');
    }
  }
);

export const deleteExistingForm = createAsyncThunk(
  'forms/deleteExistingForm',
  async (formId, { rejectWithValue }) => {
    try {
      await formsApi.deleteForm(formId);
      return formId;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete form');
    }
  }
);

export const toggleFormStatus = createAsyncThunk(
  'forms/toggleFormStatus',
  async ({ formId, status }, { rejectWithValue }) => {
    try {
      const response = await formsApi.updateForm(formId, { status });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update form status');
    }
  }
);

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setFilterStatus: (state, action) => {
      state.filters.status = action.payload;
      state.pagination.page = 1;
    },
    setFilterSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.page = 1;
    },
    setFilterDepartment: (state, action) => {
      state.filters.department = action.payload;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearFormErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Forms
      .addCase(fetchFormsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormsList.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.forms;
        state.pagination = action.payload.meta;
        state.filters = action.payload.filters;
      })
      .addCase(fetchFormsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Form
      .addCase(deleteExistingForm.pending, (state, action) => {
        state.deleteLoadingId = action.meta.arg;
      })
      .addCase(deleteExistingForm.fulfilled, (state, action) => {
        state.deleteLoadingId = null;
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.pagination.totalCount = Math.max(0, state.pagination.totalCount - 1);
      })
      .addCase(deleteExistingForm.rejected, (state, action) => {
        state.deleteLoadingId = null;
        state.error = action.payload;
      })

      // Toggle Status
      .addCase(toggleFormStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.items.findIndex((item) => item._id === updated._id);
        if (index !== -1) {
          state.items[index] = updated;
        }
      });
  }
});

export const {
  setFilterStatus,
  setFilterSearch,
  setFilterDepartment,
  setPage,
  clearFormErrors
} = formsSlice.actions;

export default formsSlice.reducer;
