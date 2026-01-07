import prisma from "../config/db.js";
import dotenv from 'dotenv'
dotenv.config()

async function main() {

  const alice = await prisma.user.create({
    data: {
      username: "Alice",
      email: "alice@example.com",
      password: "alice123",
      isOnline: "true",
      image: "https://example.com/alice.png",
    },
  });

  const bob = await prisma.user.create({
    data: {
      username: "Bob",
      email: "bob@example.com",
      password: "bob123",
      isOnline: "false",
      image: "https://example.com/bob.png",
    },
  });

  console.log("Users created:", alice, bob);

  console.log("Creating messages...");

  await prisma.message.create({
    data: {
      from: alice.id,
      to: bob.id,
      content: "Hello Bob!",
    },
  });

  await prisma.message.create({
    data: {
      from: bob.id,
      to: alice.id,
      content: "Hey Alice! How are you?",
    },
  });

  console.log("Messages created.");

  console.log("Fetching all users:");
  const users = await prisma.user.findMany();
  console.log(users);

  console.log("Fetching all messages:");
  const messages = await prisma.message.findMany();
  console.log(messages);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
