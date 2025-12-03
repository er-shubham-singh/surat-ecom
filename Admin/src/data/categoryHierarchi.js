const categoryHierarchy = {
  women: {
    top: [
      { value: "ladies_tops", label: "Tops" },
    ],
    jacket: [
      { value: "half_jacket", label: "Half Jackets" },
      { value: "crop_jacket", label: "Crop Jacket" },
    ],
    hoodie: [
      { value: "oversized_hoodie", label: "Oversized Hoodie" },
      { value: "back_print_hoodie", label: "Back Print Hoodie" },
    ],
    cardigan: [
      { value: "short_cardigan", label: "Short Cardigan" },
      { value: "long_cardigan", label: "Long Cardigan" },
      { value: "cotrise_cardigan", label: "Cotrise Cardigan" },
      { value: "coat_look_cardigan", label: "Coat Look Cardigan" },
    ],
    coats: [
      { value: "short_length_coat", label: "Short Length" },
      { value: "medium_length_coats", label: "Medium Length" },
      { value: "full_length_coats", label: "Full Length" },
    ],
    cord_set: [
      { value: "ethentic", label: "Ethentic" },
      { value: "western", label: "Western" },
    ],
    kurti: [
      { value: "party_wear", label: "Party Wear" },
      { value: "casual", label: "Casual" },
    ],
    night_suits: [
      { value: "sleep_wear", label: "Sleep Wear" },
    ],
    dresses: [
      { value: "woolen", label: "Woolen" },
      { value: "party_waer", label: "Party Wear" },
    ],
    jeans: [
      { value: "narrow_fit", label: "Narrow Fit" },
      { value: "regular_fit", label: "Regular Fit" },
    ],
    pants: [
      { value: "formal_pants", label: "Formal Pants" },
      { value: "trouser", label: "Trouser" },
      { value: "bell_bottom", label: "Bell Bottom" },
    ],
    jeggings: [
      { value: "narrow_fit", label: "Narrow Fit" },
    ],
    lower: [
      { value: "cottonise", label: "Cottonise" },
      { value: "pants_fits", label: "Pants Fit" },
      { value: "regular_fit", label: "Regular Fit" },
      { value: "slim_fit", label: "Slim Fit" },
    ],
    lingerie: [
      { value: "Jockey", label: "Jockey" },
      { value: "Amante", label: "Amante" },
    ],
  },

  men: {
    zipper: [
      // note: value uses ids exactly as in your navigation
      { value: "half-ziper", label: "Half Zipper" },
      { value: "full-zipper", label: "Full Zipper" },
    ],
    jacket: [
      { value: "half-jacket", label: "Half Jacket" },
      { value: "cotnise-jacket", label: "Cotnise Jacket" },
      { value: "denim-jacket", label: "Denim Jacket" },
    ],
    "formal-trouser": [
      { value: "linen-trouser", label: "Linen Trouser" },
      { value: "cargo", label: "Cargo" },
    ],
    jeans: [
      { value: "cotrises-jeans", label: "Cotrises Jeans" },
      { value: "fleece", label: "Fleece" },
      { value: "without-fleece", label: "Without Fleece" },
    ],
    lower: [
      { value: "cotrises", label: "Cotrises" },
      { value: "fleece", label: "Fleece" },
      { value: "straight-fit", label: "Straight Fit" },
      { value: "narrow-fit", label: "Narrow Fit" },
      { value: "lower-style-pant", label: "Lower Style Pant" },
      { value: "denim", label: "Denim" },
      { value: "cargo", label: "Cargo" },
    ],
  },

  kids: {
    bottom_wear: [],
    tops: [],
    kurtis: [],
  },
};

export default categoryHierarchy;
