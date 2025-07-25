﻿using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using PIMS.Tests.Automation.Classes;

namespace PIMS.Tests.Automation.PageObjects
{
    public class LeaseDetails : PageObjectBase
    {
        //Main Menu links Elements
        private readonly By menuManagementButton = By.XPath("//body/div[@id='root']/div[2]/div[1]/div[1]/div[@data-testid='nav-tooltip-leases&licences']/a");
        private readonly By createLicenseButton = By.XPath("//a[contains(text(),'Create a Lease/Licence File')]");

        //File Details Edit Icon
        private readonly By licenseDetailsEditIcon = By.XPath("//div[@role='tabpanel']/div/div/div/button");

        //Lease Header Elements
        private readonly By licenseHeaderNbrLabel = By.XPath("//label[contains(text(),'Lease/Licence #')]");
        private readonly By licenseHeaderNbrContent = By.XPath("//h1[contains(text(),'Lease / Licence')]/parent::div/parent::div/following-sibling::div/div/div/div/div/div[1]/div[2]/span[1]");
        private readonly By licenseHeaderAccountType = By.XPath("//label[contains(text(),'Lease/Licence #')]/parent::div/following-sibling::div/span[2]");
        private readonly By licenseHeaderProperty = By.XPath("//h1[contains(text(),'Lease / Licence')]/parent::div/parent::div/following-sibling::div[2]/div[1]/div/div/div/div[2]/div/label[contains(text(),'Property')]");
        private readonly By licenseHeaderPropertyContent = By.XPath("//h1[contains(text(),'Lease / Licence')]/parent::div/parent::div/following-sibling::div[2]/div[1]/div/div/div/div[2]/div/label[contains(text(),'Property')]/parent::div/following-sibling::div/span");
        private readonly By licenseHeaderTenantLabel = By.XPath("//label[contains(text(),'Tenant')]");
        private readonly By licenseHeaderPayeeLabel = By.XPath("//label[contains(text(),'Payee')]");
        private readonly By licenseHeaderStartDateLabel = By.XPath("//h1/parent::div/parent::div/following-sibling::div[2]/div/div/div/div/div[4]/div/label[contains(text(),'Commencement')]");
        private readonly By licenseHeaderStartDateContent = By.XPath("//label[contains(text(),'Commencement')]/parent::div/following-sibling::div[1]");
        private readonly By licenseHeaderExpiryDateLabel = By.XPath("//label[contains(text(),'Commencement')]/parent::div/following-sibling::div[2]/label[contains(text(),'Expiry')]");
        private readonly By licenseHeaderExpiryDateContent = By.XPath("//label[contains(text(),'Commencement')]/parent::div/following-sibling::div[2]/label[contains(text(),'Expiry')]/parent::div/following-sibling::div[1]/span");
        private readonly By licenseHeaderHistoricalFileLabel = By.XPath("//label[contains(text(),'Historical file')]");
        private readonly By licenseHeaderHistoricalFileContent = By.XPath("//label[contains(text(),'Historical file #:')]/parent::div/following-sibling::div/span");

        private readonly By licenseHeaderCreatedLabel = By.XPath("//span/strong[contains(text(),'Created')]");
        private readonly By licenseHeaderCreatedContent = By.XPath("//strong[contains(text(),'Created')]/parent::span");
        private readonly By licenseHeaderCreatedByContent = By.XPath("//strong[contains(text(),'Created')]/parent::span/span[@data-testid='tooltip-icon-userNameTooltip']");
        private readonly By licenseHeaderLastUpdatedLabel = By.XPath("//span/strong[contains(text(),'Updated')]");
        private readonly By licenseHeaderLastUpdatedContent = By.XPath("//strong[contains(text(),'Updated')]/parent::span");
        private readonly By licenseHeaderLastUpdatedByContent = By.XPath("//strong[contains(text(),'Updated')]/parent::span/span[@data-testid='tooltip-icon-userNameTooltip']");
        private readonly By licenseHeaderStatusContent = By.XPath("//b[contains(text(),'File')]/parent::span/following-sibling::div");
        private readonly By licenseHeaderExpiredFlag = By.XPath("//label[contains(text(),'Commencement')]/parent::div/following-sibling::div[4]/div");

        //Create/View Lease Details Elements
        private readonly By licenseCreateTitle = By.XPath("//html[1]/body[1]/div[1]/div[2]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/h1[contains(text(),'Create Lease/Licence')]");

        private readonly By licenseDetailsCreateSubtitle = By.XPath("//h2/div/div[contains(text(),'Original Agreement')]");

