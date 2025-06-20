export const createPrismaExtended = (prisma: any) =>
  prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ operation, args, query }) {
          let searchParams = args as typeof args & { where: any };

          if (
            !searchParams.where &&
            operation !== 'create' &&
            operation !== 'createMany'
          ) {
            searchParams = { ...searchParams, where: {} };
          }

          if (
            !searchParams?.where?.deleted_at &&
            operation !== 'create' &&
            operation !== 'createMany'
          ) {
            searchParams.where.deleted_at = null;
          }

          return query(searchParams);
        },
      },
    },
  });
