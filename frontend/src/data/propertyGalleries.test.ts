import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_R2_BASE_URL,
  PROPERTY_UNIT_MANIFESTS,
  getCuratedGallery,
} from "./propertyGalleries.ts";

const EXPECTED_PROPERTIES = [
  { slug: "landmark-1-29-08", code: "L1.29.08", minPhotos: 20 },
  { slug: "landmark-3-30-ot05", code: "L3.30OT05", minPhotos: 10 },
  { slug: "landmark-3-44-09", code: "L3.44.09", minPhotos: 8 },
  { slug: "landmark-3-49-02", code: "L3.49.02", minPhotos: 10 },
  { slug: "landmark-81-07-12", code: "L81.07.12", minPhotos: 15 },
  { slug: "park-1-11-12", code: "P1.11.12", minPhotos: 5 },
  { slug: "park-1-27-10", code: "P1.27.10", minPhotos: 10 },
  { slug: "park-3-30-09", code: "P3.30.09", minPhotos: 5 },
  { slug: "park-3-42-12", code: "P3.42.12", minPhotos: 8 },
  { slug: "park-7-10-12", code: "P7.10.12", minPhotos: 5 },
];

const VALID_CATEGORIES = new Set([
  "living-room",
  "bedroom",
  "kitchen",
  "bathroom",
  "balcony",
  "amenities",
  "other",
]);

test("Gallery Contract: All 10 property units have complete photo galleries configured", () => {
  const manifestedSlugs = Object.keys(PROPERTY_UNIT_MANIFESTS);
  assert.equal(manifestedSlugs.length, 10, "Must have exactly 10 managed properties");

  for (const expected of EXPECTED_PROPERTIES) {
    const unit = PROPERTY_UNIT_MANIFESTS[expected.slug];
    assert.ok(unit, `Property manifest missing for ${expected.slug}`);
    assert.ok(
      unit.photos.length >= expected.minPhotos,
      `Property ${expected.slug} has ${unit.photos.length} photos, expected at least ${expected.minPhotos}`,
    );
  }
});

test("Gallery Contract: Dual-variant image URLs, dimensions and category assignments", () => {
  for (const expected of EXPECTED_PROPERTIES) {
    const gallery = getCuratedGallery(expected.slug);
    assert.ok(gallery.length > 0, `Gallery for ${expected.slug} should not be empty`);

    for (const photo of gallery) {
      // 1. Dual variants check
      assert.ok(photo.thumbnailSrc, `Missing thumbnailSrc for photo ${photo.id}`);
      assert.ok(photo.fullSrc, `Missing fullSrc for photo ${photo.id}`);
      assert.ok(
        photo.thumbnailSrc.endsWith("-640.webp"),
        `Thumbnail variant must end with -640.webp: ${photo.thumbnailSrc}`,
      );
      assert.ok(
        photo.fullSrc.endsWith("-1600.webp"),
        `Full variant must end with -1600.webp: ${photo.fullSrc}`,
      );
      assert.equal(photo.src, photo.fullSrc, "Default src should match fullSrc (1600.webp)");

      // 2. Base URL check
      assert.ok(
        photo.thumbnailSrc.startsWith(DEFAULT_R2_BASE_URL),
        `Thumbnail URL must start with R2 base URL: ${photo.thumbnailSrc}`,
      );
      assert.ok(
        photo.fullSrc.startsWith(DEFAULT_R2_BASE_URL),
        `Full URL must start with R2 base URL: ${photo.fullSrc}`,
      );

      // 3. Category assignment check
      assert.ok(
        photo.category && VALID_CATEGORIES.has(photo.category),
        `Invalid or missing category '${photo.category}' for photo ${photo.id}`,
      );

      // 4. Dimensions & metadata check
      assert.ok(photo.width > 0, `Width must be > 0 for photo ${photo.id}`);
      assert.ok(photo.height > 0, `Height must be > 0 for photo ${photo.id}`);
      assert.ok(photo.alt && photo.alt.trim().length > 0, `Alt text missing for photo ${photo.id}`);
    }
  }
});

test("Gallery Lookup: Resolves by both URL slugs and tower/unit codes", () => {
  for (const expected of EXPECTED_PROPERTIES) {
    const bySlug = getCuratedGallery(expected.slug);
    const byCode = getCuratedGallery(expected.code);
    assert.ok(bySlug.length > 0, `Lookup by slug failed for ${expected.slug}`);
    assert.ok(byCode.length > 0, `Lookup by code failed for ${expected.code}`);
    assert.equal(
      byCode.length,
      bySlug.length,
      `Lookup for ${expected.slug} and ${expected.code} should return same photo count`,
    );

    // Case-insensitivity check
    const byLowerCode = getCuratedGallery(expected.code.toLowerCase());
    assert.equal(
      byLowerCode.length,
      bySlug.length,
      `Lookup for lowercased code ${expected.code.toLowerCase()} should return same photo count`,
    );
  }
});

test("Gallery Fallback: Unlisted or invalid units fall back gracefully without errors", () => {
  assert.deepEqual(getCuratedGallery("non-existent-unit-999"), []);
  assert.deepEqual(getCuratedGallery(""), []);
  assert.deepEqual(getCuratedGallery(null), []);
  assert.deepEqual(getCuratedGallery(undefined), []);
  assert.deepEqual(getCuratedGallery("RANDOM_TOWER_404"), []);
});
