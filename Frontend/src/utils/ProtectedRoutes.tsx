import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ProtectedRoutes = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <span className="spinner-border text-primary"></span>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};
