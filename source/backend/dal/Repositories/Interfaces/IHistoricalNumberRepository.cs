
using System.Collections.Generic;
using Pims.Dal.Entities;

namespace Pims.Dal.Repositories
{
    /// <summary>
    /// IHistoricalNumberRepository interface, provides functions to interact with property's historical numbers within the datasource.
    /// </summary>
    public interface IHistoricalNumberRepository : IRepository<PimsHistoricalFileNumber>
    {
        IList<PimsHistoricalFileNumber> GetAllByPropertyId(long propertyId);
    }
}