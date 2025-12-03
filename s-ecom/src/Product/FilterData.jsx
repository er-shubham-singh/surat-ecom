// filters.js
export const color = [
  "white",
  "black",
  "red",
  "maroon",
  "beige",
  "pink",
  "green",
  "yellow",
];

export const filters = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "white", label: "White", colorCode: "#FFFFFF" },
      { value: "black", label: "Black", colorCode: "#000000" },
      { value: "blue", label: "Blue", colorCode: "#0000FF" },
      { value: "brown", label: "Brown", colorCode: "#8B4513" },
      { value: "green", label: "Green", colorCode: "#008000" },
      { value: "purple", label: "Purple", colorCode: "#800080" },
      { value: "yellow", label: "Yellow", colorCode: "#FFFF00" },
      { value: "multicolor", label: "Multicolor", colorCode: "linear-gradient(90deg,#ff7a7a,#ffd36e,#9ae66e)" }
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
    ],
  },
];

export const singleFilter = [
  {
    id: "price",
    name: "Price",
    options: [
      { value: "159-399", label: "₹159 To ₹399" },
      { value: "399-999", label: "₹399 To ₹999" },
      { value: "999-1999", label: "₹999 To ₹1999" },
      { value: "1999-2999", label: "₹1999 To ₹2999" },
      { value: "3999-4999", label: "₹3999 To ₹4999" },
    ],
  },
  {
    id: "discount", // corrected id
    name: "Discount Range",
    options: [
      { value: "10", label: "10% And Above" },
      { value: "20", label: "20% And Above" },
      { value: "30", label: "30% And Above" },
      { value: "40", label: "40% And Above" },
      { value: "50", label: "50% And Above" },
      { value: "60", label: "60% And Above" },
      { value: "70", label: "70% And Above" },
      { value: "80", label: "80% And Above" },
    ],
  },
  {
    id: "stock",
    name: "Availability",
    options: [
      { value: "in_stock", label: "In Stock" },
      { value: "out_of_stock", label: "Out Of Stock" },
    ],
  },
];

export const sortOptions = [
  { name: "Featured", query: "featured", current: false },
  { name: "Price: Low to High", query: "price_low", current: false },
  { name: "Price: High to Low", query: "price_high", current: false },
  { name: "Newest", query: "newest", current: false },
  { name: "Best Selling", query: "best_selling", current: false },
];
