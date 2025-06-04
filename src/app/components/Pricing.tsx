import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function Pricing() {
  const plans = [
    {
      name: "BASIC",
      price: "350",
      features: ["Task Management", "Basic Automation", "Email Support"],
    },
    {
      name: "GRANDE",
      price: "450",
      features: ["Advanced Task Management", "Full Automation", "Priority Support", "Analytics"],
    },
    {
      name: "VENTI",
      price: "900",
      features: ["Custom Solutions", "Dedicated Account Manager", "24/7 Support", "Advanced Analytics"],
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full">Choose Plan</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
