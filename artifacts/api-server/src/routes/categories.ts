import { Router, type IRouter } from "express";
import { sql, eq } from "drizzle-orm";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { ListCategoriesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable);
  const counts = await db
    .select({
      slug: productsTable.categorySlug,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(productsTable)
    .groupBy(productsTable.categorySlug);

  const countMap = new Map(counts.map((c) => [c.slug, Number(c.count)]));
  const out = cats.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    icon: c.icon,
    accentColor: c.accentColor,
    productCount: countMap.get(c.slug) ?? 0,
  }));
  void eq;
  res.json(ListCategoriesResponse.parse(out));
});

export default router;
