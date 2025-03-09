import AdminLogoutButton from '../../components/AdminLogoutButton';

export const metadata = {
  title: 'Beads Charm Collection Studio (Direct)',
  description: 'Direct access to Beads Charm Collection content management',
};

export default function StudioDirectLayout({ children }) {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {children}
      <AdminLogoutButton />
    </div>
  );
} 