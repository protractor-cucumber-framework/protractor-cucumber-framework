Feature: Running Cucumber with Protractor
  As a user of Protractor
  I should be able to use Cucumber
  to run my E2E tests

  @dev
  Scenario: Running Cucumber with Protractor
    Given I run Cucumber with Protractor
    Then it should still do normal tests
    Then it should expose the correct global variables

  @dev @sourceLocation
  Scenario: Wrapping WebDriver
    Given I go on "index.html"
    Then the title should equal "My AngularJS App"

  @failing
  Scenario: Report failures
    Given I go on "index.html"
    Then the title should equal "Failing scenario 1"

  @failing
  Scenario: Reporting multiple failures
    Given I go on "index.html"
    Then the title should equal "Failing scenario 2"

  @strict
  Scenario: Missing step definition
    Given I go on "index.html"
    Then this step is not defined
