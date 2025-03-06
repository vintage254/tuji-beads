'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/admin-logout');
      
      if (response.ok) {
        toast.success('Logged out successfully');
        // Redirect to admin login page
        router.push('/admin-login');
      } else {
        toast.error('Failed to log out');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999
      }}
    >
      Admin Logout
    </button>
  );
}
