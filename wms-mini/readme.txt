Created by: Olof Hultberg
Create date: 2019-10-08
Changelog:

Installation notes:
---------------------------------------------------------------------
1. Install PM2
2. create folder to be working directory . c:\wms\
3. Create new env variable system PM2_HOME and set it to c:\wms\.pm2
4. Restart server/windows
5. open cmd as an administrator
6. Setup pm2:
 a. pm2 start server.js --watch
 b. pm2 serve dist 80 --spa
 c. pm2 save
7. Get nssm (non sucking service manager) at https://nssm.cc/
8. unpack it to PM2_HOME dir (c:\wms\)
9 . Create a bat-file in c:\wms\ called pm2_startup.bat
10. open cmd as an administrator if not already open
11. run nssm.exe install grafokett-wms-service
12. set the following
 a. Path: c:\wms\pm2_startup.bat
 b. Folder: should be c:\wms\
 c. Startup type: Automatic delayed
