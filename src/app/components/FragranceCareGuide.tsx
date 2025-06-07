import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Sun, Thermometer, Clock } from "lucide-react"

const careGuideItems = [
  {
    icon: <Thermometer className="h-6 w-6" />,
    title: "Temperature",
    description: "Store your fragrances in a cool, dry place away from direct sunlight and heat sources.",
  },
  {
    icon: <Sun className="h-6 w-6" />,
    title: "Light",
    description: "Keep perfumes away from direct sunlight to prevent degradation of the scent.",
  },
  {
    icon: <Droplet className="h-6 w-6" />,
    title: "Humidity",
    description: "Avoid storing fragrances in humid environments like bathrooms to maintain their quality.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Longevity",
    description: "Use opened fragrances within 3-5 years for the best scent experience.",
  },
]

export default function FragranceCareGuide() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-serif">Fragrance Care Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careGuideItems.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
