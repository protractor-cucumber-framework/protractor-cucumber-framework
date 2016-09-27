Feature: Running Cucumber with Protractor
  As a user of Protractor
  I should be able to use Cucumber
  to run my E2E tests

  @failing
  Scenario: Report failures
    Given I go on "index.html"
    Then the title should equal "Failing scenario 1"

  @failing @rerun
  Scenario: Reporting multiple failures
    Given I go on "index.html"
    Then the title should equal "Failing scenario 2"

  @strict
  Scenario: Missing step definition
    Given I go on "index.html"
    Then this step is not defined
