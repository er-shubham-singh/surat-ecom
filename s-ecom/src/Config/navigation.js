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
    featured: [
      {
        name: "New Arrivals",
        href: "/",
        imageSrc:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/top/c/v/t/s-d-16-angarkha-original-imahc7ha2tgxvaqw.jpeg?q=70",
        imageAlt:
          "Models sitting back to back, wearing Basic Tee in black and bone.",
      },
      {
        name: "Basic Tees",
        href: "/",
        imageSrc:
          "https://rukminim2.flixcart.com/image/612/612/ku4ezrk0/top/g/s/1/xl-printed-top-fancify-original-imag7bb3yg9xx4yn.jpeg?q=70",
        imageAlt:
          "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
      },
    ],
    categories: [
      {
        id: "top",
        title: "Top",
        subHeadings: [
          {
            id: "ladies_tops",
            name: "Crop Tops",
            path: "/women/topwear/ladies_tops",
          },
        ],
      },

      {
        id: "jacket",
        title: "Jacket",
        subHeadings: [
          {
            id: "half_jacket",
            name: "Half Jackets",
            path: "/women/topwear/half-jackets",
          },
          {
            id: "crop_jacket",
            name: "Crop Jacket",
            path: "/women/topwear/crop-jacket",
          },
        ],
      },

      {
        id: "hoodie",
        title: "Hoodie",
        subHeadings: [
          {
            id: "oversized_hoodie",
            name: "Oversized Hoodie",
            path: "/women/topwear/oversized-hoodie",
          },
          {
            id: "back_print_hoodie",
            name: "Back Print Hoodie",
            path: "/women/topwear/back-print-hoodie",
          },
        ],
      },

      {
        id: "cardigan",
        title: "Cardigan",
        subHeadings: [
          {
            id: "short_cardigan",
            name: "Short Cardigan",
            path: "/women/cardigan/short-cardigan",
          },
          {
            id: "long_cardigan",
            name: "Long Cardigan",
            path: "/women/cardigan/long-cardigan",
          },
          {
            id: "cotrise_cardigan",
            name: "Cotrise Cardigan",
            path: "/women/cardigan/cotrise-cardigan",
          },
          {
            id: "coat_look_cardigan",
            name: "Coat Look Cardigan",
            path: "/women/cardigan/coat-look-cardigan",
          },
        ],
      },

      {
        id: "coats",
        title: "Coats",
        subHeadings: [
          {
            id: "short_length_coat",
            name: "Short Length",
            path: "/women/coats/short-length",
          },
          {
            id: "medium_length_coats",
            name: "Medium Length",
            path: "/women/coats/medium-length",
          },
          {
            id: "full_length_coats",
            name: "Full Length",
            path: "/women/coats/full-length",
          },
        ],
      },

      {
        id: "cord_set",
        title: "Cord Set",
        subHeadings: [
          {
            id: "ethentic",
            name: "Ethnic",
            path: "/women/sets/ethnic",
          },
          {
            id: "western",
            name: "Western",
            path: "/women/sets/western",
          },
        ],
      },

      {
        id: "kurti",
        title: "Kurti",
        subHeadings: [
          {
            id: "party_wear",
            name: "Party Wear",
            path: "/women/kurti/party-wear",
          },
          {
            id: "casual",
            name: "Casual",
            path: "/women/kurti/casual",
          },
        ],
      },

      {
        id: "night_suits",
        title: "Night Suits",
        subHeadings: [
          {
            id: "sleep_wear",
            name: "Sleep Wear",
            path: "/women/night-suits/sleep-wear",
          },
        ],
      },

      {
        id: "dresses",
        title: "Dresses",
        subHeadings: [
          {
            id: "woolen",
            name: "Woolen",
            path: "/women/dresses/woolen",
          },
          {
            id: "party_wear",
            name: "Party Wear",
            path: "/women/dresses/party-wear",
          },
        ],
      },

      {
        id: "jeans",
        title: "Jeans",
        subHeadings: [
          {
            id: "narrow_fit",
            name: "Narrow Fit",
            path: "/women/jeans/narrow-fit",
          },
          {
            id: "regular_fit",
            name: "Regular Fit",
            path: "/women/jeans/regular-fit",
          },
        ],
      },

      {
        id: "pants",
        title: "Pants",
        subHeadings: [
          {
            id: "formal_pants",
            name: "Formal Pants",
            path: "/women/pants/formal-pants",
          },
          {
            id: "trouser",
            name: "Trouser",
            path: "/women/pants/trouser",
          },
          {
            id: "bell_bottom",
            name: "Bell Bottom",
            path: "/women/pants/bell-bottom",
          },
        ],
      },

      {
        id: "jeggings",
        title: "Jeggings",
        subHeadings: [
          {
            id: "jeggings_narrow_fit",
            name: "Narrow Fit",
            path: "/women/jeggings/narrow-fit",
          },
        ],
      },

      {
        id: "lower",
        title: "Lower",
        subHeadings: [
          {
            id: "cottonise",
            name: "Cottonise",
            path: "/women/lower/cottonise",
          },
          {
            id: "pants_fits",
            name: "Pants Fit",
            path: "/women/lower/pants-fits",
          },
          {
            id: "regular_fit",
            name: "Regular Fit",
            path: "/women/lower/regular-fit",
          },
          {
            id: "slim_fit",
            name: "Slim Fit",
            path: "/women/lower/slim-fit",
          },
        ],
      },

      {
        id: "lingerie",
        title: "Lingerie",
        subHeadings: [
          {
            id: "Jockey",
            name: "Jockey",
            path: "/women/lingerie/jockey",
          },
          {
            id: "Amante",
            name: "Amante",
            path: "/women/lingerie/amante",
          },
        ],
      },
    ],
  },

  {
    id: "men",
    title: "Men",
    featured: [
      {
        name: "New Arrivals",
        href: "/",
        imageSrc:
          "https://rukminim2.flixcart.com/image/612/612/xif0q/top/c/v/t/s-d-16-angarkha-original-imahc7ha2tgxvaqw.jpeg?q=70",
        imageAlt:
          "Models sitting back to back, wearing Basic Tee in black and bone.",
      },
      {
        name: "Basic Tees",
        href: "/",
        imageSrc:
          "https://rukminim2.flixcart.com/image/612/612/ku4ezrk0/top/g/s/1/xl-printed-top-fancify-original-imag7bb3yg9xx4yn.jpeg?q=70",
        imageAlt:
          "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
      },
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
            image:
              "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800",
          },
          {
            id: "men-top-shirts",
            name: "Shirts",
            path: "/men/topwear/shirts",
            image:
              "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800",
          },
          {
            id: "men-top-blazers",
            name: "Blazers & Jackets",
            path: "/men/topwear/blazers",
            image:
              "https://images.unsplash.com/photo-1530845640854-6f3a56c5a3f0?q=80&w=800",
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
            image:
              "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=800",
          },
          {
            id: "men-bottom-trousers",
            name: "Trousers",
            path: "/men/bottomwear/trousers",
            image:
              "https://images.unsplash.com/photo-1503342217505-b0a15d2a0a2d?q=80&w=800",
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
            image:
              "https://images.unsplash.com/photo-1520975912274-2f1b8b1b3f1d?q=80&w=800",
          },
          {
            id: "men-sherwanis",
            name: "Sherwanis",
            path: "/men/ethnic/sherwanis",
            image:
              "https://images.unsplash.com/photo-1530845640854-6f3a56c5a3f0?q=80&w=800",
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
