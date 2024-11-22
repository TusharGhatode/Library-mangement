

import React from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddCenter from "./components/masterAdmin-pages/Addcenter/AddCenter";
import CenterAdmin from "./components/masterAdmin-pages/centerAdmin/CenterAdmin";
import ManageBook from "./components/masterAdmin-pages/book-management/ManageBook";
import AddManager from "./components/masterAdmin-pages/managerManagement/AddManager";
import AddStudent from "./components/masterAdmin-pages/student-management/addStudent";
import Approval from "./components/masterAdmin-pages/approval-section/Approval";
import AddAccount from "./components/masterAdmin-pages/manage-accounts/center-admin/AddAccount";
import CenterDetails from "./components/masterAdmin-pages/Addcenter/centerDetail/CenterDetails";
import Comine from "./components/masterAdmin-pages/student/Comine";
import Combine from "./components/masterAdmin-pages/manage-accounts/owner-account/OwnerCombine";
import Combined from "./components/masterAdmin-pages/returnbook/Combined";
import ProfileCombine from './components/profile/ProfileCombine'

function App() {
  return (
    <div className="dark:bg-gray-600">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addCenter" element={<AddCenter />} />
          <Route path="/addBook" element={<ManageBook />} />
          <Route path="/addCenterAdmin" element={<CenterAdmin />} />
          <Route path="/addManager" element={<AddManager />} />
          <Route path="/addStudentCenter" element={<AddStudent />} />
          <Route path="/approve" element={<Approval />} />
          <Route path="/centerAdmin" element={<AddAccount />} />
          <Route path="/centerdetails" element={<CenterDetails />} />
          <Route path="/books" element={<Comine />} />
          <Route path="/returnbook" element={<Combined />} />
          <Route path="/addOwner" element={<Combine />} />
          <Route path="/profile" element={<ProfileCombine />} />






        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
