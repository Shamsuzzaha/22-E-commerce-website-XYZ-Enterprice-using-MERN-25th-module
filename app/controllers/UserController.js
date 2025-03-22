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
        // Cookies Option (Fixed expiration time)
        let cookieOption = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiration
            httpOnly: true, // Secure against XSS attacks
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" // Allow cross-site requests in production
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
    // Set cookie expiration to a past date to immediately expire the cookie
    res.clearCookie("token", {
        expires: new Date(Date.now() - 24 * 60 * 60 * 1000), // Expire the cookie immediately
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
