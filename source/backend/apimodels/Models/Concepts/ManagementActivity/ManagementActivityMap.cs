using Mapster;
using Pims.Api.Models.Base;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Models.Concepts.Property
{
    public class ManagementActivityMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.PimsManagementActivity, ManagementActivityModel>()
                .Map(dest => dest.Id, src => src.PimsManagementActivityId)
                .Map(dest => dest.ManagementFileId, src => src.ManagementFileId)
                .Map(dest => dest.ManagementFile, src => src.ManagementFile)
                .Map(dest => dest.ActivityTypeCode, src => src.PropMgmtActivityTypeCodeNavigation)
                .Map(dest => dest.ActivitySubTypeCodes, src => src.PimsPropActivityMgmtActivities)
                .Map(dest => dest.ActivityStatusTypeCode, src => src.PropMgmtActivityStatusTypeCodeNavigation)
                .Map(dest => dest.RequestAddedDateOnly, src => src.RequestAddedDt)
                .Map(dest => dest.CompletionDateOnly, src => src.CompletionDt)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.RequestSource, src => src.RequestSource)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.ServiceProviderOrgId, src => src.ServiceProviderOrgId)
                .Map(dest => dest.ServiceProviderOrg, src => src.ServiceProviderOrg)
                .Map(dest => dest.ServiceProviderPersonId, src => src.ServiceProviderPersonId)
                .Map(dest => dest.ServiceProviderPerson, src => src.ServiceProviderPerson)
                .Map(dest => dest.InvolvedParties, src => src.PimsPropActInvolvedParties)
                .Map(dest => dest.MinistryContacts, src => src.PimsPropActMinContacts)
                .Map(dest => dest.ActivityProperties, src => src.PimsManagementActivityProperties)
                .Map(dest => dest.Invoices, src => src.PimsPropertyActivityInvoices)
                .Inherits<Entity.IBaseAppEntity, BaseAuditModel>();

            config.NewConfig<ManagementActivityModel, Entity.PimsManagementActivity>()
                .Map(dest => dest.PimsManagementActivityId, src => src.Id)
                .Map(dest => dest.ManagementFileId, src => src.ManagementFileId)
                .Map(dest => dest.PropMgmtActivityTypeCode, src => src.ActivityTypeCode.Id)
                .Map(dest => dest.PimsPropActivityMgmtActivities, src => src.ActivitySubTypeCodes)
                .Map(dest => dest.PropMgmtActivityStatusTypeCode, src => src.ActivityStatusTypeCode.Id)
                .Map(dest => dest.RequestAddedDt, src => src.RequestAddedDateOnly)
                .Map(dest => dest.CompletionDt, src => src.CompletionDateOnly)
                .Map(dest => dest.Description, src => src.Description)
                .Map(dest => dest.RequestSource, src => src.RequestSource)
                .Map(dest => dest.IsDisabled, src => src.IsDisabled)
                .Map(dest => dest.ServiceProviderOrgId, src => src.ServiceProviderOrgId)
                .Map(dest => dest.ServiceProviderPersonId, src => src.ServiceProviderPersonId)
                .Map(dest => dest.PimsPropActInvolvedParties, src => src.InvolvedParties)
                .Map(dest => dest.PimsPropActMinContacts, src => src.MinistryContacts)
                .Map(dest => dest.PimsManagementActivityProperties, src => src.ActivityProperties)
                .Map(dest => dest.PimsPropertyActivityInvoices, src => src.Invoices)
                .Inherits<BaseAuditModel, Entity.IBaseAppEntity>();
        }
    }
}
