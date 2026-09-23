import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useToast } from "../toastContext.js";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/projects/create", {
        name: projectName,
        details: projectDetails,
      });

      toast.success("Project created successfully.");
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "We couldn't create this project. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Page Header */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-gray-500">Projects</p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create a new project
            </h1>

            <p className="mt-2 text-gray-600">
              Add the details of your project to start tracking your work.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {error && (
              <div className="mb-4 flex items-center justify-center rounded-lg bg-red-100 p-4">
                <X
                  className="mr-2 h-5 w-5 cursor-pointer text-red-700"
                  onClick={() => setError(null)}
                  aria-label="Dismiss error"
                />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Project Name */}
              <div>
                <label
                  htmlFor="projectName"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Project Name
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  Give your project a clear and memorable name.
                </p>

                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  placeholder="e.g. DevBoard"
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  required
                  className="mt-3 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="projectDetails"
                  className="block text-sm font-semibold text-gray-900"
                >
                  Details
                </label>

                <p className="mt-1 text-sm text-gray-500">
                  Briefly describe what this project is about.
                </p>

                <textarea
                  id="projectDetails"
                  name="projectDetails"
                  rows={5}
                  placeholder="Describe your project..."
                  onChange={(e) => setProjectDetails(e.target.value)}
                  value={projectDetails}
                  required
                  className="mt-3 block w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateProject;
