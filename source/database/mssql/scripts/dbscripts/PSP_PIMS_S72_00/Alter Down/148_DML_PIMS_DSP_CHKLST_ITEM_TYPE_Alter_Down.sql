/* -----------------------------------------------------------------------------
Alter the data in the PIMS_DSP_CHKLST_ITEM_TYPE table.
. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
Author        Date         Comment
------------  -----------  -----------------------------------------------------
Doug Filteau  2024-Jan-10  Initial version
----------------------------------------------------------------------------- */

SET XACT_ABORT ON
GO
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO
BEGIN TRANSACTION
GO
IF @@ERROR <> 0 SET NOEXEC ON
GO

-- Insert the "SGNDXFRPPH" type
DECLARE @CurrCd NVARCHAR(20)
SET     @CurrCd = N'SGNDXFRPPH'

SELECT DSP_CHKLST_ITEM_TYPE_CODE
FROM   PIMS_DSP_CHKLST_ITEM_TYPE
WHERE  DSP_CHKLST_ITEM_TYPE_CODE = @CurrCd;

IF @@ROWCOUNT = 1
  BEGIN
  DELETE 
  FROM  PIMS_DSP_CHKLST_ITEM_TYPE 
  WHERE DSP_CHKLST_ITEM_TYPE_CODE = @CurrCd;
  END
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