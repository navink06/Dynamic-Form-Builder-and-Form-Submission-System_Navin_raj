import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSubmissions,
  deleteSubmission,
  setActiveSubmission
} from '../store/slices/submissionsSlice';
import SubmissionDetailModal from '../components/submissions/SubmissionDetailModal';
import Pagination from '../components/submissions/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import DebouncedSearchInput from '../components/common/DebouncedSearchInput';
import LiveFormModal from '../components/common/LiveFormModal';
import { submissionsApi } from '../api/submissionsApi';
import {
  ArrowLeft,
  Download,
  Trash2,
  Eye,
  FileSpreadsheet,
  Calendar,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';

const FormSubmissionsPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    submissions,
    formContext,
    pagination,
    activeSubmission,
    loading,
    deletingId,
    error
  } = useSelector((state) => state.submissions);

  const [searchFilter, setSearchFilter] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  useEffect(() => {
    if (formId) {
      dispatch(fetchSubmissions({ formId, page: 1, limit: 10 }));
    }
  }, [formId, dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchSubmissions({ formId, page: newPage, limit: pagination.limit }));
  };

  const handleViewDetail = (sub) => {
    dispatch(setActiveSubmission(sub));
    setIsDetailOpen(true);
  };

  const handleDelete = (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      dispatch(deleteSubmission({ formId, submissionId }));
    }
  };

  const handleExportCSV = () => {
    const exportUrl = submissionsApi.getExportUrl(formId);
    const token = localStorage.getItem('token');
    // Direct download trigger with auth token fetch
    fetch(exportUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formContext?.name || 'form'}_submissions_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => alert('Export failed: ' + err.message));
  };

  const fields = formContext?.fields || [];
  // Pick primary first 4 columns for table view
  const previewFields = fields.slice(0, 4);

  // Performance Optimization: Memoize filtered submissions list
  // Note: All React hooks MUST be declared before any conditional early returns
  const filteredSubmissions = useMemo(() => {
    if (!searchFilter.trim()) return submissions || [];
    const term = searchFilter.toLowerCase();
    return (submissions || []).filter((sub) => {
      const strData = JSON.stringify(sub.data || {}).toLowerCase();
      return strData.includes(term);
    });
  }, [submissions, searchFilter]);

  if (loading && !formContext) {
    return <LoadingSpinner size="lg" message="Loading submissions..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {formContext?.name || 'Form Submissions'}
                </h1>
                <Badge variant={formContext?.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {formContext?.department} • Total Submissions: {pagination.totalCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {formContext?.status === 'published' && (
              <button
                type="button"
                onClick={() => setIsLiveModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-brand-600" /> Open Live Form
              </button>
            )}

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={pagination.totalCount === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Search bar & count summary */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <DebouncedSearchInput
            value={searchFilter}
            onChange={setSearchFilter}
            placeholder="Search response data..."
            className="w-full sm:w-80"
          />

          <div className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredSubmissions.length}</span> records on this page
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <EmptyState
              icon={FileSpreadsheet}
              title="No submissions recorded yet"
              description="Share the published form link with users to start collecting data."
              action={
                formContext?._id && (
                  <button
                    type="button"
                    onClick={() => setIsLiveModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm"
                  >
                    Open Live Form
                  </button>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3.5 px-4"># ID</th>
                    <th className="py-3.5 px-4">Submitted At</th>
                    {previewFields.map((f) => (
                      <th key={f.key} className="py-3.5 px-4">
                        {f.label}
                      </th>
                    ))}
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredSubmissions.map((sub, idx) => {
                    const rowNum = (pagination.page - 1) * pagination.limit + idx + 1;
                    return (
                      <tr key={sub._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-500 font-semibold">
                          #{rowNum}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {new Date(sub.createdAt).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </td>
                        {previewFields.map((f) => {
                          const val = sub.data?.[f.key];
                          let rendered = '—';
                          if (val !== undefined && val !== null && val !== '') {
                            rendered = Array.isArray(val) ? val.join(', ') : String(val);
                          }
                          return (
                            <td key={f.key} className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                              {rendered}
                            </td>
                          );
                        })}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleViewDetail(sub)}
                            className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors mr-1"
                            title="View Full Submission"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === sub._id}
                            onClick={() => handleDelete(sub._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Delete Submission"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Submission Detail Modal */}
      <SubmissionDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        submission={activeSubmission}
        form={formContext}
      />

      {/* Live Form Modal (Zero Navigation) */}
      <LiveFormModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        form={formContext}
        formId={formId}
        onSubmissionSuccess={() => dispatch(fetchSubmissions({ formId, page: pagination.page, limit: pagination.limit }))}
      />
    </div>
  );
};

export default FormSubmissionsPage;
