import { expect, test } from "@playwright/test";

const card = {
  object: "card",
  id: "konrad",
  name: "Syr Konrad, the Grim",
  type_line: "Legendary Creature — Human Knight",
  oracle_text: "Whenever another creature dies, Syr Konrad deals 1 damage.",
  mana_cost: "{3}{B}{B}",
  colors: ["B"],
  rarity: "uncommon",
  set: "dsc",
  set_name: "Duskmourn",
  released_at: "2024-09-27",
  artist: "Anna Steinbauer",
  power: "5",
  toughness: "4",
  image_uris: {
    small: "https://cards.scryfall.io/small/front/konrad.jpg",
    normal: "https://cards.scryfall.io/normal/front/konrad.jpg",
  },
};

test("searches a card, saves it, and finds it again in favorites", async ({
  page,
}) => {
  await page.route("https://api.scryfall.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        object: "list",
        total_cards: 1,
        has_more: false,
        data: [card],
      }),
    });
  });
  await page.route("https://cards.scryfall.io/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "image/gif",
      body: Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64",
      ),
    });
  });

  await page.goto("/");
  await page.getByRole("searchbox", { name: "Buscar cartas" }).fill("konrad");
  await page
    .getByRole("button", {
      name: "Syr Konrad, the Grim Legendary Creature — Human Knight",
    })
    .click();

  const dialog = page.getByRole("dialog", { name: "Syr Konrad, the Grim" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Salvar nos favoritos" }).click();
  await dialog.getByRole("button", { name: "Fechar" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("link", { name: /Favoritos/ }).click();
  await expect(
    page.getByRole("heading", { name: "Syr Konrad, the Grim" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("1 carta");

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Syr Konrad, the Grim" }),
  ).toBeVisible();
});
