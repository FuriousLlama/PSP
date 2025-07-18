﻿// ------------------------------------------------------------------------------
//  <auto-generated>
//      This code was generated by Reqnroll (https://www.reqnroll.net/).
//      Reqnroll Version:2.0.0.0
//      Reqnroll Generator Version:2.0.0.0
// 
//      Changes to this file may cause incorrect behavior and will be lost if
//      the code is regenerated.
//  </auto-generated>
// ------------------------------------------------------------------------------
#region Designer generated code
#pragma warning disable
using Reqnroll;
namespace PIMS.Tests.Automation.Features
{
    
    
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Reqnroll", "2.0.0.0")]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    [Xunit.TraitAttribute("Category", "Regression-Properties")]
    public partial class PropertiesFeature : object, Xunit.IClassFixture<PropertiesFeature.FixtureData>, Xunit.IAsyncLifetime
    {
        
        private global::Reqnroll.ITestRunner testRunner;
        
        private static string[] featureTags = new string[] {
                "Regression-Properties"};
        
        private static global::Reqnroll.FeatureInfo featureInfo = new global::Reqnroll.FeatureInfo(new global::System.Globalization.CultureInfo("en-US"), "Features", "Properties", "Property Inventory and Information Details test cases", global::Reqnroll.ProgrammingLanguage.CSharp, featureTags);
        
        private Xunit.Abstractions.ITestOutputHelper _testOutputHelper;
        
#line 1 "Properties.feature"
#line hidden
        
        public PropertiesFeature(PropertiesFeature.FixtureData fixtureData, Xunit.Abstractions.ITestOutputHelper testOutputHelper)
        {
            this._testOutputHelper = testOutputHelper;
        }
        
        public static async global::System.Threading.Tasks.Task FeatureSetupAsync()
        {
        }
        
        public static async global::System.Threading.Tasks.Task FeatureTearDownAsync()
        {
        }
        
        public async global::System.Threading.Tasks.Task TestInitializeAsync()
        {
            testRunner = global::Reqnroll.TestRunnerManager.GetTestRunnerForAssembly(featureHint: featureInfo);
            try
            {
                if (((testRunner.FeatureContext != null) 
                            && (testRunner.FeatureContext.FeatureInfo.Equals(featureInfo) == false)))
                {
                    await testRunner.OnFeatureEndAsync();
                }
            }
            finally
            {
                if (((testRunner.FeatureContext != null) 
                            && testRunner.FeatureContext.BeforeFeatureHookFailed))
                {
                    throw new global::Reqnroll.ReqnrollException("Scenario skipped because of previous before feature hook error");
                }
                if ((testRunner.FeatureContext == null))
                {
                    await testRunner.OnFeatureStartAsync(featureInfo);
                }
            }
        }
        
        public async global::System.Threading.Tasks.Task TestTearDownAsync()
        {
            if ((testRunner == null))
            {
                return;
            }
            try
            {
                await testRunner.OnScenarioEndAsync();
            }
            finally
            {
                global::Reqnroll.TestRunnerManager.ReleaseTestRunner(testRunner);
                testRunner = null;
            }
        }
        
        public void ScenarioInitialize(global::Reqnroll.ScenarioInfo scenarioInfo)
        {
            testRunner.OnScenarioInitialize(scenarioInfo);
            testRunner.ScenarioContext.ScenarioContainer.RegisterInstanceAs<Xunit.Abstractions.ITestOutputHelper>(_testOutputHelper);
        }
        
        public async global::System.Threading.Tasks.Task ScenarioStartAsync()
        {
            await testRunner.OnScenarioStartAsync();
        }
        
        public async global::System.Threading.Tasks.Task ScenarioCleanupAsync()
        {
            await testRunner.CollectScenarioErrorsAsync();
        }
        
        async global::System.Threading.Tasks.Task Xunit.IAsyncLifetime.InitializeAsync()
        {
            try
            {
                await this.TestInitializeAsync();
            }
            catch (System.Exception e1)
            {
                try
                {
                    ((Xunit.IAsyncLifetime)(this)).DisposeAsync();
                }
                catch (System.Exception e2)
                {
                    throw new System.AggregateException("Test initialization failed", e1, e2);
                }
                throw;
            }
        }
        
