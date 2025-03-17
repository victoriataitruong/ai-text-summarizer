import './globals.css'; // Import global styles (Tailwind)

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 font-sans">
        <div className="container mx-auto py-8">{children}</div>
      </body>
    </html>
  );
}
