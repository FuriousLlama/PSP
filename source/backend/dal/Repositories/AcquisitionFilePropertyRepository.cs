using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Core.Exceptions;
using Pims.Core.Extensions;
using Pims.Dal.Entities;

namespace Pims.Dal.Repositories
{
    /// <summary>
    /// Provides a repository to interact with acquisition file properties within the datasource.
    /// </summary>
    public class AcquisitionFilePropertyRepository : BaseRepository<PimsPropertyAcquisitionFile>, IAcquisitionFilePropertyRepository
    {
        #region Constructors

        /// <summary>
        /// Creates a new instance of a AcquisitionFilePropertyRepository, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public AcquisitionFilePropertyRepository(PimsContext dbContext, ClaimsPrincipal user, ILogger<AcquisitionFilePropertyRepository> logger)
            : base(dbContext, user, logger)
        {
        }

        #endregion

        #region Methods

        public List<PimsPropertyAcquisitionFile> GetPropertiesByAcquisitionFileId(long acquisitionFileId)
        {
            return Context.PimsPropertyAcquisitionFiles
                .AsNoTracking()
                .Include(rp => rp.PimsTakes)
                .Include(ap => ap.PimsInthldrPropInterests)
                .Include(rp => rp.Property)
                    .ThenInclude(rp => rp.RegionCodeNavigation)
                .Include(rp => rp.Property)
                    .ThenInclude(rp => rp.DistrictCodeNavigation)
                .Include(rp => rp.Property)
                    .ThenInclude(rp => rp.Address)
                    .ThenInclude(a => a.Country)
                .Include(rp => rp.Property)
                    .ThenInclude(rp => rp.Address)
                    .ThenInclude(a => a.ProvinceState)
                .Include(rp => rp.Property)
                    .ThenInclude(h => h.PimsHistoricalFileNumbers)
                .Where(x => x.AcquisitionFileId == acquisitionFileId)
                .OrderBy(pa => pa.DisplayOrder)
                .ToList();
        }

        public int GetAcquisitionFilePropertyRelatedCount(long propertyId)
        {
            return Context.PimsPropertyAcquisitionFiles
                .Where(x => x.PropertyId == propertyId)
                .AsNoTracking()
                .Count();
        }

        public PimsPropertyAcquisitionFile Add(PimsPropertyAcquisitionFile propertyAcquisitionFile)
        {
            propertyAcquisitionFile.ThrowIfNull(nameof(propertyAcquisitionFile));

            if (propertyAcquisitionFile.Property.IsRetired.HasValue && propertyAcquisitionFile.Property.IsRetired.Value)
            {
                throw new BusinessRuleViolationException("Retired property can not be selected.");
            }

            // Mark the property not to be changed if it did not exist already.
            if (propertyAcquisitionFile.PropertyId != 0)
            {
                propertyAcquisitionFile.Property = null;
            }

            Context.PimsPropertyAcquisitionFiles.Add(propertyAcquisitionFile);
            return propertyAcquisitionFile;
        }

        public void Delete(PimsPropertyAcquisitionFile propertyAcquisitionFile)
        {
            propertyAcquisitionFile.ThrowIfNull(nameof(propertyAcquisitionFile));

            var propertyAcquisitionFileToDelete = Context.PimsPropertyAcquisitionFiles
                .Where(x => x.PropertyAcquisitionFileId == propertyAcquisitionFile.Internal_Id)
                .FirstOrDefault() ?? throw new KeyNotFoundException();

            Context.PimsPropertyAcquisitionFiles.Remove(propertyAcquisitionFileToDelete);
        }

        public PimsPropertyAcquisitionFile Update(PimsPropertyAcquisitionFile propertyAcquisitionFile)
        {
            propertyAcquisitionFile.ThrowIfNull(nameof(propertyAcquisitionFile));

            Context.Entry(propertyAcquisitionFile).CurrentValues.SetValues(propertyAcquisitionFile);
            Context.Entry(propertyAcquisitionFile).State = EntityState.Modified;
            return propertyAcquisitionFile;
        }

        public bool AcquisitionFilePropertyInCompensationReq(long propertyAcquisitionFileId)
        {
            return Context.PimsPropAcqFlCompReqs.Where(x => x.PropertyAcquisitionFileId == propertyAcquisitionFileId).AsNoTracking().Any();
        }

        #endregion
    }
}
