import { describe, expect, it } from "vitest";
import { galleries, featuredImages } from "../src/data/galleries.mjs";
import { site } from "../src/data/site.mjs";

describe("site content contract", () => {
  it("uses the agreed brand, contact, and sales destinations", () => {
    expect(site.name).toBe("Jamie Kazemier Photography");
    expect(site.email).toBe("jamiekaazz@gmail.com");
    expect(site.instagramHandle).toBe("@jamie.kazemier");
    expect(site.buyPhotosHref).toBe("/contact/#buy-photos");
  });

  it("ships three event-led rowing galleries with valid asset conventions", () => {
    expect(galleries).toHaveLength(3);

    for (const gallery of galleries) {
      expect(gallery.href).toBe(`/galleries/${gallery.slug}/`);
      expect(gallery.images.length).toBeGreaterThanOrEqual(8);
      expect(gallery.images.length).toBeLessThanOrEqual(12);
      expect(gallery.cover.src).toMatch(new RegExp(`^/images/galleries/${gallery.slug}/[0-9]{2}\\.jpg$`));
      expect(gallery.lead.src).toMatch(new RegExp(`^/images/galleries/${gallery.slug}/[0-9]{2}\\.jpg$`));

      for (const image of gallery.images) {
        expect(image.src).toMatch(new RegExp(`^/images/galleries/${gallery.slug}/[0-9]{2}\\.jpg$`));
        expect(image.alt.length).toBeGreaterThan(20);
      }
    }
  });

  it("features six homepage images drawn from gallery content", () => {
    expect(featuredImages).toHaveLength(6);
    expect(new Set(featuredImages.map((image) => image.src)).size).toBe(6);
  });
});
