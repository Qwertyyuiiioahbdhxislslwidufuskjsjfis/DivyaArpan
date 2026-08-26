import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CatalogPooja = {
  name: string;
  description: string;
  duration: string;
  price: string;
};

type CatalogTemple = {
  slug: string;
  name: string;
  city: string;
  state: string;
  address: string;
  description: string;
  openingTime: string;
  closingTime: string;
  mapUrl: string;
  featuredImage: string;
  isFeatured: boolean;
  poojas: CatalogPooja[];
};

const temples: CatalogTemple[] = [
  {
    slug: "siddhivinayak-mumbai",
    name: "Shree Siddhivinayak Temple",
    city: "Mumbai",
    state: "Maharashtra",
    address: "SK Bole Marg, Prabhadevi, Mumbai, Maharashtra 400028",
    description: "A revered Lord Ganesha temple in Prabhadevi, Mumbai, visited by devotees seeking blessings for success and prosperity.",
    openingTime: "05:30 AM",
    closingTime: "09:50 PM",
    mapUrl: "https://www.google.com/maps?q=Siddhivinayak+Temple+Mumbai&output=embed",
    featuredImage: "/images/temples/siddhivinayak.jpg",
    isFeatured: true,
    poojas: [
      { name: "Ganesh Pooja", description: "Daily worship dedicated to Lord Ganesha.", duration: "30 Minutes", price: "501" },
      { name: "Sahasranam Archana", description: "A devotional archana with the recitation of divine names.", duration: "45 Minutes", price: "1101" },
      { name: "Maha Aarti", description: "A sacred aarti offering for peace and blessings.", duration: "20 Minutes", price: "251" },
    ],
  },
  {
    slug: "mumbadevi-mumbai",
    name: "Shree Mumbadevi Temple",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Mumbadevi Marg, Bhuleshwar, Mumbai, Maharashtra 400002",
    description: "A historic Mumbai temple dedicated to Mumbadevi, the city's guardian deity.",
    openingTime: "06:00 AM",
    closingTime: "10:00 PM",
    mapUrl: "https://www.google.com/maps?q=Mumbadevi+Temple+Mumbai&output=embed",
    featuredImage: "/images/temples/siddhivinayak.jpg",
    isFeatured: true,
    poojas: [
      { name: "Mumbadevi Pooja", description: "A traditional offering to Mumbadevi for protection and blessings.", duration: "30 Minutes", price: "501" },
      { name: "Abhishek Pooja", description: "A sacred bathing ritual followed by devotional prayers.", duration: "45 Minutes", price: "1101" },
      { name: "Special Aarti", description: "A special aarti offering at the temple shrine.", duration: "20 Minutes", price: "251" },
    ],
  },
  {
    slug: "mahalakshmi-mumbai",
    name: "Shree Mahalakshmi Temple",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Bhulabhai Desai Road, Mahalaxmi, Mumbai, Maharashtra 400026",
    description: "A celebrated temple of Mahalakshmi overlooking the Arabian Sea and devoted to abundance and well-being.",
    openingTime: "06:00 AM",
    closingTime: "10:00 PM",
    mapUrl: "https://www.google.com/maps?q=Mahalakshmi+Temple+Mumbai&output=embed",
    featuredImage: "/images/temples/siddhivinayak.jpg",
    isFeatured: true,
    poojas: [
      { name: "Mahalakshmi Pooja", description: "Devotional worship seeking blessings for prosperity and well-being.", duration: "30 Minutes", price: "501" },
      { name: "Lakshmi Archana", description: "A prayerful archana dedicated to Goddess Lakshmi.", duration: "45 Minutes", price: "1101" },
      { name: "Dhan Lakshmi Pooja", description: "A traditional offering for abundance and auspicious beginnings.", duration: "60 Minutes", price: "2101" },
    ],
  },
  {
    slug: "trimbakeshwar-nashik",
    name: "Shree Trimbakeshwar Temple",
    city: "Nashik",
    state: "Maharashtra",
    address: "Trimbak, Nashik, Maharashtra 422212",
    description: "One of the twelve Jyotirlingas, the Trimbakeshwar Temple is a sacred destination on the banks of the Godavari.",
    openingTime: "05:30 AM",
    closingTime: "09:00 PM",
    mapUrl: "https://www.google.com/maps?q=Trimbakeshwar+Temple+Nashik&output=embed",
    featuredImage: "/images/temples/kashi-vishwanath.jpg",
    isFeatured: false,
    poojas: [
      { name: "Rudrabhishek", description: "A sacred Shiva abhishek performed with devotional offerings.", duration: "45 Minutes", price: "1001" },
      { name: "Mahamrityunjaya Jaap", description: "Traditional prayers for peace, health and spiritual strength.", duration: "60 Minutes", price: "1501" },
      { name: "Shiv Archana", description: "A focused archana dedicated to Lord Shiva.", duration: "30 Minutes", price: "501" },
    ],
  },
  {
    slug: "grishneshwar-ellora",
    name: "Shree Grishneshwar Temple",
    city: "Ellora",
    state: "Maharashtra",
    address: "Verul, Ellora, Maharashtra 431102",
    description: "The Grishneshwar Temple near Ellora is one of the twelve Jyotirlingas and an important Shaiva pilgrimage site.",
    openingTime: "05:00 AM",
    closingTime: "09:30 PM",
    mapUrl: "https://www.google.com/maps?q=Grishneshwar+Temple+Ellora&output=embed",
    featuredImage: "/images/temples/kashi-vishwanath.jpg",
    isFeatured: false,
    poojas: [
      { name: "Grishneshwar Pooja", description: "A devotional offering at the sacred Grishneshwar shrine.", duration: "30 Minutes", price: "501" },
      { name: "Rudrabhishek", description: "A traditional abhishek dedicated to Lord Shiva.", duration: "45 Minutes", price: "1001" },
      { name: "Maha Aarti", description: "A sacred aarti offering for blessings and peace.", duration: "20 Minutes", price: "251" },
    ],
  },
];

