import { describe, expect, it } from "vitest";
import { galleries, portfolioSequence, storyTeasers } from "../src/data/galleries.mjs";
import { site } from "../src/data/site.mjs";

describe("site content contract", () => {
  it("uses the agreed brand, contact, and a truthful sales handoff config", () => {
    expect(site.name).toBe("Jamie Kazemier Photography");
    expect(site.email).toBe("jamiekaazz@gmail.com");
    expect(site.instagramHandle).toBe("@jamie.kazemier");
    expect(site.shopLabel).toBe("Find race photos");
    expect(site.shopHref).toBe("/contact/#sales");
    expect(site.shopExternal).toBe(false);
    expect(site.description).toMatch(/rowing photography/i);
    expect(site.tagline).toMatch(/rowing/i);
  });

  it("keeps only a few deeper story galleries with strong asset conventions", () => {
    expect(galleries.length).toBeGreaterThanOrEqual(2);
    expect(galleries.length).toBeLessThanOrEqual(3);

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

  it("defines a curated portfolio sequence with only a few linked story exits", () => {
    expect(portfolioSequence).toHaveLength(18);

    const uniqueImages = new Set(portfolioSequence.map((entry) => entry.image.src));
    expect(uniqueImages.size).toBe(portfolioSequence.length);

    const linkedEntries = portfolioSequence.filter((entry) => entry.href);
    expect(linkedEntries.length).toBeGreaterThanOrEqual(2);
    expect(linkedEntries.length).toBeLessThanOrEqual(3);

    for (const entry of portfolioSequence) {
      expect(entry.image.alt.length).toBeGreaterThan(20);
      expect(["feature", "wide", "tall", "square"]).toContain(entry.layout);

      if (entry.href) {
        expect(entry.href).toMatch(/^\/galleries\/.+\/$/);
      }
    }
  });

  it("surfaces a sparse set of homepage story teasers", () => {
    expect(storyTeasers).toHaveLength(3);

    for (const teaser of storyTeasers) {
      expect(teaser.href).toMatch(/^\/galleries\/.+\/$/);
    }
  });
});
