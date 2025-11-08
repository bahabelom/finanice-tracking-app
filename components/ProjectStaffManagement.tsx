'use client';

import { useState } from 'react';
import { useFinancial } from '@/context/FinancialContext';
import { ProjectStaff } from '@/types';
import { Plus, Edit2, Trash2, X, Users, Mail, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';

function ProjectStaffForm({ 
  staff, 
  onClose 
}: { 
  staff?: ProjectStaff; 
  onClose: () => void;
}) {
  const { addProjectStaff, updateProjectStaff, projects } = useFinancial();
  const [formData, setFormData] = useState({
    fullName: staff?.fullName || '',
    dutyBaseZone: staff?.dutyBaseZone || '',
    dutyBaseWereda: staff?.dutyBaseWereda || '',
    phone: staff?.phone || '',
    email: staff?.email || '',
    projectId: staff?.projectId || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (staff) {
      updateProjectStaff(staff.id, formData);
    } else {
      addProjectStaff(formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {staff ? 'Edit Project Staff' : 'Register Project Staff'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Assigned Project *
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Duty Base - Zone *
              </label>
              <input
                type="text"
                value={formData.dutyBaseZone}
                onChange={(e) => setFormData({ ...formData, dutyBaseZone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                placeholder="Enter zone"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Duty Base - Wereda *
              </label>
              <input
                type="text"
                value={formData.dutyBaseWereda}
                onChange={(e) => setFormData({ ...formData, dutyBaseWereda: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                placeholder="Enter wereda"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 font-medium"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
            >
              {staff ? 'Update' : 'Register'} Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectStaffManagement() {
  const { projectStaff, deleteProjectStaff, projects } = useFinancial();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<ProjectStaff | undefined>();
  const [filterProject, setFilterProject] = useState<string>('all');

  const handleEdit = (staff: ProjectStaff) => {
    setEditingStaff(staff);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingStaff(undefined);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingStaff(undefined);
  };

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Unknown';
  };

  const filteredStaff = filterProject === 'all' 
    ? projectStaff 
    : projectStaff.filter(s => s.projectId === filterProject);

  const sortedStaff = [...filteredStaff].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="w-6 h-6 text-indigo-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Project Staff</h2>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-800 font-medium"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Register Staff
          </button>
        </div>
      </div>

      {projectStaff.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium text-slate-600">No project staff registered yet</p>
          <p className="text-sm mt-2 text-slate-500">Click "Register Staff" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedStaff.map((staff) => {
            const projectName = getProjectName(staff.projectId);
            
            return (
              <div
                key={staff.id}
                className="p-5 border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-lg bg-white transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-slate-800">{staff.fullName}</h3>
                      <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full">
                        {projectName}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        <span className="text-slate-700">
                          <span className="font-semibold text-slate-800">Zone:</span> {staff.dutyBaseZone}
                          {', '}
                          <span className="font-semibold text-slate-800">Wereda:</span> {staff.dutyBaseWereda}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-5 h-5 text-green-600" />
                        <span className="text-slate-700 font-medium">{staff.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="text-slate-700 font-medium">{staff.email}</span>
                      </div>
                      
                      <div className="text-xs text-slate-500 font-medium">
                        Registered: {format(new Date(staff.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Staff"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${staff.fullName}?`)) {
                          deleteProjectStaff(staff.id);
                        }
                      }}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Staff"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isFormOpen && (
        <ProjectStaffForm staff={editingStaff} onClose={handleClose} />
      )}
    </div>
  );
}

