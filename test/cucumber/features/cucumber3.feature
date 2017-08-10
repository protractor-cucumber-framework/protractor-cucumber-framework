Feature: Running Cucumber 3 with Protractor

  @cucumber3
  Scenario: Using Cucumber 3
    Given I go on "index.html"
    Then the title should equal "My AngularJS App"
