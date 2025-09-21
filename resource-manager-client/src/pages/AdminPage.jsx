import UserManagementDashboard from '../components/admin/UserManagementDashboard';

const AdminPage = () => {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">User Management</h2>
      </header>
      <p className="text-sm text-[#84858c] mb-6">
        Here you can modify the roles and seniority levels of users in the system.
      </p>
      <UserManagementDashboard />
    </>
  );
};

export default AdminPage;
