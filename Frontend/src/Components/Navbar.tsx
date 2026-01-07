import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const { user } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-white font-semibold border-b-2 border-white'
      : 'text-gray-300 hover:text-white';

  return (
    <nav className="bg-gray-900 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <img src="./src/assets/logo.png" alt="logo" className="h-8 w-8" />
          <NavLink to="/" className="text-xl font-bold text-white">
            Notes App
          </NavLink>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {user && (
            <span className="text-sm text-gray-300">
              Hi,{' '}
              <span className="font-semibold text-white">{user.username}</span>
            </span>
          )}

          {user ? (
            <>
              <NavLink to="/" className={navClass}>
                Home
              </NavLink>
              <NavLink to="/profile" className={navClass}>
                Profile
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
