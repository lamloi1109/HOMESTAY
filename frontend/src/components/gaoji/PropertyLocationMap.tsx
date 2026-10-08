import { ExternalLink, MapPin } from "lucide-react";

interface PropertyLocationMapProps {
  propertyName: string;
  tower?: string | null;
  address?: string | null;
  city?: string | null;
}

export function PropertyLocationMap({
  propertyName,
  tower,
  address,
  city,
}: PropertyLocationMapProps) {
  const buildingName = tower ? `Tòa ${tower}` : propertyName;
  const location = [address || buildingName, city, "Việt Nam"].filter(Boolean).join(", ");
  const encodedLocation = encodeURIComponent(location);
  const embedUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed&z=17`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

  return (
    <section
      aria-labelledby="property-location-title"
      className="mx-auto mt-12 max-w-[1600px] px-4 sm:px-8 lg:px-12"
    >
      <div className="border border-[var(--hairline)] bg-[var(--surface-raised)]">
        <div className="flex flex-col gap-5 border-b border-[var(--hairline)] p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--gold-700)]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-900)]">
                Vị trí căn hộ
              </span>
            </div>
            <h2
              id="property-location-title"
              className="font-display text-2xl font-normal uppercase text-[var(--ink-900)] sm:text-3xl"
            >
              {buildingName} · Vinhomes Central Park
            </h2>
            <p className="mt-2 flex max-w-3xl items-start gap-2 font-sans text-sm leading-6 text-[var(--text-muted)] sm:text-base">
              <MapPin
                aria-hidden="true"
                className="mt-1 shrink-0 text-[var(--gold-900)]"
                size={17}
                strokeWidth={1.7}
              />
              <span>{location}</span>
            </p>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-[var(--jade-700)] bg-[var(--jade-700)] px-5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[var(--jade-900)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            aria-label={`Mở vị trí ${buildingName} trên Google Maps trong thẻ mới`}
          >
            Mở Google Maps
            <ExternalLink aria-hidden="true" size={16} strokeWidth={1.7} />
          </a>
        </div>

        <div className="relative h-[340px] overflow-hidden bg-[var(--surface-sunken)] sm:h-[420px] lg:h-[480px]">
          <iframe
            title={`Bản đồ vị trí ${buildingName}`}
            src={embedUrl}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
