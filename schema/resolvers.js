const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Employee = require('../models/Employee');
require('dotenv').config();

const resolvers = {
    Query: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error('User not found');

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Incorrect password');

            return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        },
        getAllEmployees: async () => await Employee.find(),
        getEmployeeById: async (_, { id }) => await Employee.findById(id),
        searchEmployee: async (_, { designation, department }) => {
            return await Employee.find({ $or: [{ designation }, { department }] });
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();
            return user;
        },
        addEmployee: async (_, args) => {
            const employee = new Employee(args);
            await employee.save();
            return employee;
        },
        updateEmployee: async (_, { id, ...updates }) => {
            return await Employee.findByIdAndUpdate(id, updates, { new: true });
        },
        deleteEmployee: async (_, { id }) => {
            await Employee.findByIdAndDelete(id);
            return 'Employee deleted successfully';
        }
    }
};

module.exports = resolvers;
