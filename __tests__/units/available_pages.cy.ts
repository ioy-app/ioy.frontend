describe("Main", () => {
  beforeEach(() => {
    cy.visit("http://localhost:444");
  });

  it("Home", () => {
    cy.contains("Terms & Privacy");
    cy.contains("English");
    cy.contains("About");
    cy.contains("Games");
  });

  it("Game", () => {
    cy.get(`a[href^="/g"]`).first().click();
    cy.contains("Authors");
    cy.contains("Description");
    cy.contains("Comments");
    cy.contains("Back");
    cy.get(".button-text").contains("Back").click();
    cy.url().should("include", "/");
  });

  it("About", () => {
    cy.contains("About").click();
    cy.contains("support@ioy.app");
  });

  it("Terms & Privacy", () => {
    cy.visit("http://localhost:444/terms");
    cy.contains("Contact: support@ioy.app");
    cy.contains("Updated");
    cy.contains("Terms & Privacy");
    cy.contains("By using the site, you confirm that you are 18+ and agree to these terms.");
  });

  it("Change lang", () => {
    cy.get("select").select("Русский");
    cy.contains("Русский");
    cy.contains("О проекте");
    cy.get("select").select("English");
    cy.contains("English");
    cy.contains("About");
  });
})