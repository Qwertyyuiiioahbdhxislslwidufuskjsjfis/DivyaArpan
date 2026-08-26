import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const temples = [
  {
    slug: "siddhivinayak-mumbai",
    name: "Shree Siddhivinayak Temple",
    city: "Prabhadevi, Mumbai",
    state: "Maharashtra",
    address: "SK Bole Marg, Prabhadevi, Mumbai, Maharashtra 400028",
    description:
      "Shree Siddhivinayak Temple is one of India's most famous temples dedicated to Lord Ganesha. Millions of devotees visit every year seeking blessings for success, prosperity, and happiness.",
    openingTime: "5:30 AM",
    closingTime: "10:00 PM",
    mapUrl:
      "https://www.google.com/maps?q=Siddhivinayak+Temple+Mumbai&output=embed",
    featuredImage: "/images/temples/siddhivinayak.jpg",
    isFeatured: true,
    poojas: [
      {
        name: "Ganesh Pooja",
        description: "Daily Ganesh Pooja",
        duration: "30 Minutes",
        price: "₹501",
      },
      {
        name: "Sahasranam Archana",
        description: "Sahasranam Archana",
        duration: "45 Minutes",
        price: "₹1101",
      },
      {
        name: "Maha Aarti",
        description: "Maha Aarti",
        duration: "20 Minutes",
        price: "₹251",
      },
    ],
    facilities: [
      "🚗 Parking",
      "♿ Wheelchair Access",
      "📸 Photography Zone",
    ],
  },
  {
    slug: "kashi-vishwanath-varanasi",
    name: "Kashi Vishwanath",
    city: "Varanasi",
    state: "Uttar Pradesh",
    address: "Vishwanath Gali, Varanasi, Uttar Pradesh",
    description:
      "Kashi Vishwanath Temple is one of the twelve Jyotirlingas of Lord Shiva. Devotees from across the world visit this sacred temple.",
    openingTime: "3:00 AM",
    closingTime: "11:00 PM",
    mapUrl:
      "https://www.google.com/maps?q=Kashi+Vishwanath+Temple+Varanasi&output=embed",
    featuredImage: "/images/temples/kashi-vishwanath.jpg",
    isFeatured: true,
    poojas: [
      {
        name: "Rudrabhishek",
        description: "Rudrabhishek",
        duration: "45 Minutes",
        price: "₹1001",
      },
      {
        name: "Mangala Aarti",
        description: "Mangala Aarti",
        duration: "30 Minutes",
        price: "₹501",
      },
      {
        name: "Shiv Archana",
        description: "Shiv Archana",
        duration: "40 Minutes",
        price: "₹701",
      },
    ],
    facilities: [
      "🚗 Parking",
      "🛍️ Prasad Counter",
      "♿ Wheelchair Access",
    ],
  },
  {
    slug: "tirupati-balaji",
    name: "Tirupati Balaji",
    city: "Tirupati",
    state: "Andhra Pradesh",
    address: "Tirumala, Tirupati, Andhra Pradesh",
    description:
      "Tirumala Tirupati Devasthanam is among the richest and most visited temples in the world, dedicated to Lord Venkateswara.",
    openingTime: "2:30 AM",
    closingTime: "11:30 PM",
    mapUrl:
      "https://www.google.com/maps?q=Tirupati+Balaji+Temple&output=embed",
    featuredImage: "/images/temples/tirupati-balaji.jpg",
    isFeatured: true,
    poojas: [
      {
        name: "Suprabhat Seva",
        description: "Suprabhat Seva",
        duration: "60 Minutes",
        price: "₹1501",
      },
      {
        name: "Thomala Seva",
        description: "Thomala Seva",
        duration: "45 Minutes",
        price: "₹1201",
      },
      {
        name: "Kalyanotsavam",
        description: "Kalyanotsavam",
        duration: "90 Minutes",
        price: "₹2501",
      },
    ],
    facilities: [
      "🚌 Free Bus Service",
      "🚗 Parking",
      "🍛 Free Annadanam",
    ],
  },
];

async function main() {
  console.log("🛕 Restoring DivyaArpan temples...");

  for (const data of temples) {
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

    await prisma.pooja.deleteMany({
      where: { templeId: temple.id },
    });

    await prisma.facility.deleteMany({
      where: { templeId: temple.id },
    });

    await prisma.gallery.deleteMany({
      where: { templeId: temple.id },
    });

    await prisma.pooja.createMany({
      data: data.poojas.map((pooja) => ({
        templeId: temple.id,
        name: pooja.name,
        description: pooja.description,
        duration: pooja.duration,
        price: pooja.price,
        image: data.featuredImage,
      })),
    });

    await prisma.facility.createMany({
      data: data.facilities.map((facility) => ({
        templeId: temple.id,
        facility,
      })),
    });

    await prisma.gallery.createMany({
      data: [
        { templeId: temple.id, imageUrl: data.featuredImage },
        { templeId: temple.id, imageUrl: data.featuredImage },
        { templeId: temple.id, imageUrl: data.featuredImage },
      ],
    });

    console.log(`✅ ${data.name}`);
  }

  console.log("🎉 Temple restoration complete.");
}

main()
  .catch((error) => {
    console.error("❌ Temple restoration failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
