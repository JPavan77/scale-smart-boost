import { test, expect } from "@playwright/test";

test("homepage carrega e navega para catálogo real", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Seu negócio local com cara de marca grande/i })).toBeVisible();
  await page.getByRole("link", { name: /Abrir catálogo demo/i }).click();
  await expect(page).toHaveURL(/barbearia-do-ze/);
  await expect(page.getByText("Corte clássico")).toBeVisible();
});

test("categorias filtram o catálogo", async ({ page }) => {
  await page.goto("/barbearia-do-ze");
  await expect(page.getByText("Corte clássico")).toBeVisible();
  await page.getByRole("button", { name: /^Barba$/i }).click();
  await expect(page.getByText("Barba completa")).toBeVisible();
  await expect(page.getByText("Corte clássico")).toHaveCount(0);
  await page.getByRole("button", { name: /^Todos$/i }).click();
  await expect(page.getByText("Corte clássico")).toBeVisible();
});

test("catálogo real adiciona item e atualiza carrinho", async ({ page }) => {
  await page.goto("/barbearia-do-ze");
  const product = page.locator(".product").filter({ hasText: "Corte clássico" });
  await expect(product).toBeVisible();
  await product.getByRole("button", { name: /Adicionar Corte clássico/i }).click();

  const cart = page.locator("aside.cart").first();
  await expect(cart.getByRole("heading", { name: /Seu pedido/i })).toBeVisible();
  await expect(cart.getByText("Corte clássico")).toBeVisible();
  await expect(cart.getByText("R$ 45,00")).toBeVisible();
  await expect(cart.getByRole("button", { name: /Enviar pelo WhatsApp/i })).toBeEnabled();
});

test("quantidade pode aumentar e diminuir", async ({ page }) => {
  await page.goto("/barbearia-do-ze");
  const product = page.locator(".product").filter({ hasText: "Barba completa" });
  await product.getByRole("button", { name: /Adicionar Barba completa/i }).click();

  const cart = page.locator("aside.cart").first();
  const line = cart.locator(".cart-line").filter({ hasText: "Barba completa" });
  await line.locator(".qty button").nth(1).click();
  await expect(line.locator(".qty")).toContainText("2");
  await line.locator(".qty button").nth(0).click();
  await expect(line.locator(".qty")).toContainText("1");
});

test("carrinho persiste por empresa", async ({ page }) => {
  await page.goto("/barbearia-do-ze");
  const product = page.locator(".product").filter({ hasText: "Barba completa" });
  await product.getByRole("button", { name: /Adicionar Barba completa/i }).click();
  await page.reload();
  const cart = page.locator("aside.cart").first();
  await expect(cart.getByText("Barba completa")).toBeVisible();
});

test("item sob consulta usa total parcial", async ({ page }) => {
  await page.goto("/barbearia-do-ze");
  const product = page.locator(".product").filter({ hasText: "Dia do noivo" });
  await expect(product.getByText("Sob consulta")).toBeVisible();
  await product.getByRole("button", { name: /Adicionar Dia do noivo/i }).click();

  const cart = page.locator("aside.cart").first();
  await expect(cart.getByText("Total parcial")).toBeVisible();
  await expect(cart.getByText(/valor sob consulta/i)).toBeVisible();
});

test("mensagem do WhatsApp contém itens, duração e total", async ({ page, context }) => {
  await page.goto("/barbearia-do-ze");
  const product = page.locator(".product").filter({ hasText: "Barba completa" });
  await product.getByRole("button", { name: /Adicionar Barba completa/i }).click();

  const cart = page.locator("aside.cart").first();
  const popupPromise = context.waitForEvent("page");
  await cart.getByRole("button", { name: /Enviar pelo WhatsApp/i }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded").catch(() => {});

  const url = new URL(popup.url());
  expect(["wa.me", "api.whatsapp.com"]).toContain(url.hostname);

  const phone = url.hostname === "wa.me"
    ? url.pathname.replace(/^\//, "")
    : url.searchParams.get("phone");
  const text = url.searchParams.get("text") ?? "";

  expect(phone).toBe("5511999999999");
  expect(text).toContain("Barba completa");
  expect(text).toContain("30 min");
  expect(text).toContain("R$ 35,00");
  await popup.close();
});

test("login real carrega", async ({ page }) => {
  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: /Entre no seu painel/i })).toBeVisible();
  await expect(page.getByText(/Use o email vinculado à sua empresa/i)).toBeVisible();
});

test("painel exige autenticação", async ({ page }) => {
  await page.goto("/painel");
  await expect(page).toHaveURL(/auth/);
  await expect(page.getByRole("heading", { name: /Entre no seu painel/i })).toBeVisible();
});

test("admin exige autenticação", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/auth/);
  await expect(page.getByRole("heading", { name: /Entre no seu painel/i })).toBeVisible();
});

test("empresa inexistente não vaza catálogo", async ({ page }) => {
  await page.goto("/empresa-que-nao-existe");
  await expect(page.getByRole("heading", { name: /Catálogo temporariamente indisponível/i })).toBeVisible();
});
