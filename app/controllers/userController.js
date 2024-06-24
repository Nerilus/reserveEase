const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  try {
    if (!req.body.currentUserAdmin) {
        return res.status(403).json({ message: "Access denied. Only admins can view users." });
      }
    const users = await User.findAll(); 
    const usersWithoutPassword = users.map((user) => {
      const { password, ...otherDetails } = user.toJSON(); 
      return otherDetails;
    });
    res.status(200).json(usersWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getUser = async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findByPk(id);
      if (user) {
        const { password, ...otherDetails } = user.toJSON(); 
        res.status(200).json(otherDetails);
      } else {
        res.status(404).json({ message: "No such user" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message }); 
    }
  };


  exports.deleteUser = async (req, res) => {
    console.log('deleteUser controller called');
    const id = req.params.id;
    const { currentUserId, currentUserAdmin } = req.body;
  
    // console.log('Request body:', req.body);
  
    if (currentUserId == id || currentUserAdmin) {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        await user.destroy();
        res.status(200).json("User deleted successfully");
      } catch (error) {
        // console.log('Deletion error:', error);
        res.status(500).json({ message: error.message });
      }
    } else {
    //   console.log('Access denied: currentUserId:', currentUserId, 'id:', id, 'currentUserAdmin:', currentUserAdmin);
      res.status(403).json("Access denied");
    }
  };