const bcrypt = require("bcrypt");
const usermodel = require("../models/usermodel");
const { generateToken } = require("../utils/jwt");
const standardmodel = require("../models/standard");
const subjectmodel = require("../models/subject");

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
        return res.status(200).json({ message: "studentDashboard" })
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
        const { firstname, lastname, username, email, password, subject } = req.body;

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

        const checkSubject = async ()=>{
            for(let i = 0 ; i < subjectArray.length; i++){
                const isSubject = await subjectmodel.findOne({subject : subjectArray[i]})
                console.log("isSubject running" , isSubject)
    
                if(!isSubject){
                    console.log("this subject not found in Db")
                    return false 
                }
                
            }
            return true
        }
        
        if(!(await checkSubject())){
            return res.json({"massage" : "subject not found"})
        }

        const subjectIDArray =[];

        for(let i =0 ; i < subjectArray.length ; i++){
             const subject =  await subjectmodel.findOne({subject : subjectArray[i]})
            subjectIDArray.push(subject._id)
        }


        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await usermodel.create({ firstname, lastname, username, email, password: hashedPassword, role: 'teacher', subject });

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

        const isStandard = await standardmodel.findOne({standard});
        if(!isStandard){
            return res.json({"massage" : "standard not found"})
        }
        const standardId = isStandard._id 
        const hashedPassword = bcrypt.hashSync(password,10);

        const user = await usermodel.create({ firstname, lastname, username, email, password: hashedPassword, role: "student", standard : standardId });

        return res.status(200).json({ message: "student registered successfully", data: user })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const viewstudent = async (req, res) => {
    try {
        const users = await usermodel.find({ role: "student" }).select("-password");
        return res.status(200).json({ message: "students", data: users })
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
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await usermodel.findByIdAndUpdate(id, { firstname, lastname, username, email, password: hashedPassword, role: "teacher" });
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
        const user = await usermodel.findByIdAndDelete(id);
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

module.exports = { register, login, admincontroller, teachercontroller, studentcontroller, AdminDashboard, TeacherDashboard, StudentDashboard, createteacher, createstudent, viewstudent, viewteacher, deletestudent, deleteteacher, createstandard, createSubject, editteacher, editstudent }


