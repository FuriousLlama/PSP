using Mapster;
using Pims.Api.Models.Base;
using Pims.Core.Extensions;
using Entity = Pims.Dal.Entities;

namespace Pims.Api.Models.Concepts.Property
{
    public class PropertyMap : IRegister
    {
        public void Register(TypeAdapterConfig config)
        {
            config.NewConfig<Entity.PimsProperty, PropertyModel>()
                .Map(dest => dest.Id, src => src.Internal_Id)
                .Map(dest => dest.Pid, src => src.Pid)
                .Map(dest => dest.Pin, src => src.Pin)
                .Map(dest => dest.PlanNumber, src => src.SurveyPlanNumber)
                .Map(dest => dest.Status, src => src.PropertyStatusTypeCodeNavigation)
                .Map(dest => dest.PropertyType, src => src.PropertyTypeCodeNavigation)
                .Map(dest => dest.Address, src => src.Address)
                .Map(dest => dest.District, src => src.DistrictCodeNavigation)
                .Map(dest => dest.Region, src => src.RegionCodeNavigation)
                .Map(dest => dest.Location, src => src.Location)
                .Map(dest => dest.Boundary, src => src.Boundary)
                .Map(dest => dest.GeneralLocation, src => src.GeneralLocation)

                .Map(dest => dest.DataSource, src => src.PropertyDataSourceTypeCodeNavigation)
                .Map(dest => dest.DataSourceEffectiveDateOnly, src => src.PropertyDataSourceEffectiveDate)

                .Map(dest => dest.IsRetired, src => src.IsRetired)
                .Map(dest => dest.IsRwyBeltDomPatent, src => src.IsRwyBeltDomPatent)
                .Map(dest => dest.PphStatusTypeCode, src => src.PphStatusTypeCode)
                .Map(dest => dest.PphStatusUpdateUserid, src => src.PphStatusUpdateUserid)
                .Map(dest => dest.PphStatusUpdateTimestamp, src => src.PphStatusUpdateTimestamp)
                .Map(dest => dest.PphStatusUpdateUserGuid, src => src.PphStatusUpdateUserGuid)
                .Map(dest => dest.IsOwned, src => src.IsOwned)

                // multi-selects
                .Map(dest => dest.Anomalies, src => src.PimsPropPropAnomalyTyps)
                .Map(dest => dest.Tenures, src => src.PimsPropPropTenureTyps)
                .Map(dest => dest.RoadTypes, src => src.PimsPropPropRoadTyps)

                .Map(dest => dest.LandArea, src => src.LandArea)
                .Map(dest => dest.AreaUnit, src => src.PropertyAreaUnitTypeCodeNavigation)

                .Map(dest => dest.IsVolumetricParcel, src => src.IsVolumetricParcel)
                .Map(dest => dest.VolumetricMeasurement, src => src.VolumetricMeasurement)
                .Map(dest => dest.VolumetricUnit, src => src.VolumeUnitTypeCodeNavigation)
                .Map(dest => dest.VolumetricType, src => src.VolumetricTypeCodeNavigation)

                .Map(dest => dest.MunicipalZoning, src => src.MunicipalZoning)

                .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription)

                .Map(dest => dest.Latitude, src => src.Location.Coordinate.Y)
                .Map(dest => dest.Longitude, src => src.Location.Coordinate.X)

                .Map(dest => dest.SurplusDeclarationComment, src => src.SurplusDeclarationComment)
                .Map(dest => dest.SurplusDeclarationDate, src => src.SurplusDeclarationDate.ToNullableDateOnly())
                .Map(dest => dest.SurplusDeclarationType, src => src.SurplusDeclarationTypeCodeNavigation)

                .Map(dest => dest.HistoricalFileNumbers, src => src.PimsHistoricalFileNumbers)

                .Inherits<Entity.IBaseEntity, BaseConcurrentModel>();

