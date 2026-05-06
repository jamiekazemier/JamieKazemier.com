const image = (slug, number, alt, span = "standard") => ({
  src: `/images/galleries/${slug}/${String(number).padStart(2, "0")}.jpg`,
  alt,
  span
});

export const galleries = [
  {
    title: "Head of the River",
    slug: "head-of-the-river",
    location: "Amsterdam",
    date: "Spring 2026",
    summary: "Low angles, tight crews, and long water lines from a fast spring race day.",
    href: "/galleries/head-of-the-river/",
    cover: image("head-of-the-river", 2, "A yellow rowing shell racing low across the water at Head of the River."),
    lead: image("head-of-the-river", 3, "A rowing crew driving together past the riverbank in bright spring light.", "wide"),
    images: [
      image("head-of-the-river", 1, "A low-angle view of rowers launching into Head of the River beside the dock.", "wide"),
      image("head-of-the-river", 2, "A yellow rowing shell racing low across the water at Head of the River.", "wide"),
      image("head-of-the-river", 3, "A rowing crew driving together past the riverbank in bright spring light.", "wide"),
      image("head-of-the-river", 4, "Crew members rowing in sync with yellow blades over rippled water.", "wide"),
      image("head-of-the-river", 5, "A full crew passing the riverbank during a Head of the River race.", "wide"),
      image("head-of-the-river", 6, "Two crews racing close together on open water under spring trees.", "wide"),
      image("head-of-the-river", 7, "A yellow shell and chasing crew captured side by side on the course.", "wide"),
      image("head-of-the-river", 8, "A distant crew rowing past a bridge with dark blue water in the foreground.", "wide"),
      image("head-of-the-river", 9, "A crew passing under a bridge with yellow blades visible in rhythm.", "wide"),
      image("head-of-the-river", 10, "A yellow racing shell framed by bridge pillars and open water.", "wide"),
      image("head-of-the-river", 11, "A crew rowing out from the bridge with bright blades and strong reflections.", "wide")
    ]
  },
  {
    title: "Herfstregatta",
    slug: "herfstregatta",
    location: "Netherlands",
    date: "Autumn 2026",
    summary: "Yellow crews, green banks, close racing, and calm regatta water in autumn light.",
    href: "/galleries/herfstregatta/",
    cover: image("herfstregatta", 7, "A women's crew in yellow rowing toward camera through warm autumn reflections."),
    lead: image("herfstregatta", 6, "A rowing crew moving along a green riverbank during Herfstregatta.", "wide"),
    images: [
      image("herfstregatta", 1, "A yellow rowing crew seen between wooden posts during Herfstregatta.", "tall"),
      image("herfstregatta", 2, "A men's crew in yellow rowing close to camera with focused expressions.", "wide"),
      image("herfstregatta", 3, "A blue crew driving through the water in tight formation during racing.", "wide"),
      image("herfstregatta", 4, "A rower throwing a sheet of water from a wooden shell in bright light.", "tall"),
      image("herfstregatta", 5, "Close race detail of oars, hands, and water splashing over the shell.", "tall"),
      image("herfstregatta", 6, "A rowing crew moving along a green riverbank during Herfstregatta.", "wide"),
      image("herfstregatta", 7, "A women's crew in yellow rowing toward camera through warm autumn reflections.", "wide"),
      image("herfstregatta", 8, "A long canal view with small rowing shells moving through a leafy course.", "wide"),
      image("herfstregatta", 9, "A blue crew rowing toward camera with blades spread across the water.", "wide"),
      image("herfstregatta", 10, "A green crew and blue crew crossing paths in a high-angle regatta view.", "wide"),
      image("herfstregatta", 11, "An overhead view of a green crew aligned in a narrow rowing shell.", "tall"),
      image("herfstregatta", 12, "An overhead view of a blue crew rowing in formation on dark water.", "tall")
    ]
  },
  {
    title: "Traika Tilburg",
    slug: "traika-tilburg",
    location: "Tilburg",
    date: "Winter 2026",
    summary: "Low morning light, quiet water, and close-up training moments from Tilburg.",
    href: "/galleries/traika-tilburg/",
    cover: image("traika-tilburg", 2, "A single rower silhouetted against misty golden water in Tilburg."),
    lead: image("traika-tilburg", 3, "Rowers preparing beside the water with oars cutting through golden reflections.", "wide"),
    images: [
      image("traika-tilburg", 1, "A rower framed in silhouette on still morning water in Tilburg.", "wide"),
      image("traika-tilburg", 2, "A single rower silhouetted against misty golden water in Tilburg.", "wide"),
      image("traika-tilburg", 3, "Rowers preparing beside the water with oars cutting through golden reflections.", "wide"),
      image("traika-tilburg", 4, "A rower leaning over the shell in dark silhouette before training.", "wide"),
      image("traika-tilburg", 5, "A close low-angle silhouette of a rower and oar above the water.", "wide"),
      image("traika-tilburg", 6, "A crew member focused in the shell with blurred oars crossing the foreground.", "wide"),
      image("traika-tilburg", 7, "A low-angle view of athletes rowing past warm reflections and shoreline.", "wide"),
      image("traika-tilburg", 8, "Two rowers moving beside the bank with a long oar crossing the frame.", "wide"),
      image("traika-tilburg", 9, "A yellow shell with a crew rowing in profile across calm water.", "wide"),
      image("traika-tilburg", 10, "A close profile of a rowing crew in a yellow shell under soft winter light.", "wide")
    ]
  }
];

export const featuredImages = [
  galleries[0].images[1],
  galleries[1].images[0],
  galleries[2].images[1],
  galleries[0].images[3],
  galleries[1].images[4],
  galleries[2].images[5]
];

export function getGalleryBySlug(slug) {
  return galleries.find((gallery) => gallery.slug === slug);
}
