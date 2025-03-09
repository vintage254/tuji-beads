import AdminLogoutButton from '../../components/AdminLogoutButton';

export const metadata = {
  title: 'Beads Charm Collection Studio',
  description: 'Content management for Beads Charm Collection',
};

export default function StudioLayout({ children }) {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {children}
      <AdminLogoutButton />
    </div>
  );
}
