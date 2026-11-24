import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchPublicForm,
  submitPublicForm,
  setFieldValue,
  setFieldTouched,
  resetSubmissionState,
  closeSubmissionModal
} from '../store/slices/formRendererSlice';
import DynamicFormRenderer from '../components/formRenderer/DynamicFormRenderer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FormInput, AlertTriangle, ArrowLeft } from 'lucide-react';

const PublicFormPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();

  const {
    formDefinition,
    values,
    errors,
    touched,
    loading,
    submitting,
    submitSuccess,
    submissionId,
    submittedRecord,
    error
  } = useSelector((state) => state.formRenderer);

  useEffect(() => {
    if (formId) {
      dispatch(fetchPublicForm({ formId }));
    }
  }, [formId, dispatch]);

  const handleChange = (key, value) => {
    dispatch(setFieldValue({ key, value }));
  };

  const handleBlur = (key) => {
    dispatch(setFieldTouched(key));
  };

  const handleSubmit = (submittedValues) => {
    dispatch(submitPublicForm({ formId, values: submittedValues }));
  };

  const handleReset = () => {
    dispatch(resetSubmissionState());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <LoadingSpinner size="lg" message="Loading form definition..." />
      </div>
    );
  }

  if (error && !formDefinition) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Form Unavailable</h2>
          <p className="text-xs text-slate-500 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/20 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <FormInput className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-800 text-sm">FormForge Dynamic Portal</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Secured & Encrypted</span>
      </div>

      {/* Dynamic Form Engine */}
      <DynamicFormRenderer
        form={formDefinition}
        values={values}
        errors={errors}
        touched={touched}
        onChange={handleChange}
        onBlur={handleBlur}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitSuccess={submitSuccess}
        submissionId={submissionId}
        submittedRecord={submittedRecord}
        onReset={handleReset}
        onCloseModal={() => dispatch(closeSubmissionModal())}
      />
    </div>
  );
};

export default PublicFormPage;
