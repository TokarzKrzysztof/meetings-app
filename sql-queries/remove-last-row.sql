  DELETE FROM [Meetings].[dbo].[Chats] 
WHERE  CreatedAt = (SELECT Max(CreatedAt) FROM [Meetings].[dbo].[Chats]) 