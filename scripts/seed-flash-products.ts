import 'dotenv/config';
import { prisma } from '../lib/prisma';
/// testing
async function main() {
  const chargerCategory = await prisma.category.findUnique({
    where: { slug: 'chargers' },
  });

  if (!chargerCategory) {
    throw new Error('Chargers category not found');
  }

  const flashProducts = [
    {
      slug: '65w-gan-fast-charger-white',
      name: 'DK Power 65W GaN Fast Charger + 100W Cable (White)',
      sku: 'DK-CHG-65W-WHT',
      brand: 'DK Power',
      description: 'DK Power Ultra Fast 65W GaN Charger with dual Type-C and USB-A ports. Includes heavy-duty 100W braided fast charging cable. Supports Power Delivery (PD) 3.0 and Quick Charge 4.0+.',
      price: 3500,
      salePrice: 2490,
      stockQuantity: 150,
      lowStockThreshold: 10,
      isFeatured: true,
      categoryId: chargerCategory.id,
      imageUrl: '/products/flash/flash-1-white-gan.png',
    },
    {
      slug: '65w-gan-fast-charger-black',
      name: 'DK Power 65W GaN Fast Charger + 100W Cable (Black)',
      sku: 'DK-CHG-65W-BLK',
      brand: 'DK Power',
      description: 'DK Power Ultra Fast 65W GaN Charger (Matte Black) with dual Type-C and USB-A ports. Includes premium 100W braided fast charging cable. Compact foldable travel design.',
      price: 3500,
      salePrice: 2490,
      stockQuantity: 150,
      lowStockThreshold: 10,
      isFeatured: true,
      categoryId: chargerCategory.id,
      imageUrl: '/products/flash/flash-2-black-gan.png',
    },
    {
      slug: '65w-dual-port-fast-charger',
      name: 'DK Power 65W GaN Dual Port Charger + Braided Cable',
      sku: 'DK-CHG-65W-DUAL',
      brand: 'DK Power',
      description: 'DK Power 65W High-Speed Dual Port Wall Adapter with intelligent power distribution. Includes durable Type-C to Type-C fast charging cable.',
      price: 3500,
      salePrice: 2690,
      stockQuantity: 120,
      lowStockThreshold: 10,
      isFeatured: true,
      categoryId: chargerCategory.id,
      imageUrl: '/products/flash/flash-3-dual-gan.png',
    },
    {
      slug: '100w-gan-pro-fast-charger',
      name: 'DK Power 100W GaN Pro Ultra Charger + 100W Cable',
      sku: 'DK-CHG-100W-PRO',
      brand: 'DK Power',
      description: 'DK Power Flagship 100W GaN Pro Multiport Charger for laptops, MacBooks, tablets, and smartphones. Includes certified 100W E-Mark fast charging cable.',
      price: 3500,
      salePrice: 2990,
      stockQuantity: 80,
      lowStockThreshold: 10,
      isFeatured: true,
      categoryId: chargerCategory.id,
      imageUrl: '/products/flash/flash-4-pro-gan.png',
    },
  ];

  for (const item of flashProducts) {
    const { imageUrl, ...prodData } = item;
    const existing = await prisma.product.findUnique({
      where: { slug: prodData.slug },
    });

    if (!existing) {
      const created = await prisma.product.create({
        data: {
          ...prodData,
          images: {
            create: [
              {
                imageUrl,
                altText: prodData.name,
                sortOrder: 0,
              },
            ],
          },
        },
      });

      await prisma.inventoryTransaction.create({
        data: {
          productId: created.id,
          quantity: created.stockQuantity,
          transactionType: 'purchase',
          referenceId: 'INITIAL_FLASH_DEALS',
          notes: 'Seeding DK Power Flash Deal product',
        },
      });
      console.log('Created product:', created.name, created.slug);
    } else {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          ...prodData,
          isActive: true,
        },
      });
      console.log('Updated existing product:', existing.slug);
    }
  }

  console.log('All flash deal products successfully synchronized!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
