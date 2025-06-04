import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
  return (
    <section className="w-full py-24 bg-accent">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold mb-4 font-serif text-primary">Stay Connected</h2>
        <p className="mb-8 text-primary/80 max-w-2xl mx-auto">
          Subscribe to our newsletter for exclusive offers, new releases, and fragrance tips.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-grow border-border text-primary bg-background"
          />
          <Button type="submit" className="bg-primary text-background hover:bg-primary/90">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  )
}
