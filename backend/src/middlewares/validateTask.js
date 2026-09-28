const validateTask = (req, res, next) => {
    const { name, details } = req.body;

    if (!name || !details) {
        return next({
            status: 400,
            message: "Name and details are required",
        });
    }

    if (typeof name !== "string" || typeof details !== "string") {
        return next({
            status: 400,
            message: "Name and details must be strings",
        });
    }

    if (name.trim().length < 3) {
        return next({
            status: 400,
            message: "Task name must be at least 3 characters",
        });
    }

    next();
};

export default validateTask;