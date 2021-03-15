import { useState } from "react";
import Cell from "./Cell";

function Grid() {
  const GRID_SIZE = 50;
  const REQUIRED_FIB_LENGTH = 5;
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0)))

  const isPosValid = (x) => {
    return x >= 0 && x <= GRID_SIZE - 1
  }

  // Checks if an element can be part of a fib seq with its neighbours on a single axis
  const checkElem = (grid, row, col, rowModSigned, colModSigned) => {
    let valid = true;
    const rowMod = Math.abs(rowModSigned);
    const colMod = Math.abs(colModSigned);
    [row - rowMod, row + rowMod, col - colMod, col + colMod].forEach(
      (x) => {
        if (!isPosValid(x)) valid = false
      }
    )
    if (!valid) return 0;

    if (grid[row][col] + grid[row + rowMod][col + colMod] === grid[row - rowMod][col - colMod])
      return -1
    if (grid[row][col] + grid[row - rowMod][col - colMod] === grid[row + rowMod][col + colMod])
      return 1

    return 0
  }

  // Check for fib elements in a single direction from a modified elem
  const checkDirection = (grid, row, col, rowMod, colMod) => {
    let nextRow = row + rowMod;
    let nextCol = col + colMod;
    let nextElem = null;
    let fib = [];
    while (isPosValid(nextRow) && isPosValid(nextRow)) {
      const newNextElem = checkElem(grid, nextRow, nextCol, rowMod, colMod);
      if (newNextElem === 0 || (newNextElem !== nextElem && nextElem !== null)) break;

      fib.push([nextRow, nextCol]);
      nextRow += rowMod;
      nextCol += colMod;
      nextElem = newNextElem;
    }
    fib.push([nextRow, nextCol])
    return [nextElem, fib]
  }

  // Check for fib sequences on an axis for a modified elem
  const checkAxis = (grid, row, col, rowMod, colMod) => {
    let emptyableElem = [];

    const newElem = checkElem(grid, row, col, rowMod, colMod);
    let [nextElem, nextElemFib] = checkDirection(grid, row, col, rowMod, colMod);
    let [prevElem, prevElemFib] = checkDirection(grid, row, col, -rowMod, -colMod);

    if (newElem !== 0) {
      if (prevElem === newElem === nextElem) {
        nextElemFib = nextElemFib.concat(prevElemFib);
        prevElemFib = []
      }
      else {
        if (prevElem === newElem && isPosValid(row + rowMod) && isPosValid(col + colMod))
          prevElemFib.push([row + rowMod, col + colMod]);
        if (nextElem === newElem && isPosValid(row - rowMod) && isPosValid(col - colMod))
          nextElemFib.push([row - rowMod, col - colMod]);
      }
    }
    prevElemFib.push([row, col]);
    nextElemFib.push([row, col]);

    if (nextElemFib.length >= REQUIRED_FIB_LENGTH) emptyableElem = emptyableElem.concat(nextElemFib);
    if (prevElemFib.length >= REQUIRED_FIB_LENGTH) emptyableElem = emptyableElem.concat(prevElemFib);

    return emptyableElem;
  }

  const modifyGrid = (row, col) => {
    let newGrid = [...grid];
    let emptyableElem = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      newGrid[row][i]++;
      newGrid[i][col]++;

      if (i !== col) {
        emptyableElem = emptyableElem.concat(checkAxis(grid, row, i, 1, 0));
      }
      if (i !== row) {
        emptyableElem = emptyableElem.concat(checkAxis(grid, i, col, 0, 1));
      }
    }
    newGrid[row][col]--;

    let rowFib = [];
    let rowLast = 0;
    let colFib = [];
    let colLast = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      const nextRowElem = checkElem(grid, i, col, 1, 0);
      const nextColElem = checkElem(grid, row, i, 0, 1);

      rowFib.push([i, col]);
      colFib.push([row, i]);
      if (nextRowElem === 0 || nextRowElem === rowLast * -1) {
        if (rowFib.length >= REQUIRED_FIB_LENGTH) {
          emptyableElem = emptyableElem.concat(rowFib);
        }
        rowFib = [[i, col]];
        if (nextRowElem !== 0)
          rowFib.push([i - 1, col]);
      }
      if (nextColElem === 0 || nextColElem === colLast * -1) {
        if (colFib.length >= REQUIRED_FIB_LENGTH) {
          emptyableElem = emptyableElem.concat(colFib);
        }
        colFib = [[row, i]];
        if (nextColElem !== 0)
          colFib.push([row, i - 1]);
      }

      rowLast = nextRowElem;
      colLast = nextColElem;
    }

    emptyableElem.forEach(elem => {
      newGrid[elem[0]][elem[1]] = 0;
    });

    setGrid(newGrid);

  }

  return (
    <div className="Grid w-100 h-100 px-5">
      {grid.map((row, rowIndex) => {
        return (
          <div className="row" key={"row" + rowIndex} >
            {row.map((elem, colIndex) => {
              return (
                <Cell
                  key={"col" + colIndex}
                  value={elem}
                  onClick={() => modifyGrid(rowIndex, colIndex)}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default Grid;
