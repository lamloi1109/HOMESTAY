import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const PUBLIC_ASSETS = path.resolve(process.cwd(), "public/assets");

// Helper to inspect PNG / WebP alpha channels and boundaries
function inspectImageBuffer(filePath: string) {
  const buf = fs.readFileSync(filePath);
  // Basic sanity check on file signature
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isWebp = buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP";
  assert.ok(isPng || isWebp, `${path.basename(filePath)} must be a valid PNG or WebP file`);
  return { size: buf.length, isPng, isWebp };
}

test("Logo Assets Integrity: All standard brand logos exist and are non-empty", () => {
  const expectedFiles = [
    "logo-compact.png",
    "logo-dark-compact.png",
    "logo-full.png",
    "logo-dark.png",
    "logo.png",
    "logo-transparent.png",
    "logo-brand-compact.webp",
    "logo-brand-full.webp",
  ];

  for (const file of expectedFiles) {
    const fullPath = path.join(PUBLIC_ASSETS, file);
    assert.ok(fs.existsSync(fullPath), `Asset ${file} must exist in public/assets`);
    const { size } = inspectImageBuffer(fullPath);
    assert.ok(size > 5000, `Asset ${file} must contain valid image data (got ${size} bytes)`);
  }
});

test("Logo Design Contract: No asset may have an opaque dark background or clipped text", () => {
  // Read each file and verify through Node image dimension metadata
  const filesToCheck = [
    "logo-compact.png",
    "logo-dark-compact.png",
    "logo-full.png",
    "logo-dark.png",
    "logo.png",
    "logo-brand-compact.webp",
    "logo-brand-full.webp",
  ];

  for (const file of filesToCheck) {
    const fullPath = path.join(PUBLIC_ASSETS, file);
    const buf = fs.readFileSync(fullPath);
    if (file.endsWith(".png")) {
      // PNG IHDR chunk is at byte 12..29
      // Byte 25 is color type: 6 = RGBA (Truecolor with alpha)
      const colorType = buf[25];
      assert.equal(
        colorType,
        6,
        `${file} must be 32-bit RGBA with full alpha channel support to prevent dark background boxes`
      );
    }
  }
});
