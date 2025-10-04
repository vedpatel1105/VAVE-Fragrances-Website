"use client";

import { productService } from "@/src/lib/productService";

export namespace ProductInfo {

    export const baseUrl = "https://tuqdytehmpzhlbxfvylv.supabase.co/storage/v1/object/public/vave-assets";

    const staticProducts: Product[] = [
        {
            id: 8,
            name: "Havoc",
            slug: "havoc",
            category: "Fresh",
            tagline: "Woody • Aromatic • Masculine",
            price: 400, // Fixed price
            priceXL: 500, // Fixed price
            images: {
                "30": [
                    `${baseUrl}/havoc/30/bottle.webp`,
                    `${baseUrl}/havoc/30/bwb.webp`,
                    `${baseUrl}/havoc/30/fwb.webp`,
                ],
                "50": [
                    `${baseUrl}/havoc/50/bottle.jpg`,
                    `${baseUrl}/havoc/50/bwb.webp`,
                    `${baseUrl}/havoc/50/fwb.webp`,
                ],
                label: `${baseUrl}/havoc/label.webp`,
            },
            description:
                "A bold and sophisticated woody aromatic fragrance for man.",
            longDescription: `
      <p>Havoc is a bold statement of confidence and charisma. This fragrance opens with invigorating top notes of bitter orange, green apple, and cardamom, creating an immediate fresh impression.</p>
      
      <p>The heart reveals a sophisticated blend of tea leaf, nutmeg, and geranium, balanced with aromatic accords that evoke a sense of refined masculinity.</p>
      
      <p>As it settles, the base notes of cedarwood, vetiver, and musk provide a warm, enduring foundation that ensures this scent makes a lasting impression.</p>
      
      <p>Crafted for the modern man who appreciates subtle complexity, Havoc is perfect for both everyday wear and special occasions.</p>
    `,
            rating: 4.8,
            reviews: 124,
            isNew: false,
            isBestseller: true,
            isLimited: false,
            discount: null,
            ingredients: [
                "Ethanol",
                "Parfum (Fragrance)",
                "Aqua (Water)",
                "Premix",
                "Glycerin",
            ],
            sizeOptions: [
                { size: "30", price: 400 }, // Fixed price
                { size: "50", price: 500 }, // Fixed price
            ],
            specifications: {
                fragrance_family: "Woody Aromatic",
                concentration: "25% Perfume Oil",
                longevity: "8+ hours",
                sillage: "Moderate to Strong",
                launch_year: "2025",
            },
            notes: {
                top: ["Bitter Orange", "Green Apple", "Cardamom"],
                heart: ["Tea Leaf", "Nutmeg", "Geranium"],
                base: ["Cedarwood", "Vetiver", "Musk"],
            },
            layeringOptions: [
                {
                    id: 1,
                    name: "Oceane",
                    description: "Creates a refreshing aquatic blend",
                },
                {
                    id: 2,
                    name: "Euphoria",
                    description: "Adds a floral dimension to the freshness",
                },
                {
                    id: 5,
                    name: "Mehfil",
                    description: "Creates a sophisticated spicy-fresh blend",
                },
            ],
        },
        {
            id: 4,
            name: "Lavior",
            slug: "lavior",
            category: "Oriental",
            tagline: "Herbal • Smoky • Unique",
            price: 400,
            priceXL: 500,
            images: {
                "30": [
                    `${baseUrl}/lavior/30/bottle.jpg`,
                    `${baseUrl}/lavior/30/bwb.webp`,
                    `${baseUrl}/lavior/30/fwb.webp`,
                ],
                "50": [
                    `${baseUrl}/lavior/50/bottle.jpg`,
                    `${baseUrl}/lavior/50/bwb.webp`,
                    `${baseUrl}/lavior/50/fwb.webp`,
                ],
                label: `${baseUrl}/lavior/label.webp`,
            },
            description:
                "A distinctive herbal and smoky fragrance with unique character.",
            longDescription: `
      <p>Lavior is a distinctive fragrance that combines herbal freshness with smoky depth. This unique scent creates an aura of sophistication and mystery.</p>
      
      <p>The opening notes of lavender and bergamot create a fresh, aromatic introduction that gradually transitions to a heart of clary sage and oud accord.</p>
      
      <p>The base notes of agarwood (oud), patchouli, and musk provide depth and longevity, ensuring this fragrance leaves a memorable impression throughout the day and into the evening.</p>
      
      <p>Perfect for those who appreciate refined elegance with a touch of mystery, lavior is ideal for special occasions and evening wear.</p>
    `,
            rating: 4.7,
            reviews: 98,
            isNew: false,
            isBestseller: false,
            isLimited: false,
            discount: 0,
            ingredients: [
                "Ethanol",
                "Parfum (Fragrance)",
                "Aqua (Water)",
                "Glycerin",
                "Coumarin",
                "Premix",
                "Benzyl Benzoate",
                "Geraniol",
                "Citronellol",
                "Eugenol",
            ],
            sizeOptions: [
                { size: "30", price: 400 },
                { size: "50", price: 500 },
            ],
            specifications: {
                fragrance_family: "Woody Aromatic",
                concentration: "25% Perfume Oil",
                longevity: "8+ hours",
                sillage: "Strong",
                launch_year: "2025",
            },
            notes: {
                top: ["Lavender", "Bergamot"],
                heart: ["Clary Sage", "Oud Accord"],
                base: ["Agarwood (Oud)", "Patchouli", "Musk"],
            },
            layeringOptions: [
                {
                    id: 7,
                    name: "Velora",
                    description: "Creates a rich, luxurious oriental blend",
                },
                {
                    id: 6,
                    name: "Obsession",
                    description: "Intensifies the oriental character",
                },
                {
                    id: 3,
                    name: "Duskfall",
                    description: "Adds mystery and depth",
                },
            ],
        },
        {
            id: 3,
            name: "Duskfall",
            slug: "duskfall",
            category: "Woody",
            tagline: "Citrus • Amber • Sophisticated",
            price: 400,
            priceXL: 500,
            images: {
                "30": [
                    `${baseUrl}/duskfall/30/bottle.jpg`,
                    `${baseUrl}/duskfall/30/bwb.webp`,
                    `${baseUrl}/duskfall/30/fwb.webp`,
                ],
                "50": [
                    `${baseUrl}/duskfall/50/bottle.jpg`,
                    `${baseUrl}/duskfall/50/bwb.webp`,
                    `${baseUrl}/duskfall/50/fwb.webp`,
                ],
                label: `${baseUrl}/duskfall/label.webp`,
            },
            description:
                "A sophisticated citrus amber fragrance for the discerning individual.",
            longDescription: `
      <p>Duskfall captures the sophisticated transition from day to night. This enigmatic fragrance opens with bright citrus notes of Sicilian orange, ginger, and citron.</p>
      
      <p>The heart reveals a complex blend of neroli, black tea, and ambrox, adding depth and character to this sophisticated scent.</p>
      
      <p>As the fragrance settles, the base notes of olibanum, guaiac wood, and ambergris emerge, providing a rich, enduring foundation.</p>
      
      <p>Perfect for the sophisticated individual who appreciates complexity and refinement, Duskfall is ideal for evening events and special occasions.</p>
    `,
            rating: 4.6,
            reviews: 87,
            isNew: true,
            isBestseller: false,
            isLimited: false,
            discount: 0,
            ingredients: [
                "Ethanol",
                "Parfum (Fragrance)",
                "Aqua (Water)",
                "Premix",
                "Glycerin",
            ],
            sizeOptions: [
                { size: "30", price: 400 },
                { size: "50", price: 500 },
            ],
            specifications: {
                fragrance_family: "Citrus Amber",
                concentration: "25% Perfume Oil",
                longevity: "8+ hours",
                sillage: "Moderate to Strong",
                launch_year: "2025",
            },
            notes: {
                top: ["Sicilian Orange", "Ginger", "Citron"],
                heart: ["Neroli", "Black Tea", "Ambrox"],
                base: ["Olibanum", "Guaiac Wood", "Ambergris"],
            },
            layeringOptions: [
                {
                    id: 6,
                    name: "Obsession",
                    description: "Creates an intense, bold evening scent",
                },
                {
                    id: 2,
                    name: "Euphoria",
                    description: "Adds a floral brightness to the mystery",
                },
                {
                    id: 4,
                    name: "lavior",
                    description: "Enhances the oriental character",
                },
            ],
        },
        {
            id: 2,
            name: "Euphoria",
            slug: "euphoria",
            category: "Floral",
            tagline: "Floral • Romantic • Feminine",
            price: 400,
            priceXL: 500,
            images: {
                "30": [
                    `${baseUrl}/euphoria/30/bottle.webp`,
                    `${baseUrl}/euphoria/30/bwb.webp`,
                    `${baseUrl}/euphoria/30/fwb.webp`,
                ],
                "50": [
                    `${baseUrl}/euphoria/50/bottle.jpg`,
                    `${baseUrl}/euphoria/50/bwb.webp`,
                    `${baseUrl}/euphoria/50/fwb.webp`,
                ],
                label: `${baseUrl}/euphoria/label.webp`,
            },
            description:
                "A romantic floral fragrance that celebrates feminine beauty.",
            longDescription: `
      <p>Euphoria is a joyful celebration of femininity in a bottle. This uplifting fragrance combines delicate floral notes with subtle fruity accords, creating a scent that evokes happiness and romance.</p>
      
      <p>The opening notes of pear, mandarin orange, and peony create a bright, cheerful introduction that transitions into a heart of osmanthus, rose, and magnolia, adding a sophisticated floral dimension.</p>
      
      <p>The base notes of sandalwood, patchouli, and vanilla provide a warm foundation that ensures the fragrance has lasting power while maintaining its uplifting character.</p>
      
      <p>Ideal for day wear and special moments when you want to feel your best, Euphoria is perfect for those who appreciate the beauty of floral fragrances with a modern twist.</p>
    `,
            rating: 4.9,
            reviews: 156,
            isNew: false,
            isBestseller: true,
            isLimited: false,
            discount: 0,
            ingredients: [
                "Ethanol",
                "Parfum (Fragrance)",
                "Aqua (Water)",
                "Premix",
                "Glycerin",
            ],
            sizeOptions: [
                { size: "30", price: 400 },
                { size: "50", price: 500 },
            ],
            specifications: {
                fragrance_family: "Floral Fruity",
                concentration: "25% Perfume Oil",
                longevity: "8+ hours",
                sillage: "Moderate",
                launch_year: "2025",
            },
            notes: {
                top: ["Pear", "Mandarin Orange", "Peony"],
                heart: ["Osmanthus", "Rose", "Magnolia"],
                base: ["Sandalwood", "Patchouli", "Vanilla"],
            },
            layeringOptions: [
                {
                    id: 1,
                    name: "Oceane",
                    description: "Creates a fresh, uplifting blend",
                },
                {
                    id: 3,
                    name: "Duskfall",
                    description: "Adds mystery to the floral character",
                },
                {
                    id: 7,
                    name: "Velora",
                    description: "Enhances the richness of the florals",
                },
            ],
        },
        {
            id: 1,
            name: "Oceane",
            slug: "oceane",
            category: "Aquatic",
            tagline: "Fresh • Aquatic • Sporty",
            price: 400,
            priceXL: 500,
            images: {
                "30": [
                    `${baseUrl}/oceane/30/bottle.jpg`,
                    `${baseUrl}/oceane/30/bwb.webp`,
                    `${baseUrl}/oceane/30/fwb.webp`,
                ],
                "50": [
                    `${baseUrl}/oceane/50/bottle.jpg`,
                    `${baseUrl}/oceane/50/bwb.webp`,
                    `${baseUrl}/oceane/50/fwb.webp`,
                ],
                label: `${baseUrl}/oceane/label.webp`,
            },
            description:
                "A fresh aquatic fragrance that captures the essence of the ocean.",
            longDescription: `
      <p>Oceane captures the essence of the sea with its fresh, aquatic character. This refreshing fragrance transports you to the serene shores of a pristine beach.</p>
      
      <p>Opening with crisp green apple, bergamot, and lemon zest, it creates an immediate sense of freshness and clarity that's invigorating and uplifting.</p>
      
      <p>The heart of lavender, marine accord, and clary sage adds depth and complexity, while the base of vetiver, tonka bean, and musk provides a clean, lasting finish.</p>
      
      <p>Perfect for those who appreciate the energizing power of the ocean, Oceane is ideal for daytime wear, especially during warmer months or whenever you need a refreshing boost.</p>
    `,
            rating: 4.5,
            reviews: 112,
            isNew: false,
            isBestseller: false,
            isLimited: true,
            discount: 10,
            ingredients: [
                "Ethanol",
                "Parfum (Fragrance)",
                "Aqua (Water)",
                "Premix",
                "Glycerin",
            ],
            sizeOptions: [
                { size: "30", price: 400 },
                { size: "50", price: 500 },
            ],
            specifications: {
                fragrance_family: "Fresh Aquatic",
                concentration: "25% Perfume Oil",
                longevity: "8+ hours",
                sillage: "Moderate",
                launch_year: "2025",
            },
            notes: {
                top: ["Green Apple", "Bergamot", "Lemon Zest"],
                heart: ["Lavender", "Marine Accord", "Clary Sage"],
                base: ["Vetiver", "Tonka Bean", "Musk"],
            },
            layeringOptions: [
                {
                    id: 8,
                    name: "Havoc",
                    description: "Creates a fresh, masculine blend",
                },
                {
                    id: 2,
                    name: "Euphoria",
                    description: "Adds floral brightness to the aquatic base",
                },
                {
                    id: 7,
                    name: "Velora",
                    description:
                        "Creates an interesting contrast of fresh and warm",
                },
            ],
        },
        {
            id: 7,
            name: "Velora",
            slug: "velora",
            category: "Woody",
            tagline: "Gourmand • Warm • Seductive",
            price: 400,
            priceXL: 500,
            images: {
                "30": [
                    `${baseUrl}/velora/30/bottle.jpg`,
                    `${baseUrl}/velora/30/bwb.webp`,
                    `${baseUrl}/velora/30/fwb.webp`,
                ],
                "50": [
                    `${baseUrl}/velora/50/bottle.jpg`,
                    `${baseUrl}/velora/50/bwb.webp`,
                    `${baseUrl}/velora/50/fwb.webp`,
                ],
                label: `${baseUrl}/velora/label.webp`,
            },
            description:
                "A seductive gourmand fragrance with warm, inviting notes.",
            longDescription: `
      <p>Velora is a luxurious fragrance that envelops you in a warm embrace of gourmand notes. This sophisticated scent exudes elegance and seduction.</p>
      
      <p>The opening notes of pink pepper, orange blossom, and pear create a spicy-sweet, intriguing introduction that transitions into a heart of coffee, jasmine, and almond, adding depth and character.</p>
      
      <p>The base notes of vanilla, patchouli, and cedarwood provide a warm, sensual foundation that ensures the fragrance has remarkable longevity and presence.</p>
      
      <p>Perfect for those who appreciate depth and sophistication in their fragrances, Velora is ideal for evening events, special occasions, and moments when you want to make a lasting impression.</p>
    `,
            rating: 4.8,
            reviews: 92,
            isNew: true,
            isBestseller: false,
            isLimited: true,
            discount: 0,
            ingredients: [
                "Ethanol",
                "Parfum (Fragrance)",
                "Aqua (Water)",
                "Premix",
                "Glycerin",
            ],
            sizeOptions: [
                { size: "30", price: 400 },
                { size: "50", price: 500 },
            ],
            specifications: {
                fragrance_family: "Gourmand",
                concentration: "25% Perfume Oil",
                longevity: "8+ hours",
                sillage: "Strong",
                launch_year: "2025",
            },
            notes: {
                top: ["Pink Pepper", "Orange Blossom", "Pear"],
                heart: ["Coffee", "Jasmine", "Almond"],
                base: ["Vanilla", "Patchouli", "Cedarwood"],
            },
            layeringOptions: [
                {
                    id: 4,
                    name: "lavior",
                    description: "Creates a rich, complex oriental blend",
                },
                {
                    id: 6,
                    name: "Obsession",
                    description: "Intensifies the warm, spicy character",
                },
                {
                    id: 2,
                    name: "Euphoria",
                    description: "Adds a floral brightness to the warmth",
                },
            ],
        },
        {
            id: 6,
            name: "Obsession",
            slug: "obsession",
            category: "Oriental",
            tagline: "Spicy • Intense • Addictive",
            price: 400,
            priceXL: 500,
            images: {
                "30": [
                    `${baseUrl}/obsession/30/bottle.webp`,
                    `${baseUrl}/obsession/30/bwb.webp`,
                    `${baseUrl}/obsession/30/fwb.webp`,
                ],
                "50": [
                    `${baseUrl}/obsession/50/bottle.webp`,
                    `${baseUrl}/obsession/50/bwb.webp`,
                    `${baseUrl}/obsession/50/fwb.webp`,
                ],
                label: `${baseUrl}/obsession/label.webp`,
            },
            description:
                "An intense and addictive spicy fragrance that commands attention.",
            longDescription: `
      <p>Obsession is an intense and captivating fragrance that leaves a lasting impression. This rich spicy scent is designed for those who aren't afraid to stand out.</p>
      
      <p>The opening notes of cardamom and red berries create a spicy, warm introduction that immediately commands attention and transitions into a heart of toffee and cinnamon bark, adding a sweet and spicy dimension.</p>
      
      <p>The base notes of amberwood, tonka bean, and leather provide a sensual, long-lasting foundation that ensures this fragrance remains memorable throughout the day and night.</p>
      
      <p>Perfect for those who appreciate bold, statement fragrances, Obsession is ideal for evening events and special occasions when you want to make an unforgettable impression.</p>
    `,
            rating: 4.7,
            reviews: 85,
            isNew: false,
            isBestseller: true,
            isLimited: false,
            discount: 0,
            ingredients: [
                "Ethanol",
                "Parfum (Fragrance)",
                "Aqua (Water)",
                "Premix",
                "Glycerin",
            ],
            sizeOptions: [
                { size: "30", price: 400 },
                { size: "50", price: 500 },
            ],
            specifications: {
                fragrance_family: "Spicy Oriental",
                concentration: "25% Perfume Oil",
                longevity: "10+ hours",
                sillage: "Very Strong",
                launch_year: "2025",
            },
            notes: {
                top: ["Cardamom", "Red Berries"],
                heart: ["Toffee", "Cinnamon Bark"],
                base: ["Amberwood", "Tonka Bean", "Leather"],
            },
            layeringOptions: [
                {
                    id: 3,
                    name: "Duskfall",
                    description: "Creates a mysterious, intense evening scent",
                },
                {
                    id: 7,
                    name: "Velora",
                    description: "Enhances the rich, warm character",
                },
                {
                    id: 5,
                    name: "Mehfil",
                    description:
                        "Creates a complex, spicy oriental masterpiece",
                },
            ],
        },
        {
            id: 5,
            name: "Mehfil",
            slug: "mehfil",
            category: "Spicy",
            tagline: "Amber • Sweet • Opulent",
            price: 400,
            priceXL: 500,
            images: {
                "30": [
                    `${baseUrl}/mehfil/30/bottle.jpg`,
                    `${baseUrl}/mehfil/30/bwb.webp`,
                    `${baseUrl}/mehfil/30/fwb.webp`,
                ],
                "50": [
                    `${baseUrl}/mehfil/50/bottle.jpg`,
                    `${baseUrl}/mehfil/50/bwb.webp`,
                    `${baseUrl}/mehfil/50/fwb.webp`,
                ],
                label: `${baseUrl}/mehfil/label.webp`,
            },
            description:
                "An opulent amber fragrance with sweet, rich character.",
            longDescription: `
      <p>Mehfil captures the essence of opulence with its rich, amber character. This luxurious fragrance is a tribute to indulgence and celebration.</p>
      
      <p>The opening notes of saffron and jasmine create a warm, floral introduction that evokes the atmosphere of a lavish gathering, transitioning into a heart of amberwood and ambergris, adding depth and richness.</p>
      
      <p>The base notes of fir resin, cedarwood, and musk provide a rich, long-lasting foundation that ensures this fragrance remains memorable throughout special occasions.</p>
      
      <p>Perfect for those who appreciate richness and depth in their fragrances, Mehfil is ideal for special celebrations and moments when you want to make a sophisticated statement.</p>
    `,
            rating: 4.9,
            reviews: 110,
            isNew: true,
            isBestseller: true,
            isLimited: false,
            discount: 0,
            ingredients: [
                "Ethanol",
                "Parfum (Fragrance)",
                "Aqua (Water)",
                "Premix",
                "Glycerin",
            ],
            sizeOptions: [
                { size: "30", price: 400 },
                { size: "50", price: 500 },
            ],
            specifications: {
                fragrance_family: "Amber",
                concentration: "25% Perfume Oil",
                longevity: "10+ hours",
                sillage: "Very Strong",
                launch_year: "2025",
            },
            notes: {
                top: ["Saffron", "Jasmine"],
                heart: ["Amberwood", "Ambergris"],
                base: ["Fir Resin", "Cedarwood", "Musk"],
            },
            layeringOptions: [
                {
                    id: 6,
                    name: "Obsession",
                    description:
                        "Creates an intense, rich oriental masterpiece",
                },
                {
                    id: 8,
                    name: "Havoc",
                    description: "Adds freshness to the rich spicy character",
                },
                {
                    id: 4,
                    name: "lavior",
                    description:
                        "Enhances the oriental character with herbal notes",
                },
            ],
        },
    ];

