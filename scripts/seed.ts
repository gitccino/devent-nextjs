import mongoose from "mongoose";
import EventModel from "../lib/models/event.model";

const MONGODB_URI = process.env.MONGODB_URI!;

const events = [
  {
    title: "React Summit 2025",
    description:
      "The world's biggest React conference, bringing together React developers from across the globe for two days of talks, workshops, and networking.",
    overview:
      "React Summit 2025 is the premier event for React developers worldwide. Whether you're a seasoned engineer or just getting started, you'll find deep-dive technical sessions, hands-on workshops, and inspiring keynotes covering the latest in React 19, Server Components, and the evolving frontend ecosystem.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=750&h=500&fit=crop",
    venue: "Beurs van Berlage",
    location: "Amsterdam, Netherlands",
    date: "June 13, 2025",
    time: "9:00 AM - 6:00 PM",
    mode: "hybrid",
    audience: "Frontend Developers, React Engineers, Full-Stack Developers",
    agenda: [
      "Keynote: The Future of React",
      "React 19 Deep Dive",
      "Server Components in Production",
      "Workshop: Advanced Patterns with Hooks",
      "Panel: Open Source Sustainability",
      "Networking & After Party",
    ],
    organizer: "GitNation",
    tags: ["React", "JavaScript", "Frontend", "TypeScript"],
  },
  {
    title: "Google I/O 2025",
    description:
      "Google's annual developer festival showcasing the latest innovations across Android, AI, web, and cloud technologies with hands-on labs and sessions.",
    overview:
      "Google I/O is where developers get a first look at Google's latest technologies. From breakthroughs in Gemini AI to the newest Android APIs and web platform features, I/O 2025 is packed with keynotes, codelabs, and sessions that equip you to build the next generation of apps.",
    image:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=750&h=500&fit=crop",
    venue: "Shoreline Amphitheatre",
    location: "Mountain View, CA",
    date: "May 20, 2025",
    time: "10:00 AM - 5:00 PM",
    mode: "hybrid",
    audience: "Android Developers, Web Developers, AI Engineers, Cloud Architects",
    agenda: [
      "Opening Keynote: Google CEO Address",
      "Developer Keynote",
      "What's New in Android 16",
      "Gemini AI for Developers",
      "Firebase & Cloud Updates",
      "Codelabs & Sandbox",
    ],
    organizer: "Google",
    tags: ["Google", "Android", "AI", "Cloud", "Web"],
  },
  {
    title: "AWS re:Invent 2025",
    description:
      "Amazon Web Services' flagship annual conference featuring 2,000+ sessions, keynotes, and hands-on labs across cloud computing, DevOps, AI/ML, and serverless.",
    overview:
      "AWS re:Invent is the largest cloud computing event of the year. Held in Las Vegas, it brings together hundreds of thousands of cloud professionals, architects, and developers. Expect major product launches, certification opportunities, and an expo hall showcasing the AWS ecosystem.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=750&h=500&fit=crop",
    venue: "The Venetian & Caesars Forum",
    location: "Las Vegas, NV",
    date: "December 1, 2025",
    time: "8:00 AM - 7:00 PM",
    mode: "offline",
    audience: "Cloud Architects, DevOps Engineers, Backend Developers, CTOs",
    agenda: [
      "Keynote: Werner Vogels",
      "Keynote: AWS CEO",
      "New AWS Service Launches",
      "Serverless at Scale Workshop",
      "AI/ML on AWS Deep Dive",
      "re:Play Party",
    ],
    organizer: "Amazon Web Services",
    tags: ["AWS", "Cloud", "DevOps", "Serverless", "AI/ML"],
  },
  {
    title: "HackMIT 2025",
    description:
      "MIT's annual flagship hackathon where 1,000+ students from top universities around the world gather to build innovative projects in just 24 hours.",
    overview:
      "HackMIT is one of the most prestigious student hackathons in the world. Hosted at MIT, it challenges participants to ideate, prototype, and pitch solutions to real-world problems. With mentors from leading tech companies, prizes worth over $50,000, and an electrifying atmosphere, HackMIT is where the next generation of tech innovators meets.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=750&h=500&fit=crop",
    venue: "MIT Johnson Athletic Center",
    location: "Cambridge, MA",
    date: "September 20, 2025",
    time: "10:00 AM - 10:00 AM (24 hours)",
    mode: "offline",
    audience: "University Students, Early-Career Developers, Designers",
    agenda: [
      "Opening Ceremony & Team Formation",
      "Sponsor Tech Talks",
      "Hacking Begins",
      "Midnight Snack & Mini Events",
      "Mentor Office Hours",
      "Project Submissions & Demo Fair",
      "Awards Ceremony",
    ],
    organizer: "MIT HackMIT",
    tags: ["Hackathon", "Students", "Innovation", "AI", "Web3"],
  },
  {
    title: "Vercel Ship 2025",
    description:
      "Vercel's annual product event unveiling the next wave of features for Next.js, the Vercel platform, and the broader frontend cloud ecosystem.",
    overview:
      "Vercel Ship is the must-attend event for Next.js developers and frontend engineers. Get an exclusive first look at upcoming Next.js features, Vercel platform improvements, and real-world case studies from companies running at scale. Includes live demos, Q&A with the core team, and hands-on workshops.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=750&h=500&fit=crop",
    venue: "SF Jazz Center",
    location: "San Francisco, CA",
    date: "May 15, 2025",
    time: "10:00 AM - 5:00 PM",
    mode: "hybrid",
    audience: "Frontend Developers, Next.js Engineers, Product Managers",
    agenda: [
      "Keynote: The Frontend Cloud",
      "Next.js 17 — What's New",
      "Edge Runtime Deep Dive",
      "Customer Case Study: Scaling to Millions",
      "Workshop: Deploying with Zero Config",
      "Fireside Chat with Core Team",
    ],
    organizer: "Vercel",
    tags: ["Next.js", "Frontend", "Vercel", "React", "Edge"],
  },
  {
    title: "JSConf Asia 2025",
    description:
      "The leading JavaScript conference in Asia, bringing together developers from across the continent for talks on modern JS, tooling, and open source.",
    overview:
      "JSConf Asia is a community-driven conference celebrating the JavaScript ecosystem across Asia-Pacific. Expect two days of curated talks from international and local speakers, covering everything from language internals and performance to accessibility, developer experience, and the future of the web.",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=750&h=500&fit=crop",
    venue: "Marina Bay Sands Expo",
    location: "Singapore",
    date: "August 7, 2025",
    time: "9:00 AM - 6:00 PM",
    mode: "offline",
    audience: "JavaScript Developers, Web Engineers, Open Source Contributors",
    agenda: [
      "Opening Keynote",
      "JavaScript Engine Internals",
      "Accessibility First Development",
      "Performance on the Edge",
      "Open Source Community Panel",
      "Closing Keynote & Networking",
    ],
    organizer: "JSConf Asia Foundation",
    tags: ["JavaScript", "Web", "Open Source", "Frontend", "Performance"],
  },
  {
    title: "KubeCon + CloudNativeCon 2025",
    description:
      "The Cloud Native Computing Foundation's flagship conference gathering thousands of developers and operators around Kubernetes, containers, and cloud-native technologies.",
    overview:
      "KubeCon + CloudNativeCon is the premier event for cloud-native practitioners. Attend to learn about the latest developments in Kubernetes, Prometheus, Envoy, Helm, and other CNCF projects. With co-located events, hands-on workshops, and a massive expo hall, it's where the cloud-native community shapes the future of infrastructure.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=750&h=500&fit=crop",
    venue: "ExCeL London",
    location: "London, United Kingdom",
    date: "April 1, 2025",
    time: "8:30 AM - 6:00 PM",
    mode: "hybrid",
    audience: "DevOps Engineers, Platform Engineers, SREs, Cloud Architects",
    agenda: [
      "Keynote: State of Cloud Native",
      "Kubernetes 2.0 Roadmap",
      "GitOps in Practice Workshop",
      "Observability with Prometheus & Grafana",
      "Security in Cloud Native Environments",
      "CNCF Project Showcase",
    ],
    organizer: "Cloud Native Computing Foundation",
    tags: ["Kubernetes", "Cloud Native", "DevOps", "Containers", "CNCF"],
  },
  {
    title: "PyCon US 2025",
    description:
      "The largest annual gathering for the Python community, featuring talks, tutorials, sprints, and open space sessions for all experience levels.",
    overview:
      "PyCon US is the flagship conference of the Python Software Foundation. Whether you're a data scientist, web developer, or automation enthusiast, PyCon has something for you. With three days of talks, two days of sprints, and tutorials from Python core developers, it's the best place to level up your Python skills and connect with the community.",
    image:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=750&h=500&fit=crop",
    venue: "David L. Lawrence Convention Center",
    location: "Pittsburgh, PA",
    date: "May 14, 2025",
    time: "9:00 AM - 6:00 PM",
    mode: "hybrid",
    audience: "Python Developers, Data Scientists, ML Engineers, Educators",
    agenda: [
      "Keynote: Python Core Team",
      "Python 3.14 New Features",
      "Async Python Deep Dive",
      "ML with Python: From Notebook to Production",
      "Tutorial: Building CLIs with Typer",
      "Open Space Sessions",
      "Development Sprints",
    ],
    organizer: "Python Software Foundation",
    tags: ["Python", "Data Science", "ML", "Open Source", "Backend"],
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected.");

  // Clear existing events to prevent duplicates on re-runs
  await EventModel.deleteMany({});
  console.log("Cleared existing events.");

  for (const event of events) {
    await EventModel.create(event);
    console.log(`Created: ${event.title}`);
  }

  console.log(`\nSeeded ${events.length} events successfully.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
