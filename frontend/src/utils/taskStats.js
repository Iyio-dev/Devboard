export const getTaskStats = (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "completed").length;
    const inProgress = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
        total,
        completed,
        inProgress,
        completionRate,
    }
}

