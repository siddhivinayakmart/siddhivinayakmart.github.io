// Products Page
function ProductsPage() {
  const products = [
    {
      name: 'Fortified Wheat Flour (5kg)',
      price: '₹185',
      nutrition: 'High in Iron, Folic Acid & Fiber',
      image: '/products/wheat.png',
      gradient: 'from-lime-700 via-lime-800 to-lime-900'
    },
    {
      name: 'Basmati Rice Premium (1kg)',
      price: '₹120',
      nutrition: 'Low in Fat, High Carbohydrate Energy Source',
      image: '/products/rice.png',
      gradient: 'from-amber-700 via-amber-800 to-amber-900'
    },
    {
      name: 'Organic Moong Dal (1kg)',
      price: '₹130',
      nutrition: 'Rich in Protein, Iron & Dietary Fiber',
      image: '/products/moongdal.png',
      gradient: 'from-emerald-700 via-emerald-800 to-emerald-900'
    },
    {
      name: 'Refined Sunflower Oil (1L)',
      price: '₹160',
      nutrition: 'Source of Vitamin E & Healthy Fats',
      image: '/products/oil.png',
      gradient: 'from-yellow-700 via-yellow-800 to-yellow-900'
    }
  ];

  return (
    <main className="px-6 md:px-20 py-10">
      <h1 className="text-3xl font-bold text-lime-400 mb-6">Our Grocery Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((item, idx) => (
          <div key={idx} className={`rounded-2xl p-5 shadow-xl bg-gradient-to-br ${item.gradient} text-white`}>
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg" />
              <div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-yellow-300 font-semibold">Price: {item.price}</p>
                <p className="italic text-gray-200">Nutrition: {item.nutrition}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
