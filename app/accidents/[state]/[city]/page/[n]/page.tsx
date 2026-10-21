import { notFound } from "next/navigation";
import { getCityPage } from "@/lib/location/cityPages";
import CityAccidents, { cityMetadata, getCityListing } from "../../CityAccidents";

export const revalidate = 86400; // Rebuild daily

// Without this the route renders on every request and ignores revalidate.
export function generateStaticParams() {
  return [];
}

type Params = Promise<{ state: string; city: string; n: string }>;

function pageNumber(n: string) {
  return /^[1-9]\d{0,3}$/.test(n) ? Number(n) : null;
}

export default async function OlderCityAccidentsPage({ params }: { params: Params }) {
  const { state, city: slug, n } = await params;
  const city = getCityPage(state, slug);
  const page = pageNumber(n);
  if (!city || !page || page < 2) notFound();

  const listing = await getCityListing(city, page);
  if (!listing) notFound();

  return <CityAccidents city={city} page={page} listing={listing} />;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { state, city: slug, n } = await params;
  const city = getCityPage(state, slug);
  const page = pageNumber(n);
  return city && page ? cityMetadata(city, page) : {};
}
