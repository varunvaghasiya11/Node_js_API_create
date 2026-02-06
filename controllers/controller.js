const bcrypt = require("bcrypt");
const usermodel = require("../models/usermodel");
const { generateToken } = require("../utils/jwt");
const standardmodel = require("../models/standard");
const subjectmodel = require("../models/subject");
const attendenceModel = require("../models/attendence");

const calculateAttendanceForStudent = async (studentId) => {
    const attendanceRecords = await attendenceModel.find({
        "records.studentId": studentId
    });

    let totalDays = 0;
    let presentDays = 0;

    attendanceRecords.forEach(doc => {
        const studentRecord = doc.records.find(r => r.studentId.toString() === studentId.toString());
        if (studentRecord) {
            totalDays++;
            if (studentRecord.status === 'present') {
                presentDays++;
            }
        }
    });

    const percentage = totalDays === 0 ? 0 : ((presentDays / totalDays) * 100).toFixed(2);

    return {
        totalDays,
        presentDays,
        percentage: percentage + "%"
    };
}


const register = async (req, res) => {
    try {
        const { username, email, firstname, lastname, password } = req.body;

        if (!username || !email || !firstname || !lastname || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await usermodel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const existingEmail = await usermodel.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await usermodel.create({ username, firstname, lastname, email, password: hashedPassword });

        return res.status(200).json({ message: "User registered successfully", data: user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await usermodel.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }

        const token = generateToken({ id: user.id, role: user.role });

        return res.status(200).json({ message: "User logged in successfully", token: token })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const AdminDashboard = async (req, res) => {
    try {
        return res.status(200).json({ message: "AdminDashboard" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const TeacherDashboard = async (req, res) => {
    try {
        return res.status(200).json({ message: "teacherDashboard" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
const StudentDashboard = async (req, res) => {
    try {
        const studentId = req.user.id;
        const attendance = await calculateAttendanceForStudent(studentId);

        return res.status(200).json({
            message: "studentDashboard",
            data: {
                attendance
            }
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const admincontroller = async (req, res) => {
    try {
        return res.status(200).json({ message: "Admin" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const teachercontroller = async (req, res) => {
    try {
        return res.status(200).json({ message: "Teacher" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const studentcontroller = async (req, res) => {
    try {
        return res.status(200).json({ message: "Student" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createteacher = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password, subject, standard } = req.body;

        if (!firstname || !lastname || !username || !email || !password || !subject) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await usermodel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const existingEmail = await usermodel.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const subjectArray = subject.split(" ")
        console.log("subjectArray :", subjectArray[0])

        const checkSubject = async () => {
            for (let i = 0; i < subjectArray.length; i++) {
                const isSubject = await subjectmodel.findOne({ subject: subjectArray[i] })
                console.log("isSubject running", isSubject)

                if (!isSubject) {
                    console.log("this subject not found in Db")
                    return subjectArray[i]; // Return the missing subject
                }

            }
            return true
        }

        const subjectCheck = await checkSubject();
        if (subjectCheck !== true) {
            return res.json({ "massage": `subject '${subjectCheck}' not found` })
        }

        if (!standard) {
            return res.status(400).json({ message: "Standard is required" });
        }
        const isStandard = await standardmodel.findOne({ standard });
        if (!isStandard) {
            return res.json({ "massage": "standard not found" })
        }
        const standardId = isStandard._id;

        const subjectIDArray = [];

        for (let i = 0; i < subjectArray.length; i++) {
            const subject = await subjectmodel.findOne({ subject: subjectArray[i] })
            subjectIDArray.push(subject._id)
        }


        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await usermodel.create({ firstname, lastname, username, email, password: hashedPassword, role: 'teacher', subject: subjectIDArray, standard: standardId });

        return res.status(200).json({ message: "teacher registered successfully", data: user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createstudent = async (req, res) => {
    try {
        const { firstname, lastname, username, email, password, standard } = req.body;

        if (!firstname || !lastname || !username || !email || !password || !standard) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await usermodel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const existingEmail = await usermodel.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const isStandard = await standardmodel.findOne({ standard });
        if (!isStandard) {
            return res.json({ "massage": "standard not found" })
        }
        const standardId = isStandard._id
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await usermodel.create({ firstname, lastname, username, email, password: hashedPassword, role: "student", standard: standardId });

        return res.status(200).json({ message: "student registered successfully", data: user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const viewstudent = async (req, res) => {
    try {
        let query = { role: "student", isDeleted: false };

        if (req.user.role === "teacher") {
            const teacher = await usermodel.findById(req.user.id);
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            query.standard = teacher.standard;
        }

        const users = await usermodel.find(query).select("-password");

        if (!users || users.length === 0) {
            return res.status(400).json({ message: "students not found" })
        }

        const studentData = await Promise.all(users.map(async (user) => {
            const attendance = await calculateAttendanceForStudent(user._id);
            return {
                ...user.toObject(),
                attendance
            };
        }));

        return res.status(200).json({ message: "students", data: studentData })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const viewteacher = async (req, res) => {
    try {
        const users = await usermodel.find({ role: "teacher" }).select("-password");
        return res.status(200).json({ message: "teachers", data: users })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const editteacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, username, email, password } = req.body;
        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await usermodel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const existingEmail = await usermodel.findOne({ email });

        if (existingEmail && existingEmail.id !== id) {
            return res.status(400).json({ message: "Email already exists" })
        }

        let updateData = { firstname, lastname, username, email, role: "teacher" };
        if (password) {
            updateData.password = bcrypt.hashSync(password, 10);
        }

        const { standard } = req.body;
        if (standard) {
            const isStandard = await standardmodel.findOne({ standard });
            if (!isStandard) {
                return res.json({ "massage": "standard not found" })
            }
            updateData.standard = isStandard._id;
        }

        const user = await usermodel.findByIdAndUpdate(id, updateData, { new: true });
        return res.status(200).json({ message: "teacher updated successfully", data: user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const editstudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, username, email, password } = req.body;
        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await usermodel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const existingEmail = await usermodel.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await usermodel.findByIdAndUpdate(id, { firstname, lastname, username, email, password: hashedPassword, role: "student" });
        return res.status(200).json({ message: "student updated successfully", data: user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deletestudent = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await usermodel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: Date.now() });
        return res.status(200).json({ message: "student deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const deleteteacher = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await usermodel.findByIdAndDelete(id);
        return res.status(200).json({ message: "teacher deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



const createstandard = async (req, res) => {
    try {
        const { standard } = req.body;
        if (!standard) {
            return res.status(400).json({ message: "standard is required" })
        }
        const existingStandard = await standardmodel.findOne({ standard });
        if (existingStandard) {
            return res.status(400).json({ message: "standard already exists" })
        }
        const Standard = await standardmodel.create({ standard });
        return res.status(200).json({ message: "standard created successfully", data: Standard })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const createSubject = async (req, res) => {
    try {
        const { subject, standardId } = req.body;
        if (!subject || !standardId) {
            return res.status(400).json({ message: "subject and standardId are required" })
        }
        const existingSubject = await subjectmodel.findOne({ subject });
        if (existingSubject) {
            return res.status(400).json({ message: "subject already exists" })
        }
        const existingStandard = await standardmodel.findById(standardId);
        if (!existingStandard) {
            return res.status(400).json({ message: "Standard not found" })
        }
        const Subject = await subjectmodel.create({ subject, standardId });
        return res.status(200).json({ message: "subject created successfully", data: Subject })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const viewallstudent = async (req, res) => {
    try {
        let query = {
            role: "student",
            isDeleted: false
        };

        if (req.user.role === "teacher") {
            const teacher = await usermodel.findById(req.user.id);

            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            query.standard = teacher.standard;
        }

        const students = await usermodel
            .find(query)
            .select("-password")
            .populate("standard");

        const studentData = await Promise.all(students.map(async (student) => {
            const attendance = await calculateAttendanceForStudent(student._id);
            return {
                ...student.toObject(),
                attendance
            };
        }));

        return res.status(200).json({
            message: "students",
            data: studentData
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const attendence = async (req, res) => {
    try {
        const { date, studentId, status } = req.body

        const attendanceDate = date || new Date().toISOString().split('T')[0];

        if (!studentId || !status) {
            return res.status(400).json({ message: "StudentId and status are required" })
        }

        await attendenceModel.create({
            date: attendanceDate,
            records: [
                {
                    studentId,
                    status
                }
            ],
            markedBy: req.user.id
        })
        res.json({ "massage": "attendence marked for student " })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { register, login, admincontroller, teachercontroller, studentcontroller, AdminDashboard, TeacherDashboard, StudentDashboard, createteacher, createstudent, viewstudent, viewteacher, deletestudent, deleteteacher, createstandard, createSubject, editteacher, editstudent, viewallstudent, attendence }


