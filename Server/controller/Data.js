import UserData from "../model/userdata.js";

// Controller to handle POST request to store user data
export const postdata = async (req, res) => {
  try {
    const { data } = req.body;

    let userData = await UserData.findOne({ user: req.user });

    if (userData) {
      userData.data = data;
    } else {
      userData = new UserData({
        user: req.user,
        data: [data],
      });
    }

    await userData.save();
    res.status(201).json({ message: "Data saved successfully", userData });
  } catch (error) {
    console.error("Error in postdata controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getdata = async (req, res) => {
  try {
    const userData = await UserData.findOne({ user: req.user });

    if (!userData) {
      return res.status(404).json({ error: "No data found for this user" });
    }

    res
      .status(200)
      .json({ message: "Data retrieved successfully", data: userData.data });
  } catch (error) {
    console.error("Error in getdata controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
