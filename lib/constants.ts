export type Event = {
  slug: string;
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
};

export const events: Event[] = [
  {
    slug: "google-io-2025",
    image: "/images/event1.png",
    title: "Google I/O 2025",
    location: "Mountain View, CA",
    date: "May 20, 2025",
    time: "9:00 AM - 6:00 PM",
  },
  {
    slug: "react-summit-2025",
    image: "/images/event2.png",
    title: "React Summit 2025",
    location: "Amsterdam, Netherlands",
    date: "June 13, 2025",
    time: "10:00 AM - 7:00 PM",
  },
  {
    slug: "hackmit-2025",
    image: "/images/event3.png",
    title: "HackMIT 2025",
    location: "Cambridge, MA",
    date: "September 20, 2025",
    time: "8:00 AM - 8:00 AM",
  },
  {
    slug: "vercel-ship-2025",
    image: "/images/event4.png",
    title: "Vercel Ship 2025",
    location: "San Francisco, CA",
    date: "May 15, 2025",
    time: "10:00 AM - 5:00 PM",
  },
  {
    slug: "aws-reinvent-2025",
    image: "/images/event5.png",
    title: "AWS re:Invent 2025",
    location: "Las Vegas, NV",
    date: "December 1, 2025",
    time: "8:00 AM - 6:00 PM",
  },
  {
    slug: "berlin-dev-meetup",
    image: "/images/event6.png",
    title: "Berlin Dev Meetup",
    location: "Berlin, Germany",
    date: "April 10, 2025",
    time: "6:00 PM - 9:00 PM",
  },
];
