import type { Metadata } from "next"
import { ListPropertyContent } from "@/components/list-property-content"

export const metadata: Metadata = {
  title: "List Your Property - HouseLook",
  description: "List your property on HouseLook and reach thousands of potential buyers and renters across Kenya.",
}

export default function ListPropertyPage() {
  return <ListPropertyContent />
}
