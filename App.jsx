// App Component with Routing
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white font-sans">
        <nav className="bg-black/70 backdrop-blur sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-yellow-400 font-bold text-xl">Siddhivinayak Mart</h1>
          <ul className="flex space-x-4 text-sm md:text-base">
            <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-yellow-400">Products</Link></li>
            <li><Link to="/bakery" className="hover:text-yellow-400">Bakery</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/bakery" element={<BakeryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>

        <footer className="mt-20 text-center py-6 text-gray-400 text-sm animate-fadeIn">
          &copy; 2025 Siddhivinayak A-Z Saving Mart. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}
What 