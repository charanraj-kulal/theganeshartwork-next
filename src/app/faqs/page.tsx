import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "We offer 24-48 hours delivery within Bidar and Kalaburagi city. For other locations across India, delivery typically takes 5-7 business days."
    },
    {
      question: "Do you offer Cash on Delivery?",
      answer: "Yes! We offer Cash on Delivery (COD) for all orders. You can also pay online using UPI, credit card, debit card, or net banking."
    },
    {
      question: "Can I customize my photo frame?",
      answer: "Absolutely! All our frames are fully customizable. You can add your photos, choose text, colors, and designs according to your preferences."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a hassle-free return policy. If you're not satisfied with your product, you can return it within 7 days of delivery for a full refund or replacement."
    },
    {
      question: "How do I upload my photos?",
      answer: "After placing your order, you can upload photos via WhatsApp to +91 9448075790 or email them to support@decorior.in. Our team will guide you through the process."
    },
    {
      question: "What materials are used for the frames?",
      answer: "We use high-quality materials including premium paper, durable frames, and professional-grade printing to ensure your frames last for years."
    },
    {
      question: "Do you ship outside Karnataka?",
      answer: "Yes! While we specialize in fast delivery within Bidar and Kalaburagi, we ship to all locations across India."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via SMS and email. You can also track your order on our Track Order page."
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order before it goes into production. Please contact us immediately at +91 9448075790 if you need to cancel."
    },
    {
      question: "Do you offer bulk orders or corporate gifting?",
      answer: "Yes! We offer special pricing for bulk orders and corporate gifting. Please contact us for a custom quote."
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">FAQ's</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our products and services
          </p>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden group"
            >
              <summary className="cursor-pointer p-6 font-semibold text-gray-900 hover:bg-gray-50 flex justify-between items-center">
                <span>{faq.question}</span>
                <svg
                  className="w-5 h-5 text-gray-900 transform group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 max-w-4xl mx-auto bg-gray-50 border-2 border-gray-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please chat with our friendly team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/919448075790"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
