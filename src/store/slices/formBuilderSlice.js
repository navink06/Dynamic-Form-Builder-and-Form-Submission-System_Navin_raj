import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formsApi } from '../../api/formsApi';

const defaultFormTemplate = {
  name: 'Untitled Form',
  description: '',
  department: 'General',
  designation: 'Staff',
  role: 'User',
  creatorMail: '',
  creatorMobile: '',
  creatorGender: 'Not Specified',
  status: 'draft',
  fields: []
};

const initialState = {
  currentForm: { ...defaultFormTemplate },
  selectedFieldId: null,
  activeViewMode: 'builder', // 'builder' | 'preview'
  isDirty: false,
  loading: false,
  saving: false,
  error: null,
  saveSuccessMessage: null
};

// Async thunk to fetch an existing form for editing
export const loadFormForEdit = createAsyncThunk(
  'formBuilder/loadFormForEdit',
  async (formId, { rejectWithValue }) => {
    try {
      const response = await formsApi.fetchFormById(formId, true);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load form');
    }
  }
);

// Async thunk to save form (create if new, update if existing)
export const saveForm = createAsyncThunk(
  'formBuilder/saveForm',
  async (overrideData = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().formBuilder;
      const payload = {
        ...state.currentForm,
        ...overrideData
      };

      let response;
      if (payload._id) {
        response = await formsApi.updateForm(payload._id, payload);
      } else {
        response = await formsApi.createForm(payload);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save form');
    }
  }
);

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    initNewForm: (state, action) => {
      state.currentForm = {
        ...defaultFormTemplate,
        name: action.payload?.name || 'Untitled Dynamic Form',
        fields: action.payload?.fields || []
      };
      state.selectedFieldId = null;
      state.isDirty = false;
      state.error = null;
      state.activeViewMode = 'builder';
    },

    updateMetadata: (state, action) => {
      state.currentForm = {
        ...state.currentForm,
        ...action.payload
      };
      state.isDirty = true;
    },

    addField: (state, action) => {
      const newField = {
        id: `fld_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        key: `field_${Date.now().toString(36)}`,
        label: action.payload.label || 'New Field',
        type: action.payload.type || 'TEXT',
        placeholder: '',
        defaultValue: action.payload.type === 'CHECKBOX' ? [] : '',
        required: false,
        options: ['SELECT', 'RADIO', 'CHECKBOX'].includes(action.payload.type)
          ? [
              { label: 'Option 1', value: 'option_1' },
              { label: 'Option 2', value: 'option_2' }
            ]
          : [],
        validation: {
          minLength: null,
          maxLength: null,
          min: null,
          max: null,
          pattern: null,
          customError: ''
        },
        order: state.currentForm.fields.length
      };

      state.currentForm.fields.push(newField);
      state.selectedFieldId = newField.id;
      state.isDirty = true;
    },

    updateField: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.currentForm.fields.findIndex((f) => f.id === id);
      if (index !== -1) {
        state.currentForm.fields[index] = {
          ...state.currentForm.fields[index],
          ...updates
        };
        state.isDirty = true;
      }
    },

    deleteField: (state, action) => {
      const id = action.payload;
      state.currentForm.fields = state.currentForm.fields.filter((f) => f.id !== id);
      // Re-index order
      state.currentForm.fields.forEach((f, idx) => {
        f.order = idx;
      });
      if (state.selectedFieldId === id) {
        state.selectedFieldId = null;
      }
      state.isDirty = true;
    },

    moveField: (state, action) => {
      const { index, direction } = action.payload;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= state.currentForm.fields.length) return;

      const fields = [...state.currentForm.fields];
      const [movedItem] = fields.splice(index, 1);
      fields.splice(targetIndex, 0, movedItem);

      // Re-assign order properties
      fields.forEach((f, idx) => {
        f.order = idx;
      });

      state.currentForm.fields = fields;
      state.isDirty = true;
    },

    reorderAllFields: (state, action) => {
      state.currentForm.fields = action.payload.map((f, idx) => ({
        ...f,
        order: idx
      }));
      state.isDirty = true;
    },

    setSelectedFieldId: (state, action) => {
      state.selectedFieldId = action.payload;
    },

    setActiveViewMode: (state, action) => {
      state.activeViewMode = action.payload;
    },

    clearBuilderErrors: (state) => {
      state.error = null;
      state.saveSuccessMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load form for editing
      .addCase(loadFormForEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFormForEdit.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload;
        state.isDirty = false;
        state.selectedFieldId = action.payload.fields?.[0]?.id || null;
      })
      .addCase(loadFormForEdit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Save form
      .addCase(saveForm.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.saveSuccessMessage = null;
      })
      .addCase(saveForm.fulfilled, (state, action) => {
        state.saving = false;
        state.currentForm = action.payload;
        state.isDirty = false;
        state.saveSuccessMessage = `Form "${action.payload.name}" saved successfully!`;
      })
      .addCase(saveForm.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      });
  }
});

export const {
  initNewForm,
  updateMetadata,
  addField,
  updateField,
  deleteField,
  moveField,
  reorderAllFields,
  setSelectedFieldId,
  setActiveViewMode,
  clearBuilderErrors
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;