        private readonly By licenseDetailsProjectLabel = By.XPath("//label[contains(text(),'Ministry project')]");
        private readonly By licenseDetailsProjectContent = By.XPath("//label[contains(text(),'Ministry project')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsProjectInput = By.CssSelector("input[id='typeahead-project']");
        private readonly By licenseDetailsProject1stOption = By.CssSelector("div[id='typeahead-project'] a:nth-child(1)");

        private readonly By licenseDetailsProductLabel = By.XPath("//label[contains(text(),'Product')]");
        private readonly By licenseDetailsProductContent = By.XPath("//label[contains(text(),'Product')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsProductSelect = By.Id("input-productId");

        private readonly By licenseDetailsStatusLabel = By.XPath("//div/div/div/div/label[contains(text(),'Status')]");
        private readonly By licenseDetailsStatusTooltip = By.CssSelector("span[data-testid='tooltip-icon-lease-status-tooltip']");
        private readonly By licenseDetailsStatusSelector = By.Id("input-statusTypeCode");
        private readonly By licenseDetailsStatusContent = By.XPath("//label[contains(text(),'Status')]/parent::div/following-sibling::div");

        private readonly By licenseDetailsAccountTypeLabel = By.XPath("//label[contains(text(),'Account type')]");
        private readonly By licenseDetailsAccountTypeSelector = By.Id("input-paymentReceivableTypeCode");
        private readonly By licenseDetailsAccountTypeContent = By.XPath("//div[contains(text(),'Original Agreement')]/parent::div/parent::h2/following-sibling::div/div/div/label[contains(text(),'Account type')]/parent::div/following-sibling::div");

        private readonly By licenseDetailsCommencementDateLabel = By.XPath("//label[contains(text(),'Commencement')]");
        private readonly By licenseDetailsCommencementDateTooltip = By.CssSelector("span[data-testid='tooltip-icon-lease-commencement-tooltip']");
        private readonly By licenseDetailsCommencementDateInput = By.Id("datepicker-startDate");
        private readonly By licenseDetailsCommencementDateContent = By.XPath("//label[contains(text(),'Commencement')]/parent::div/following-sibling::div");

        private readonly By licenseDetailsExpiryDateLabel = By.XPath("//label[contains(text(),'Expiry')]");
        private readonly By licenseDetailsExpiryDateTooltip = By.CssSelector("span[data-testid='tooltip-icon-lease-expiry-tooltip']");
        private readonly By licenseDetailsExpiryDateInput = By.Id("datepicker-expiryDate");
        private readonly By licenseDetailsExpiryDateContent = By.XPath("//label[contains(text(),'Expiry')]/parent::div/following-sibling::div");

        private readonly By licenseDetailsCancelReasonLabel = By.XPath("//label[contains(text(),'Cancellation reason')]");
        private readonly By licenseDetailsCancelReasonInput = By.Id("input-cancellationReason");
        private readonly By licenseDetailsCancelContent = By.XPath("//label[contains(text(),'Cancellation reason')]/parent::div/following-sibling::div");

        private readonly By licenseDetailsTerminateDateLabel = By.XPath("//div[contains(text(),'Original Agreement')]/parent::div/parent::h2/following-sibling::div/div[6]/div/label");
        private readonly By licenseDetailsViewTerminationTooltip = By.CssSelector("span[data-testid='tooltip-icon-lease-termination-tooltip']");
        private readonly By licenseDetailsTerminatedReasonLabel = By.XPath("//label[contains(text(),'Termination reason')]");
        private readonly By licenseDetailsTerminateReasonInput = By.Id("input-terminationReason");
        private readonly By licenseDetailsTerminateDateInput = By.Id("datepicker-terminationDate");
        private readonly By licenseDetailsTerminateReasonContent = By.XPath("//label[contains(text(),'Termination reason')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsViewTerminateDateContent = By.XPath("//div[contains(text(),'Original Agreement')]/parent::div/parent::h2/following-sibling::div/div[6]/div[2]");
        private readonly By licenseDetailsViewTerminateReason = By.XPath("//label[contains(text(),'Termination reason')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsViewCancelReason = By.XPath("//label[contains(text(),'Cancellation reason')]/parent::div/following-sibling::div");

        //Create/View Renewal Options Elements
        private readonly By licenseDetailsRenewalTitle = By.XPath("//h2/div/div[contains(text(),'Renewal Option')]");
        private readonly By licenseDetailsAddRenewButton = By.XPath("//div[contains(text(),'+ Add a Renewal')]/parent::button");
        private readonly By licenceDetailsFirstRenewalDeleteBttn = By.XPath("//*[@data-testid='renewal.0.remove-button']/parent::div/parent::button");

        //Create/View Administration Elements
        private readonly By licenseDetailsAdmSubtitle = By.XPath("//div[contains(text(),'Administration')]/parent::div/parent::h2");
        private readonly By licenseDetailsAdmHelpTooltip = By.XPath("//div[contains(text(),'Help with choosing the agreement Program, Type and Purpose')]");
        private readonly By licenseDetailsMotiContactLabel = By.XPath("//label[contains(text(),'MOTI contact')]");
        private readonly By licenseDetailsMotiContactInput = By.Id("input-motiName");
        private readonly By licenseDetailsMotiContactContent = By.XPath("//label[contains(text(),'MOTI contact')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsMotiRegionLabel = By.XPath("//label[contains(text(),'MOTI region')]");
        private readonly By licenseDetailsMotiRegionSelector = By.Id("input-regionId");
        private readonly By licenseDetailsProgramViewLabel = By.XPath("//label[contains(text(),'Program')]");
        private readonly By licenseDetailsProgramContent = By.XPath("//label[contains(text(),'Program')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsProgramLabel = By.XPath("//select[@id='input-programTypeCode']/parent::div/parent::div/preceding-sibling::div/label[contains(text(),'Program')]");
        private readonly By licenseDetailsProgramSelector = By.Id("input-programTypeCode");
        private readonly By licenseDetailsOtherProgramLabel = By.XPath("//label[contains(text(),'Other Program')]");
        private readonly By licenseDetailsOtherProgramInput = By.Id("input-otherProgramTypeDescription");
        private readonly By licenseDetailsOtherProgramContent = By.Id("input-otherProgramType");
        private readonly By licenseDetailsTypeLabel = By.XPath("//label[contains(text(),'Type')]");
        private readonly By licenseDetailsTypeSelector = By.Id("input-leaseTypeCode");
        private readonly By licenseDetailsTypeContent = By.XPath("//div[contains(text(),'Administration')]/parent::div/parent::h2/following-sibling::div/div/div/label[contains(text(),'Type')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsOtherTypeLabel = By.XPath("//input[@id='input-otherLeaseTypeDescription']/parent::div/parent::div/preceding-sibling::div/label[contains(text(),'Describe other')]");
        private readonly By licenseDetailsOtherTypeInput = By.Id("input-otherLeaseTypeDescription");
        private readonly By licenseDetailsOtherTypeContent = By.Id("input-otherType");
        private readonly By licenseDetailsReceivableToLabel = By.XPath("//label[contains(text(),'Receivable to')]");
        private readonly By licenseDetailsReceivableToContent = By.XPath("//label[contains(text(),'Receivable to')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsPurposeLabel = By.XPath("//label[contains(text(),'Purpose')]");
        private readonly By licenseDetailsPurposeMultiselector = By.Id("multiselect-purposes_input");
        private readonly By licenseDetailsPurposeDeleteBttns = By.CssSelector("div[id='multiselect-purposes'] i[class='custom-close']");
        private readonly By licenseDetailsPurposeOptions = By.XPath("//input[@id='multiselect-purposes_input']/parent::div/following-sibling::div/ul[@class='optionContainer']");

        private readonly By licenseDetailsPurposeContent = By.CssSelector("div[id='multiselectContainerReact'] div");
        private readonly By licenseDetailsOtherPurposeContent = By.XPath("//div[@id='multiselectContainerReact']/parent::div/parent::div");
        private readonly By licenseDetailsOtherPurposeLabel = By.XPath("//input[@id='input-purposeOtherDescription']/parent::div/parent::div/preceding-sibling::div/label[contains(text(),'Describe other')]");
        private readonly By licenseDetailsOtherPurposeInput = By.Id("input-purposeOtherDescription");
        private readonly By licenseDetailsInitiatorLabel = By.XPath("//label[contains(text(),'Initiator')]");
        private readonly By licenseDetailsInitiatorTooltip = By.XPath("//label[contains(text(),'Initiator')]/span/span[@data-testid='tooltip-icon-section-field-tooltip']");
        private readonly By licenseDetailsInitiatorSelector = By.Id("input-initiatorTypeCode");
        private readonly By licenseDetailsInitiatorContent = By.XPath("//label[contains(text(),'Initiator')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsResponsibilityLabel = By.XPath("//label[contains(text(),'Responsibility')]");
        private readonly By licenseDetailsResponsibilityTooltip = By.XPath("//label[contains(text(),'Responsibility')]/span/span[@data-testid='tooltip-icon-section-field-tooltip']");
        private readonly By licenseDetailsResposibilitySelector = By.Id("input-responsibilityTypeCode");
        private readonly By licenseDetailsResponsibilityContent = By.XPath("//label[contains(text(),'Responsibility')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsEffectiveDateLabel = By.XPath("//label[contains(text(),'Effective date')]");
        private readonly By licenseDetailsEffectiveDateInput = By.Id("datepicker-responsibilityEffectiveDate");
        private readonly By licenseDetailsEffectiveDateContent = By.XPath("//label[contains(text(),'Effective date')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsIntendedUseLabel = By.XPath("//label[contains(text(),'Intended use')]");
        private readonly By licenseDetailsIntendedUseTextarea = By.CssSelector("textarea[id='input-description']");
        private readonly By licenseDetailsIntendedUseContent = By.XPath("//label[contains(text(),'Intended use')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsCityArbitrationLabel = By.XPath("//label[contains(text(),'Primary arbitration city')]");
        private readonly By licenseDetailsCityArbitrationInput = By.Id("input-primaryArbitrationCity");
        private readonly By licenseDetailsCityArbitrationContent = By.CssSelector("div[data-testid='primaryArbitrationCity']");

        private readonly By licenseDetailsTeamSubtitle = By.XPath("//div[contains(text(),'Lease & Licence Team')]/parent::div/parent::h2");
        private readonly By licenseDetailsTeamAddMemberLink = By.CssSelector("button[data-testid='add-team-member']");
        private readonly By licenseDetailsTeamMembersGroup = By.XPath("//div[contains(text(),'Lease & Licence Team')]/parent::div/parent::h2/following-sibling::div/div[@class='py-3 row']");

        private readonly By licenseDetailsFeeDeterminationSubtitle = By.XPath("//div[contains(text(),'Fee Determination')]/parent::div/parent::h2");
        private readonly By licenseDetailsFeeDeterminationPublicBenefitLabel = By.XPath("//label[contains(text(),'Public benefit')]");
        private readonly By licenseDetailsFeeDeterminationPublicBenefitInput = By.Id("input-isPublicBenefit");
        private readonly By licenseDetailsFeeDeterminationPublicBenefitContent = By.XPath("//label[contains(text(),'Public benefit')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsFeeDeterminationFinancialGainLabel = By.XPath("//label[contains(text(),'Financial gain')]");
        private readonly By licenseDetailsFeeDeterminationFinancialGainInput = By.Id("input-isFinancialGain");
        private readonly By licenseDetailsFeeDeterminationFinancialGainContent = By.XPath("//label[contains(text(),'Financial gain')]/parent::div/following-sibling::div");
        private readonly By licenseDetailsFeeDeterminationSuggestedFeeLabel = By.XPath("//label[contains(text(),'Suggested fee')]");
        private readonly By licenseDetaulsFeeDeterminationSuggestedFeeTooltip = By.CssSelector("span[data-testid='tooltip-icon-section-field-tooltip']");
        private readonly By licenseDetailsFeeDeterminationSuggestedFeeContent = By.CssSelector("span[data-testid='suggestedFee']");
        private readonly By licenseDetailsFeeDeterminationNotesLabel = By.XPath("//label[contains(text(),'Comments')]");
        private readonly By licenseDetailsFeeDeterminationNotesTooltip = By.CssSelector("span[data-testid='tooltip-icon-section-field-tooltip']");
        private readonly By licenseDetailsFeeDeterminationNotesInput = By.Id("input-feeDeterminationNote");
        private readonly By licenseDetailsFeeDeterminationNotesContent = By.XPath("//div[contains(text(),'Fee Determination')]/parent::div/parent::h2/following-sibling::div/div[4]/div[2]");

        private readonly By licenseDetailsSaveButton = By.XPath("//div[contains(text(),'Save')]/parent::button");
        private readonly By licenseDetailsCancelButton = By.XPath("//div[contains(text(),'Cancel')]/parent::button");

        //Lease Property Section Elements
        private readonly By leasePropertiesSubtitle = By.XPath("//div[contains(text(),'Property Information')]/parent::div/parent::h2");
        private readonly By leasePropertiesUpdateSubtitle = By.XPath("//div[contains(text(),'Selected properties')]/parent::div/parent::h2");
        private readonly By leaseEditPropertiesBttn = By.CssSelector("button[title='Change properties']");

        //Leases Modal Element
        private readonly By licenseDetailsConfirmationModal = By.CssSelector("div[class='modal-content']");
        private readonly By licenseDetailsConfirmationContent = By.CssSelector("div[class='modal-content'] p");
        private readonly By licensesDetailsPropertiesModal = By.XPath("//div[contains(text(),'User Override Required')]/parent::div/parent::div");
        private readonly By licensesDetailsPropertiesModalContent = By.XPath("//div[contains(text(),'User Override Required')]/parent::div/parent::div/div[@class='modal-body']");
        private readonly By licensesDetailsPropertiesOkBttn = By.XPath("//div[contains(text(),'User Override Required')]/parent::div/parent::div/div[@class='modal-footer']/div/button[@title='ok-modal']");

        private readonly SharedFileProperties sharedSearchProperties;
        private readonly SharedModals sharedModals;
        private SharedTeamMembers sharedTeams;

        public LeaseDetails(IWebDriver webDriver) : base(webDriver)
        {
            sharedSearchProperties = new SharedFileProperties(webDriver);
            sharedModals = new SharedModals(webDriver);
            sharedTeams = new SharedTeamMembers(webDriver);
        }

        public void NavigateToCreateNewLicense()
        {
            Wait();
            FocusAndClick(menuManagementButton);

            Wait();
            FocusAndClick(createLicenseButton);
        }

        public void NavigateToAddPropertiesLeasesFile()
        {
            Wait();
            webDriver.FindElement(leaseEditPropertiesBttn).Click();
        }

        public void CreateMinimumLicenseDetails(Lease lease)
        {
            Wait();

            //MAIN DETAILS

            //Status
            if (lease.LeaseStatus != "")
                ChooseSpecificSelectOption(licenseDetailsStatusSelector, lease.LeaseStatus);

            //Termination reason
            if (lease.LeaseTerminationReason != "")
            {
                AssertTrueIsDisplayed(licenseDetailsTerminateDateLabel);
                AssertTrueIsDisplayed(licenseDetailsViewTerminationTooltip);
                ClearInput(licenseDetailsTerminateDateInput);
                webDriver.FindElement(licenseDetailsTerminateDateInput).SendKeys(lease.LeaseTerminationDate);
                webDriver.FindElement(licenseDetailsTerminateDateInput).SendKeys(Keys.Enter);

                AssertTrueIsDisplayed(licenseDetailsTerminatedReasonLabel);
                ClearInput(licenseDetailsTerminateReasonInput);
                webDriver.FindElement(licenseDetailsTerminateReasonInput).Click();
                webDriver.FindElement(licenseDetailsTerminateReasonInput).SendKeys(lease.LeaseTerminationReason);
            }

            //Cancellation reason
            if (lease.LeaseCancellationReason != "")
            {
                AssertTrueIsDisplayed(licenseDetailsCancelReasonLabel);
                ClearInput(licenseDetailsCancelReasonInput);
                webDriver.FindElement(licenseDetailsCancelReasonInput).Click();
                webDriver.FindElement(licenseDetailsCancelReasonInput).SendKeys(lease.LeaseCancellationReason);
            }

            //Account Type
            if (lease.AccountType != "")
                ChooseSpecificSelectOption(licenseDetailsAccountTypeSelector, lease.AccountType);
            
            //Start Date
            if (lease.LeaseStartDate != "")
            {
                webDriver.FindElement(licenseDetailsCommencementDateInput).SendKeys(lease.LeaseStartDate);
                webDriver.FindElement(licenseDetailsCommencementDateInput).SendKeys(Keys.Enter);
            }

            if (lease.LeaseExpiryDate != "")
            {
                webDriver.FindElement(licenseDetailsExpiryDateInput).SendKeys(lease.LeaseExpiryDate);
                webDriver.FindElement(licenseDetailsExpiryDateInput).SendKeys(Keys.Enter);
            }

            //Administration Details
            //MOTI Region
            if(lease.MOTIRegion != "")
                ChooseSpecificSelectOption(licenseDetailsMotiRegionSelector, lease.MOTIRegion);

            //Program
            if (lease.Program != "")
                ChooseSpecificSelectOption(licenseDetailsProgramSelector, lease.Program);

            //If other Program is selected, insert input
            if (webDriver.FindElements(licenseDetailsOtherProgramInput).Count > 0 && lease.ProgramOther != "")
            {
                WaitUntilVisible(licenseDetailsOtherProgramInput);
                Assert.True(webDriver.FindElement(licenseDetailsOtherProgramLabel).Displayed);
                webDriver.FindElement(licenseDetailsOtherProgramInput).SendKeys(lease.ProgramOther);
            }

            //Type
            if (lease.AdminType != "")
                ChooseSpecificSelectOption(licenseDetailsTypeSelector, lease.AdminType);

            //If other Type is selected, insert input
            if (webDriver.FindElements(licenseDetailsOtherTypeInput).Count > 0 && lease.TypeOther != "")
            {
                Assert.True(webDriver.FindElement(licenseDetailsOtherTypeLabel).Displayed);
                webDriver.FindElement(licenseDetailsOtherTypeInput).SendKeys(lease.TypeOther);
            }

            //Purpose
            if (webDriver.FindElements(licenseDetailsPurposeDeleteBttns).Count > 0)
            {
                while (webDriver.FindElements(licenseDetailsPurposeDeleteBttns).Count > 0)
                    webDriver.FindElements(licenseDetailsPurposeDeleteBttns)[0].Click();
            }

            if (lease.LeasePurpose.Count > 0)
            {
                foreach (string purpose in lease.LeasePurpose)
                {
                    webDriver.FindElement(licenseDetailsPurposeLabel).Click();                 

                    Wait();
                    FocusAndClick(licenseDetailsPurposeMultiselector);

                    Wait();
                    ChooseMultiSelectSpecificOption(licenseDetailsPurposeOptions, purpose);
                }

                webDriver.FindElement(licenseDetailsPurposeLabel).Click();
            }

            //If other Purpose is selected, insert input
            if (webDriver.FindElements(licenseDetailsOtherPurposeInput).Count > 0 && lease.PurposeOther != "")
            {
                Assert.True(webDriver.FindElement(licenseDetailsOtherPurposeLabel).Displayed);
                webDriver.FindElement(licenseDetailsOtherPurposeInput).SendKeys(lease.PurposeOther);
            }
        }

        public void UpdateLeaseFileDetails(Lease lease)
        {
            Wait();

            //ORIGINAL AGREEMENT
            AssertTrueIsDisplayed(licenseDetailsCreateSubtitle);

            //Project
            AssertTrueIsDisplayed(licenseDetailsProjectLabel);
            if (lease.MinistryProject != "")
            {
                ClearInput(licenseDetailsProjectInput);
                webDriver.FindElement(licenseDetailsProjectInput).SendKeys(lease.MinistryProject);
                webDriver.FindElement(licenseDetailsProjectInput).SendKeys(Keys.Enter);
                webDriver.FindElement(licenseDetailsProjectInput).SendKeys(Keys.Backspace);

                Wait();
                webDriver.FindElement(licenseDetailsProject1stOption).Click();
            }

            //Product
            if (lease.MinistryProduct != "")
            {
                AssertTrueIsDisplayed(licenseDetailsProductLabel);
                ChooseSpecificSelectOption(licenseDetailsProductSelect, lease.MinistryProduct);
            }

            //Status
            AssertTrueIsDisplayed(licenseDetailsStatusLabel);
            AssertTrueIsDisplayed(licenseDetailsStatusTooltip);
            if (lease.LeaseStatus != "")
            {
                SelectElement selectStatusElement = new(webDriver.FindElement(licenseDetailsStatusSelector));
                IWebElement selectedStatus = selectStatusElement.SelectedOption;
                string previousStatus = selectedStatus.Text;

                ChooseSpecificSelectOption(licenseDetailsStatusSelector, lease.LeaseStatus);

                Wait();
                if (webDriver.FindElements(licenseDetailsConfirmationModal).Count > 0)
                {
                    Assert.Equal("Are you sure?", sharedModals.ModalHeader());
                    Assert.Contains("The lease is no longer in " + previousStatus + " state. The reason for doing so will be cleared from the file details and can only be viewed in the notes tab.", webDriver.FindElement(licenseDetailsConfirmationContent).Text);
                    Assert.Contains("Do you want to proceed?", webDriver.FindElement(licenseDetailsConfirmationContent).Text);
                    sharedModals.ModalClickOKBttn();
                }
            }

            //Account Type
            AssertTrueIsDisplayed(licenseDetailsAccountTypeLabel);
            if (lease.AccountType != "")
            {
                webDriver.FindElement(licenseDetailsAccountTypeSelector).Click();
                ChooseSpecificSelectOption(licenseDetailsAccountTypeSelector, lease.AccountType);
            }

            //Commencement Date
            AssertTrueIsDisplayed(licenseDetailsCommencementDateLabel);
            AssertTrueIsDisplayed(licenseDetailsCommencementDateTooltip);
            if (lease.LeaseStartDate != "")
            {
                ClearInput(licenseDetailsCommencementDateInput);
                webDriver.FindElement(licenseDetailsCommencementDateInput).SendKeys(lease.LeaseStartDate);
                webDriver.FindElement(licenseDetailsCommencementDateInput).SendKeys(Keys.Enter);
            }

            //Expiry Date
            AssertTrueIsDisplayed(licenseDetailsExpiryDateLabel);
            AssertTrueIsDisplayed(licenseDetailsExpiryDateTooltip);
            if (lease.LeaseExpiryDate != "")
            {
                ClearInput(licenseDetailsExpiryDateInput);
                webDriver.FindElement(licenseDetailsExpiryDateInput).Click();
                webDriver.FindElement(licenseDetailsExpiryDateInput).SendKeys(lease.LeaseExpiryDate);
                webDriver.FindElement(licenseDetailsExpiryDateInput).SendKeys(Keys.Enter);
            }

            //Termination reason
            if (lease.LeaseTerminationReason != "")
            {
                AssertTrueIsDisplayed(licenseDetailsTerminateDateLabel);
                AssertTrueIsDisplayed(licenseDetailsViewTerminationTooltip);
                ClearInput(licenseDetailsTerminateDateInput);
                webDriver.FindElement(licenseDetailsTerminateDateInput).SendKeys(lease.LeaseTerminationDate);
                webDriver.FindElement(licenseDetailsTerminateDateInput).SendKeys(Keys.Enter);

                AssertTrueIsDisplayed(licenseDetailsTerminatedReasonLabel);
                ClearInput(licenseDetailsTerminateReasonInput);
                webDriver.FindElement(licenseDetailsTerminateReasonInput).Click();
                webDriver.FindElement(licenseDetailsTerminateReasonInput).SendKeys(lease.LeaseTerminationReason);
            }

            //Cancellation reason
            if (lease.LeaseCancellationReason != "")
            {
                AssertTrueIsDisplayed(licenseDetailsCancelReasonLabel);
                ClearInput(licenseDetailsCancelReasonInput);
                webDriver.FindElement(licenseDetailsCancelReasonInput).Click();
                webDriver.FindElement(licenseDetailsCancelReasonInput).SendKeys(lease.LeaseCancellationReason);
            }

            //RENEWAL OPTIONS
            if (lease.LeaseRenewals.Count > 0)
            {
                //Delete previous created renewals is any
                while (webDriver.FindElements(licenceDetailsFirstRenewalDeleteBttn).Count > 0)
                {
                    webDriver.FindElement(licenceDetailsFirstRenewalDeleteBttn).Click();

                    Wait();
                    if (webDriver.FindElements(licenseDetailsConfirmationModal).Count > 0)
                    {
                        Assert.Equal("Remove Renewal", sharedModals.ModalHeader());
                        Assert.Contains("Removing a renewal will also delete any renewal data.", sharedModals.ModalContent());
                        Assert.Contains("Do you want to proceed?", sharedModals.ModalContent());
                        sharedModals.ModalClickOKBttn();
                    }
                }

                for (var i = 0; i < lease.LeaseRenewals.Count; i++)
                {
                    webDriver.FindElement(licenseDetailsAddRenewButton).Click();
                    ChooseSpecificSelectOption(By.Id("input-renewals."+ i +".isExercised"), lease.LeaseRenewals[i].RenewalIsExercised);

                    webDriver.FindElement(By.Id("datepicker-renewals."+ i +".commencementDt")).SendKeys(lease.LeaseRenewals[i].RenewalCommencementDate);
                    webDriver.FindElement(By.Id("datepicker-renewals."+ i +".commencementDt")).SendKeys(Keys.Enter);

                    webDriver.FindElement(By.Id("datepicker-renewals."+ i +".expiryDt")).SendKeys(lease.LeaseRenewals[i].RenewalExpiryDate);
                    webDriver.FindElement(By.Id("datepicker-renewals."+ i +".expiryDt")).SendKeys(Keys.Enter);

                    webDriver.FindElement(By.Id("input-renewals."+ i +".renewalNote")).SendKeys(lease.LeaseRenewals[i].RenewalNotes);
                }
            }

            //ADMINISTRATION
            //MOTI Contact
            AssertTrueIsDisplayed(licenseDetailsAdmSubtitle);
            AssertTrueIsDisplayed(licenseDetailsAdmHelpTooltip);

            AssertTrueIsDisplayed(licenseDetailsMotiContactLabel);
            if (lease.MOTIContact != "")
                webDriver.FindElement(licenseDetailsMotiContactInput).SendKeys(lease.MOTIContact);

            //MOTI Region
            AssertTrueIsDisplayed(licenseDetailsMotiRegionLabel);
            if (lease.MOTIRegion != "")
                ChooseSpecificSelectOption(licenseDetailsMotiRegionSelector, lease.MOTIRegion);

            //Program
            AssertTrueIsDisplayed(licenseDetailsProgramLabel);
            if (lease.Program != "")
                ChooseSpecificSelectOption(licenseDetailsProgramSelector, lease.Program);

            //If other Program is selected, insert input
            if (webDriver.FindElements(licenseDetailsOtherProgramInput).Count > 0 && lease.ProgramOther != "")
            {
                WaitUntilVisible(licenseDetailsOtherProgramInput);
                AssertTrueIsDisplayed(licenseDetailsOtherProgramLabel);
                ClearInput(licenseDetailsOtherProgramInput);
                webDriver.FindElement(licenseDetailsOtherProgramInput).SendKeys(lease.ProgramOther);
            }

            //Type
            AssertTrueIsDisplayed(licenseDetailsTypeLabel);
            if (lease.AdminType != "")
                ChooseSpecificSelectOption(licenseDetailsTypeSelector, lease.AdminType);

            //If other Type is selected, insert input
            if (webDriver.FindElements(licenseDetailsOtherTypeInput).Count > 0 && lease.TypeOther != "")
            {
                AssertTrueIsDisplayed(licenseDetailsOtherTypeLabel);
                ClearInput(licenseDetailsOtherTypeInput);
                webDriver.FindElement(licenseDetailsOtherTypeInput).SendKeys(lease.TypeOther);
            }

            AssertTrueIsDisplayed(licenseDetailsPurposeLabel);
            //Purpose
            if (webDriver.FindElements(licenseDetailsPurposeDeleteBttns).Count > 0)
            {
                while (webDriver.FindElements(licenseDetailsPurposeDeleteBttns).Count > 0)
                    webDriver.FindElements(licenseDetailsPurposeDeleteBttns)[0].Click();
            }

            if (lease.LeasePurpose.Count > 0)
            {
                foreach (string purpose in lease.LeasePurpose)
                {
                    FocusAndClick(licenseDetailsPurposeMultiselector);

                    WaitUntilClickable(licenseDetailsPurposeOptions);
                    ChooseMultiSelectSpecificOption(licenseDetailsPurposeOptions, purpose);
                }
            }

            //If other Purpose is selected, insert input
            if (webDriver.FindElements(licenseDetailsOtherPurposeInput).Count > 0 && lease.PurposeOther != "")
            {
                WaitUntilVisible(licenseDetailsOtherPurposeInput);
                AssertTrueIsDisplayed(licenseDetailsOtherPurposeLabel);
                ClearInput(licenseDetailsOtherPurposeInput);
                webDriver.FindElement(licenseDetailsOtherPurposeInput).SendKeys(lease.PurposeOther);
            }

            //Initiator
            AssertTrueIsDisplayed(licenseDetailsInitiatorLabel);
            AssertTrueIsDisplayed(licenseDetailsInitiatorTooltip);
            if (lease.Initiator != "")
                ChooseSpecificSelectOption(licenseDetailsInitiatorSelector, lease.Initiator);

            //Responsibility
            AssertTrueIsDisplayed(licenseDetailsResponsibilityLabel);
            AssertTrueIsDisplayed(licenseDetailsResponsibilityTooltip);
            if (lease.Responsibility != "")
                ChooseSpecificSelectOption(licenseDetailsResposibilitySelector, lease.Responsibility);

            //Effective date of responsibility
            AssertTrueIsDisplayed(licenseDetailsEffectiveDateLabel);
            if (lease.EffectiveDate != "")
            {
                ClearInput(licenseDetailsEffectiveDateInput);
                webDriver.FindElement(licenseDetailsEffectiveDateInput).SendKeys(lease.EffectiveDate);
                webDriver.FindElement(licenseDetailsEffectiveDateInput).SendKeys(Keys.Enter);
            }

            //Intended use
            AssertTrueIsDisplayed(licenseDetailsIntendedUseLabel);
            if (lease.IntendedUse != "")
            {
                ClearInput(licenseDetailsIntendedUseTextarea);
                webDriver.FindElement(licenseDetailsIntendedUseTextarea).SendKeys(lease.IntendedUse);
            }

            //Arbitration City
            AssertTrueIsDisplayed(licenseDetailsCityArbitrationLabel);
            if (lease.ArbitrationCity != "")
            {
                ClearInput(licenseDetailsCityArbitrationInput);
                webDriver.FindElement(licenseDetailsCityArbitrationInput).SendKeys(lease.ArbitrationCity);
            }

            //LEASE & LICENCE TEAM
            AssertTrueIsDisplayed(licenseDetailsTeamSubtitle);
            if (lease.LeaseTeam!.Count > 0)
            {
                while (webDriver.FindElements(licenseDetailsTeamMembersGroup).Count > 0)
                    sharedTeams.DeleteFirstStaffMember();

                for (var i = 0; i < lease.LeaseTeam!.Count; i++)
                    sharedTeams.AddTeamMembers(lease.LeaseTeam![i]);
            }

            //FEE DETERMINATION
            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationSubtitle);

            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationPublicBenefitLabel);
            if (lease.FeeDeterminationPublicBenefit != "")
                ChooseSpecificSelectOption(licenseDetailsFeeDeterminationPublicBenefitInput, lease.FeeDeterminationPublicBenefit);

            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationFinancialGainLabel);
            if(lease.FeeDeterminationFinancialGain != "")
                ChooseSpecificSelectOption(licenseDetailsFeeDeterminationFinancialGainInput, lease.FeeDeterminationFinancialGain);

            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationSuggestedFeeLabel);
            AssertTrueIsDisplayed(licenseDetaulsFeeDeterminationSuggestedFeeTooltip);
            AssertTrueElementContains(licenseDetailsFeeDeterminationSuggestedFeeContent, lease.FeeDeterminationSuggestedFee);

            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationNotesLabel);
            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationNotesTooltip);
            if (lease.FeeDeterminationNotes != "")
            {
                ClearInput(licenseDetailsFeeDeterminationNotesInput);
                webDriver.FindElement(licenseDetailsFeeDeterminationNotesInput).SendKeys(lease.FeeDeterminationNotes);
            }
        }

        public void EditLeaseFileDetailsBttn()
        {
            Wait();
            webDriver.FindElement(licenseDetailsEditIcon).Click();
        }

        public void SaveLicense()
        {
            //Save
            ButtonElement("Save");

            Wait();
            while (webDriver.FindElements(licenseDetailsConfirmationModal).Count > 0)
            {
                //If PID is already associated with another license
                if (webDriver.FindElements(licensesDetailsPropertiesModal).Count > 0)
                {
                    Assert.Contains("is attached to L-File #", webDriver.FindElement(licensesDetailsPropertiesModalContent).Text);
                    webDriver.FindElement(licensesDetailsPropertiesOkBttn).Click();

                    Wait();
                }
                else if (sharedModals.ModalContent().Contains("he selected property already exists in the system's inventory"))
                {
                    Assert.Equal("User Override Required", sharedModals.ModalHeader());
                    Assert.Contains("The selected property already exists in the system's inventory. However, the record is missing spatial details.", sharedModals.ModalContent());
                    Assert.Contains("To add the property, the spatial details for this property will need to be updated. The system will attempt to update the property record with spatial information from the current selection.", sharedModals.ModalContent());
                    sharedModals.ModalClickOKBttn();

                    Wait();
                }
                else if (sharedModals.ModalContent().Contains("You have made changes to the properties in this file."))
                {
                    Assert.Equal("Confirm changes", sharedModals.ModalHeader());
                    Assert.Contains("You have made changes to the properties in this file.", sharedModals.ModalContent());
                    Assert.Contains("Do you want to save these changes?", sharedModals.ModalContent());
                    sharedModals.ModalClickOKBttn();

                    Wait();
                }
                else if (sharedModals.ModalHeader() == "Confirm status change")
                {
                    Assert.Equal("Confirm status change", sharedModals.ModalHeader());
                    Assert.Contains("If you save it, only the administrator can turn it back on. You will still see it in the management table.", sharedModals.ConfirmationModalParagraph1());
                    Assert.Equal("Do you want to acknowledge and proceed?", sharedModals.ConfirmationModalParagraph2());
                    sharedModals.ModalClickOKBttn();

                    Wait();
                }
            }
        }

        public void SaveLicenseWithExpectedErrors()
        {
            Wait();
            ButtonElement("Save");

            Wait();
            while (webDriver.FindElements(licenseDetailsConfirmationModal).Count() > 0)
            {
                if (sharedModals.ModalHeader().Contains("Error"))
                {
                    Assert.Contains("Lease File Stakeholder can not be removed since it's assigned as a payee for a compensation requisition", sharedModals.ModalContent());
                    sharedModals.ModalClickOKBttn();
                    break;
                }   
            }
            
        }

        public void CancelLicense()
        {
            ButtonElement("Cancel");
            sharedModals.CancelActionModal();
        }

        public string GetLeaseCode()
        {
            Wait();
            return webDriver.FindElement(licenseHeaderNbrContent).Text;
        }

        public string GetLeaseAccountType()
        {
            WaitUntilVisible(licenseHeaderAccountType);
            return webDriver.FindElement(licenseHeaderAccountType).Text;
        }

        public void VerifyLicenseDetailsInitCreateForm()
        {
            Wait(6000);

            //Create Title
            AssertTrueIsDisplayed(licenseCreateTitle);

            //Original Agreement
            AssertTrueIsDisplayed(licenseDetailsCreateSubtitle);
            AssertTrueIsDisplayed(licenseDetailsProjectLabel);
            AssertTrueIsDisplayed(licenseDetailsProjectInput);
            AssertTrueIsDisplayed(licenseDetailsStatusLabel);
            AssertTrueIsDisplayed(licenseDetailsStatusSelector);
            AssertTrueIsDisplayed(licenseDetailsAccountTypeLabel);
            AssertTrueIsDisplayed(licenseDetailsAccountTypeSelector);
            AssertTrueIsDisplayed(licenseDetailsCommencementDateLabel);
            AssertTrueIsDisplayed(licenseDetailsCommencementDateInput);
            AssertTrueIsDisplayed(licenseDetailsExpiryDateLabel);
            AssertTrueIsDisplayed(licenseDetailsExpiryDateInput);

            //Properties to include in this file
            sharedSearchProperties.VerifyLocateOnMapFeature("Lease");

            //Administration
            AssertTrueIsDisplayed(licenseDetailsAdmSubtitle);
            AssertTrueIsDisplayed(licenseDetailsAdmHelpTooltip);
            AssertTrueIsDisplayed(licenseDetailsMotiContactLabel);
            AssertTrueIsDisplayed(licenseDetailsMotiContactInput);
            AssertTrueIsDisplayed(licenseDetailsMotiRegionLabel);
            AssertTrueIsDisplayed(licenseDetailsMotiRegionSelector);
            AssertTrueIsDisplayed(licenseDetailsProgramLabel);
            AssertTrueIsDisplayed(licenseDetailsProgramSelector);
            AssertTrueIsDisplayed(licenseDetailsTypeLabel);
            AssertTrueIsDisplayed(licenseDetailsTypeSelector);
            AssertTrueIsDisplayed(licenseDetailsPurposeLabel);
            AssertTrueIsDisplayed(licenseDetailsPurposeMultiselector);
            AssertTrueIsDisplayed(licenseDetailsInitiatorLabel);
            AssertTrueIsDisplayed(licenseDetailsInitiatorTooltip);
            AssertTrueIsDisplayed(licenseDetailsInitiatorSelector);
            AssertTrueIsDisplayed(licenseDetailsResponsibilityLabel);
            AssertTrueIsDisplayed(licenseDetailsResponsibilityTooltip);
            AssertTrueIsDisplayed(licenseDetailsResposibilitySelector);
            AssertTrueIsDisplayed(licenseDetailsEffectiveDateLabel);
            AssertTrueIsDisplayed(licenseDetailsEffectiveDateInput);
            AssertTrueIsDisplayed(licenseDetailsIntendedUseLabel);
            AssertTrueIsDisplayed(licenseDetailsIntendedUseTextarea);
            AssertTrueIsDisplayed(licenseDetailsCityArbitrationLabel);

            //Lease & Licence Team
            AssertTrueIsDisplayed(licenseDetailsTeamSubtitle);
            AssertTrueIsDisplayed(licenseDetailsTeamAddMemberLink);

            //Buttons
            AssertTrueIsDisplayed(licenseDetailsSaveButton);
            AssertTrueIsDisplayed(licenseDetailsCancelButton);
        }

        public void UpdateLicensePropertiesForm(LeaseProperty property, int propertyIdx)
        {
            AssertTrueIsDisplayed(leasePropertiesUpdateSubtitle);

            if (property.DescriptiveName != "")
            {
                ClearInput(By.Id("input-properties."+ propertyIdx +".name"));
                webDriver.FindElement(By.Id("input-properties."+ propertyIdx +".name")).SendKeys(property.DescriptiveName);

            }

            if (property.Area != "")
            {
                ClearDigitsInput(By.XPath("//input[@id='input-properties."+ propertyIdx +".name']/parent::div/parent::div/parent::div/following-sibling::div[1]/div/div/div[1]/div/div[1]/div/input"));
                webDriver.FindElement(By.XPath("//input[@id='input-properties."+ propertyIdx +".name']/parent::div/parent::div/parent::div/following-sibling::div[1]/div/div/div[1]/div/div[1]/div/input")).SendKeys(property.Area);

                AssertTrueDoublesEquals(By.XPath("//input[@id='input-properties."+ propertyIdx +".name']/parent::div/parent::div/parent::div/following-sibling::div[1]/div/div/div[1]/div/div[2]/div/input"), TransformSqMtToHectares(property.Area));
                AssertTrueIsDisplayed(By.XPath("//input[@id='input-properties."+ propertyIdx +".name']/parent::div/parent::div/parent::div/following-sibling::div[1]/div/div/div[1]/div/div[2]/div[contains(text(),'hectares')]"));

                AssertTrueDoublesEquals(By.XPath("//input[@id='input-properties."+ propertyIdx +".name']/parent::div/parent::div/parent::div/following-sibling::div[1]/div/div/div[2]/div/div[1]/div/input"), TransformSqMtToSqFt(property.Area));
                AssertTrueIsDisplayed(By.XPath("//input[@id='input-properties."+ propertyIdx +".name']/parent::div/parent::div/parent::div/following-sibling::div[1]/div/div/div[2]/div/div[1]/div[contains(text(),'sq. feet')]"));

                AssertTrueDoublesEquals(By.XPath("//input[@id='input-properties."+ propertyIdx +".name']/parent::div/parent::div/parent::div/following-sibling::div[1]/div/div/div[2]/div/div[2]/div/input"), TransformSqMtToAcres(property.Area));
                AssertTrueIsDisplayed(By.XPath("//input[@id='input-properties."+ propertyIdx +".name']/parent::div/parent::div/parent::div/following-sibling::div[1]/div/div/div[2]/div/div[2]/div[contains(text(),'acres')]"));
            }
        }

        public void VerifyLicenseHeader(Lease lease)
        {
            AssertTrueIsDisplayed(licenseHeaderNbrLabel);
            AssertTrueContentNotEquals(licenseHeaderNbrContent, "");
            AssertTrueContentNotEquals(licenseHeaderAccountType, "");
            AssertTrueIsDisplayed(licenseHeaderProperty);
            
            if(lease.AccountType == "Receivable")
                AssertTrueIsDisplayed(licenseHeaderTenantLabel);
            else
                AssertTrueIsDisplayed(licenseHeaderPayeeLabel);
            AssertTrueIsDisplayed(licenseHeaderStartDateLabel);
            AssertTrueContentEquals(licenseHeaderStartDateContent, TransformDateFormat(lease.LeaseStartDate));
            AssertTrueIsDisplayed(licenseHeaderExpiryDateLabel);
            AssertTrueContentEquals(licenseHeaderExpiryDateContent, CalculateExpiryCurrentDate(lease.LeaseExpiryDate, lease.LeaseRenewals));
            AssertTrueIsDisplayed(licenseHeaderHistoricalFileLabel);
            AssertTrueIsDisplayed(licenseHeaderCreatedLabel);
            AssertTrueContentNotEquals(licenseHeaderCreatedContent, "");
            AssertTrueContentEquals(licenseHeaderCreatedByContent, "TRANPSP1");
            AssertTrueIsDisplayed(licenseHeaderLastUpdatedLabel);
            AssertTrueContentNotEquals(licenseHeaderLastUpdatedContent, "");
            AssertTrueContentEquals(licenseHeaderLastUpdatedByContent, "TRANPSP1");

            if (lease.LeaseStatus != "")
                AssertTrueContentEquals(licenseHeaderStatusContent, GetUppercaseString(lease.LeaseStatus));

            //Verify Expired Flag on Header
            if (webDriver.FindElement(licenseHeaderExpiryDateContent).Text != "")
            {
                var expiryDateInput = Convert.ToDateTime(webDriver.FindElement(licenseHeaderExpiryDateContent).Text);
                if (expiryDateInput < DateTime.Now)
                {
                    AssertTrueIsDisplayed(licenseHeaderExpiredFlag);
                }
            }  
        }

        public void VerifyLicensePropertiesHeader(string leaseType)
        {
            AssertTrueIsDisplayed(licenseHeaderNbrLabel);
            AssertTrueContentNotEquals(licenseHeaderNbrContent, "");
            AssertTrueContentNotEquals(licenseHeaderAccountType, "");
            AssertTrueIsDisplayed(licenseHeaderProperty);
            AssertTrueIsDisplayed(licenseHeaderPropertyContent);
            if (leaseType == "Receivable")
                AssertTrueIsDisplayed(licenseHeaderTenantLabel);
            else
                AssertTrueIsDisplayed(licenseHeaderPayeeLabel);
            AssertTrueIsDisplayed(licenseHeaderStartDateLabel);
            AssertTrueIsDisplayed(licenseHeaderExpiryDateLabel);
            AssertTrueIsDisplayed(licenseHeaderHistoricalFileLabel);
            Assert.True(webDriver.FindElements(licenseHeaderHistoricalFileContent).Count > 0);
            AssertTrueIsDisplayed(licenseHeaderCreatedLabel);
            AssertTrueContentNotEquals(licenseHeaderCreatedContent, "");
            AssertTrueContentEquals(licenseHeaderCreatedByContent, "TRANPSP1");
            AssertTrueIsDisplayed(licenseHeaderLastUpdatedLabel);
            AssertTrueContentNotEquals(licenseHeaderLastUpdatedContent, "");
            AssertTrueContentEquals(licenseHeaderLastUpdatedByContent, "TRANPSP1");

            //Verify Expired Flag on Header
            if (webDriver.FindElement(licenseHeaderExpiryDateContent).Text != "")
            {
                var expiryDateInput = Convert.ToDateTime(webDriver.FindElement(licenseHeaderExpiryDateContent).Text);
                if (expiryDateInput < DateTime.Now)
                {
                    AssertTrueIsDisplayed(licenseHeaderExpiredFlag);
                }
            }
        }

        public void VerifyLicenseDetailsViewForm(Lease lease)
        {
            VerifyLicenseHeader(lease);

            //Edit Icon
            AssertTrueIsDisplayed(licenseDetailsEditIcon);

            //DETAILS
            AssertTrueIsDisplayed(licenseDetailsCreateSubtitle);

            AssertTrueIsDisplayed(licenseDetailsProjectLabel);
            if (lease.MinistryProject != "")
                AssertTrueContentEquals(licenseDetailsProjectContent, lease.MinistryProjectCode + " - " + lease.MinistryProject);

            AssertTrueIsDisplayed(licenseDetailsProductLabel);
            if (lease.MinistryProduct != "")
                AssertTrueContentEquals(licenseDetailsProductContent, lease.MinistryProduct);

            AssertTrueIsDisplayed(licenseDetailsStatusLabel);
            AssertTrueIsDisplayed(licenseDetailsStatusTooltip);
            AssertTrueContentEquals(licenseDetailsStatusContent, lease.LeaseStatus);

            AssertTrueIsDisplayed(licenseDetailsAccountTypeLabel);
            AssertTrueContentEquals(licenseDetailsAccountTypeContent, lease.AccountType);

            AssertTrueIsDisplayed(licenseDetailsCommencementDateLabel);
            if (lease.LeaseStartDate != "")
                AssertTrueContentEquals(licenseDetailsCommencementDateContent, TransformDateFormat(lease.LeaseStartDate));

            AssertTrueIsDisplayed(licenseDetailsExpiryDateLabel);
            if (lease.LeaseExpiryDate != "" || lease.LeaseRenewals.Count > 0)
                AssertTrueContentEquals(licenseDetailsExpiryDateContent, CalculateExpiryCurrentDate(lease.LeaseExpiryDate, lease.LeaseRenewals));
            
            if (lease.LeaseTerminationReason != "")
            {
                AssertTrueIsDisplayed(licenseDetailsTerminateDateLabel);
                AssertTrueIsDisplayed(licenseDetailsViewTerminationTooltip);
                AssertTrueContentEquals(licenseDetailsViewTerminateDateContent, TransformDateFormat(lease.LeaseTerminationDate));
                AssertTrueIsDisplayed(licenseDetailsTerminatedReasonLabel);
                AssertTrueContentEquals(licenseDetailsTerminateReasonContent, lease.LeaseTerminationReason);
                AssertTrueContentEquals(licenseDetailsViewTerminateReason, lease.LeaseTerminationReason);
            }

            if (lease.LeaseCancellationReason != "")
            {
                AssertTrueIsDisplayed(licenseDetailsCancelReasonLabel);
                AssertTrueContentEquals(licenseDetailsCancelContent, lease.LeaseCancellationReason);
                AssertTrueContentEquals(licenseDetailsViewCancelReason, lease.LeaseCancellationReason);
            }

            //RENEWALS
            AssertTrueIsDisplayed(licenseDetailsRenewalTitle);
            if (lease.LeaseRenewals.Count > 0)
            {
                for (var i = 0; i < lease.LeaseRenewals.Count; i++)
                {
                    var elementIdx = i + 1;
                    AssertTrueContentEquals(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/h2/div/div"), "Renewal " + elementIdx);
                    AssertTrueIsDisplayed(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/div/div/div/label[contains(text(),'Exercised')]"));
                    AssertTrueContentEquals(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/div/div/div/label[contains(text(),'Exercised')]/parent::div/following-sibling::div"), lease.LeaseRenewals[i].RenewalIsExercised);

                    AssertTrueIsDisplayed(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/div/div[2]/div[1]/div/div/label[contains(text(),'Commencement')]"));
                    AssertTrueContentEquals(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/div/div[2]/div[1]/div/div/label[contains(text(),'Commencement')]/parent::div/following-sibling::div"), TransformDateFormat(lease.LeaseRenewals[i].RenewalCommencementDate));

                    AssertTrueIsDisplayed(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/div/div[2]/div[2]/div/div/label[contains(text(),'Expiry')]"));
                    AssertTrueContentEquals(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/div/div[2]/div[2]/div/div/label[contains(text(),'Expiry')]/parent::div/following-sibling::div"), TransformDateFormat(lease.LeaseRenewals[i].RenewalExpiryDate));

                    AssertTrueIsDisplayed(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/div/div[3]/div/label[contains(text(),'Comments')]"));
                    AssertTrueContentEquals(By.XPath("//div[contains(text(),'Renewal Options')]/parent::div/parent::h2/following-sibling::div/div["+ elementIdx +"]/div/div[3]/div/label[contains(text(),'Comments')]/parent::div/following-sibling::div"), lease.LeaseRenewals[i].RenewalNotes);
                }
            }

            //ADMINISTRATION
            AssertTrueIsDisplayed(licenseDetailsAdmSubtitle);
            AssertTrueIsDisplayed(licenseDetailsProgramViewLabel);

            if(lease.Program != "")
                //AssertTrueContentEquals(licenseDetailsProgramContent, lease.Program);

            if (lease.ProgramOther != "")
                //AssertTrueElementValueEquals(licenseDetailsOtherProgramContent, lease.ProgramOther);

            AssertTrueIsDisplayed(licenseDetailsTypeLabel);
            if(lease.AdminType != "")
                AssertTrueContentEquals(licenseDetailsTypeContent, lease.AdminType);

            if (lease.TypeOther != "")
                AssertTrueElementValueEquals(licenseDetailsOtherTypeContent, lease.TypeOther);

            AssertTrueIsDisplayed(licenseDetailsPurposeLabel);
            if (lease.LeasePurpose.Count > 0)
            {
                var purposesUI = GetViewFieldListContent(licenseDetailsPurposeContent);
                Assert.True(Enumerable.SequenceEqual(purposesUI, lease.LeasePurpose));
            }

            if (lease.PurposeOther != "")
                AssertTrueElementContains(licenseDetailsOtherPurposeContent, lease.PurposeOther);

            AssertTrueIsDisplayed(licenseDetailsInitiatorLabel);

            if (lease.Initiator != "")
                AssertTrueContentEquals(licenseDetailsInitiatorContent, lease.Initiator);

            AssertTrueIsDisplayed(licenseDetailsResponsibilityLabel);

            if(lease.Responsibility != "")
                AssertTrueContentEquals(licenseDetailsResponsibilityContent, lease.Responsibility);

            AssertTrueIsDisplayed(licenseDetailsEffectiveDateLabel);

            if (lease.EffectiveDate != "")
                AssertTrueContentEquals(licenseDetailsEffectiveDateContent, TransformDateFormat(lease.EffectiveDate));

            AssertTrueIsDisplayed(licenseDetailsMotiContactLabel);

            if(lease.MOTIContact != "")
                AssertTrueContentEquals(licenseDetailsMotiContactContent, lease.MOTIContact);

            AssertTrueIsDisplayed(licenseDetailsIntendedUseLabel);

            if(lease.IntendedUse != "")
                AssertTrueContentEquals(licenseDetailsIntendedUseContent, lease.IntendedUse);

            AssertTrueIsDisplayed(licenseDetailsCityArbitrationLabel);

            if (lease.ArbitrationCity != "")
                AssertTrueContentEquals(licenseDetailsCityArbitrationContent, lease.ArbitrationCity);

            //LEASE & LICENSE TEAM
            AssertTrueIsDisplayed(licenseDetailsTeamSubtitle);
            if (lease.LeaseTeam!.Count > 0)
                sharedTeams.VerifyTeamMembersViewForm(lease.LeaseTeam);

            //FEE DETERMINATION
            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationSubtitle);

            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationPublicBenefitLabel);
            if (lease.FeeDeterminationPublicBenefit != "")
            {
                AssertTrueContentEquals(licenseDetailsFeeDeterminationPublicBenefitContent, lease.FeeDeterminationPublicBenefit);
                //IWebElement publicBenefit = webDriver.FindElement(licenseDetailsFeeDeterminationPublicBenefitInput);
                //SelectElement selectedValue = new(publicBenefit);
                //string selectedText = selectedValue.SelectedOption.Text;
                //Assert.Equal(lease.FeeDeterminationPublicBenefit, selectedText);
            }

            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationFinancialGainLabel);
            if (lease.FeeDeterminationFinancialGain != "")
            {
                AssertTrueContentEquals(licenseDetailsFeeDeterminationFinancialGainContent, lease.FeeDeterminationFinancialGain);
                //IWebElement financialGain = webDriver.FindElement(licenseDetailsFeeDeterminationFinancialGainInput);
                //SelectElement selectedValue = new(element: financialGain);
                //string selectedText = selectedValue.SelectedOption.Text;
                //Assert.Equal(lease.FeeDeterminationFinancialGain, selectedText);
            }

            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationSuggestedFeeLabel);
            AssertTrueContentEquals(licenseDetailsFeeDeterminationSuggestedFeeContent, lease.FeeDeterminationSuggestedFee);

            AssertTrueIsDisplayed(licenseDetailsFeeDeterminationNotesLabel);
            AssertTrueContentEquals(licenseDetailsFeeDeterminationNotesContent, lease.FeeDeterminationNotes);
        }
    }
}
