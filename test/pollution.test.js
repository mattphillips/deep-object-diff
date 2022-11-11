import addedDiff from "../src/added";

describe("Prototype pollution", () => {
  test("Demonstrate prototype pollution globally across all objects", () => {
    const a = {};
    const b = new Object();

    expect(a.hello).toBeUndefined();
    expect(b.hello).toBeUndefined();
    expect({}.hello).toBeUndefined();

    b.__proto__.hello = "world";

    expect(a.hello).toBe("world");
    expect(b.hello).toBe("world");
    expect({}.hello).toBe("world");
  });

  test("addedDiff does not pollute global prototype when running diff with added `__proto__` key", () => {
    const a = { role: "user" };
    const b = JSON.parse('{ "__proto__": { "role": "admin" } }');

    expect(a.role).toBe("user");
    expect(a.__proto__.role).toBeUndefined();
    expect(b.role).toBeUndefined();
    expect(b.__proto__.role).toBe("admin");
    expect({}.role).toBeUndefined();
    expect({}.__proto__role).toBeUndefined();

    const difference = addedDiff(a, b);

    expect(a.role).toBe("user");
    expect(a.__proto__.role).toBeUndefined();
    expect(b.__proto__.role).toBe("admin");
    expect(b.role).toBeUndefined();
    expect({}.role).toBeUndefined();
    expect({}.__proto__role).toBeUndefined();

    expect(difference).toEqual({ __proto__: { role: "admin" } });
  });

  test("addedDiff does not pollute global prototype when running diff with added `__proto__` key generated from JSON.parse and mutating original left hand object", () => {
    let a = { role: "user" };
    // Note: Don't trust `JSON.parse`!!!
    const b = JSON.parse('{ "__proto__": { "role": "admin" } }');

    expect(a.role).toBe("user");
    expect(a.__proto__.role).toBeUndefined();
    expect(b.role).toBeUndefined();
    expect(b.__proto__.role).toBe("admin");
    expect({}.role).toBeUndefined();
    expect({}.__proto__role).toBeUndefined();

    // Note: although this does not pollute the global proto, it does pollute the original object. (Don't mutate kids!)
    a = addedDiff(a, b);

    expect(a.role).toBe("admin");
    expect(a.__proto__.role).toBe("admin");
    expect(b.__proto__.role).toBe("admin");
    expect(b.role).toBeUndefined();
    expect({}.role).toBeUndefined();
    expect({}.__proto__role).toBeUndefined();
  });

  test("addedDiff does not pollute global prototype or original object when running diff with added `__proto__` key", () => {
    let a = { role: "user" };
    const b = { __proto__: { role: "admin" } };

    expect(a.role).toBe("user");
    expect(a.__proto__.role).toBeUndefined();
    expect(b.role).toBe("admin");
    expect(b.__proto__.role).toBe("admin");
    expect({}.role).toBeUndefined();
    expect({}.__proto__role).toBeUndefined();

    a = addedDiff(a, b);

    expect(a.role).toBeUndefined();
    expect(a.__proto__.role).toBeUndefined();
    expect(b.role).toBe("admin");
    expect(b.__proto__.role).toBe("admin");
    expect({}.role).toBeUndefined();
    expect({}.__proto__role).toBeUndefined();
  });
});
