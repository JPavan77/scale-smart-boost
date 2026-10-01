import { describe, expect, it } from "vitest";
import { buildAppHref } from "../src/lib/navigation";

describe("GitHub Pages navigation", () => {
  const base = "/scale-smart-boost";

  it("gera todas as rotas internas usando hash", () => {
    expect(buildAppHref("/auth", base)).toBe("/scale-smart-boost/#/auth");
    expect(buildAppHref("/admin", base)).toBe("/scale-smart-boost/#/admin");
    expect(buildAppHref("/painel", base)).toBe("/scale-smart-boost/#/painel");
    expect(buildAppHref("/barbearia-do-ze", base)).toBe("/scale-smart-boost/#/barbearia-do-ze");
  });

  it("mantém a home na raiz publicada", () => {
    expect(buildAppHref("/", base)).toBe("/scale-smart-boost/");
  });

  it("não altera links externos", () => {
    expect(buildAppHref("https://wa.me/5511999999999", base)).toBe("https://wa.me/5511999999999");
  });
});
