import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { currentUser } = useAuth();
  return <h1>Welcome, {currentUser?.email}</h1>;
}

export default Dashboard;
