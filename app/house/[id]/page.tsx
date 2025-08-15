import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import HouseClient from "./HouseClient";

export async function generateStaticParams() {
  // Fetch all house IDs from Firebase at build time
  const snapshot = await get(ref(db, "property"));
  const houses = snapshot.val() || {};

  return Object.keys(houses).map((id) => ({ id }));
}

export default async function HousePage({ params }: { params: { id: string } }) {
  // You could fetch initial data here if needed
  return <HouseClient id={params.id} />;
}
