/* -----------------------------------------------------------------------------
Alter the data in the PIMS_LEASE_LICENSE_TYPE table.
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
Author        Date         Comment
------------  -----------  -----------------------------------------------------
Doug Filteau  2024-Jul-11  Initial version.
----------------------------------------------------------------------------- */

SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO
BEGIN TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Insert/Enable the "LTRINTENT" type
PRINT N'Update the description for the "LTRINTENT" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'LTRINTENT'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    IS_DISABLED                = 0
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
ELSE
  INSERT INTO PIMS_LEASE_LICENSE_TYPE (LEASE_LICENSE_TYPE_CODE, DESCRIPTION)
    VALUES (N'LTRINTENT',  N'Letter of Intended Use');
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Insert/Enable the "LTRINDMNY" type
PRINT N'Update the description for the "LTRINDMNY" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'LTRINDMNY'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    IS_DISABLED                = 0
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
ELSE
  INSERT INTO PIMS_LEASE_LICENSE_TYPE (LEASE_LICENSE_TYPE_CODE, DESCRIPTION)
    VALUES (N'LTRINDMNY',  N'Indemnity letter');
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Insert/Enable the "AMNDAGREE" type
PRINT N'Update the description for the "AMNDAGREE" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'AMNDAGREE'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    IS_DISABLED                = 0
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
ELSE
  INSERT INTO PIMS_LEASE_LICENSE_TYPE (LEASE_LICENSE_TYPE_CODE, DESCRIPTION)
    VALUES (N'AMNDAGREE',  N'Amending Agreement');
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Insert/Enable the "BLDGLSRCV" type
PRINT N'Update the description for the "BLDGLSRCV" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'BLDGLSRCV'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    IS_DISABLED                = 0
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
ELSE
  INSERT INTO PIMS_LEASE_LICENSE_TYPE (LEASE_LICENSE_TYPE_CODE, DESCRIPTION)
    VALUES (N'BLDGLSRCV',  N'Building Lease (receivable)');
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Disable various types
PRINT N'Disable various types'
GO
UPDATE PIMS_LEASE_LICENSE_TYPE
SET    IS_DISABLED                = 1
     , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
WHERE  LEASE_LICENSE_TYPE_CODE = N'LIOCCUSE';
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "LIMOTIPRJ" type
PRINT N'Update the description for the "LIMOTIPRJ" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'LIMOTIPRJ'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'MoTI Use Licence of Occupation (BCTFA fee simple)'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "LIOCCACCS" type
PRINT N'Update the description for the "LIOCCACCS" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'LIOCCACCS'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'Licence of Occupation (BCTFA fee simple)'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "LIOCCTTLD" type
PRINT N'Update the description for the "LIOCCTTLD" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'LIOCCTTLD'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'Licence of Occupation (HMK fee simple)'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "LSGRND" type
PRINT N'Update the description for the "LSGRND" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'LSGRND'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'Land Lease (receivable)'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "LSREG" type
PRINT N'Update the description for the "LSREG" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'LSREG'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'Lease - Registered (payable)'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "LSUNREG" type
PRINT N'Update the description for the "LSUNREG" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'LSUNREG'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'Lease - Unregistered (payable)'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "MANUFHOME" type
PRINT N'Update the description for the "MANUFHOME" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'MANUFHOME'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'Manufactured Home Tenancy'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "RESLNDTEN" type
PRINT N'Update the description for the "RESLNDTEN" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'RESLNDTEN'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'Residential Tenancy Agreement'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Update the description for the "ROADXING" type
PRINT N'Update the description for the "ROADXING" type'
GO
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'ROADXING'

SELECT LEASE_LICENSE_TYPE_CODE
FROM   PIMS_LEASE_LICENSE_TYPE
WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  UPDATE PIMS_LEASE_LICENSE_TYPE
  SET    DESCRIPTION                = N'Crossing Agreement'
       , CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
  WHERE  LEASE_LICENSE_TYPE_CODE = @CurrCd;
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- --------------------------------------------------------------
-- Update the display order.
-- --------------------------------------------------------------
UPDATE tbl
SET    tbl.DISPLAY_ORDER              = seq.ROW_NUM
     , tbl.CONCURRENCY_CONTROL_NUMBER = CONCURRENCY_CONTROL_NUMBER + 1
FROM   PIMS_LEASE_PROGRAM_TYPE tbl JOIN
       (SELECT LEASE_PROGRAM_TYPE_CODE
             , ROW_NUMBER() OVER (ORDER BY DESCRIPTION) AS ROW_NUM
        FROM   PIMS_LEASE_PROGRAM_TYPE) seq  ON seq.LEASE_PROGRAM_TYPE_CODE = tbl.LEASE_PROGRAM_TYPE_CODE
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