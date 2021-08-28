/// <reference types="cypress" />

describe("Hello world", () => {
  it("Login page must exists", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(1000);
    cy.get("input[x-model=userName]").type("user1");
    cy.get("input[x-model=password]")
      .type("123mudar")
      .parent()
      .find("button")
      .click();
    cy.wait(1500);
    cy.get(".header-navbar a").should("have.length", 3);
  });
});
