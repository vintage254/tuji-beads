import '../styles/globals.css';
import ClientLayout from './client-layout';

export const metadata = {
  title: 'Tuji Beads',
  description: 'Tuji Beads Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
