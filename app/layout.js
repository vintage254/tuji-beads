import '../styles/globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'Tuji Beads',
  description: 'Tuji Beads Application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
