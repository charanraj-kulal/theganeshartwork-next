export default function DeliveryBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-gray-900 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            Delivered in just 24 hours in Bidar 
            <span className="text-4xl">🔥</span>
          </h2>
          <p className="text-xl mb-6">
            Fast, reliable delivery right to your doorstep
          </p>
          <button className="bg-white text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg">
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
}
