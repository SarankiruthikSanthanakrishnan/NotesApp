import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface UserProfile {
  username: string;
  email: string;
  contact: string;
  profile_image: string | null;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // ---------------- FETCH USER ----------------
  const fetchUserData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me', {
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = async () => {
    if (!profileImage) return;

    const formData = new FormData();
    formData.append('profile_image', profileImage);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/upload-profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      toast.success('Profile image updated');

      setUser((prev) =>
        prev ? { ...prev, profile_image: res.data.profile_image } : prev
      );

      setProfileImage(null);
    } catch (error) {
      console.error(error);
      toast.error('Image upload failed');
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout Successfully');
      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Logout failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-600 to-purple-600">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 to-purple-200 py-12 px-4">
      <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800">
        Profile Page
      </h2>

      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl bg-white p-6 shadow-xl text-center">
          <img
            src={
              user?.profile_image
                ? `http://localhost:5000${user.profile_image}?t=${Date.now()}`
                : 'https://placehold.co/300x300'
            }
            alt="Profile"
            className="mx-auto h-48 w-48 rounded-full object-cover border-4 border-purple-300"
          />

          <h5 className="mt-4 text-xl font-bold text-gray-800">
            {user?.username}
          </h5>

          <p className="mt-2 text-gray-600">
            <span className="font-semibold">Email:</span> {user?.email}
          </p>

          <p className="text-gray-600">
            <span className="font-semibold">Contact:</span> {user?.contact}
          </p>

          <input
            type="file"
            accept="image/*"
            className="mt-4 w-full rounded-lg border border-gray-300 p-2 text-sm"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];

                if (!file.type.startsWith('image/')) {
                  toast.error('Only image files allowed');
                  return;
                }

                if (file.size > 2 * 1024 * 1024) {
                  toast.error('Image must be below 2MB');
                  return;
                }

                setProfileImage(file);
              }
            }}
          />

          <button
            className="mt-4 w-full rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 transition disabled:opacity-50"
            onClick={handleImageUpload}
            disabled={!profileImage}
          >
            Upload Image
          </button>

          <button
            className="mt-3 w-full rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
