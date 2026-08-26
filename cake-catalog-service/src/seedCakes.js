const Cake = require("./models/Cake");

const sampleCakes = [
    {
        name: "Chocolate Truffle Cake",
        description: "Rich chocolate cake with creamy truffle layers",
        category: "Chocolate",
        price: 799,
        availability: true
    },
    {
        name: "Vanilla",
        description: "Light, sweet, and made with vanilla extract",
        category: "Chocolate",
        price: 299,
        availability: true
    },
    {
        name: "Red Velvet",
        description: "Soft red sponge cake with cream cheese frosting",
        category: "Chocolate",
        price: 399,
        availability: true
    },
    {
        name: "Butterscotch",
        description: "Vanilla cake with caramel crunch bits.",
        category: "Chocolate",
        price: 499,
        availability: true
    },
    {
        name: "Pineapple Cake",
        description: "Light sponge layered with fresh fruit and cream.",
        category: "Chocolate",
        price: 599,
        availability: true
    },
    {
        name: "Tiramisu",
        description: "Coffee-flavored Italian sponge cake.",
        category: "Chocolate",
        price: 199,
        availability: true
    }
];

async function seedCakes() {
    const count = await Cake.count();

    if (count > 0) {
        console.log(`✅ Sample data already exists (${count} cakes).`);
        return;
    }

    console.log("📦 No cakes found. Adding initial sample cakes...");

    await Cake.bulkCreate(sampleCakes);

    console.log("✅ Initial sample cakes added successfully.");
}

module.exports = seedCakes;