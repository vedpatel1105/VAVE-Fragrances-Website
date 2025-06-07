import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fragranceTypes = [
  {
    name: "Eau de Parfum",
    description: "Contains 15-20% perfume oils. Lasts 6-8 hours.",
  },
  {
    name: "Eau de Toilette",
    description: "Contains 5-15% perfume oils. Lasts 4-6 hours.",
  },
  {
    name: "Eau de Cologne",
    description: "Contains 2-4% perfume oils. Lasts 2-3 hours.",
  },
  {
    name: "Parfum",
    description: "Contains 20-30% perfume oils. Lasts 8+ hours.",
  },
]

export default function FragranceTypes() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-serif">Fragrance Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {fragranceTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
