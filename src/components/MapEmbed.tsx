import { site } from "@/lib/site";

// Bản đồ Google nhúng, không cần API key
export function MapEmbed() {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&z=16&hl=vi&output=embed`;
  return (
    <div className="map-frame">
      <iframe
        src={src}
        title={`Bản đồ đường tới ${site.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
