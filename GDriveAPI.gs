/*************************************************************************************
Description:
Utility services for file/folder operations in google drive

Revision History:
Version   Date          Author        Description
1.0.0     2017/6/23     CAI Huaqin    initial version
1.0.1     2017/7/19     CAI Huaqin    Fix a bug of key word: NULL -> null in function 
                                      "GDriveAPI_getFolderByUrl"

*************************************************************************************/

/**
  The ID of the specified folder or file.
  examples: 
  fileType    ID                                             URL
  folder      "0B-f74PperqixS3h0LWxrNndLUVk"                 "https://drive.google.com/drive/folders/0B-f74PperqixS3h0LWxrNndLUVk"
  sheet       "1azBHEngWXIhXnexz3QRnIwFYLNZunda9UuHbbjpQYG4" "https://docs.google.com/spreadsheets/d/1azBHEngWXIhXnexz3QRnIwFYLNZunda9UuHbbjpQYG4/edit#gid=0"
  doc         "1edieAgfwaywtL_IKbBMRiNsPE_IevrLX6_ar0cRUkCM" "https://docs.google.com/document/d/1edieAgfwaywtL_IKbBMRiNsPE_IevrLX6_ar0cRUkCM/edit"    
  ppt        "1huRusHN7WYvwGJ5zfEesXd7he-pXEGxfxufA4gYcSxI"  "https://docs.google.com/presentation/d/1huRusHN7WYvwGJ5zfEesXd7he-pXEGxfxufA4gYcSxI/edit"
  @param {String}  url - The Url of the folder or file in google drive
  @param {String}  type - The document type of the URL, value can be one of the below: "sheet", "folder", "doc", "ppt".
  @return {String} id - the folder or file ID in google drive, otherwise, return "NULL"
*/
function GDriveAPI_getIdByUrl( url, type )
{
  var id = null;
  
  if ( url != "" )
  {
     if ( type == "sheet" || type == "doc" || type == "ppt" )
     {
        var keyStart = "/d/";
        var keyEnd = "/edit";
        var idxStart = url.indexOf( keyStart ) + keyStart.length;
        var idxEnd = url.indexOf( keyEnd );
        id = url.slice( idxStart, idxEnd ); // Not including the idxEnd
     }
     else if ( type == "folder" )
     {
       var keyStr = "/folders/";
       var idStartIdx = url.indexOf( keyStr ) + keyStr.length;
       id = url.slice( idStartIdx ); // return the substring to the end of url, starting from the start index
     }
  }
  
  return id;
}

/**
  The folder of a specified folder URL
  @param {String}  folderUrl - The Url of the folder in google drive
  @return {object} the folder object in google drive, if not found, return NULL.
*/
function GDriveAPI_getFolderByUrl( folderUrl )
{
  var folder = null;
  
  if ( folderUrl != "" )
  {
    var folderId = GDriveAPI_getIdByUrl( folderUrl, "folder" );
    folder = GDriveAPI_getFolderById( folderId );
  }
  
  return folder;
}

/**
  The folder of a specified folder ID
  @param {String}  folderId - The ID of the folder in google drive
  @return {object} the folder object in google drive, if not found, return null.
*/
function GDriveAPI_getFolderById( folderId )
{
  var folder = null;
  
  if ( folderId != "" )
  {
    folder = DriveApp.getFolderById( folderId );
  }
  
  return folder;
}

/**
  Check if the specified folder name exists in the current folder. Return null if not in the current folder, else return the folder object.
  Note that the function check if the same folder name exist in the current folder, in google drive, there could be
  several folders with the same name, we avoid to have this.
  @param {object} curFoler the current folder object
  @param {string} folderName the folder name to check inside the current folder
  @return {object} return the object of the folder name to check, if not found, return null.
*/
function GDriveAPI_checkFolderExistInCurrentFolder( curFoler, folderName )
{
  var newFolder = null;
  
  if ( curFoler != null )
  {
    // First, we check if the folder has already been created, retrieve all teh sub folders under the current
    var subFolders = curFoler.getFolders();
    while(subFolders.hasNext())
    {
      // This folder has already been created. 
      // TODO: note that in google drive, there could be several same folder names under one foler, 
      // we can be sure if the foler with the same name under the foler is exactly the one we are going to create,
      // the safe way is to compare the folder ID
      // here we just compre the folder name.
      var tmp = subFolders.next();
      if (folderName == tmp.getName())
      {
        // This folder already created
        newFolder = tmp;
        break;
      }
    }
  }
  
  return newFolder;
}

