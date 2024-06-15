const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();


// async function create() {
//   // Create branches
//   await prisma.Branch.createMany({
//         data: [
//             { name: 'Branch1' },
//             { name: 'Branch2' },
//             { name: 'Branch3' },
//         ],
//     });

//     // Create menu items
//     await prisma.Menu.createMany({
//       data: [
//         { item: 'CHICKEN_STEAK', price: 10.99 },
//         { item: 'FISH_STEAK', price: 12.99 },
//         { item: 'BEEF_STEAK', price: 14.99 }, 
//         { item: 'LAMB_STEAK', price: 16.99 },
//     ],
//     });
// }

// create()
//   .catch(e => {
//       console.error(e);
//       process.exit(1);
//   })
//   .finally(async () => {
//       await prisma.$disconnect();
// });


async function main() {
  const email = 'admin@gmail.com';
  const rawPassword = 'admin';
  const role = 'ADMIN';
  const branchName = 'Branch1';

  const password = await bcrypt.hash(rawPassword, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    const branch = await prisma.branch.findFirst({
      where: { name: branchName },
    });

    if (!branch) {
      console.error(`Branch with name ${branchName} does not exist.`);
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        role,
        Branch: { connect: { id: branch.id } }
      },
    });

    console.log(`User with email ${email} created with role ${role}`);
  } else {
    console.log(`User with email ${email} already exists and will not be updated`);
  }
}

main()
.catch((e) => {
  console.error(e);
  process.exit(1);
})
.finally(async () => {
  await prisma.$disconnect();
});

