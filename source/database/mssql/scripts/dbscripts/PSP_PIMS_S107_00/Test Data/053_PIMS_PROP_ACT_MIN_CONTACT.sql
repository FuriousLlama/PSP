DELETE FROM PIMS_PROP_ACT_MIN_CONTACT;
GO

INSERT INTO PIMS_PROP_ACT_MIN_CONTACT (PIMS_MANAGEMENT_ACTIVITY_ID, PERSON_ID)
VALUES
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID())),
  ((SELECT TOP 1 PIMS_MANAGEMENT_ACTIVITY_ID FROM PIMS_MANAGEMENT_ACTIVITY ORDER BY NEWID()),(SELECT TOP 1 PERSON_ID FROM PIMS_PERSON ORDER BY NEWID()));
GO
