/*************************************************************************************
$Description Of This Module:

Utility services for generic operations

$Revision History:
Version   Date          Author        Description            Location
1.0.0     2018/02/09    CAI Huaqin    initial version, add sorting for 2D arrays

*************************************************************************************/

/**
  Sort the 2D array by specified column index, either acending or decending order
  the sort column is assumed as numbers
  @param {array} array2D - 2D array to be sorted
  @param {number} sortByColIdx - the index of the array column, starting from 0
  @param {boolean} bAsending - indicate if asending order or desending order when sorting
                   by default, asending order is assumed.
  @return {array} the sorted 2D array
*/
function UtilityAPI_SortArray( array2D, sortByColIdx, bAsending )
{
  if ( bAsending == "" )
  {
    bAsending = true;
  }
  
  if ( sortByColIdx < 0 )
  {
    sortByColIdx = 0;
  }
  
  if ( Array.isArray(array2D) )
  {
    // If 2D array, 
    if ( Array.isArray(array2D[0]) )
    {
      array2D.sort( function(x,y) {
        // NOT case sensitive
        var xp = x[sortByColIdx];//.toLowerCase();
        var yp = y[sortByColIdx];//.toLowerCase();
        
        if ( bAsending )
        {
          return (xp == yp) ? (0) : (xp < yp) ? (-1) : (1);
        }
        else
        {
          return (xp == yp) ? (0) : (xp < yp) ? (1) : (-1);
        }
      });
    }    
    else // 1D array
    {
      array2D.sort( function(x,y) {
        // NOT case sensitive
        var xp = x;//.toLowerCase();
        var yp = y;//.toLowerCase();
        
        if ( bAsending )
        {
          return (xp == yp) ? (0) : (xp < yp) ? (-1) : (1);
        }
        else
        {
          return (xp == yp) ? (0) : (xp < yp) ? (1) : (-1);
        }
      });      
    }
  }
  
  return array2D;
}

/**
  UtilityAPI_COLUMN_TO_LETTER
 
  @param {column} column index.
  @return the letter representing the column.
  @customfunction
*/
function UtilityAPI_COLUMN_TO_LETTER( column )
{
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

/**
  UtilityAPI_COLUMN_TO_LETTER
 
  @param {column} column index.
  @return the letter representing the column.
  @customfunction
*/
//function letterToColumn(letter)
//{
//  var column = 0, length = letter.length;
//  for (var i = 0; i < length; i++)
//  {
//    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
//  }
//  return column;
//}