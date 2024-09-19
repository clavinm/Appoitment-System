import Joi from "joi";
import { asyncHandler } from "../utils/asyncHandler.js";

const authSchema = asyncHandler(async (req, _, next) => {

    const schema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(6).max(16).required()
    });
    const result = await schema.validateAsync(req.body);
    req.user = result;
    next();
});

export { authSchema };
