import { get, set, del, createStore } from 'idb-keyval';

const store = createStore('attendance-db', 'attendance-store');

export interface User {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean;
  employeeId?: number;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  createdAt: string;
  userId: number;
}

export interface Attendance {
  id: number;
  employeeId: number;
  checkIn: string;
  checkOut: string | null;
  date: string;
}

export const db = {
  async initializeDb() {
    const users = await get('users', store);
    if (!users) {
      await set('users', [
        {
          id: 1,
          username: 'admin',
          password: 'admin123',
          isAdmin: true,
        },
      ], store);
      await set('employees', [], store);
      await set('attendance', [], store);
      await set('sequences', { users: 1, employees: 0, attendance: 0 }, store);
    }
  },

  async getUser(username: string, password: string, isAdmin?: boolean): Promise<User | null> {
    const users: User[] = await get('users', store) || [];
    return users.find(
      u => u.username === username && 
      u.password === password && 
      (isAdmin === undefined || u.isAdmin === isAdmin)
    ) || null;
  },

  async registerEmployee(data: {
    username: string;
    password: string;
    name: string;
    email: string;
    position: string;
    department: string;
  }): Promise<Employee> {
    const users: User[] = await get('users', store) || [];
    const employees: Employee[] = await get('employees', store) || [];
    const sequences = await get('sequences', store) || { users: 0, employees: 0, attendance: 0 };

    // Check if username already exists
    if (users.some(u => u.username === data.username)) {
      throw new Error('Username already exists');
    }

    // Create user
    const userId = sequences.users + 1;
    const employeeId = sequences.employees + 1;

    const user: User = {
      id: userId,
      username: data.username,
      password: data.password,
      isAdmin: false,
      employeeId,
    };

    const employee: Employee = {
      id: employeeId,
      name: data.name,
      email: data.email,
      position: data.position,
      department: data.department,
      createdAt: new Date().toISOString(),
      userId,
    };

    await set('users', [...users, user], store);
    await set('employees', [...employees, employee], store);
    await set('sequences', { ...sequences, users: userId, employees: employeeId }, store);

    return employee;
  },

  async getEmployees(): Promise<Employee[]> {
    return await get('employees', store) || [];
  },

  async getEmployee(id: number): Promise<Employee | null> {
    const employees: Employee[] = await get('employees', store) || [];
    return employees.find(e => e.id === id) || null;
  },

  async removeEmployee(id: number): Promise<void> {
    const employees: Employee[] = await get('employees', store) || [];
    const users: User[] = await get('users', store) || [];
    const attendance: Attendance[] = await get('attendance', store) || [];

    const employee = employees.find(e => e.id === id);
    if (!employee) return;

    // Remove related records
    const updatedEmployees = employees.filter(e => e.id !== id);
    const updatedUsers = users.filter(u => u.id !== employee.userId);
    const updatedAttendance = attendance.filter(a => a.employeeId !== id);

    await set('employees', updatedEmployees, store);
    await set('users', updatedUsers, store);
    await set('attendance', updatedAttendance, store);
  },

  async getAttendance(date?: string): Promise<Attendance[]> {
    const attendance: Attendance[] = await get('attendance', store) || [];
    if (date) {
      return attendance.filter(a => a.date === date);
    }
    return attendance;
  },

  async getEmployeeAttendance(employeeId: number): Promise<Attendance[]> {
    const attendance: Attendance[] = await get('attendance', store) || [];
    return attendance.filter(a => a.employeeId === employeeId);
  },

  async markAttendance(employeeId: number, type: 'checkIn' | 'checkOut'): Promise<Attendance> {
    const attendance: Attendance[] = await get('attendance', store) || [];
    const sequences = await get('sequences', store) || { attendance: 0 };
    const today = new Date().toISOString().split('T')[0];
    
    const existingRecord = attendance.find(
      a => a.employeeId === employeeId && a.date === today
    );

    if (existingRecord) {
      if (type === 'checkOut' && !existingRecord.checkOut) {
        existingRecord.checkOut = new Date().toISOString();
        await set('attendance', attendance, store);
        return existingRecord;
      }
      throw new Error(type === 'checkIn' ? 'Already checked in today' : 'Already checked out today');
    }

    if (type === 'checkOut') {
      throw new Error('Must check in first');
    }

    const newRecord: Attendance = {
      id: sequences.attendance + 1,
      employeeId,
      checkIn: new Date().toISOString(),
      checkOut: null,
      date: today
    };

    await set('attendance', [...attendance, newRecord], store);
    await set('sequences', { ...sequences, attendance: sequences.attendance + 1 }, store);
    
    return newRecord;
  }
};

// Initialize the database
db.initializeDb();