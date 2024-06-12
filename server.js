if (process.env.NODE_ENV !== "production") {
<<<<<<< HEAD
  require("dotenv").config();
}
const app = require(".");
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
=======
    require("dotenv").config();
  }
  const app = require(".");
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
  });
  
  
>>>>>>> master
