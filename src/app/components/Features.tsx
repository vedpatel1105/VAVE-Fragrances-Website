import { CheckCircle, Zap, BarChart } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: "Task Management",
      description: "Organize and prioritize your tasks with ease.",
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Automation",
      description: "Automate repetitive tasks and save time.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: "Analytics",
      description: "Gain insights with powerful analytics tools.",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
