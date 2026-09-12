import { prisma } from "../lib/prisma";

const map: Record<string, string> = {
  "Government Photo ID": "GOVERNMENT_ID",
  "PAN Card": "PAN_CARD",
  "Address Proof": "ADDRESS_PROOF",
  "Police Verification": "POLICE_VERIFICATION",
  "Pooja / Vedic Qualification Certificate":
    "QUALIFICATION_CERTIFICATE",
};

async function main() {
  const documents = await prisma.panditDocument.findMany();

  let updated = 0;

  for (const document of documents) {
    const newType = map[document.documentType];

    if (newType) {
      await prisma.panditDocument.update({
        where: { id: document.id },
        data: { documentType: newType },
      });

      console.log(
        `Updated document ${document.id}: ${document.documentType} -> ${newType}`
      );

      updated++;
    }
  }

  console.log(`SUCCESS: ${updated} document records updated.`);
}

main()
  .catch((error) => {
    console.error("FAILED:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
