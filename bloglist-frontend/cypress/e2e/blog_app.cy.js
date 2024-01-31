describe("Blog ", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Kasper Envalds",
      username: "kappe",
      password: "kappe1234",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:5173");
  });

  it("front page can be opened", function () {
    cy.contains("login");
  });

  it("Login form is shown", function () {
    cy.contains("login").click();
  });

  describe("Login", function () {
    it("user can login", function () {
      cy.contains("login").click();
      cy.get("#username").type("kappe");
      cy.get("#password").type("kappe1234");
      cy.get("#login-button").click();

      cy.contains("new blog");
    });

    it("user cannot login with incorrect credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("kappe");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      cy.contains("wrong credentials");
    });
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "kappe", password: "kappe1234" });
    });

    it("a new blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("test_title");
      cy.get("#author").type("test_author");
      cy.get("#url").type("http://testurl.com");
      cy.contains("create").click();
      cy.contains("test_title");
    });

    describe("when blog created", function () {
      beforeEach(function () {
        cy.createBlog({
          title: "test_title",
          author: "test_author",
          likes: 0,
          url: "http://test_url.com",
        });
      });

      it("a blog can be liked", function () {
        cy.contains("view").click();
        cy.contains("like").click();
        cy.contains("1");
      });

      it("a blog can be removed", function () {
        cy.contains("view").click();
        cy.contains("remove").click();
        cy.get("html").should("not.contain", "test_title");
      });

      it("only blog creator sees remove button", function () {
        const user = {
          name: "Kasper",
          username: "kappe123",
          password: "kappe",
        };
        cy.request("POST", "http://localhost:3003/api/users/", user);
        cy.visit("http://localhost:5173");

        cy.login({ username: "kappe123", password: "kappe" });

        cy.contains("view").click();

        cy.get("button").should("not.contain", "remove");
      });

      it("blogs ordered by most likes", function () {
        cy.createBlog({
          title: "test_title1",
          author: "test_author",
          likes: 10,
          url: "http://test_url.com",
        });
        cy.createBlog({
          title: "test_title_most",
          author: "test_author",
          likes: 20,
          url: "http://test_url.com",
        });

        cy.get(".blog").eq(0).should("contain", "test_title_most");
        cy.get(".blog").eq(1).should("contain", "test_title1");
      });
    });
  });
});
