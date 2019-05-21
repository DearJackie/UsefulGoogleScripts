// The scripts is from the URL: https://sites.google.com/site/scriptsexamples/custom-methods/2d-arrays-library

/**
 * Returns only the unique rows in the source array, discarding duplicates. 
 * The rows are returned according to the order in which they first appear in the source array.
 *
 * @param  {Object[][]} data a JavaScript 2d array
 * @param  {int} optColumnIndex the index of the column used to get unique values from a specific column
 * @param  {boolean} onlyReturnSelectedColumn a boolean, true to return only the values from optColumnIndex and no other column, false otherwise
 * @return {Object[][]} the unique rows in the source array, discarding duplicates. 
 */
function UtilityAPI_2DArrayUnique(data, optColumnIndex, onlyReturnSelectedColumn) {
  if (data.length > 0) {
    var o = {},
      i, l = data.length,
      r = [];
    if (typeof optColumnIndex == "number" && optColumnIndex < data[0].length) {
      if(onlyReturnSelectedColumn) {
        for (i = 0; i < l; i += 1) o[data[i][optColumnIndex]] = data[i][optColumnIndex];
      }
      else {
        for (i = 0; i < l; i += 1) o[data[i][optColumnIndex]] = data[i];
      }
      for (i in o) {
        if (o[i] != '') r.push(o[i]);
      }
    }
    else if (optColumnIndex == undefined) {
      for (i = 0; i < l; i += 1) o[data[i]] = data[i];
      for (i in o) {
        if (o[i] != '') r.push(o[i]);
      }
    }
    else {
      throw 'optColumnIndex should be a column index';
    }
    return r;
  }
  else {
    return data;
  }
}

/**
 * Returns the number of rows that meet certain criteria within a JavaScript 2d array.
 *
 * @param  {Object[][]} data a JavaScript 2d array
 * @param  {String} criteria the criteria in the form of a character string by which the cells are counted
 * @param  {boolean} matchEntireContent a boolean, true to match the entire cell content, false otherwise
 * @return {int} the number of rows that meet the criteria. 
 */

function UtilityAPI_2DArrayCountif(data, criteria, matchEntireContent) {
  if (data.length > 0) {
    var r = 0;
    var reg = new RegExp(escape(criteria));
    for (var i = 0; i < data.length; i++) {
      if(matchEntireContent){
        if (escape(data[i].toString()) == escape(criteria)) {
          r++;
        }
      }
      else{
        if (escape(data[i].toString()).search(reg) != -1) {
          r++;
        }
      }
    }
    return r;
  }
  else {
    return 0;
  }
}

/**
 * Returns the first row in which a specified value can be found in a specific column.
 * returns -1 if the value to find never occurs.
 *
 * @param  {Object[][]} data a JavaScript 2d array
 * @param  {int} columnIndex the index of the column in which the value can be found or -1 to search accross all columns
 * @param  {String} value the value in the form of a character string
 * @return {int} the first row in which the value can be found. 
 */

function UtilityAPI_2DArrayIndexOf(data, columnIndex, value) {
  if (data.length > 0) {
    if (typeof columnIndex != "number" || columnIndex > data[0].length) {
      throw 'Choose a valide column index';
    }
    var r = -1;
    var reg = new RegExp(escape(value).toUpperCase());
    for (var i = 0; i < data.length; i++) {
      if (data[0][0] == undefined) {
        if (escape(data[i].toString()).toUpperCase().search(reg) != -1) return i;
      }
      else {
        if (columnIndex < 0 && escape(data[i].toString()).toUpperCase().search(reg) != -1 || columnIndex >= 0 && escape(data[i][columnIndex].toString()).toUpperCase().search(reg) != -1) return i;
      }
    }
    return r;
  }
  else {
    return data;
  }
}

/**
 * Returns a filtered version of the given source array, where only certain rows have been included.
 *
 * @param  {Object[][]} data a JavaScript 2d array
 * @param  {int} columnIndex the index of the column in which the values can be found or -1 to search accross all columns
 * @param  {String[]} values the values in the form of an array of strings 
 * @return {Object[][]} the filtered rows in the source array. 
 */
 

function UtilityAPI_2DArrayFilterByText(data, columnIndex, values) {
  var value = values;
  if (data.length > 0) {
    if (typeof columnIndex != "number" || columnIndex > data[0].length) {
      throw 'Choose a valide column index';
    }
    var r = [];
    if (typeof value == 'string') {
      var reg = new RegExp(escape(value).toUpperCase());
      for (var i = 0; i < data.length; i++) {
        if (columnIndex < 0 && escape(data[i].toString()).toUpperCase().search(reg) != -1 || columnIndex >= 0 && escape(data[i][columnIndex].toString()).toUpperCase().search(reg) != -1) r.push(data[i]);
      }
      return r;
    }
    else {
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < value.length; j++) {
          var reg = new RegExp(escape(value[j]).toUpperCase());
          if (columnIndex < 0 && escape(data[i].toString()).toUpperCase().search(reg) != -1 || columnIndex >= 0 && escape(data[i][columnIndex].toString()).toUpperCase().search(reg) != -1) {
            r.push(data[i]);
            j = value.length;
          }
        }
      }
      return r;
    }
  }
  else {
    return data;
  }
}

