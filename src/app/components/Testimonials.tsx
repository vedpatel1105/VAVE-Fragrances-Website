import Image from "next/image"

export default function Testimonials() {
  const testimonials = [
    {
      quote: "StreamLine has revolutionized our team's workflow. We're more productive than ever!",
      author: "Jane Doe",
      company: "Tech Innovators Inc.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      quote: "The automation features have saved us countless hours. It's a game-changer.",
      author: "John Smith",
      company: "Global Solutions Ltd.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
