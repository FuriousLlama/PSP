using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Repositories
{
    public interface IAcquisitionFilePropertyRepository : IRepository
    {
        List<PimsPropertyAcquisitionFile> GetPropertiesByAcquisitionFileId(long acquisitionFileId);

        int GetAcquisitionFilePropertyRelatedCount(long propertyId);

        PimsPropertyAcquisitionFile Add(PimsPropertyAcquisitionFile propertyAcquisitionFile);

        PimsPropertyAcquisitionFile Update(PimsPropertyAcquisitionFile propertyAcquisitionFile);

        bool AcquisitionFilePropertyInCompensationReq(long propertyAcquisitionFileId);

        void Delete(PimsPropertyAcquisitionFile propertyAcquisitionFile);
    }
}
