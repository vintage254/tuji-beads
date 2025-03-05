export const metadata = {
  title: 'Studio',
  description: 'Tuji Beads Studio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