    // Product cache
    let _productCache: Product[] | null = null;

    // Load products from sessionStorage or Supabase
    export async function loadProducts(): Promise<Product[]> {
        if (typeof window !== "undefined") {
            const cached = window.sessionStorage.getItem("allProductItems");
            if (cached) {
                try {
                    _productCache = JSON.parse(cached);
                    return _productCache || [];
                } catch { }
            }
        }
        const products = await productService.getAllProducts();
        // take id and price related info fro db or priserve Product static info strcture  map the info 
        // needed to merge static info with db info check through name 
        _productCache = products.map(dbProd => {
            const staticProd = staticProducts.find(sp => sp.slug === dbProd.slug);
            return {
                ...staticProd,
                price: dbProd.price_30ml || staticProd?.price || 400,
                priceXL: dbProd.price_50ml || staticProd?.priceXL || 500,
                id: dbProd.id,
            } as Product;
        });
        if (typeof window !== "undefined") {
            window.sessionStorage.setItem("allProductItems", JSON.stringify(_productCache));
        }

        return _productCache || staticProducts;
    }

    // Synchronous getter for use in components
    export function getAllProductItems(): Product[] {
        if (_productCache) return _productCache;
        if (typeof window !== "undefined") {
            const cached = window.sessionStorage.getItem("allProductItems");
            if (cached) {
                try {
                    _productCache = JSON.parse(cached);
                    return _productCache || staticProducts;
                } catch { }
            }
        }
        return staticProducts;
    }

