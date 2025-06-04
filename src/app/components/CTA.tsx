import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Workflow?</h2>
        <p className="mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied customers and start boosting your productivity today.
        </p>
        <Button size="lg" variant="secondary">
          Start Your Free Trial
        </Button>
      </div>
    </section>
  )
}
