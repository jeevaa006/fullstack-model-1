require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// MONGODB CONNECTION
// ==========================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.name);
    })
    .catch((error) => {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    });


// ==========================
// EMPLOYEE SCHEMA
// ==========================

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    },

    designation: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true
    }
});

const Employee = mongoose.model("Employee", employeeSchema);


// ==========================
// HOME
// ==========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// ==========================
// Q1
// ==========================

app.get("/q1", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../q1/index.html")
    );
});


// ==========================
// Q2
// ==========================

app.get("/q2", (req, res) => {
    res.sendFile(
        path.join(__dirname, "q2.html")
    );
});


// ==========================
// SEARCH EMPLOYEE
// ==========================

app.get("/employee/:employeeId", async (req, res) => {

    console.log(
        "Searching employee:",
        req.params.employeeId
    );

    try {

        const employee = await Employee.findOne({
            employeeId: req.params.employeeId
        }).lean();

        console.log("Search result:", employee);

        if (!employee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        res.json(employee);

    } catch (error) {

        console.log("Search error:", error);

        res.status(500).json({
            message: error.message
        });

    }
});


// ==========================
// UPDATE SALARY
// ==========================

app.put("/employee/:employeeId", async (req, res) => {

    console.log(
        "Updating:",
        req.params.employeeId,
        "Salary:",
        req.body.salary
    );

    try {

        const employee =
            await Employee.findOneAndUpdate(
                {
                    employeeId: req.params.employeeId
                },
                {
                    $set: {
                        salary: Number(req.body.salary)
                    }
                },
                {
                    new: true
                }
            ).lean();

        if (!employee) {

            return res.status(404).json({
                message: "Employee not found"
            });

        }

        res.json(employee);

    } catch (error) {

        console.log("Update error:", error);

        res.status(500).json({
            message: error.message
        });

    }
});


// ==========================
// START SERVER
// ==========================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});