import { describe, expect, it } from "vitest";
import { authErrorMessage, newPasswordSchema, normalizeWhatsapp, safeNext, signUpSchema, zodFieldErrors } from "./helpers";

describe("safeNext", () => {
  it("aceita caminhos internos", () => {
    expect(safeNext("/dashboard/cardapios?x=1")).toBe("/dashboard/cardapios?x=1");
  });
  it("bloqueia redirecionamento para outro site", () => {
    expect(safeNext("https://evil.com")).toBe("/dashboard");
    expect(safeNext("//evil.com")).toBe("/dashboard");
    expect(safeNext("/\\evil.com")).toBe("/dashboard");
    expect(safeNext(undefined, "/x")).toBe("/x");
  });
});

describe("mensagens de erro", () => {
  it("não revela se o e-mail existe no login", () => {
    expect(authErrorMessage({ code: "invalid_credentials" })).toBe("E-mail ou senha incorretos.");
  });
  it("traduz limite de tentativas", () => {
    expect(authErrorMessage({ status: 429 })).toMatch(/Muitas tentativas/);
  });
  it("tem mensagem padrão", () => {
    expect(authErrorMessage({ code: "algo_novo" })).toMatch(/Tente novamente/);
  });
});

describe("validação de cadastro", () => {
  it("exige senha com letra e número e aceite dos termos", () => {
    const r = signUpSchema.safeParse({ fullName: "Ana", email: "ana@x.com", password: "abcdefgh" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const e = zodFieldErrors(r.error);
      expect(e.password).toMatch(/número/);
      expect(e.terms).toBeTruthy();
    }
  });
  it("normaliza e-mail", () => {
    const r = signUpSchema.safeParse({ fullName: "Ana", email: "  Ana@X.com ", password: "senha123", terms: "on" });
    expect(r.success && r.data.email).toBe("ana@x.com");
  });
  it("confere confirmação de senha", () => {
    const r = newPasswordSchema.safeParse({ password: "senha123", confirm: "senha124" });
    expect(r.success).toBe(false);
  });
});

describe("WhatsApp", () => {
  it("adiciona DDI do Brasil", () => {
    expect(normalizeWhatsapp("(62) 99999-0000")).toBe("5562999990000");
    expect(normalizeWhatsapp("+55 62 99999-0000")).toBe("5562999990000");
  });
  it("rejeita números curtos", () => {
    expect(normalizeWhatsapp("1234")).toBeNull();
    expect(normalizeWhatsapp("")).toBeNull();
  });
});
