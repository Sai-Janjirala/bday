/**
 * Today's date, formatted once.
 *
 * A birthday card is read in one sitting, so evaluating this at module
 * load rather than during render is both stable and honest — and it
 * keeps `new Date()` out of component bodies, where it would be a new
 * value on every re-render.
 */
const formatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const todayLabel: string = formatter.format(new Date());
