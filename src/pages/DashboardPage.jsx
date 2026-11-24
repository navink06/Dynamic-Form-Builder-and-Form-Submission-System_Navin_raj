import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchFormsList,
  deleteExistingForm,
  setFilterStatus,
  setFilterSearch,
  setPage
} from '../store/slices/formsSlice';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/submissions/Pagination';
import DebouncedSearchInput from '../components/common/DebouncedSearchInput';
import LiveFormModal from '../components/common/LiveFormModal';
import {
  PlusCircle,
  Search,
  FileSpreadsheet,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Files,
  CheckCircle,
  FileText
} from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: forms, pagination, filters, loading, deleteLoadingId } = useSelector(
    (state) => state.forms
  );

  const [copiedId, setCopiedId] = useState(null);
  const [liveModalForm, setLiveModalForm] = useState(null);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  const handleOpenLiveForm = useCallback((form) => {
    setLiveModalForm(form);
    setIsLiveModalOpen(true);
  }, []);

  useEffect(() => {
    dispatch(fetchFormsList({ page: pagination.page }));
  }, [dispatch, pagination.page, filters.status, filters.search]);

  // Performance Optimization: Debounced search callback to prevent unnecessary Redux dispatches
  const handleSearchChange = useCallback((term) => {
    dispatch(setFilterSearch(term));
  }, [dispatch]);

  const handleStatusChange = useCallback((e) => {
    dispatch(setFilterStatus(e.target.value));
  }, [dispatch]);

  const handleDelete = useCallback((formId, formName) => {
    if (window.confirm(`Are you sure you want to delete "${formName}" and all its submissions?`)) {
      dispatch(deleteExistingForm(formId));
    }
  }, [dispatch]);

  const handleCopyLink = useCallback((formId) => {
    const url = `${window.location.origin}/forms/${formId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // Performance Optimization: Memoize summary metrics to avoid recalculating on each render
  const { totalSubmissions, publishedCount, draftCount } = useMemo(() => {
    const totalSubs = forms.reduce((acc, f) => acc + (f.submissionCount || 0), 0);
    const pub = forms.filter((f) => f.status === 'published').length;
    const draft = forms.filter((f) => f.status === 'draft').length;
    return { totalSubmissions: totalSubs, publishedCount: pub, draftCount: draft };
  }, [forms]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Forms & Submissions Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Build dynamic scalable forms, track live submissions, and export analytics.
            </p>
          </div>

          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Form</span>
          </Link>
        </div>

        {/* Analytics Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Files className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Forms</p>
              <h3 className="text-2xl font-black text-slate-900">{pagination.totalCount}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Published Active</p>
              <h3 className="text-2xl font-black text-slate-900">{publishedCount}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Drafts</p>
              <h3 className="text-2xl font-black text-slate-900">{draftCount}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Submissions Logged</p>
              <h3 className="text-2xl font-black text-slate-900">{totalSubmissions}</h3>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Performance Optimized Debounced Search Input */}
          <DebouncedSearchInput
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search forms by name, department..."
            className="w-full sm:w-80"
          />

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Forms Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading && forms.length === 0 ? (
            <LoadingSpinner size="lg" message="Loading forms..." />
          ) : forms.length === 0 ? (
            <EmptyState
              icon={Files}
              title="No forms found"
              description="Get started by creating your first dynamic form with custom fields."
              action={
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Create New Form
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Form Title & Department</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Fields Count</th>
                    <th className="py-3.5 px-4">Submissions</th>
                    <th className="py-3.5 px-4">Created Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {forms.map((form) => (
                    <tr key={form._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">{form.name}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>{form.department || 'General'}</span>
                          {form.designation && <span>• {form.designation}</span>}
                          {form.role && <span>({form.role})</span>}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <Badge variant={form.status} />
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap font-medium text-slate-600">
                        {form.fields?.length || 0} fields
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <Link
                          to={`/admin/forms/${form._id}/submissions`}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 font-bold transition-colors"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                          <span>{form.submissionCount || 0} Submissions</span>
                        </Link>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Live Public URL button */}
                          {form.status === 'published' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleCopyLink(form._id)}
                                title="Copy Public Form Link"
                                className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                              >
                                {copiedId === form._id ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenLiveForm(form)}
                                title="Open Live Form in Modal"
                                className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Builder edit */}
                          <Link
                            to={`/builder/${form._id}`}
                            title="Edit Form in Builder"
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete Form */}
                          <button
                            type="button"
                            disabled={deleteLoadingId === form._id}
                            onClick={() => handleDelete(form._id, form.name)}
                            title="Delete Form"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.limit}
            onPageChange={(page) => dispatch(setPage(page))}
          />
        </div>
      </div>

      {/* Live Form Popup Modal (Zero Page Navigation) */}
      <LiveFormModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        form={liveModalForm}
        formId={liveModalForm?._id}
        onSubmissionSuccess={() => dispatch(fetchFormsList({ page: pagination.page }))}
      />
    </div>
  );
};

export default DashboardPage;
