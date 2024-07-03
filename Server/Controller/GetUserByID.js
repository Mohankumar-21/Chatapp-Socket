const UserModel = require("../Schema/User");

const GetUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId)
    const user = await UserModel.findById(userId).select("-password"); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = GetUserById;
