/* -----------------------------------------------------------------------------
Alter the data in the PIMS_PROP_MGMT_ACTIVITY_SUBTYPE table.
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
Author        Date         Comment
------------  -----------  -----------------------------------------------------
Doug Filteau  2024-Feb-26  Initial version
----------------------------------------------------------------------------- */

SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO
BEGIN TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Insert the new data source types
DELETE
FROM   PIMS_PROP_MGMT_ACTIVITY_SUBTYPE
WHERE  PROP_MGMT_ACTIVITY_TYPE_CODE    =  N'UTILITYBILL'
   AND PROP_MGMT_ACTIVITY_SUBTYPE_CODE IN (N'ELECTRICITYBILL', N'GASBILL', N'INTERNETBILL', N'SEWERWATERBILL', N'TELEPHONEBILL')
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Insert the new data source types
DELETE
FROM   PIMS_PROP_MGMT_ACTIVITY_SUBTYPE
WHERE  PROP_MGMT_ACTIVITY_TYPE_CODE    =  N'TAXESLEVIES'
   AND PROP_MGMT_ACTIVITY_SUBTYPE_CODE IN (N'MUNIPROPTAX', N'WATERTAX', N'OTHERTAX')
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

COMMIT TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO
DECLARE @Success AS BIT
SET @Success = 1
SET NOEXEC OFF
IF (@Success = 1) PRINT 'The database update succeeded'
ELSE BEGIN
   IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION
   PRINT 'The database update failed'
END
GO
