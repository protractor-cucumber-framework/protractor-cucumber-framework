Feature: Running Cucumber 4 with Protractor

  @cucumber4
  Scenario: Using Cucumber 4
    Given I go on "index.html"
    Then the title should equal "My AngularJS App"
