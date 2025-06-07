import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Thermometer, Clock, Activity } from "lucide-react"

const applySteps = [
  {
    icon: <Droplet className="h-6 w-6" />,
    title: "Pulse Points",
    description: "Apply to wrists, neck, behind ears, and inside elbows for better diffusion.",
  },
  {
    icon: <Thermometer className="h-6 w-6" />,
    title: "Moisturize",
    description: "Apply to well-moisturized skin for longer-lasting fragrance.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Don't Rub",
    description: "Avoid rubbing wrists together, as it can break down the fragrance.",
  },
  {
    icon: <Activity className="h-6 w-6" />,
    title: "Layer",
    description: "Use matching scented lotions or oils to enhance and prolong the fragrance.",
  },
]

export default function HowToApplyPerfume() {
  return (
    <section className="py-24 bg-gradient-to-r from-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-serif">How to Apply Perfume</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {applySteps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {step.icon}
                  <span>{step.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
