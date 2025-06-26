
import { db } from "./db";
import { articles } from "@shared/schema";

const articlesData = [
  {
    title: "Discovering the World's Biggest Cave",
    author: "Ben Mitchell",
    summary: "The remarkable discovery of Hang Son Doong and its impact on Vietnamese caving tourism.",
    mainImageUrl: "/images/inspiration/A Story Spanning Decades- Discovering the World's Biggest Cave.jpg",
    publicationDate: new Date("2017-09-07"),
    locationIds: "201",
    latitude: "17.5468",
    longitude: "106.2899",
    tags: ["caves", "adventure", "history"],
    contentHtml: `<h1>Discovering the World's Biggest Cave</h1><p><strong>By Ben Mitchell</strong></p><p><em>The remarkable discovery of Hang Son Doong and its impact on Vietnamese caving tourism.</em></p><div>The remarkable discovery of Hang Son Doong and its impact on Vietnamese caving tourism.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: true,
    isActive: true
  },
  {
    title: "Epic Eco Travel Shares Experience of Phong Nha and Vietnam",
    author: "Epic Eco Travel",
    summary: "A personal travel blog about sustainable tourism and the beauty of Phong Nha.",
    mainImageUrl: "/images/inspiration/Epic Eco Travel Shares Experience of Phong Nha and Vietnam.jpg",
    publicationDate: new Date("2017-10-19"),
    locationIds: "101",
    latitude: "17.555",
    longitude: "106.288",
    tags: ["eco", "sustainable", "tourism"],
    contentHtml: `<h1>Epic Eco Travel Shares Experience of Phong Nha and Vietnam</h1><p><strong>By Epic Eco Travel</strong></p><p><em>A personal travel blog about sustainable tourism and the beauty of Phong Nha.</em></p><div>A personal travel blog about sustainable tourism and the beauty of Phong Nha.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: true,
    isActive: true
  },
  {
    title: "Vietnam's Hidden Natural Wonders: An Adventure Trip",
    author: "David Scherz",
    summary: "An adventure from Phong Nha to Ha Giang exploring hidden gems of Vietnam.",
    mainImageUrl: "/images/inspiration/Vietnam's Hidden Natural Wonders- An Adventure Trip.jpg",
    publicationDate: new Date("2017-10-27"),
    locationIds: "101,301",
    latitude: "17.558",
    longitude: "106.292",
    tags: ["adventure", "tours", "nature"],
    contentHtml: `<h1>Vietnam's Hidden Natural Wonders: An Adventure Trip</h1><p><strong>By David Scherz</strong></p><p><em>An adventure from Phong Nha to Ha Giang exploring hidden gems of Vietnam.</em></p><div>An adventure from Phong Nha to Ha Giang exploring hidden gems of Vietnam.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: true,
    isActive: true
  },
  {
    title: "Make Your Own Vietnamese Hat in Phong Nha",
    author: "Ben Mitchell",
    summary: "Join a hands-on conical hat making workshop in Bong Lai Valley.",
    mainImageUrl: "/images/inspiration/Make Your Own Vietnamese Hat in Phong Nha.jpg",
    publicationDate: new Date("2017-11-25"),
    locationIds: "202",
    latitude: "17.544",
    longitude: "106.276",
    tags: ["culture", "workshop", "heritage"],
    contentHtml: `<h1>Make Your Own Vietnamese Hat in Phong Nha</h1><p><strong>By Visit Phong Nha</strong></p><p><em>Join a hands-on conical hat making workshop in Bong Lai Valley.</em></p><div>Join a hands-on conical hat making workshop in Bong Lai Valley.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: true,
    isActive: true
  },
  {
    title: "Altars, Incense and the Celebration of Death",
    author: "Ben Mitchell",
    summary: "Explores Vietnamese ancestor worship traditions, death anniversaries, and the cultural meaning behind altars and incense rituals.",
    mainImageUrl: "/images/inspiration/Altars, Incense and the Celebration of Death.jpg",
    publicationDate: new Date("2017-12-09"),
    locationIds: null,
    latitude: "17.5557",
    longitude: "106.2871",
    tags: ["Culture", "Heritage", "Phong Nha", "Vietnam"],
    contentHtml: `<h1>Altars, Incense and the Celebration of Death</h1><p><strong>By Visit Phong Nha</strong></p><p><em>Explores Vietnamese ancestor worship traditions, death anniversaries, and the cultural meaning behind altars and incense rituals.</em></p><div>Explores Vietnamese ancestor worship traditions, death anniversaries, and the cultural meaning behind altars and incense rituals.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: false,
    isActive: true
  },
  {
    title: "Clothes for Big People",
    author: "Ben Mitchell",
    summary: "A look at the challenges of finding clothes for big people in Vietnam, with tips and humorous anecdotes from expats.",
    mainImageUrl: "/images/inspiration/Clothes for Big People.jpg",
    publicationDate: new Date("2017-12-23"),
    locationIds: null,
    latitude: "17.5557",
    longitude: "106.2871",
    tags: ["Culture", "Shopping", "Vietnam"],
    contentHtml: `<h1>Clothes for Big People</h1><p><strong>By Visit Phong Nha</strong></p><p><em>A look at the challenges of finding clothes for big people in Vietnam, with tips and humorous anecdotes from expats.</em></p><div>A look at the challenges of finding clothes for big people in Vietnam, with tips and humorous anecdotes from expats.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: false,
    isActive: true
  },
  {
    title: "Great Books and Movies about Vietnam",
    author: "Ben Mitchell",
    summary: "Recommended books and movies offering deep insights into Vietnam's history, culture, and the American War.",
    mainImageUrl: "/images/inspiration/Great Books and Movies about Vietnam.jpg",
    publicationDate: new Date("2017-12-27"),
    locationIds: null,
    latitude: "14.0583",
    longitude: "108.2772",
    tags: ["Heritage", "History", "Literature", "Movies"],
    contentHtml: `<h1>Great Books and Movies about Vietnam</h1><p><strong>By Visit Phong Nha</strong></p><p><em>Recommended books and movies offering deep insights into Vietnam's history, culture, and the American War.</em></p><div>Recommended books and movies offering deep insights into Vietnam's history, culture, and the American War.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: false,
    isActive: true
  },
  {
    title: "Tết Holiday in Vietnam (Pt.1): An Introduction",
    author: "Ben Mitchell",
    summary: "An introduction to Vietnam's most important holiday, Tết, exploring its cultural significance and traditions.",
    mainImageUrl: "/images/inspiration/Tết Holiday in Vietnam (Pt.1).jpg",
    publicationDate: new Date("2018-01-23"),
    locationIds: null,
    latitude: "14.0583",
    longitude: "108.2772",
    tags: ["Culture", "Heritage", "Phong Nha", "Vietnam"],
    contentHtml: `<h1>Tết Holiday in Vietnam (Pt.1): An Introduction</h1><p><strong>By Visit Phong Nha</strong></p><p><em>An introduction to Vietnam's most important holiday, Tết, exploring its cultural significance and traditions.</em></p><div>An introduction to Vietnam's most important holiday, Tết, exploring its cultural significance and traditions.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: false,
    isActive: true
  },
  {
    title: "Tết Holiday in Vietnam (Pt.2): How to Make the Most of Tết",
    author: "Ben Mitchell",
    summary: "Advice for travelers on how to make the most of Vietnam's Lunar New Year holiday, Tết, including travel tips and etiquette.",
    mainImageUrl: "/images/inspiration/Tết Holiday in Vietnam (Pt.2).jpg",
    publicationDate: new Date("2018-01-26"),
    locationIds: null,
    latitude: "14.0583",
    longitude: "108.2772",
    tags: ["Culture", "Heritage", "Phong Nha", "Vietnam"],
    contentHtml: `<h1>Tết Holiday in Vietnam (Pt.2): How to Make the Most of Tết</h1><p><strong>By Visit Phong Nha</strong></p><p><em>Advice for travelers on how to make the most of Vietnam's Lunar New Year holiday, Tết, including travel tips and etiquette.</em></p><div>Advice for travelers on how to make the most of Vietnam's Lunar New Year holiday, Tết, including travel tips and etiquette.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: false,
    isActive: true
  },
  {
    title: "The Elements Collection – a Super Unique Countryside Experience",
    author: "Ben Mitchell",
    summary: "Discover The Elements Collection, a boutique villa experience in rural Vietnam with private pools and vintage vehicles.",
    mainImageUrl: "/images/inspiration/The Elements Collection.jpg",
    publicationDate: new Date("2018-06-26"),
    locationIds: null,
    latitude: "17.5445",
    longitude: "106.2655",
    tags: ["Luxury", "Accommodation", "Phong Nha"],
    contentHtml: `<h1>The Elements Collection – a Super Unique Countryside Experience</h1><p><strong>By Visit Phong Nha</strong></p><p><em>Discover The Elements Collection, a boutique villa experience in rural Vietnam with private pools and vintage vehicles.</em></p><div>Discover The Elements Collection, a boutique villa experience in rural Vietnam with private pools and vintage vehicles.</div>`,
    mapOverlay: null,
    externalUrl: null,
    isFeatured: false,
    isActive: true
  }
];

async function importArticles() {
  try {
    console.log("Clearing existing articles...");
    await db.delete(articles);
    
    console.log("Importing new articles...");
    for (const articleData of articlesData) {
      await db.insert(articles).values(articleData);
      console.log(`Imported: ${articleData.title}`);
    }
    
    console.log("Articles import completed successfully!");
  } catch (error) {
    console.error("Error importing articles:", error);
  }
}

// Run the import
importArticles();
