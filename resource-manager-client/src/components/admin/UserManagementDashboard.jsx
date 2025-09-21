import { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useManageUsers } from '../../hooks/useManageUsers';
import useAuthStore from '../../store/authStore';

// This is a single, editable row in our user table
const UserRow = ({ user }) => {
  const { profile: loggedInUser } = useAuthStore();
  const [role, setRole] = useState(user.role);
  const [seniority, setSeniority] = useState(user.seniority);
  const { updateUserAsAdmin, isLoading } = useManageUsers();

  const hasChanged = user.role !== role || user.seniority !== seniority;

  const handleUpdate = async () => {
    const updateData = { role, seniority };
    await updateUserAsAdmin(user.id, updateData);
  };

  // A user cannot edit their own role or seniority
  const isSelf = user.id === loggedInUser.id;

  return (
    <tr>
      <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="font-medium text-white">{user.name}</div>
        <div className="text-[#A9A9A9]">{user.email}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          disabled={isSelf || isLoading}
          className="bg-[#101010] border border-[#2D2D2D] rounded-md p-1 disabled:opacity-50"
        >
          <option value="Manager">Manager</option>
          <option value="Engineer">Engineer</option>
        </select>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
        <select 
          value={seniority} 
          onChange={(e) => setSeniority(e.target.value)}
          disabled={isSelf || isLoading}
          className="bg-[#101010] border border-[#2D2D2D] rounded-md p-1 disabled:opacity-50"
        >
          <option value="Junior">Junior</option>
          <option value="Mid">Mid-level</option>
          <option value="Senior">Senior</option>
        </select>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button 
          onClick={handleUpdate}
          disabled={!hasChanged || isSelf || isLoading}
          className="py-1 px-3 bg-[#1a1b26] text-[#e4ddbc] text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </td>
    </tr>
  );
};


const UserManagementDashboard = () => {
  const { users, loading, error } = useUsers();

  if (loading) {
    return <p className="text-center mt-8 text-[#A9A9A9]">Loading users...</p>;
  }
  if (error) {
    return <p className="text-center mt-8 text-red-500">Error: {error.message}</p>;
  }

  return (
    <div className="bg-[#101010] border border-[#1a1f29] rounded-xl mt-6">
      <table className="min-w-full divide-y divide-[#1a1f29]">
        <thead className="bg-[#1f1f1f]">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[#EAEAEA] sm:pl-6">User</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#EAEAEA]">Role</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#EAEAEA]">Seniority</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Save</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1f29]">
          {users.map((user) => (
            <UserRow key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementDashboard;
