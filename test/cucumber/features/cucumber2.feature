Feature: Running Cucumber 2 with Protractor

  @cucumber2
  Scenario: Using Cucumber 2
    Given I go on "index.html"
    Then the title should equal "My AngularJS App"

  @uncaughtException
  Scenario:
    Given I go on "index.html"
    When I encounter an unexpected exception

  @uncaughtException
  Scenario:
    Given I go on "index.html"
    When I encounter an unexpected exception