    // For legacy compatibility
    export let allProductItems: Product[] = [];

    // On app load, fetch and cache products (only once per tab)
    if (typeof window !== "undefined") {
        (async () => {
            if (!window.sessionStorage.getItem("allProductItems")) {
                try {
                    const products = await loadProducts();
                    window.sessionStorage.setItem("allProductItems", JSON.stringify(products));
                    allProductItems = products;
                    _productCache = products;
                } catch (err) {
                    console.error("Failed to load products:", err);
                }
            } else {
                try {
                    allProductItems = JSON.parse(window.sessionStorage.getItem("allProductItems")!);
                    _productCache = allProductItems;
                } catch { }
            }
        })();
    }

    export const getProductById = (id: string | number) => {
        const items = getAllProductItems();
        return items.find((product) => product.id === id);
    };

    export const getProductSlugById = (id: string | number) => {
        const items = getAllProductItems();
        const product = items.find((product) => product.id === id);
        return product ? product.slug : "xxx";
    };

    export const getProductsBySlug = (slug: string) => {
        const items = getAllProductItems();
        return items.filter((product) => product.slug === slug);
    };

    export const getProductsByName = (name: string) => {
        const items = getAllProductItems();
        return items.filter((product) =>
            product.name.toLowerCase().includes(name.toLowerCase())
        );
    };

