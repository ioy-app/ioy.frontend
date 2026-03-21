describe("Main", () => {
  beforeEach(() => {
    cy.visit("https://ioy.app");
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

  it("Profile", () => {
    cy.get(`a[href^="/g"]`).first().click();
    cy.contains("Authors");
    cy.get(`a[href^="/u"]`)
      .first()
      .invoke("text")
      .then(login => {
        cy.get(`a[href^="/u"]`).first().click();
        cy.contains(login);
      });
    cy.contains("Follow").should("not.be");
    cy.contains("Unfollow").should("not.be");
    cy.contains("Report").should("not.be");
  });

  it("About", () => {
    cy.contains("About").click();
    cy.contains("support@ioy.app");
  });

  it("Terms & Privacy", () => {
    cy.visit("https://ioy.app/terms");
    cy.contains("Contact: support@ioy.app");
    cy.contains("Updated");
    cy.contains("Terms & Privacy");
    cy.contains("By using the site, you confirm that you are 18+ and agree to these terms.");
  });

  it("Search", () => {
    cy.get("input").type("adventure");
    cy.get(".button-primary").click();
    cy.contains("Back");
    cy.contains("Game");
    cy.contains("Author");
    cy.contains("Version");
    cy.contains("Date created");
    cy.contains("Date updated");
    cy.get(".button-text").contains("Back").click();
    cy.url().should("include", "/");
  });

  it("Tag", () => {
    cy.contains("2d").click();
    cy.contains("Back");
    cy.contains("Game");
    cy.contains("Author");
    cy.contains("Version");
    cy.contains("Date created");
    cy.contains("Date updated");
    cy.get(".button-text").contains("Back").click();
    cy.url().should("include", "/");
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