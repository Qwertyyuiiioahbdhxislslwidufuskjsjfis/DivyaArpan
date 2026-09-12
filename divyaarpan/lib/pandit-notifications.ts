import type { Prisma, PrismaClient } from "@prisma/client";

type NotificationClient = PrismaClient | Prisma.TransactionClient;

type PanditNotificationInput = {
  panditId: number;
  type: string;
  title: string;
  message: string;
  eventKey: string;
  bookingId?: number;
  offerId?: number;
};

export async function createPanditNotification(client: NotificationClient, input: PanditNotificationInput) {
  return client.panditNotification.upsert({
    where: { eventKey: input.eventKey },
    create: input,
    update: {},
  });
}