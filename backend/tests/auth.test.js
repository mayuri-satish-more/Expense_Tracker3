import { jest } from "@jest/globals";
import protect from "../middleware/authMiddleware.js";

describe("Auth Middleware", () => {
  test("should reject request when authorization header is missing", async () => {
    const req = {
      headers: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Not authorized. Please login.",
    });

    expect(next).not.toHaveBeenCalled();
  });
});