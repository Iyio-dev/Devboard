export const statByProject = (tasks) => {
    return tasks.reduce((acc, task) => {
        const key = task._id;

        if (!acc[key]) {
            acc[key] = {
                total: 0,
                completed: 0,
            }
        }

        acc[key].total += 1;

        if (task.status === "completed") {
            acc[key].completed += 1;
        }

        return acc;
    }, {});
    
}