import addedDiff from "../src/added";
import updatedDiff from "../src/updated";
import diff from "../src/diff";
import deletedDiff from "../src/deleted";

describe("Prototype pollution", () => {
    describe("diff", () => {
        test("should not pollute returned diffs prototype", () => {
            const l = { role: "user" };
            const r = JSON.parse(
                '{ "role": "user", "__proto__": { "role": "admin" } }'
            );
            const difference = diff(l, r);

            expect(l.role).toBe("user");
            expect(r.role).toBe("user");
            expect(difference.role).toBeUndefined();
        });

        test("should not pollute returned diffs prototype on nested diffs", () => {
            const l = { about: { role: "user" } };
            const r = JSON.parse(
                '{ "about": { "__proto__": { "role": "admin" } } }'
            );
            const difference = addedDiff(l, r);

            expect(l.about.role).toBe("user");
            expect(r.about.role).toBeUndefined();
            expect(
                (difference.about as { role?: unknown }).role
            ).toBeUndefined();
        });
    });

    describe("addedDiff", () => {
        test("addedDiff should not pollute returned diffs prototype", () => {
            const l = { role: "user" };
            const r = JSON.parse('{ "__proto__": { "role": "admin" } }');
            const difference = addedDiff(l, r);

            expect(l.role).toBe("user");
            expect(r.role).toBeUndefined();
            expect(difference.role).toBeUndefined();
        });

        test("should not pollute returned diffs prototype on nested diffs", () => {
            const l = { about: { role: "user" } };
            const r = JSON.parse(
                '{ "about": { "__proto__": { "role": "admin" } } }'
            );
            const difference = addedDiff(l, r);

            expect(l.about.role).toBe("user");
            expect(r.about.role).toBeUndefined();
            expect(
                (difference.about as { role?: unknown }).role
            ).toBeUndefined();
        });
    });

    test("updatedDiff should not pollute returned diffs prototype", () => {
        const l = { role: "user" };
        const r = JSON.parse(
            '{ "role": "user", "__proto__": { "role": "admin" } }'
        );
        const difference = updatedDiff(l, r);

        expect(l.role).toBe("user");
        expect(r.role).toBe("user");
        expect(difference.role).toBeUndefined();
    });

    test("deletedDiff should not pollute returned diffs prototype", () => {
        const l = { role: "user" };
        const r = JSON.parse('{ "__proto__": { "role": "admin" } }');
        const difference = deletedDiff(l, r);

        expect(l.role).toBe("user");
        expect(r.role).toBeUndefined();
        expect((difference as { role?: unknown }).role).toBeUndefined();
    });
});
