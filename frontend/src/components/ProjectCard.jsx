import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";

import api from "../services/api";

import { useParams } from "react-router-dom";

const ProjectCard = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/projects/${id}`);

      setProject(response.data.message);
    } catch (error) {
      console.error("Error fetching project:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while fetching the project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
          <p className="text-gray-500">Loading project...</p>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-red-600">
              Error
            </h2>

            <p className="mt-2 text-gray-600">
              {error}
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              {project?.name}
            </h1>

            <p className="mt-3 text-gray-600">
              {project?.details}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectCard;
