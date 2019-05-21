/*************************************************************************************
Description:
Utility services for spreadsheet operations in google drive

Revision History:
Version   Date          Author        Description
1.0.0     2017/6/23     CAI Huaqin    initial version
1.1.0     2017/7/19     CAI Huaqin    add new function: GSheetAPI_inputBox 
1.1.1     2017/7/21     CAI Huaqin    add new function: GSheetAPI_messageBox, 
                                      GSheetAPI_decisionBox
1.1.2     2017/9/20     CAI Huaqin    add new function: GSheetAPI_naviCmd
1.1.3     2018/1/11     CAI Huaqin    add new function: GSheetAPI_hideEmptyRowsCols                                      
*************************************************************************************/

/**
  New sheet from template within the same spreadsheet
  @param {string} newShName: the new sheet name to be created
  @param {string} tempShName: the template sheet name to copy from
  @return {sheet} the new sheet and this sheet is always of index "0" in the spreadsheet
*/
function GSheetAPI_newSheetFromTemplate( ss, newShName, tempShName )
{
  var newSheet = null;
  
  if ( ss != null )
  {
    // First, check if the sheet with the specified year exists or not, if not, create a new sheet from the template
    var allSheets = ss.getSheets();
    var numOfSheets = allSheets.length;
    for ( var i = 0; i < numOfSheets; i++ )
    {
      var sheetName = allSheets[i].getName();
      if ( newShName == sheetName ) // The sheet with the year name exist
      {
        newSheet = allSheets[i];
        break;
      }
    }
    
    // If the sheet with name year doesn't exist, we create a new one from the "template" sheet
    if ( newSheet == null )
    {
      // insert the sheet with the name year in the first index
      var tempSheet = ss.getSheetByName( tempShName );
      newSheet = tempSheet.copyTo( ss ).setName( String(newShName) );
      
      // move to the 1st position for incoming operations, it will reduce the num of loop
      ss.setActiveSheet( newSheet );
      ss.moveActiveSheet( 0 );
    }
  }
  
  return newSheet;
}

/**
  New input box waiting for the user input. Note that the API can only be used within bounded script
  @param {string} promptText: the prompt text for the input
  @return {string} the input text if press OK otherwise, return ""
*/
function GSheetAPI_inputBox( promptText )
{
  var ret = "";
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt( promptText, ui.ButtonSet.OK_CANCEL );
  if (response.getSelectedButton() == ui.Button.OK) 
  {
      ret = response.getResponseText();
  }
  
  return ret;
}

/**
  New Message box for information. Note that the API can only be used within bounded script
  @param {string} promptText: the prompt text for the message
  @return {string} "ok" if press OK otherwise, return ""
*/
function GSheetAPI_messageBox( promptText )
{
  var ret = "ok";
  var ui = SpreadsheetApp.getUi();
  ui.alert( promptText );
  
  return ret;
}

/**
  New Message box for information. Note that the API can only be used within bounded script
  @param {string} promptText: the prompt text for the message
  @return {string} "Yes", "No" if press OK otherwise, return "No"
*/
function GSheetAPI_decisionBox( promptText )
{
  var ret = "No";
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert( promptText, ui.ButtonSet.YES_NO );
  if (response == ui.Button.YES) 
  {
    ret = "Yes";
  }
  
  return ret;
}

/**
  Navigation APIs, example code:

 var C_OPERATION_RANGES_EXT = [
    // Operation range(1 row), current range(1 cell),
    ["MemberListRangeAcquired", "MemberCurrentAcquired"],
  ];

  var sh = SpreadsheetApp.getActiveSheet();
  Lib.GSheetAPI_naviCmd("goCurrent", C_OPERATION_RANGES_EXT, sh);
  
  @param {string} cmd - one of "goCurrent", "showPast", "hidePast"
  @param {array} opRangeList - the 2D array of the operation range list for the spreadsheet, 
                               each element is composed of two items: 
                               named range of the range which is either one row or one column,
                               reference value range as 1 single cell.
  @param {sheet} sh - the sheet the operation is currently working on
  @return {number} "0" if success, otherwise failed
*/
function GSheetAPI_naviCmd( cmd, opRangeList, sh )
{
  var ret = -1;

  // Continue only the operation range is within the current sheet
  if ( sh != null && opRangeList != null )
  {
    // Get the opRange and reference value
    var elementIdx = -1;
    var numOfopRanges = opRangeList.length;
    var shName = sh.getName();
    var ss = sh.getParent();
    var opRangeValues = [];  // 2D array
    var refCurValue = "";
    
    // Try to find the operation range and reference value
    for ( var i = 0; i < numOfopRanges; i++ )
    {
      var opRangeName = opRangeList[i][0];
      var refRangeName = opRangeList[i][1];
      
      // Get the operation range of each element
      var opRange = ss.getRangeByName( opRangeName );
      var refRange = ss.getRangeByName( refRangeName );
      if ( (opRange != null) && 
           (refRange != null) && 
           (opRange.getSheet().getName() == shName) )
      {
        elementIdx = i;
        refCurValue = String(refRange.getValue()); // Only 1 cell, transform to String type
        opRangeValues = opRange.getValues();
        break;
      }
    }
    
    // We found the operation range and current reference value
    if ( elementIdx != -1 )
    {
      // Check if this is a row range or a column range
      var startIdx = -1, numofIdx = 0;
      
      // Range with 1 row
      if ( opRangeValues.length == 1 )
      {
         startIdx = opRange.getColumn();
         numofIdx = opRange.getNumColumns();  
         
         for ( var i = 0; i < numofIdx; i++ )
         {
            var value = opRangeValues[0][i];
            if ( value == refCurValue )
            {
              // Activate the current cell, note that range index starts from "1"
              opRange.getCell(1, i+1).activate();
              if ( cmd == "hidePast" )
              {
                // Column index starts from "1", the past array index is exactly the number of past columns
                sh.hideColumns( startIdx, i ); 
              }
              else if ( cmd == "showPast" )
              {
                sh.showColumns( startIdx, i ); 
              }
              ret = 0;
              break;
            }
         }
      }
      // Range with 1 column
      else if ( opRangeValues[0].length == 1 ) 
      {
         startIdx = opRange.getRow();
         numofIdx = opRange.getNumRows();
         
         for ( var i = 0; i < numofIdx; i++ )
         {
           var value = String(opRangeValues[i][0]);
           if ( value == refCurValue )
           {
             // Activate the current cell, note that range index starts from "1"-
             opRange.getCell(i+1, 1).activate();
             if ( cmd == "hidePast" )
             {
               // Row index starts from "1", the past array index is exactly the number of past columns
               sh.hideRows( startIdx, i ); 
             }
             else if ( cmd == "showPast" )
             {
               sh.showRows( startIdx, i ); 
             }
             ret = 0;
             break;
           }
         }
      }
    }
  }
  
  return ret;
}

