// Contact Page
function ContactPage() {
  return (
    <main className="px-6 md:px-20 py-10">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Contact & Visit Us</h1>
      <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 mb-10 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-yellow-300 mb-4 text-center">📍 Store Information</h2>
        <ul className="space-y-3 text-gray-300 text-base">
          <li><strong className="text-white">🏪 Store:</strong> Siddhivinayak A-Z Saving Mart</li>
          <li><strong className="text-white">📍 Address:</strong> Telia Kalan, Near Barhaj, Deoria, Uttar Pradesh, India</li>
          <li><strong className="text-white">📞 Phone:</strong> +91 9876543210</li>
          <li><strong className="text-white">✉️ Email:</strong> support@siddhivinayakmart.in</li>
          <li><strong className="text-white">🕒 Hours:</strong> Daily – 7:00 AM to 9:30 PM</li>
        </ul>
      </div>
      <div className="max-w-2xl mx-auto">
        <p className="text-gray-300 mb-4">Need help finding us? Use the map below to navigate to your favorite mart!</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3577.898272089673!2d83.98580161483051!3d26.861282683147864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39901b34e29fa82b%3A0x4c6af8871bb75a0!2sTelia%20Kalan%2C%20Deoria%2C%20Uttar%20Pradesh%20271%20102%2C%20India!5e0!3m2!1sen!2sus!4v1685815591234!5m2!1sen!2sus"
          className="w-full h-64 rounded-xl border-none"
          allowFullScreen
          loading="lazy"
          title="Store Location"
        ></iframe>
      </div>
    </main>
  );
}