/**
 * Returns a filtered version of the given source array, where only certain rows have been included.
 *
 * @param  {Object[][]} data a JavaScript 2d array
 * @param  {int} columnIndex the index of the column in which the value can be found
 * @param  {Date} startDate the beginning of the time range
 * @param  {Date} endDate the end of the time range
 * @return {Object[][]} the filtered rows in the source array. 
 */

function UtilityAPI_2DArrayFilterByDate(data, columnIndex, startDate, endDate) {
  if (data.length > 0) {
    if (typeof columnIndex != "number" || columnIndex > data[0].length) {
      throw 'Choose a valide column index';
    }
    if (startDate instanceof Date == false || endDate instanceof Date == false) {
      throw 'startDate and endDate must be dates';
    }
    startDate = startDate.getTime();
    endDate = endDate.getTime();
    var r = [];
    for (var i = 0; i < data.length; i++) {
      var date = new Date(data[i][columnIndex]);
      if (data[i][columnIndex] != '' && isNaN(date.getYear())) {
          throw 'The selected column should only contain Dates';
      }
      else if (data[i][columnIndex] != '' && date.getTime() > startDate && date.getTime() < endDate) {
          r.push(data[i]);
      }
    }
    return r;
  }
  else {
    return data;
  }
}

/**
 * Returns a filtered version of the given source array, where only certain rows have been included.
 *
 * @param  {Object[][]} data a JavaScript 2d array
 * @param  {int} columnIndex the index of the column in which the value can be found
 * @param  {int} min the minimal value
 * @param  {int} max the maximal value
 * @return {Object[][]} the filtered rows in the source array. 
 */

function UtilityAPI_2DArrayFilterByRange(data, columnIndex, min, max) {
  if (data.length > 0) {

    if (typeof columnIndex != "number" || columnIndex > data[0].length) {
      throw 'Choose a valide column index';
    }
    if (typeof min != "number" || typeof max != "number") {
      throw 'min and max should be numbers';
    }
    var r = [];
    for (var i = 0; i < data.length; i++) {
      var value = data[i][columnIndex];
      if (typeof value == "number") {
        if (value >= min && value <= max) {
          r.push(data[i]);
        }
      }
      else {
        throw 'The selected column should only contain numbers';
      }
    }
    return r;
  }
  else {
    return data;
  }
}

/**
 * Returns the rows in the given array, sorted according to the given key column.
 *
 * @param  {Object[][]} data a JavaScript 2d array
 * @param  {int} columnIndex the index of the column to sort
 * @param  {boolean}  ascOrDesc a boolean, true for ascending, false for descending
 * @return {Object[][]} the sorted array. 
 */

function UtilityAPI_2DArraySort(data, columnIndex, ascOrDesc) {
  if (data.length > 0) {
    if (typeof columnIndex != "number" || columnIndex > data[0].length) {
      throw 'Choose a valide column index';
    }
    var r = new Array();
    var areDates = true;
    for (var i = 0; i < data.length; i++) {
      if(data[i] != null){ // 
        var value = data[i][columnIndex];
        if(value && typeof(value)=='string') { 
          var date = new Date(value);
          if (isNaN(date.getYear())) areDates = false;
          else data[i][columnIndex] = date;
        }
        r.push(data[i]);
      }
    }
    return r.sort(function (a, b) {
      if (ascOrDesc) return ((a[columnIndex] < b[columnIndex]) ? -1 : ((a[columnIndex] > b[columnIndex]) ? 1 : 0));
      return ((a[columnIndex] > b[columnIndex]) ? -1 : ((a[columnIndex] < b[columnIndex]) ? 1 : 0));
    });
  }
  else {
    return data;
  }
}

/**
 * Transposes the rows and columns in the given array.
 * 
 * @param  {Object[][]} data a JavaScript 2d array
 * @return {Object[][]} the transposed array. 
 */

function UtilityAPI_2DArrayTranspose(data) {
  if (data.length > 0) {
    var r = [];
    for (var i = 0; i < data[0].length; i++) {
      var newRow = [];
      for (var j = 0; j < data.length; j++) {
        newRow[j] = data[j][i];
      }
      r[i] = newRow;
    }
    return r;
  }
  else {
    return data;
  }
}

/**
 * Returns a filtered version of the given source array, where only certain rows have been included.
 *
 * @param  {Object[][]} data a JavaScript 2d array
 * @param  {int} columnIndex the index of the column in which the value can be found or -1 to search accross all columns
 * @param  {void} value the value in the form of a character string or number
 * @return {Object[][]} the filtered rows in the source array. 
 */

function UtilityAPI_2DArrayFilterByValue(data, columnIndex, value) {
  if (data.length > 0) {
    var r = [];
    for (var i = 0; i < data.length; i++) {
      Logger.log(['filterByValue',data[i][columnIndex]]);
      if (data[i][columnIndex]==value) {
        r.push(data[i]);
      }
    }
    return r;
  }
}