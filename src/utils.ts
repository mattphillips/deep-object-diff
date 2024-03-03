export const isDate = (d: unknown): d is Date => d instanceof Date;

export const isEmpty = <T extends object>(o: T): boolean =>
    Object.keys(o).length === 0;

export const isObject = (o: unknown): o is object =>
    o != null && typeof o === "object";

export const hasOwnProperty = <T>(o: T, propertyName: PropertyKey): boolean =>
    Object.prototype.hasOwnProperty.call(o, propertyName);

export const isEmptyObject = <T>(o: T): T extends object ? boolean : false =>
    isObject(o) ? (isEmpty(o) as T extends object ? boolean : false) : false;

export const makeObjectWithoutPrototype = (): Record<string, unknown> =>
    Object.create(null);
