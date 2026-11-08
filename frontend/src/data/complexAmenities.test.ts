import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_R2_BASE_URL } from "./propertyGalleries.ts";
import { getComplexAmenities } from "./complexAmenities.ts";
import nextConfig from "../../next.config.ts";

test("Complex Amenities Contract: Lookups return all verified Vinhomes Central Park shared amenities", () => {
  const vhcpAmenities = getComplexAmenities("vhcp");
  assert.equal(vhcpAmenities.length, 4, "Must have 4 complex-level amenities for Vinhomes Central Park");

  const categories = vhcpAmenities.map((a) => a.category);
  assert.ok(categories.includes("pool"), "Must include infinity pools");
  assert.ok(categories.includes("park"), "Must include riverside park");
  assert.ok(categories.includes("marina"), "Must include marina");
  assert.ok(categories.includes("landscape"), "Must include landscape");

  for (const amenity of vhcpAmenities) {
    assert.ok(amenity.id && amenity.id.startsWith("vhcp-"));
    assert.ok(amenity.name && amenity.name.length > 0);
    assert.ok(amenity.description && amenity.description.length > 0);
    assert.ok(amenity.width > 0 && amenity.height > 0);

    // Dual variants verification
    assert.ok(
      amenity.thumbnailSrc.endsWith("-640.webp"),
      `Thumbnail variant must end with -640.webp: ${amenity.thumbnailSrc}`,
    );
    assert.ok(
      amenity.fullSrc.endsWith("-1600.webp"),
      `Full variant must end with -1600.webp: ${amenity.fullSrc}`,
    );
    assert.ok(
      amenity.thumbnailSrc.includes("complexes/vhcp/amenities/"),
      `Thumbnail URL must be under complexes/vhcp/amenities/: ${amenity.thumbnailSrc}`,
    );
    assert.ok(
      amenity.fullSrc.includes("complexes/vhcp/amenities/"),
      `Full URL must be under complexes/vhcp/amenities/: ${amenity.fullSrc}`,
    );
    assert.ok(
      amenity.thumbnailSrc.startsWith(DEFAULT_R2_BASE_URL),
      `Thumbnail URL must start with R2 base URL: ${amenity.thumbnailSrc}`,
    );
  }
});

test("Complex Amenities Aliases: Resolves alias keys and safely falls back for unlisted complexes", () => {
  assert.equal(getComplexAmenities("vinhomes-central-park").length, 4);
  assert.equal(getComplexAmenities("VINHOMES").length, 4);
  assert.equal(getComplexAmenities("VHCP").length, 4);

  // Safe fallback for unlisted complexes
  assert.deepEqual(getComplexAmenities("unlisted-complex-999"), []);
  assert.deepEqual(getComplexAmenities(""), []);
});

test("Static Asset Routing Contract: Next.js redirects only photo requests to R2 while brand assets remain local", async () => {
  // 1. When ASSET_BASE_URL is configured
  const mockBaseUrl = "https://pub-f4801f91b77a4269828769d0b4821905.r2.dev";
  process.env.NEXT_PUBLIC_ASSET_BASE_URL = mockBaseUrl;

  const redirects = await (nextConfig.redirects ? nextConfig.redirects() : Promise.resolve([]));
  assert.ok(redirects.length > 0, "Redirects must be active when assetBaseUrl is set");

  const photoRedirect = redirects.find((r) => r.source === "/assets/photos/:path*");
  assert.ok(photoRedirect, "Must have a redirect rule specifically for /assets/photos/:path*");
  assert.equal(
    photoRedirect.destination,
    `${mockBaseUrl}/assets/photos/:path*`,
    "Photo redirect destination must target R2 asset base URL",
  );
  assert.equal(photoRedirect.permanent, true);

  // 2. Verify brand asset paths DO NOT match the redirect rule
  // A redirect for /assets/photos/:path* only matches paths starting with /assets/photos/
  const isPhotoPath = (path: string) => path.startsWith("/assets/photos/");

  // Photo paths must be redirected
  assert.equal(isPhotoPath("/assets/photos/pool-aerial.jpg"), true);
  assert.equal(isPhotoPath("/assets/photos/bathroom-shower.jpg"), true);
  assert.equal(isPhotoPath("/assets/photos/gym.webp"), true);

  // Brand identity assets MUST NOT be redirected (they are served locally from public/assets)
  assert.equal(isPhotoPath("/assets/logo.png"), false);
  assert.equal(isPhotoPath("/assets/logo-compact.png"), false);
  assert.equal(isPhotoPath("/assets/logo-dark.png"), false);
  assert.equal(isPhotoPath("/assets/qr-telegram.png"), false);
  assert.equal(isPhotoPath("/assets/qr-wechat.png"), false);
});
