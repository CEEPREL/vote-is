"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrismaExtended = void 0;
const createPrismaExtended = (prisma) => prisma.$extends({
    query: {
        $allModels: {
            async $allOperations({ operation, args, query }) {
                let searchParams = args;
                if (!searchParams.where &&
                    operation !== 'create' &&
                    operation !== 'createMany') {
                    searchParams = { ...searchParams, where: {} };
                }
                if (!searchParams?.where?.deleted_at &&
                    operation !== 'create' &&
                    operation !== 'createMany') {
                    searchParams.where.deleted_at = null;
                }
                return query(searchParams);
            },
        },
    },
});
exports.createPrismaExtended = createPrismaExtended;
//# sourceMappingURL=prisma.extends.js.map