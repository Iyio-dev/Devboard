const errorMiddleware = (err, req, res, next) => {
    console.error("Unhandled error:", err);

    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "ValidationError") {
        status = 400;
        message = "Invalid data";
    }

    if (err.code === 11000) {
        status = 409;
        message = "A user with this information already exists";
    }

    res.status(status).json({
        success: false,
        message,
    });
};

export default errorMiddleware;