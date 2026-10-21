import { notFound, redirect } from "next/navigation";
import { getCityPage } from "@/lib/location/cityPages";
import CityAccidents, { cityMetadata, getCityListing } from "./CityAccidents";

export const revalidate = 21600; // Rebuild every 6 hours

// Without this the route renders on every request and ignores revalidate.
export function generateStaticParams() {
  return [];
}

type Params = Promise<{ state: string; city: string }>;

export default async function CityAccidentsPage({ params }: { params: Params }) {
  const { state, city: slug } = await params;
  const city = getCityPage(state, slug);
  if (!city) redirect(`/accidents/${encodeURIComponent(state)}`);

  const listing = await getCityListing(city, 1);
  if (!listing) notFound();

  return <CityAccidents city={city} page={1} listing={listing} />;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { state, city: slug } = await params;
  const city = getCityPage(state, slug);
  return city ? cityMetadata(city, 1) : {};
}
