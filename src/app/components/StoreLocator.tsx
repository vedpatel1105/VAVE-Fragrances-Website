"use client"

import { useState } from "react"
import { Search, MapPin, Phone, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample store data
const storeLocations = [
  {
    id: 1,
    name: "Vave Flagship Store - Mumbai",
    address: "Shop No. 12, Linking Road, Bandra West, Mumbai, Maharashtra 400050",
    phone: "+91 9876543210",
    hours: "10:00 AM - 9:00 PM",
    coordinates: { lat: 19.0607, lng: 72.8362 },
    features: ["Tester Bar", "Exclusive Collections", "Personalized Consultation"],
  },
  {
    id: 2,
    name: "Vave Boutique - Delhi",
    address: "M-24, Greater Kailash II, New Delhi, Delhi 110048",
    phone: "+91 9876543211",
    hours: "11:00 AM - 8:00 PM",
    coordinates: { lat: 28.5355, lng: 77.251 },
    features: ["Gift Wrapping", "Limited Editions"],
  },
  {
    id: 3,
    name: "Vave Experience Center - Bangalore",
    address: "No. 42, 100 Feet Road, Indiranagar, Bangalore, Karnataka 560038",
    phone: "+91 9876543212",
    hours: "10:30 AM - 8:30 PM",
    coordinates: { lat: 12.9784, lng: 77.6408 },
    features: ["Scent Library", "Perfume Workshops", "Custom Blending"],
  },
  {
    id: 4,
    name: "Vave Kiosk - Pune",
    address: "Phoenix Marketcity, Viman Nagar, Pune, Maharashtra 411014",
    phone: "+91 9876543213",
    hours: "11:00 AM - 9:30 PM",
    coordinates: { lat: 18.5623, lng: 73.9173 },
    features: ["Quick Sampling", "Travel Sizes"],
  },
  {
    id: 5,
    name: "Vave Premium Outlet - Hyderabad",
    address: "Shop 22, Jubilee Hills, Hyderabad, Telangana 500033",
    phone: "+91 9876543214",
    hours: "10:00 AM - 8:00 PM",
    coordinates: { lat: 17.4326, lng: 78.3856 },
    features: ["Loyalty Program", "Exclusive Discounts"],
  },
]

export default function StoreLocator() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStore, setSelectedStore] = useState<number | null>(null)

  // Filter stores based on search query
  const filteredStores = storeLocations.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <section className="w-full py-16 bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-serif mb-3">Find Your Nearest Store</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visit one of our physical stores to experience our fragrances in person and receive expert guidance from our
            scent specialists.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by city or location..."
                  className="pl-10 bg-background border-accent/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <motion.div
                    key={store.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedStore === store.id ? "border-accent ring-1 ring-accent" : ""
                      }`}
                      onClick={() => setSelectedStore(store.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{store.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-start mt-2">
                              <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{store.address}</span>
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center mt-2">
                              <Phone className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>{store.phone}</span>
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center mt-2">
                              <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span>{store.hours}</span>
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-accent/10 border-accent/20 text-accent hover:bg-accent/20"
                          >
                            Directions
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {store.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="bg-background/50">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No stores found matching your search.</p>
                  <Button variant="link" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-2/3 bg-accent/5 rounded-lg overflow-hidden h-[500px] relative">
            {/* Map placeholder - in a real implementation, you would integrate with Google Maps or similar */}
            <div className="absolute inset-0 flex items-center justify-center bg-accent/10">
              <div className="text-center p-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-accent/70" />
                <h3 className="text-xl font-medium mb-2">Interactive Map</h3>
                <p className="text-muted-foreground max-w-md">
                  {selectedStore
                    ? `Viewing ${storeLocations.find((s) => s.id === selectedStore)?.name}`
                    : "Select a store to view its location on the map"}
                </p>
                <div className="mt-4">
                  <Button variant="outline" className="bg-background/50">
                    Use Current Location
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-medium mb-4">Can't find a store near you?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Our fragrances are also available at select partner retailers and department stores across India.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="bg-background/50">
              View All Locations
            </Button>
            <Button className="bg-accent text-white hover:bg-accent/90">Shop Online</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