async function main() {
  let templesCreated = 0;
  let templesExisting = 0;
  let poojasCreated = 0;
  let poojasExisting = 0;

  for (const data of temples) {
    const existingTemple = await prisma.temple.findUnique({ where: { slug: data.slug } });
    const temple = await prisma.temple.upsert({
      where: { slug: data.slug },
      update: {
        name: data.name,
        city: data.city,
        state: data.state,
        address: data.address,
        description: data.description,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        mapUrl: data.mapUrl,
        featuredImage: data.featuredImage,
        isFeatured: data.isFeatured,
      },
      create: {
        slug: data.slug,
        name: data.name,
        city: data.city,
        state: data.state,
        address: data.address,
        description: data.description,
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        mapUrl: data.mapUrl,
        featuredImage: data.featuredImage,
        isFeatured: data.isFeatured,
      },
    });

    if (existingTemple) {
      templesExisting += 1;
      console.log(`Temple already existed: ${temple.name}`);
    } else {
      templesCreated += 1;
      console.log(`Temple created: ${temple.name}`);
    }

    for (const poojaData of data.poojas) {
      const existingPooja = await prisma.pooja.findFirst({
        where: { templeId: temple.id, name: poojaData.name },
      });
      await prisma.pooja.upsert({
        where: { id: existingPooja?.id ?? -1 },
        update: {
          description: poojaData.description,
          duration: poojaData.duration,
          price: poojaData.price,
          image: data.featuredImage,
          isActive: true,
        },
        create: {
          templeId: temple.id,
          name: poojaData.name,
          description: poojaData.description,
          duration: poojaData.duration,
          price: poojaData.price,
          image: data.featuredImage,
          isActive: true,
        },
      });

      if (existingPooja) {
        poojasExisting += 1;
        console.log(`  Pooja already existed: ${poojaData.name}`);
      } else {
        poojasCreated += 1;
        console.log(`  Pooja created: ${poojaData.name}`);
      }
    }
  }

  console.log(`Summary: ${templesCreated} temples created, ${templesExisting} temples already existing.`);
  console.log(`Summary: ${poojasCreated} poojas created, ${poojasExisting} poojas already existing.`);
}

main()
  .catch((error) => {
    console.error("Catalog restore failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
