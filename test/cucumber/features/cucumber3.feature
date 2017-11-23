Feature: Running Cucumber 3 with Protractor

  @cucumber3 @tag1
  Scenario: Using Cucumber 3
    Given I go on "index.html"
    Then the title should equal "My AngularJS App"

  @cucumber3 @tag2
  Scenario Outline: View page with multiple parameters
    Given I go on index.html?param=<param>
    Then the title should equal "My AngularJS App"

    Examples:
      | param |
      | some  |
      | other |
