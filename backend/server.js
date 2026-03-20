const App = require("./index");

const PORT = process.env.PORT || 8000;

App.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