/**
  Check if the specified file name exists in the current folder. Return null if not in the current folder, else return the folder object.
  Note that the function check if the same file name exist in the current folder, in google drive, there could be
  several files with the same name, we avoid to have this.
  @param {object} curFoler the current folder object
  @param {string} fileName the file name to check inside the current folder
  @return {object} return the object of the file name to check, if not found, return NULL.
*/
function GDriveAPI_checkFileExistInCurrentFolder( curFoler, fileName )
{
  var newFile = null;
  
  if ( curFoler != null )
  {
    // First, we check if the folder has already been created, retrieve all teh sub folders under the current
    var files = curFoler.getFiles();
    while(files.hasNext())
    {
      // This file has already been created. 
      // TODO: note that in google drive, there could be several same folder names under one foler, 
      // we can be sure if the foler with the same name under the foler is exactly the one we are going to create,
      // the safe way is to compare the folder ID
      // here we just compre the folder name.
      var tmp = files.next();
      if (fileName == tmp.getName())
      {
        // This file already created
        newFile = tmp;
        break;
      }
    }
  }
  
  return newFile;
}

/**
  Create a sub folder inside the specified folder
  Note that in google drive, there could be several folders with the same name, we avoid to have this.
  @param {object} parentFolder the folder object to hold the new folder
  @param {string} newFolderName the folder name to be created inside the parent folder
  @return {object} return the object of the folder name to be created, if not found, return NULL.
                   Note that the function will check if the folder name already there.
*/
function GDriveAPI_createSubFolder( parentFolder, newFolderName )
{
  DebugAPI_debugLog(" --createSubFolder_ " );
  DebugAPI_debugLog(" under folder: " + parentFolder+" ,new folder name to create: " + newFolderName );
  
  var newFolder = GDriveAPI_checkFolderExistInCurrentFolder(parentFolder, newFolderName);
  if ( newFolder == null )
  {
    // Create a new folder in the specified folder if not created yet
    newFolder = parentFolder.createFolder(newFolderName);
  }
  else
  {
    DebugAPI_debugLog("The folder \""+newFolderName+"\" already there!");
  }
  
  DebugAPI_debugLog(" new folder: " + newFolder );
  DebugAPI_debugLog(" createSubFolder_ --" );

  return newFolder;
}

/**
  Create a new spreadsheet from the template URL, if the spreadsheet with the same exist, it will
  return the existing one, but not create a new one. Note that the newly created spreadsheet is
  opened automatically.
  @param {string} url - the URL of the template
  @param {object} destFolder - the destination foler object of the newly created spreadsheet
  @param {string} newSsName - the spreadsheet name of the newly created spreadsheet
  @return {object} return the new spreadsheet, otherwise null, the new spreadsheet is opened after this API.
*/
function GDriveAPI_createNewSpreadSheetFromURL( url, destFolder, newSsName )
{
  var newSs = null;
  
  DebugAPI_debugLog(" --createNewSpreadSheetFromURL " );
  DebugAPI_debugLog(" url to create from: "+url );

  if ( url != "" && url != null )
  {
    // Open the template Spreadsheet
    var ssTemplate = SpreadsheetApp.openByUrl( url );
    var ssIdTemplate = ssTemplate.getId();
    newSs = GDriveAPI_checkFileExistInCurrentFolder(destFolder, newSsName);
    if ( newSs == null ) // Create the spreadsheet only when it doesn't exist
    {
      newSs = DriveApp.getFileById(ssIdTemplate).makeCopy(newSsName, destFolder);
    }
    else
    {
       DebugAPI_debugLog("The spreadsheet \""+newSsName+"\" already in folder: \""+destFolder+"\"");
    }
    
    // If you want to operate in this sheet, you shall open the sheet
    {
      var newSsUrl = newSs.getUrl();
      newSs = SpreadsheetApp.openByUrl(newSsUrl); // IMPORTANT: Open this sheet for later operation
    }
  }

  DebugAPI_debugLog(" newSs: "+newSs );
  DebugAPI_debugLog(" createNewSpreadSheetFromURL --" );
  
  return newSs;
}


