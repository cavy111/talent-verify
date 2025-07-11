import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CompanyList from './pages/company/CompanyList';
import AddCompanyDepartment from './pages/company/AddCompanyDepartment';
import CompanyDetail from './pages/company/CompanyDetail';
import EmployeeList from './pages/employee/EmployeeList';
import AddEmployee from './pages/employee/AddEmployee';
import AddEmploymentRecord from './pages/employee/AddEmploymentRecord';
import UpdateEmploymentRecord from './pages/employee/UpdateEmploymentRecord';
import EmployeeDetail from './pages/employee/EmployeeDetail';
import BulkUpload from './pages/BulkUpload';
// import NotFound from './pages/NotFound';
// import Unauthorized from './pages/Unauthorized';

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/companies" element={<PrivateRoute><CompanyList /></PrivateRoute>} />
          <Route path="/add-department/:id" element={<PrivateRoute><AddCompanyDepartment /></PrivateRoute>} />
          <Route path="/companies/:id" element={<PrivateRoute><CompanyDetail /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
          <Route path="/employees/:id" element={<PrivateRoute><EmployeeDetail /></PrivateRoute>} />
          <Route path="/add-employee" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
          <Route path="/add-employment-record/:id" element={<PrivateRoute><AddEmploymentRecord /></PrivateRoute>} />
          <Route path="/employees/:employeeId/employment-record/:recordId/update" element={<PrivateRoute><UpdateEmploymentRecord /></PrivateRoute>} />
          <Route path="/bulk-upload" element={<PrivateRoute roles={['admin', 'company']}><BulkUpload /></PrivateRoute>} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;