import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loadFormForEdit,
  saveForm,
  initNewForm,
  addField,
  updateField,
  deleteField,
  moveField,
  setSelectedFieldId,
  updateMetadata,
  setActiveViewMode,
  clearBuilderErrors,
} from "../store/slices/formBuilderSlice";
import FieldPalette from "../components/formBuilder/FieldPalette";
import FieldCard from "../components/formBuilder/FieldCard";
import FieldConfigModal from "../components/formBuilder/FieldConfigModal";
import FormMetadataModal from "../components/formBuilder/FormMetadataModal";
import DynamicFormRenderer from "../components/formRenderer/DynamicFormRenderer";
import Badge from "../components/common/Badge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  Save,
  Globe,
  SlidersHorizontal,
  Eye,
  PenTool,
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  Plus,
  Layers,
  Share2,
} from "lucide-react";

const FormBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    currentForm,
    selectedFieldId,
    activeViewMode,
    isDirty,
    loading,
    saving,
    error,
    saveSuccessMessage,
  } = useSelector((state) => state.formBuilder);

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [previewValues, setPreviewValues] = useState({});
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(loadFormForEdit(id));
    } else {
      dispatch(initNewForm());
    }
    return () => {
      dispatch(clearBuilderErrors());
    };
  }, [id, dispatch]);

  const selectedField = (currentForm.fields || []).find(
    (f) => f.id === selectedFieldId,
  );

  const handleAddField = (type, label) => {
    dispatch(addField({ type, label }));
  };

  const handleFieldSelect = (fieldId) => {
    dispatch(setSelectedFieldId(fieldId));
    setIsConfigOpen(true);
  };

  const handleSaveFieldConfig = (updatedField) => {
    dispatch(updateField({ id: updatedField.id, updates: updatedField }));
  };

  const handleSaveForm = async (statusOverride = null) => {
    const payload = statusOverride ? { status: statusOverride } : {};
    const resultAction = await dispatch(saveForm(payload));
    if (saveForm.fulfilled.match(resultAction)) {
      if (!id && resultAction.payload._id) {
        navigate(`/builder/${resultAction.payload._id}`, { replace: true });
      }
    }
  };

  const handleCopyLink = () => {
    if (!currentForm._id) return;
    const url = `${window.location.origin}/forms/${currentForm._id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading form structure..." />;
  }

  const fields = currentForm.fields || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top sticky action toolbar */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Back & Title info */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  {currentForm.name || "Untitled Form"}
                </h1>
                <Badge variant={currentForm.status} />
                {isDirty && (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Unsaved Changes
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {currentForm.department} • {fields.length}{" "}
                {fields.length === 1 ? "field" : "fields"}
              </p>
            </div>
          </div>

          {/* Right: Mode toggle, Settings, Save, Publish */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => dispatch(setActiveViewMode("builder"))}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeViewMode === "builder"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" /> Builder
              </button>
              <button
                type="button"
                onClick={() => dispatch(setActiveViewMode("preview"))}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeViewMode === "preview"
                    ? "bg-white text-brand-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Live Preview
              </button>
            </div>

            {/* Form Settings */}
            <button
              type="button"
              onClick={() => setIsMetadataOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              Settings
            </button>

            {/* Copy Public Link (if saved) */}
            {currentForm._id && currentForm.status === "published" && (
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-lg transition-colors"
              >
                {copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copiedLink ? "Copied URL!" : "Copy Form URL"}
              </button>
            )}

            {/* Save as Draft */}
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveForm("draft")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              {saving ? "Saving..." : "Save Draft"}
            </button>

            {/* Publish Form */}
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveForm("published")}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              <Globe className="w-3.5 h-3.5" />
              {currentForm.status === "published"
                ? "Update & Keep Published"
                : "Publish Form"}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications / Alerts banner */}
      {error && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-4">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              {error}
            </span>
            <button
              onClick={() => dispatch(clearBuilderErrors())}
              className="font-bold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 mt-4">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              {saveSuccessMessage}
            </span>
            <button
              onClick={() => dispatch(clearBuilderErrors())}
              className="font-bold underline ml-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {activeViewMode === "preview" ? (
          /* Live Interactive Form Preview */
          <div className="py-6">
            <DynamicFormRenderer
              form={currentForm}
              values={previewValues}
              isPreview={true}
              onChange={(key, val) =>
                setPreviewValues((prev) => ({ ...prev, [key]: val }))
              }
              onBlur={() => {}}
              onSubmit={() => {
                alert(
                  "Live Preview: Form is valid and would submit successfully in production!",
                );
              }}
            />
          </div>
        ) : (
          /* Visual Builder Mode */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 4 Cols: Field Palette */}
            <div className="lg:col-span-4 sticky top-36">
              <FieldPalette onAddField={handleAddField} />
            </div>

            {/* Right 8 Cols: Form Canvas */}
            <div className="lg:col-span-8 space-y-4">
              {/* Canvas Header card */}
              <div
                onClick={() => setIsMetadataOpen(true)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-brand-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {currentForm.name || "Untitled Form"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentForm.description ||
                        "Click to edit form description and metadata..."}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
                    Edit Settings
                  </span>
                </div>
              </div>

              {/* Field Cards List */}
              {fields.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    Your canvas is empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    Click any element from the left panel to add inputs,
                    dropdowns, and checkboxes to your form.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAddField("TEXT", "Full Name")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add First Field
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <FieldCard
                      key={field.id}
                      field={field}
                      index={index}
                      totalFields={fields.length}
                      isSelected={field.id === selectedFieldId}
                      onSelect={() => handleFieldSelect(field.id)}
                      onMoveUp={() =>
                        dispatch(moveField({ index, direction: "up" }))
                      }
                      onMoveDown={() =>
                        dispatch(moveField({ index, direction: "down" }))
                      }
                      onDelete={() => dispatch(deleteField(field.id))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Field Configuration Drawer / Modal */}
      <FieldConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        field={selectedField}
        onSave={handleSaveFieldConfig}
      />

      {/* Form Metadata Settings Modal */}
      <FormMetadataModal
        isOpen={isMetadataOpen}
        onClose={() => setIsMetadataOpen(false)}
        metadata={currentForm}
        onSave={(updated) => dispatch(updateMetadata(updated))}
      />
    </div>
  );
};

export default FormBuilderPage;
