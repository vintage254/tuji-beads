import AdminLogoutButton from '../../components/AdminLogoutButton';

export const metadata = {
  title: 'Tuji Beads Studio',
  description: 'Content management for Tuji Beads',
};

export default function StudioLayout({ children }) {
  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {children}
      <AdminLogoutButton />
    </div>
  );
}
