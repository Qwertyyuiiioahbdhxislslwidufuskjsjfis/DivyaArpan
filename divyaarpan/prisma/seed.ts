import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Delete existing data
  await prisma.facility.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.pooja.deleteMany();
  await prisma.temple.deleteMany();

  // Create Temple
  const temple = await prisma.temple.create({
    data: {
      slug: "shree-siddhivinayak-mumbai",
      name: "Shree Siddhivinayak Temple",
      city: "Mumbai",
      state: "Maharashtra",
      address:
        "SK Bole Marg, Prabhadevi, Mumbai, Maharashtra 400028",
      description:
        "One of the most famous Lord Ganesha temples in India.",
      openingTime: "05:30 AM",
      closingTime: "09:50 PM",
      mapUrl:
        "https://maps.google.com/?q=Siddhivinayak+Temple+Mumbai",
      featuredImage:
        "https://images.unsplash.com/photo-1605649487212-47bdab064df7",
      isFeatured: true,
    },
  });

  // Gallery Images
  await prisma.gallery.createMany({
    data: [
      {
        templeId: temple.id,
        imageUrl:
          "https://images.unsplash.com/photo-1605649487212-47bdab064df7",
      },
      {
        templeId: temple.id,
        imageUrl:
          "https://images.unsplash.com/photo-1548013146-72479768bada",
      },
      {
        templeId: temple.id,
        imageUrl:
          "https://images.unsplash.com/photo-1578922746465-3a80a228f223",
      },
    ],
  });

  // Facilities
  await prisma.facility.createMany({
    data: [
      {
        templeId: temple.id,
        facility: "Wheelchair Accessible",
      },
      {
        templeId: temple.id,
        facility: "Parking",
      },
      {
        templeId: temple.id,
        facility: "Prasad Counter",
      },
      {
        templeId: temple.id,
        facility: "Drinking Water",
      },
      {
        templeId: temple.id,
        facility: "Shoe Stand",
      },
    ],
  });

  // Poojas
  await prisma.pooja.createMany({
    data: [
      {
        templeId: temple.id,
        name: "Ganesh Pooja",
        description: "Daily Ganesh Pooja",
        duration: "30 Minutes",
        price: "501",
        image:
          "https://images.unsplash.com/photo-1605649487212-47bdab064df7",
      },
      {
        templeId: temple.id,
        name: "Abhishek Pooja",
        description: "Special Abhishek",
        duration: "45 Minutes",
        price: "1100",
        image:
          "https://images.unsplash.com/photo-1548013146-72479768bada",
      },
      {
        templeId: temple.id,
        name: "Sankashti Special Pooja",
        description: "Monthly Sankashti Pooja",
        duration: "60 Minutes",
        price: "2100",
        image:
          "https://images.unsplash.com/photo-1578922746465-3a80a228f223",
      },
    ],
  });

  console.log("✅ Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });