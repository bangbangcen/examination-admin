export function drag(data: any) {
  let lastDragPos: number = -1; //记录上一次拖拽的位置（数组index）

  function dragStart(index: number) {
    lastDragPos = index;
    console.log(lastDragPos)
  }

  function dragEnter(index: number) {
    const dragSrcRow = data.splice(lastDragPos, 1)[0];
    data.splice(index, 0, dragSrcRow);
    // tableRowDoms[lastDragPos].style.background = "white";
    // tableRowDoms[index].style.background = "#b1d8ff";
    lastDragPos = index;
  }

  function dragEnd() {
    // tableRowDoms[lastDragPos].style.background = "white";
  }

  return { dragStart, dragEnter, dragEnd };
}