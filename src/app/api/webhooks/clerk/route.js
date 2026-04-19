import { Webhook } from "svix";
import { prisma } from "../../../../lib/db";

export async function POST(req) {
  const payload = await req.text();
  const headersList = req.headers;

  const svixHeaders = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };

  console.log("SECRET:", process.env.CLERK_WEBHOOK_SECRET);
const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, svixHeaders);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Bad signature", { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created") {
    const email = data.email_addresses?.[0]?.email_address ?? null;
    await prisma.user.create({
      data: {
        id: data.id,
        email,
      },
    });
    console.log("User created in DB:", data.id);
  }

  if (type === "user.deleted") {
    await prisma.user.deleteMany({
      where: { id: data.id },
    });
    console.log("User deleted from DB:", data.id);
  }

  return new Response("OK", { status: 200 });
}