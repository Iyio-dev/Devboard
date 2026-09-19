import { useState } from "react";
import { X, Pencil } from "lucide-react";
import api from "../services/api";

const UpdateProject = ({ project, onClose, onUpdated, onError }) => {
  const [projectName, setProjectName] = useState(project?.name || "");
  const [projectDetails, setProjectDetails] = useState(project?.details || "");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      await api.put(`/projects/update/${project?._id}`,{
        name: projectName,
        details: projectDetails
      })

      const updatedProject = {
        ...project,
        name: projectName,
        details: projectDetails,
      };

      onUpdated(updatedProject);
      onClose();
      onError(null)
    } catch (error) {
        onError(
        error.response?.data?.message ||
          "An error occurred while updating the project.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Pencil size={20} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Project
              </h2>
              <p className="text-sm text-gray-500">
                Update your project information
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Project Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project Name
            </label>

            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              placeholder="Describe your project"
              rows="5"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProject;
