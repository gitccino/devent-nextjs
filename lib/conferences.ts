export type Event = {
  slug: string;
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
};

type ConfsApiItem = {
  name: string;
  url: string;
  startDate: string;
  endDate?: string;
  city?: string;
  country?: string;
  online?: boolean;
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeRange(start: string, end?: string) {
  if (!end || end === start) return "All Day";
  return `${formatDate(start)} - ${formatDate(end)}`;
}

// const PLACEHOLDER_IMAGES = [
//   "/images/event1.png",
//   "/images/event2.png",
//   "/images/event3.png",
//   "/images/event4.png",
//   "/images/event5.png",
//   "/images/event6.png",
// ];
const PLACEHOLDER_IMAGES = "/images/event-placeholder.png";

export async function fetchConferences(): Promise<Event[]> {
  const res = await fetch(
    "https://raw.githubusercontent.com/tech-conferences/conference-data/main/conferences/2025/javascript.json",
    { next: { revalidate: 3600 } },
  );

  if (!res.ok) throw new Error("Failed to fetch conferences");

  const data: ConfsApiItem[] = await res.json();

  return data
    .filter((item) => item.city || item.online)
    .slice(0, 12)
    .map((item, index) => ({
      slug: toSlug(item.name),
      title: item.name,
      location: item.online
        ? "Online"
        : [item.city, item.country].filter(Boolean).join(", "),
      date: formatDate(item.startDate),
      time: formatTimeRange(item.startDate, item.endDate),
      // image: PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length],
      image: PLACEHOLDER_IMAGES,
    }));
}
