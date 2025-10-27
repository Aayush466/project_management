export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.error("Async Handler Error:", error);

        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate key error: user already exists",
                details: error.keyValue,
            });
        }

        // If invalid status code, default to 500
        const statusCode =
            typeof error.code === "number" && error.code >= 100 && error.code < 600
                ? error.code
                : 500;

        res.status(statusCode).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