/**
  Hide or show the rows and/or columns in the sheet specified
  @param {sheet} sh - the sheet the operations are to be applied
  @param {boolean} bHideRows - if hide the rows, by default, true
  @param {boolean} bHideCols - if hide the columns, by default, true
  @return {Number} always "0".
*/
function GSheetAPI_hideEmptyRowsCols( sh, bHideRows, bHideCols )
{
  if ( bHideRows == null )
  {
    bHideRows = true;
  }
  
  if ( bHideCols == null )
  {
    bHideCols = true;
  }
  
  if ( sh != null )
  {
    var rows = sh.getMaxRows();
    var cols = sh.getMaxColumns();
    var sheetRange = sh.getRange(1, 1, rows, cols);
    var sheetValues = sheetRange.getValues();
       
    if ( bHideRows )
    {
      var emptyNum               = 0;
      var emptyRowStartIdx       = -1; // empty row start index
      
      for ( var i = 0; i < rows; i++ )
      {
        var bRowEmpty              = true;
        for ( var j = 0; j < cols; j++ )
        {
          if ( sheetValues[i][j] != "" ) // if any element in the row is non empty, it shall be skipped
          {
            bRowEmpty = false; 
            break;
          }
        }
        
        // if the bulk start row is not -1, then, the bulk row
        if ( bRowEmpty ) // all elements in the row are empty
        {
          emptyNum++;
          if ( emptyNum == 1 ) // write down the start index
          {
            emptyRowStartIdx = i+1; // range index starts from 1.
          }
        }
        
        // if reach the next non empty row or reach the end of the whole sheet range
        if ( !bRowEmpty || (i == rows-1) )
        {
          // the current row is not empty, check if there are continous rows before this row
          if ( emptyNum > 0 )//&& emptyRowStartIdx > 0 )
          {
             // hide muliple rows at a time, more efficient
             sh.hideRows(emptyRowStartIdx, emptyNum);
             emptyNum = 0;
             emptyRowStartIdx = -1;
          }
        }
      }
    }
    else
    {
      sh.unhideRow(sheetRange);
    }
    
    if ( bHideCols )
    {
      var emptyNum               = 0;
      var emptyColStartIdx       = -1; // empty column start index
    
      for ( var j = 0; j < cols; j++ )
      {
        var bColEmpty = true;
        for ( var i = 0; i < rows; i++ )
        {
          if ( sheetValues[i][j] != "" ) // if any element in the column is non empty, it shall be skipped
          {
            bColEmpty = false;
            break;
          }
        }
        
        // if the bulk start col is not -1, then, the bulk row
        if ( bColEmpty ) // all elements in the row are empty
        {
          emptyNum++;
          if ( emptyNum == 1 ) // write down the start index
          {
            emptyColStartIdx = j+1; // range index starts from 1.
          }
        }
        
        // if reach the next non empty cols or reach the end of the whole sheet range
        if ( !bColEmpty || (j == cols-1) )
        {
          // the current col is not empty, check if there are continous columns before this column
          if ( emptyNum > 0 )
          {
             // hide muliple rows at a time, more efficient
             sh.hideColumns(emptyColStartIdx, emptyNum);
             emptyNum = 0;
             emptyColStartIdx = -1;
          }
        }
      }
    }
    else
    {
      sh.unhideColumn(sheetRange);      
    }
  }
  
  return 0;
}



