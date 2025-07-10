import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) return setLoading(false);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setRole(userDoc.data().role);
      }
      setLoading(false);
    };

    checkRole();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!role || role !== requiredRole) return <Navigate to="/service" />;

  return children;
};

export default ProtectedRoute;
