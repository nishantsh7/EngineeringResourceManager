import CapacityDashboard from "../components/assignments/CapacityDashboard"

const TeamPage = () => {
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-dark-text">Team Capacity</h2>
      </header>
      <CapacityDashboard />
    </>
  );
};

export default TeamPage;
