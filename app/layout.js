import '../styles/globals.css';
import '../styles/product-details.css';
import Providers from '../components/Providers';

export const metadata = {
  title: 'Beads Charm Collection',
  description: 'Beautiful handcrafted beads and accessories',
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