            config.NewConfig<PropertyModel, Entity.PimsProperty>()
            .Map(dest => dest.Internal_Id, src => src.Id)
            .Map(dest => dest.Pid, src => src.Pid)
            .Map(dest => dest.Pin, src => src.Pin)
            .Map(dest => dest.SurveyPlanNumber, src => src.PlanNumber)
            .Map(dest => dest.PropertyStatusTypeCode, src => src.Status.Id)
            .Map(dest => dest.PropertyTypeCode, src => src.PropertyType.Id)
            .Map(dest => dest.Address, src => src.Address)
            .Map(dest => dest.DistrictCode, src => src.District.Id)
            .Map(dest => dest.RegionCode, src => src.Region.Id)
            .Map(dest => dest.Location, src => src.Location)
            .Map(dest => dest.Boundary, src => src.Boundary)
            .Map(dest => dest.GeneralLocation, src => src.GeneralLocation)

            .Map(dest => dest.IsRetired, src => src.IsRetired)
            .Map(dest => dest.IsRwyBeltDomPatent, src => src.IsRwyBeltDomPatent)
            .Map(dest => dest.PphStatusTypeCode, src => src.PphStatusTypeCode)

            .Map(dest => dest.IsOwned, src => src.IsOwned)

            // multi-selects
            .Map(dest => dest.PimsPropPropAnomalyTyps, src => src.Anomalies)
            .Map(dest => dest.PimsPropPropTenureTyps, src => src.Tenures)
            .Map(dest => dest.PimsPropPropRoadTyps, src => src.RoadTypes)

            .Map(dest => dest.LandArea, src => src.LandArea)
            .Map(dest => dest.PropertyAreaUnitTypeCode, src => src.AreaUnit.Id)

            .Map(dest => dest.IsVolumetricParcel, src => src.IsVolumetricParcel)
            .Map(dest => dest.VolumetricMeasurement, src => src.VolumetricMeasurement)
            .Map(dest => dest.VolumeUnitTypeCode, src => src.VolumetricUnit.Id)
            .Map(dest => dest.VolumetricTypeCode, src => src.VolumetricType.Id)

            .Map(dest => dest.MunicipalZoning, src => src.MunicipalZoning)

            .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription)

            .Inherits<BaseConcurrentModel, Entity.IBaseEntity>();

            config.NewConfig<Entity.PimsPropertyHist, Entity.PimsProperty>()
                .Map(dest => dest.PropertyId, src => src.PropertyId)
                .Map(dest => dest.Pid, src => src.Pid)
                .Map(dest => dest.Pin, src => src.Pin)
                .Map(dest => dest.SurveyPlanNumber, src => src.SurveyPlanNumber)
                .Map(dest => dest.PropertyStatusTypeCode, src => src.PropertyStatusTypeCode)
                .Map(dest => dest.PropertyTypeCode, src => src.PropertyTypeCode)
                .Map(dest => dest.AddressId, src => src.AddressId)
                .Map(dest => dest.DistrictCode, src => src.DistrictCode)
                .Map(dest => dest.RegionCode, src => src.RegionCode)
                .Map(dest => dest.GeneralLocation, src => src.GeneralLocation)

                .Map(dest => dest.IsRetired, src => src.IsRetired)
                .Map(dest => dest.IsRwyBeltDomPatent, src => src.IsRwyBeltDomPatent)
                .Map(dest => dest.PphStatusTypeCode, src => src.PphStatusTypeCode)

                .Map(dest => dest.IsOwned, src => src.IsOwned)

                .Map(dest => dest.LandArea, src => src.LandArea)
                .Map(dest => dest.PropertyAreaUnitTypeCode, src => src.PropertyAreaUnitTypeCode)

                .Map(dest => dest.IsVolumetricParcel, src => src.IsVolumetricParcel)
                .Map(dest => dest.VolumetricMeasurement, src => src.VolumetricMeasurement)
                .Map(dest => dest.VolumeUnitTypeCode, src => src.VolumeUnitTypeCode)
                .Map(dest => dest.VolumetricTypeCode, src => src.VolumetricTypeCode)

                .Map(dest => dest.MunicipalZoning, src => src.MunicipalZoning)

                .Map(dest => dest.LandLegalDescription, src => src.LandLegalDescription);
        }
    }
}
