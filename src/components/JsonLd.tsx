export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // `<` is escaped so the payload can never close the script element.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
