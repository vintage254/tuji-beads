'use client';

export const metadata = {
  title: 'Tuji Beads Studio',
  description: 'Content management for Tuji Beads',
};

export default function StudioLayout({ children }) {
  return (
    <div style={{ height: '100vh' }}>
      {children}
    </div>
  );
}