    export const getProductByName = (name: string) => {
        const items = getAllProductItems();
        return items.find(
            (product) => product.name.toLowerCase() === name.toLowerCase()
        );
    };

    // Popular combinations (keep static)
    export const popularCombinations = [
        {
            fragrance1: "Oceane",
            fragrance2: "Euphoria",
            name: "Ocean Bloom",
            popularity: "95%",
        },
        {
            fragrance1: "Duskfall",
            fragrance2: "Obsession",
            name: "Dark Mystery",
            popularity: "92%",
        },
        {
            fragrance1: "Lavior",
            fragrance2: "Mehfil",
            name: "Royal Spice",
            popularity: "88%",
        },
        {
            fragrance1: "Havoc",
            fragrance2: "Velora",
            name: "Fresh Woods",
            popularity: "85%",
        },
    ];

    export interface Product {
        id: number | string;
        name: string;
        slug: string;
        category: string;
        tagline: string;
        price: number;
        priceXL: number;
        images: {
            "30": string[];
            "50": string[];
            label: string;
        };
        description: string;
        longDescription: string;
        rating: number;
        reviews: number;
        isNew: boolean;
        isBestseller: boolean;
        isLimited: boolean;
        discount: number | null;
        ingredients: string[];
        sizeOptions: { size: string; price: number }[];
        specifications: {
            fragrance_family: string;
            concentration: string;
            longevity: string;
            sillage: string;
            launch_year: string;
        };
        notes: {
            top: string[];
            heart: string[];
            base: string[];
        };
        layeringOptions: {
            id: number;
            name: string;
            description: string;
        }[];
    }
}
