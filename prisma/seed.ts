const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    const salas = [
      {
        name: "Sala 1",
        slug: "sala-1",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id malesuada elit, eget vulputate justo. Sed sollicitudin velit dolor, ut gravida odio iaculis a.",
        imageUrls: [
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala1.jpg?t=2023-12-28T05%3A45%3A26.688Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala2.jpg?t=2023-12-28T05%3A45%3A41.059Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala3.jpg?t=2023-12-28T05%3A45%3A51.449Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala4.jpg?t=2023-12-28T05%3A46%3A05.711Z",
        ],
        numberPeoples: 3,
        anexavel: false,
        basePrice: 150,
        discountPercentage: 5, // 5% discount
      },
      {
        name: "Sala 2",
        slug: "sala-2",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id malesuada elit, eget vulputate justo. Sed sollicitudin velit dolor, ut gravida odio iaculis a.",
        imageUrls: [
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala2.jpg?t=2023-12-28T05%3A45%3A41.059Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala1.jpg?t=2023-12-28T05%3A45%3A26.688Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala3.jpg?t=2023-12-28T05%3A45%3A51.449Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala4.jpg?t=2023-12-28T05%3A46%3A05.711Z",
        ],
        numberPeoples: 4,
        anexavel: false,
        basePrice: 200,
        discountPercentage: 5, // 5% discount
      },
      {
        name: "Sala 3",
        slug: "sala-3",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id malesuada elit, eget vulputate justo. Sed sollicitudin velit dolor, ut gravida odio iaculis a.",
        imageUrls: [
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala4.jpg?t=2023-12-28T05%3A46%3A05.711Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala2.jpg?t=2023-12-28T05%3A45%3A41.059Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala3.jpg?t=2023-12-28T05%3A45%3A51.449Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala4.jpg?t=2023-12-28T05%3A46%3A05.711Z",
        ],
        numberPeoples: 6,
        anexavel: false,
        basePrice: 350,
        discountPercentage: 5, // 5% discount
      },
      {
        name: "Sala 4",
        slug: "sala-4",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id malesuada elit, eget vulputate justo. Sed sollicitudin velit dolor, ut gravida odio iaculis a.",
        imageUrls: [
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala6.jpg?t=2023-12-28T05%3A51%3A28.068Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala2.jpg?t=2023-12-28T05%3A45%3A41.059Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala3.jpg?t=2023-12-28T05%3A45%3A51.449Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala4.jpg?t=2023-12-28T05%3A46%3A05.711Z",
        ],
        numberPeoples: 3,
        anexavel: true,
        basePrice: 150,
        discountPercentage: 5, // 5% discount
      },
      {
        name: "Sala 5",
        slug: "sala-5",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id malesuada elit, eget vulputate justo. Sed sollicitudin velit dolor, ut gravida odio iaculis a.",
        imageUrls: [
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala5.jpg?t=2023-12-28T05%3A51%3A18.769Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala2.jpg?t=2023-12-28T05%3A45%3A41.059Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala3.jpg?t=2023-12-28T05%3A45%3A51.449Z",
          "https://jmzatvhncqaeybpkdggc.supabase.co/storage/v1/object/public/coworking/salas/sala4.jpg?t=2023-12-28T05%3A46%3A05.711Z",
        ],
        numberPeoples: 3,
        anexavel: true,
        basePrice: 150,
        discountPercentage: 5, // 5% discount
      },
    ];

    await prisma.sala.createMany({
      data: salas,
    });

    const opcional = [
      {
        name: "Café expresso",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id malesuada elit, eget vulputate justo. Sed sollicitudin velit dolor, ut gravida odio iaculis a.",
        price: 50,
      },
      {
        name: "Salgados",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id malesuada elit, eget vulputate justo. Sed sollicitudin velit dolor, ut gravida odio iaculis a.",
        price: 150,
      },
      {
        name: "Doces",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id malesuada elit, eget vulputate justo. Sed sollicitudin velit dolor, ut gravida odio iaculis a.",
        price: 150,
      },
    ];
    await prisma.opcional.createMany({
      data: opcional,
    });

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
