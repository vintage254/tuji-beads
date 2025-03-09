import '../styles/globals.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'Beads Charm Collection',
  description: 'Beads Charm Collection - Handcrafted beaded jewelry and accessories',
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
