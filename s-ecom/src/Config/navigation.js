// src/data/navigation.js

// NOTE:
// - `id` fields are unique identifiers (string).
// - `path` fields are ready-to-use react-router paths (change as needed).
// - `images` contains two image URLs per top-level menu for use in mega-menu panels.
// - The structure is intentionally explicit so you can map it into desktop mega-menus,
//   mobile accordions, or any UI you prefer.

const navigation = [
  {
    id: "home",
    title: "Home",
    path: "/",
    type: "link",
    images: [
      "https://images.unsplash.com/photo-1520975912274-2f1b8b1b3f1d?q=80&w=1200",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200",
    ],
  },

  {
    id: "women",
    title: "Women",
    type: "mega",
    path: "/women",
    images: [
      "https://images.unsplash.com/photo-1543486958-d783bfbf1f2b?q=80&w=1200",
      "https://images.unsplash.com/photo-1520975912274-2f1b8b1b3f1d?q=80&w=1200",
    ],
    categories: [
      {
        id: "women-topwear",
        title: "Topwear",
        subHeadings: [
          {
            id: "women-top-tops",
            name: "Tops & Tees",
            path: "/women/topwear/tops",
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800",
          },
          {
            id: "women-top-shirts",
            name: "Shirts & Blouses",
            path: "/women/topwear/shirts",
            image: "https://images.unsplash.com/photo-1520975912274-2f1b8b1b3f1d?q=80&w=800",
          },
          {
            id: "women-top-kurtis",
            name: "Kurtis",
            path: "/women/topwear/kurtis",
            image: "https://images.unsplash.com/photo-1618354691510-25e0f3c3f3f6?q=80&w=800",
          },
        ],
      },

      {
        id: "women-bottomwear",
        title: "Bottomwear",
        subHeadings: [
          {
            id: "women-bottom-jeans",
            name: "Jeans",
            path: "/women/bottomwear/jeans",
            image: "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=800",
          },
          {
            id: "women-bottom-skirts",
            name: "Skirts",
            path: "/women/bottomwear/skirts",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15d2a0a2d?q=80&w=800",
          },
          {
            id: "women-bottom-pants",
            name: "Trousers & Pants",
            path: "/women/bottomwear/pants",
            image: "https://images.unsplash.com/photo-1520975912274-2f1b8b1b3f1d?q=80&w=800",
          },
        ],
      },

      {
        id: "women-ethnic",
        title: "Ethnic",
        subHeadings: [
          {
            id: "women-sarees",
            name: "Sarees",
            path: "/women/ethnic/sarees",
            image: "https://images.unsplash.com/photo-1520975912274-2f1b8b1b3f1d?q=80&w=800",
          },
          {
            id: "women-lehengas",
            name: "Lehengas",
            path: "/women/ethnic/lehengas",
            image: "https://images.unsplash.com/photo-1543486958-d783bfbf1f2b?q=80&w=800",
          },
        ],
      },
    ],
  },

  {
    id: "men",
    title: "Men",
    type: "mega",
    path: "/men",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200",
      "https://images.unsplash.com/photo-1530845640854-6f3a56c5a3f0?q=80&w=1200",
    ],
    categories: [
      {
        id: "men-topwear",
        title: "Topwear",
        subHeadings: [
          {
            id: "men-top-tshirts",
            name: "T-Shirts",
            path: "/men/topwear/tshirts",
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800",
          },
          {
            id: "men-top-shirts",
            name: "Shirts",
            path: "/men/topwear/shirts",
            image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800",
          },
          {
            id: "men-top-blazers",
            name: "Blazers & Jackets",
            path: "/men/topwear/blazers",
            image: "https://images.unsplash.com/photo-1530845640854-6f3a56c5a3f0?q=80&w=800",
          },
        ],
      },

      {
        id: "men-bottomwear",
        title: "Bottomwear",
        subHeadings: [
          {
            id: "men-bottom-jeans",
            name: "Jeans",
            path: "/men/bottomwear/jeans",
            image: "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=800",
          },
          {
            id: "men-bottom-trousers",
            name: "Trousers",
            path: "/men/bottomwear/trousers",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15d2a0a2d?q=80&w=800",
          },
        ],
      },

      {
        id: "men-ethnic",
        title: "Ethnic",
        subHeadings: [
          {
            id: "men-kurtas",
            name: "Kurtas",
            path: "/men/ethnic/kurtas",
            image: "https://images.unsplash.com/photo-1520975912274-2f1b8b1b3f1d?q=80&w=800",
          },
          {
            id: "men-sherwanis",
            name: "Sherwanis",
            path: "/men/ethnic/sherwanis",
            image: "https://images.unsplash.com/photo-1530845640854-6f3a56c5a3f0?q=80&w=800",
          },
        ],
      },
    ],
  },

  {
    id: "collection",
    title: "Collection",
    type: "link",
    path: "/collection",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200",
      "https://images.unsplash.com/photo-1543486958-d783bfbf1f2b?q=80&w=1200",
    ],
  },

  {
    id: "bestseller",
    title: "Best Seller",
    type: "link",
    path: "/bestseller",
    images: [
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200",
      "https://images.unsplash.com/photo-1520975912274-2f1b8b1b3f1d?q=80&w=1200",
    ],
  },
];

export default navigation;
