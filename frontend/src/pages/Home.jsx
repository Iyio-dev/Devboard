import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  BarChart3,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-2xl font-bold tracking-tight">
            Dev<span className="text-blue-500">Board</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-24 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
              <CheckCircle2 size={16} />
              Simple project management
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
              Turn your projects into
              <span className="block text-blue-500">progress.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              DevBoard helps you organize projects, manage tasks, and track
              your progress from one simple dashboard.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-900"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-slate-800 bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold">
                Everything you need to stay organized
              </h2>

              <p className="mt-4 text-slate-400">
                Keep your projects, tasks, and progress in one place.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<FolderKanban size={24} />}
                title="Manage Projects"
                description="Create, update, view, and organize your projects from a centralized dashboard."
              />

              <FeatureCard
                icon={<ListTodo size={24} />}
                title="Track Tasks"
                description="Break projects into manageable tasks and mark them complete as you progress."
              />

              <FeatureCard
                icon={<BarChart3 size={24} />}
                title="Track Progress"
                description="See how much of your project has been completed with simple progress tracking."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center sm:p-16">
            <h2 className="text-3xl font-bold">
              Ready to organize your next project?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Start managing your projects and tasks with DevBoard.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              Create Your Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} DevBoard</p>

          <p>Built with React, Node.js, Express & MongoDB</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 transition hover:border-slate-700">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </div>
  );
};

export default Home;
