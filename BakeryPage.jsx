// Bakery Page
function BakeryPage() {
  return (
    <main className="px-6 md:px-20 py-10">
      <h1 className="text-3xl font-bold text-pink-400 mb-6">Bakery & Cakes</h1>
      <div className="bg-gradient-to-r from-yellow-700 via-pink-700 to-pink-800 p-6 rounded-2xl shadow-xl text-center">
        <p className="text-white text-lg">
          Freshly baked breads, pastries, and customized cakes for all occasions. Perfect for birthdays, weddings, or a sweet treat any day.
        </p>
        <img
          src="/products/custom-cake.png"
          alt="Bakery Items"
          className="mt-4 w-full md:w-1/2 mx-auto rounded-xl"
        />
      </div>
    </main>
  );
}