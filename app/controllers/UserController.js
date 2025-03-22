import { CreateProfileService, ReadProfileService, UserOTPService, VerifyOTPService } from "../services/UserServices.js";

// OTP controller
export const UserOTP = async (req, res) => {
    let result = await UserOTPService(req);
    return res.status(200).json(result);
};

// Login controller
export const VerifyLogin = async (req, res) => {
    let result = await VerifyOTPService(req);

    if (result["status"] === "success") {
        // Cookies Option (Fixing issues)
        let cookieOption = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Fixed expiration time
            httpOnly: true, // Secure against XSS
            secure: process.env.NODE_ENV === "production", // Secure only in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" // Cross-site cookies for production
        };

        // Set Cookie With Response
        res.cookie("token", result["token"], cookieOption);
        return res.status(200).json(result);
    } else {
        return res.status(200).json(result);
    }
};

// Logout controller
export const UserLogout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    return res.status(200).json({ status: "success" });
};

// Update profile controller
export const UpdateProfile = async (req, res) => {
    let result = await CreateProfileService(req);
    return res.status(200).json(result);
};

// Read profile controller
export const ReadProfile = async (req, res) => {
    let result = await ReadProfileService(req);
    return res.status(200).json(result);
};
