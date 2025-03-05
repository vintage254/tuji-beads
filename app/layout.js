import '../styles/globals.css';

export const metadata = {
  title: 'Tuji Beads',
  description: 'Tuji Beads Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
