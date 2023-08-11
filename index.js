const express = require('express');
const app = express();
const cors = require('cors');

const PORT =  process.env.PORT || 5000 ;

app.use(cors());
app.use(express.json());

const connectToMongo = require("./src/mongodb/config");
connectToMongo();

//routes
app.use("/api/user", require("./src/api/user"));
app.use("/api/admin", require("./src/api/admin"));




app.listen(PORT, ()=>{
    console.log("Server is running on port " + PORT );
})