        async global::System.Threading.Tasks.Task Xunit.IAsyncLifetime.DisposeAsync()
        {
            await this.TestTearDownAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="01._Property_Information_Tab")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "01._Property_Information_Tab")]
        public async global::System.Threading.Tasks.Task _01__Property_Information_Tab()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("01._Property_Information_Tab", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 6
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 7
 await testRunner.GivenAsync("I review a Property\'s Information from row number 3", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 8
 await testRunner.WhenAsync("I update a Property details", ((string)(null)), ((global::Reqnroll.Table)(null)), "When ");
#line hidden
#line 9
 await testRunner.ThenAsync("A Property Information is saved successfully", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="02._Property_PIMS_Files_Tab")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "02._Property_PIMS_Files_Tab")]
        public async global::System.Threading.Tasks.Task _02__Property_PIMS_Files_Tab()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("02._Property_PIMS_Files_Tab", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 11
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 12
 await testRunner.GivenAsync("I search for a property in the inventory by PID from row number 24", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 13
 await testRunner.WhenAsync("I verify the PIMS Files Tab", ((string)(null)), ((global::Reqnroll.Table)(null)), "When ");
#line hidden
#line 14
 await testRunner.ThenAsync("PIMS Files Tab has rendered successfully", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="03._Property_Management_Tab")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "03._Property_Management_Tab")]
        public async global::System.Threading.Tasks.Task _03__Property_Management_Tab()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("03._Property_Management_Tab", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 16
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 17
 await testRunner.GivenAsync("I search for a property in the inventory by PID from row number 23", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 18
 await testRunner.WhenAsync("I insert information in the Property Management Tab from row number 1", ((string)(null)), ((global::Reqnroll.Table)(null)), "When ");
#line hidden
#line 19
 await testRunner.AndAsync("I update information in the Property Management Tab from row number 2", ((string)(null)), ((global::Reqnroll.Table)(null)), "And ");
#line hidden
#line 20
 await testRunner.AndAsync("I clean up the Property Management Tab from row number 3", ((string)(null)), ((global::Reqnroll.Table)(null)), "And ");
#line hidden
#line 21
 await testRunner.ThenAsync("Property Management Tab has been updated successfully", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="04._Property_Management_Activity_Digital_Documents")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "04._Property_Management_Activity_Digital_Documents")]
        public async global::System.Threading.Tasks.Task _04__Property_Management_Activity_Digital_Documents()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("04._Property_Management_Activity_Digital_Documents", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 23
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 24
 await testRunner.GivenAsync("I search for a property in the inventory by PID from row number 23", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 25
 await testRunner.WhenAsync("I insert activities to the Property Management Tab from row number 4", ((string)(null)), ((global::Reqnroll.Table)(null)), "When ");
#line hidden
#line 26
 await testRunner.AndAsync("I create Digital Documents for a Property Management row number 11", ((string)(null)), ((global::Reqnroll.Table)(null)), "And ");
#line hidden
#line 27
 await testRunner.AndAsync("I delete all activities from the Property Management Tab", ((string)(null)), ((global::Reqnroll.Table)(null)), "And ");
#line hidden
#line 28
 await testRunner.ThenAsync("Property Management Tab has been updated successfully", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="05._Properties_Map_and_List_Filters")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "05._Properties_Map_and_List_Filters")]
        public async global::System.Threading.Tasks.Task _05__Properties_Map_And_List_Filters()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("05._Properties_Map_and_List_Filters", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 30
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 31
 await testRunner.GivenAsync("I search for a Property in the Map by different filters from row number 9", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 32
 await testRunner.WhenAsync("I search for a Property in the Properties List by different filters from row numb" +
                        "er 29", ((string)(null)), ((global::Reqnroll.Table)(null)), "When ");
#line hidden
#line 33
 await testRunner.ThenAsync("Properties filters works successfully", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="06._Non-Inventory_Property_Information")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "06._Non-Inventory_Property_Information")]
        public async global::System.Threading.Tasks.Task _06__Non_Inventory_Property_Information()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("06._Non-Inventory_Property_Information", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 35
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 36
 await testRunner.GivenAsync("I search for a non MOTI property from row number 6", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 37
 await testRunner.ThenAsync("Non-Inventory property renders correctly", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="07._Invalid_Property_Not_Found")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "07._Invalid_Property_Not_Found")]
        public async global::System.Threading.Tasks.Task _07__Invalid_Property_Not_Found()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("07._Invalid_Property_Not_Found", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 39
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 40
 await testRunner.GivenAsync("I search for an Invalid Property from row number 10", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 41
 await testRunner.ThenAsync("No Properties were found", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="08._Map_Features")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "08._Map_Features")]
        public async global::System.Threading.Tasks.Task _08__Map_Features()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("08._Map_Features", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 43
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 44
 await testRunner.GivenAsync("I verify the Maps Layers", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 45
 await testRunner.WhenAsync("I verify the Maps Filters", ((string)(null)), ((global::Reqnroll.Table)(null)), "When ");
#line hidden
#line 46
 await testRunner.ThenAsync("Map Features rendered successfully", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableTheoryAttribute(DisplayName="09._Property_Management_Lease_Active_Indicator")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "09._Property_Management_Lease_Active_Indicator")]
        [Xunit.InlineDataAttribute("No", "10", new string[0])]
        [Xunit.InlineDataAttribute("No", "11", new string[0])]
        [Xunit.InlineDataAttribute("No", "12", new string[0])]
        [Xunit.InlineDataAttribute("No", "13", new string[0])]
        [Xunit.InlineDataAttribute("No", "14", new string[0])]
        [Xunit.InlineDataAttribute("No", "15", new string[0])]
        [Xunit.InlineDataAttribute("No", "16", new string[0])]
        [Xunit.InlineDataAttribute("Yes", "17", new string[0])]
        public async global::System.Threading.Tasks.Task _09__Property_Management_Lease_Active_Indicator(string activeLeaseStatus, string rowNumber, string[] exampleTags)
        {
            string[] tagsOfScenario = exampleTags;
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            argumentsOfScenario.Add("ActiveLeaseStatus", activeLeaseStatus);
            argumentsOfScenario.Add("RowNumber", rowNumber);
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("09._Property_Management_Lease_Active_Indicator", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 48
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 49
 await testRunner.GivenAsync(string.Format("I create a new minimum Lease from row number {0}", rowNumber), ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 50
 await testRunner.WhenAsync("I add additional Information to the Lease Details", ((string)(null)), ((global::Reqnroll.Table)(null)), "When ");
#line hidden
#line 51
 await testRunner.AndAsync("I add Properties to the Lease Details", ((string)(null)), ((global::Reqnroll.Table)(null)), "And ");
#line hidden
#line 52
 await testRunner.AndAsync("I search for a Property in the Properties List by PID from row number 33", ((string)(null)), ((global::Reqnroll.Table)(null)), "And ");
#line hidden
#line 53
 await testRunner.ThenAsync(string.Format("Expected Active Lease status is displayed as \"{0}\" successfully", activeLeaseStatus), ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [Xunit.SkippableFactAttribute(DisplayName="10._Properties_Digital_Documents")]
        [Xunit.TraitAttribute("FeatureTitle", "Properties")]
        [Xunit.TraitAttribute("Description", "10._Properties_Digital_Documents")]
        public async global::System.Threading.Tasks.Task _10__Properties_Digital_Documents()
        {
            string[] tagsOfScenario = ((string[])(null));
            global::System.Collections.Specialized.OrderedDictionary argumentsOfScenario = new global::System.Collections.Specialized.OrderedDictionary();
            global::Reqnroll.ScenarioInfo scenarioInfo = new global::Reqnroll.ScenarioInfo("10._Properties_Digital_Documents", null, tagsOfScenario, argumentsOfScenario, featureTags);
#line 65
this.ScenarioInitialize(scenarioInfo);
#line hidden
            if ((global::Reqnroll.TagHelper.ContainsIgnoreTag(scenarioInfo.CombinedTags) || global::Reqnroll.TagHelper.ContainsIgnoreTag(featureTags)))
            {
                testRunner.SkipScenario();
            }
            else
            {
                await this.ScenarioStartAsync();
#line 66
 await testRunner.GivenAsync("I search for a property in the inventory by PID from row number 37", ((string)(null)), ((global::Reqnroll.Table)(null)), "Given ");
#line hidden
#line 67
 await testRunner.WhenAsync("I create Digital Documents for a \"Property\" row number 16", ((string)(null)), ((global::Reqnroll.Table)(null)), "When ");
#line hidden
#line 68
 await testRunner.ThenAsync("A Property Information is saved successfully", ((string)(null)), ((global::Reqnroll.Table)(null)), "Then ");
#line hidden
            }
            await this.ScenarioCleanupAsync();
        }
        
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Reqnroll", "2.0.0.0")]
        [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
        public class FixtureData : object, Xunit.IAsyncLifetime
        {
            
            async global::System.Threading.Tasks.Task Xunit.IAsyncLifetime.InitializeAsync()
            {
                await PropertiesFeature.FeatureSetupAsync();
            }
            
            async global::System.Threading.Tasks.Task Xunit.IAsyncLifetime.DisposeAsync()
            {
                await PropertiesFeature.FeatureTearDownAsync();
            }
        }
    }
}
#pragma warning restore
#endregion
