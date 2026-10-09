type Obj = Record<string, unknown>;
/** Pick dotted paths from a messages object, e.g. ['cookie', 'legal.privacyChoices']. */
export function pickMessages(messages: Obj, paths: string[]): Obj {
  const out: Obj = {};
  for (const p of paths) {
    const parts = p.split('.');
    let src: unknown = messages;
    let dst: Obj = out;
    for (let i = 0; i < parts.length; i++) {
      const k = parts[i];
      src = (src as Obj | undefined)?.[k];
      if (src === undefined) break;
      if (i === parts.length - 1) dst[k] = src;
      else dst = (dst[k] = (dst[k] as Obj) ?? {}) as Obj;
    }
  }
  return out;
}
