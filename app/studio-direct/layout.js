import AdminLogoutButton from '../../components/AdminLogoutButton';

export const metadata = {
  title: 'Tuji Beads Studio (Direct)',
  description: 'Direct access to Tuji Beads content management',
};

export default function StudioDirectLayout({ children }) {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {children}
      <AdminLogoutButton />
    </div>
  );
} 