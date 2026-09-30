import {
  CheckCircle2,
  Circle,
  FileEdit,
  FolderPlus,
  FolderX,
  ListPlus,
  ListX,
  RotateCcw,
} from "lucide-react";

const activityConfig = {
  project_created: {
    icon: FolderPlus,
    label: "Created project",
    iconClass: "text-blue-600 bg-blue-50",
  },

  project_updated: {
    icon: FileEdit,
    label: "Updated project",
    iconClass: "text-gray-600 bg-gray-100",
  },

  project_deleted: {
    icon: FolderX,
    label: "Deleted project",
    iconClass: "text-red-600 bg-red-50",
  },

  task_created: {
    icon: ListPlus,
    label: "Created task",
    iconClass: "text-blue-600 bg-blue-50",
  },

  task_updated: {
    icon: FileEdit,
    label: "Updated task",
    iconClass: "text-gray-600 bg-gray-100",
  },

  task_completed: {
    icon: CheckCircle2,
    label: "Completed task",
    iconClass: "text-green-600 bg-green-50",
  },

  task_reopened: {
    icon: RotateCcw,
    label: "Reopened task",
    iconClass: "text-orange-600 bg-orange-50",
  },

  task_deleted: {
    icon: ListX,
    label: "Deleted task",
    iconClass: "text-red-600 bg-red-50",
  },
};

const ActivityItem = ({ activity }) => {
  const config =
    activityConfig[activity.type] || {
      icon: Circle,
      label: "Activity",
      iconClass: "text-gray-500 bg-gray-100",
    };

  const Icon = config.icon;

  return (
    <div className="relative flex gap-4 py-3">
      <div
        className={`relative z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${config.iconClass}`}
      >
        <Icon size={15} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm text-gray-800 leading-5">
          {activity.message}
        </p>

        <div className="flex items-center gap-2 mt-1">
          {activity.project?.name && (
            <>
              <span className="text-xs text-gray-500">
                {activity.project.name}
              </span>

              <span className="text-gray-300">•</span>
            </>
          )}

          <span className="text-xs text-gray-400">
            {activity.createdAt
              ? new Date(activity.createdAt).toLocaleString()
              : "Just now"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;