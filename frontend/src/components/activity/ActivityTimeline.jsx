import ActivityItem from "./ActivityItem";
import { Link } from "react-router-dom";

const ActivityTimeline = ({ activities = [] }) => {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 my-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Keep track of what&apos;s happening across your projects.
          </p>
        </div>
          <Link
            to="/activity"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            View All
          </Link>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <span className="text-gray-400 text-lg">•</span>
          </div>

          <p className="text-sm font-medium text-gray-700">
            No activity yet
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Your project activity will appear here.
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItem
                key={activity._id}
                activity={activity}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ActivityTimeline;