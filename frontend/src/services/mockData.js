// Mock data and services for the HR application

// Mock employees data
export const MOCK_EMPLOYEES = [
  {
    id: "EMP001",
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Developer",
    join_date: "2023-01-15",
    status: "Active",
    user_id: "user1",
  },
  {
    id: "EMP002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    join_date: "2023-03-20",
    status: "Active",
    user_id: "user2",
  },
  {
    id: "EMP003",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    department: "HR",
    position: "HR Specialist",
    join_date: "2022-11-10",
    status: "Active",
    user_id: "user3",
  },
];

// Mock attendance data
export const MOCK_ATTENDANCE = [
  {
    id: 1,
    employee_id: "EMP001",
    date: "2025-06-25",
    check_in_time: "09:00",
    check_out_time: "17:30",
    work_hours: "8.5",
    status: "Present",
    work_type: "Office",
  },
  {
    id: 2,
    employee_id: "EMP001",
    date: "2025-06-24",
    check_in_time: "09:15",
    check_out_time: "17:45",
    work_hours: "8.5",
    status: "Present",
    work_type: "Office",
  },
];

// Mock user credentials
export const MOCK_USERS = [
  {
    id: "user1",
    email: "john.doe@company.com",
    password: "password123",
    role: "employee",
  },
  {
    id: "user2",
    email: "jane.smith@company.com",
    password: "password123",
    role: "employee",
  },
  {
    id: "user3",
    email: "mike.johnson@company.com",
    password: "password123",
    role: "hr",
  },
  {
    id: "admin",
    email: "admin@company.com",
    password: "admin123",
    role: "ceo",
  },
];

// Mock authentication service
export const mockAuth = {
  signIn: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password,
        );
        if (user) {
          const authUser = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
          localStorage.setItem("currentUser", JSON.stringify(authUser));
          resolve({ data: { user: authUser }, error: null });
        } else {
          resolve({
            data: { user: null },
            error: { message: "Invalid credentials" },
          });
        }
      }, 500);
    });
  },

  signUp: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingUser = MOCK_USERS.find((u) => u.email === email);
        if (existingUser) {
          resolve({
            data: { user: null },
            error: { message: "User already exists" },
          });
        } else {
          const newUser = {
            id: `user${Date.now()}`,
            email,
            password,
            role: "employee",
          };
          MOCK_USERS.push(newUser);
          resolve({
            data: { user: { id: newUser.id, email: newUser.email } },
            error: null,
          });
        }
      }, 500);
    });
  },

  signOut: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem("currentUser");
        resolve({ error: null });
      }, 100);
    });
  },

  getUser: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userStr = localStorage.getItem("currentUser");
        if (userStr) {
          const user = JSON.parse(userStr);
          resolve({ data: { user }, error: null });
        } else {
          resolve({ data: { user: null }, error: null });
        }
      }, 100);
    });
  },
};

// Mock employee service
export const mockEmployeeService = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = JSON.parse(
          localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES),
        );
        resolve({ data: employees, error: null });
      }, 300);
    });
  },

  create: async (employee) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = JSON.parse(
          localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES),
        );
        const newEmployee = { ...employee, user_id: `user${Date.now()}` };
        employees.push(newEmployee);
        localStorage.setItem("employees", JSON.stringify(employees));
        resolve({ data: newEmployee, error: null });
      }, 500);
    });
  },

  update: async (id, updates) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = JSON.parse(
          localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES),
        );
        const index = employees.findIndex((emp) => emp.id === id);
        if (index !== -1) {
          employees[index] = { ...employees[index], ...updates };
          localStorage.setItem("employees", JSON.stringify(employees));
          resolve({ data: employees[index], error: null });
        } else {
          resolve({ data: null, error: { message: "Employee not found" } });
        }
      }, 500);
    });
  },

  delete: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employees = JSON.parse(
          localStorage.getItem("employees") || JSON.stringify(MOCK_EMPLOYEES),
        );
        const filteredEmployees = employees.filter((emp) => emp.id !== id);
        localStorage.setItem("employees", JSON.stringify(filteredEmployees));
        resolve({ error: null });
      }, 300);
    });
  },
};

// Initialize localStorage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem("employees")) {
    localStorage.setItem("employees", JSON.stringify(MOCK_EMPLOYEES));
  }
  if (!localStorage.getItem("attendance")) {
    localStorage.setItem("attendance", JSON.stringify(MOCK_ATTENDANCE));
  }
};
