const getSignupPage = (req, res) => { 
  res.render("forms/signup");
};

const createUser = (req, res) => { 
  console.log("created user");
  res.redirect("/");
};

module.exports = {
  getSignupPage,
  createUser
}